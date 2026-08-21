import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'

const baseUrl = 'http://localhost:5173'
const outputDir = path.resolve('..', 'qa-screenshots', 'local-full', 'guest')
const widths = [1920, 1440, 1366, 1280, 1024, 912, 820, 768, 576, 430, 390, 375, 360, 320]
const screenshotWidths = [1440, 768, 390, 375, 320, 768, 390, 375, 320, 1440]

await fs.mkdir(outputDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const diagnostics = []

try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: theme,
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await page.addInitScript((selectedTheme) => localStorage.setItem('edumaster:theme', selectedTheme), theme)

    await page.goto(`${baseUrl}/courses`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    await page.locator('.ccard').first().waitFor({ state: 'visible', timeout: 30_000 })
    const coursePath = await page.locator('a[href^="/courses/"]').first().getAttribute('href')
    if (!coursePath) throw new Error('No public course detail link was found')

    const routes = [
      { name: 'home', path: '/' },
      { name: 'courses', path: '/courses' },
      { name: 'course-detail', path: coursePath },
      { name: 'about', path: '/about' },
      { name: 'services', path: '/services' },
      { name: 'events', path: '/events' },
      { name: 'testimonials', path: '/testimonials' },
      { name: 'contact', path: '/contact' },
      { name: 'login', path: '/login' },
      { name: 'signup', path: '/signup' },
    ]

    for (const [routeIndex, route] of routes.entries()) {
      const consoleErrors = []
      const reactWarnings = []
      const pageErrors = []
      const failedRequests = []
      const unexpectedResponses = []
      const onConsole = (message) => {
        const value = message.text()
        if (message.type() === 'error') consoleErrors.push(value)
        if (message.type() === 'warning' && /warning:|react/i.test(value)) reactWarnings.push(value)
      }
      const onPageError = (error) => pageErrors.push(error.message)
      const onRequestFailed = (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText })
      const onResponse = (response) => {
        if (response.status() >= 400) unexpectedResponses.push({ status: response.status(), url: response.url() })
      }
      page.on('console', onConsole)
      page.on('pageerror', onPageError)
      page.on('requestfailed', onRequestFailed)
      page.on('response', onResponse)

      await page.setViewportSize({ width: 1440, height: 900 })
      const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
      await page.waitForLoadState('networkidle', { timeout: 4_000 }).catch(() => {})
      await page.locator('main').first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {})
      if (route.name === 'courses') await page.locator('.ccard').first().waitFor({ state: 'visible', timeout: 30_000 })
      await page.waitForTimeout(350)

      for (const width of widths) {
        const height = width >= 1024 ? 900 : width >= 600 ? 1024 : 844
        await page.setViewportSize({ width, height })
        await page.waitForTimeout(100)
        const metrics = await page.evaluate(() => ({
          bodyWidth: document.body.scrollWidth,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          brokenImages: [...document.images]
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
          title: document.title,
          textLength: document.body.innerText.trim().length,
        }))
        diagnostics.push({ route: route.path, name: route.name, theme, width, ...metrics })
      }

      const screenshotWidth = screenshotWidths[routeIndex]
      const screenshotHeight = screenshotWidth >= 1024 ? 900 : screenshotWidth >= 600 ? 1024 : 844
      await page.setViewportSize({ width: screenshotWidth, height: screenshotHeight })
      await page.waitForTimeout(150)
      await page.screenshot({
        path: path.join(outputDir, `${route.name}-${theme}-${screenshotWidth}x${screenshotHeight}.png`),
        animations: 'disabled',
        timeout: 15_000,
      })
      if (route.name === 'home' && theme === 'dark') {
        for (const selector of ['.testimonials', '.partners', '.tcarousel']) {
          await page.locator(selector).screenshot({
            path: path.join(outputDir, `home-dark-${selector.slice(1)}.png`),
            animations: 'disabled',
            timeout: 15_000,
          })
        }
      }

      diagnostics.push({
        route: route.path,
        name: route.name,
        theme,
        routeResult: true,
        httpStatus: response?.status(),
        finalUrl: page.url(),
        consoleErrors,
        reactWarnings,
        pageErrors,
        failedRequests,
        unexpectedResponses,
      })
      page.off('console', onConsole)
      page.off('pageerror', onPageError)
      page.off('requestfailed', onRequestFailed)
      page.off('response', onResponse)
      console.log(`checked ${theme} ${route.name}`)
    }
    await context.close()
  }
} finally {
  await browser.close()
}

await fs.writeFile(path.join(outputDir, 'diagnostics.json'), JSON.stringify(diagnostics, null, 2))
const routeResults = diagnostics.filter((entry) => entry.routeResult)
const summary = {
  routes: routeResults.length,
  measurements: diagnostics.filter((entry) => entry.width).length,
  overflows: diagnostics.filter((entry) => entry.width && (entry.bodyWidth > entry.viewportWidth || entry.documentWidth > entry.viewportWidth)),
  brokenImages: [...new Set(diagnostics.flatMap((entry) => entry.brokenImages || []))],
  consoleErrors: routeResults.flatMap((entry) => entry.consoleErrors),
  reactWarnings: routeResults.flatMap((entry) => entry.reactWarnings),
  pageErrors: routeResults.flatMap((entry) => entry.pageErrors),
  failedRequests: routeResults.flatMap((entry) => entry.failedRequests),
  unexpectedResponses: routeResults.flatMap((entry) => entry.unexpectedResponses),
  routeFailures: routeResults.filter((entry) => entry.httpStatus !== 200 || !entry.finalUrl.startsWith(baseUrl)),
}
console.log(JSON.stringify(summary, null, 2))
