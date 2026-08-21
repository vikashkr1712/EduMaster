import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const baseUrl = 'http://localhost:5173'
const statePath = path.join(os.tmpdir(), 'edumaster-phase4-auth-state.json')
const outputDir = path.resolve('..', 'qa-screenshots', 'local-full', 'student')
const widths = [1920, 1440, 1366, 1280, 1024, 912, 820, 768, 576, 430, 390, 375, 360, 320]
const screenshotWidths = [1440, 390, 768, 390, 375, 320, 768, 390, 375, 1440, 320, 390, 375]

await fs.access(statePath)
await fs.mkdir(outputDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const diagnostics = []
let discoveredCoursePath = null
let discoveredLearningPath = null

try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({
      storageState: statePath,
      viewport: { width: 1440, height: 900 },
      colorScheme: theme,
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await page.addInitScript((selectedTheme) => localStorage.setItem('edumaster:theme', selectedTheme), theme)

    await page.goto(`${baseUrl}/profile`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    await page.waitForTimeout(800)
    const auth = await page.evaluate(async () => {
      const response = await fetch('http://localhost:5000/api/v1/auth/me', { credentials: 'include' })
      const body = await response.json().catch(() => ({}))
      return {
        status: response.status,
        role: body?.data?.user?.role ?? body?.user?.role ?? body?.data?.role ?? null,
      }
    })
    if (auth.status !== 200 || !auth.role || auth.role === 'admin') {
      throw new Error(`Existing student state is unavailable or has the wrong role (status ${auth.status}, role ${auth.role})`)
    }

    await page.goto(`${baseUrl}/courses`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    await page.locator('.ccard').first().waitFor({ state: 'visible', timeout: 30_000 })
    discoveredCoursePath ||= await page.locator('a[href^="/courses/"]').first().getAttribute('href')

    await page.goto(`${baseUrl}/profile/courses`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    await page.waitForTimeout(1_000)
    discoveredLearningPath ||= await page.locator('a[href^="/learn/"]').first().getAttribute('href').catch(() => null)

    const routes = [
      { name: 'dashboard', path: '/profile' },
      { name: 'profile', path: '/profile' },
      { name: 'settings', path: '/profile/settings' },
      { name: 'courses', path: '/courses' },
      { name: 'course-detail', path: discoveredCoursePath },
      { name: 'wishlist', path: '/profile/wishlist' },
      { name: 'cart', path: '/cart' },
      { name: 'checkout', path: '/checkout' },
      { name: 'orders', path: '/profile/orders' },
      { name: 'my-courses', path: '/profile/courses' },
      { name: 'course-player', path: discoveredLearningPath },
      { name: 'assignments', path: discoveredLearningPath },
      { name: 'notifications', path: '/profile' },
    ]

    for (const [routeIndex, route] of routes.entries()) {
      if (!route.path) {
        diagnostics.push({ name: route.name, theme, unavailable: true })
        continue
      }
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
        if (response.status() >= 400 && ![401, 403].includes(response.status())) {
          unexpectedResponses.push({ status: response.status(), url: response.url() })
        }
      }
      page.on('console', onConsole)
      page.on('pageerror', onPageError)
      page.on('requestfailed', onRequestFailed)
      page.on('response', onResponse)

      await page.setViewportSize({ width: 1440, height: 900 })
      const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
      await page.waitForLoadState('networkidle', { timeout: 4_000 }).catch(() => {})
      await page.waitForTimeout(250)

      let interaction = null
      if (route.name === 'assignments') {
        const assignmentControl = page.getByRole('button', { name: /assignment/i }).or(page.getByRole('tab', { name: /assignment/i })).first()
        const available = await assignmentControl.count() > 0
        if (available) await assignmentControl.click()
        interaction = { assignmentControlAvailable: available }
      }
      if (route.name === 'notifications') {
        const bell = page.locator('.navbar-bell, button[aria-label*="notification" i]').first()
        const available = await bell.count() > 0 && await bell.isVisible()
        if (available) await bell.click()
        interaction = { notificationControlAvailable: available, dropdownVisible: available && await page.locator('.notification-dropdown').isVisible().catch(() => false) }
      }

      for (const width of widths) {
        const height = width >= 1024 ? 900 : width >= 600 ? 1024 : 844
        await page.setViewportSize({ width, height })
        await page.waitForTimeout(80)
        const metrics = await page.evaluate(() => ({
          bodyWidth: document.body.scrollWidth,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          brokenImages: [...document.images]
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
          textLength: document.body.innerText.trim().length,
        }))
        diagnostics.push({ name: route.name, route: route.path, theme, width, ...metrics })
      }

      const screenshotWidth = screenshotWidths[routeIndex]
      const screenshotHeight = screenshotWidth >= 1024 ? 900 : screenshotWidth >= 600 ? 1024 : 844
      await page.setViewportSize({ width: screenshotWidth, height: screenshotHeight })
      await page.waitForTimeout(100)
      await page.screenshot({
        path: path.join(outputDir, `${route.name}-${theme}-${screenshotWidth}x${screenshotHeight}.png`),
        animations: 'disabled',
        timeout: 15_000,
      })

      diagnostics.push({
        name: route.name,
        route: route.path,
        theme,
        routeResult: true,
        httpStatus: response?.status(),
        finalPath: new URL(page.url()).pathname,
        interaction,
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
    diagnostics.push({ theme, authStatus: auth.status, authRole: auth.role, discoveredCoursePath: Boolean(discoveredCoursePath), discoveredLearningPath: Boolean(discoveredLearningPath) })
    await context.close()
  }
} finally {
  await browser.close()
}

await fs.writeFile(path.join(outputDir, 'diagnostics.json'), JSON.stringify(diagnostics, null, 2))
const routeResults = diagnostics.filter((entry) => entry.routeResult)
const summary = {
  auth: diagnostics.filter((entry) => entry.authStatus),
  routes: routeResults.length,
  unavailable: diagnostics.filter((entry) => entry.unavailable),
  measurements: diagnostics.filter((entry) => entry.width).length,
  overflows: diagnostics.filter((entry) => entry.width && (entry.bodyWidth > entry.viewportWidth || entry.documentWidth > entry.viewportWidth)),
  brokenImages: [...new Set(diagnostics.flatMap((entry) => entry.brokenImages || []))],
  interactions: routeResults.filter((entry) => entry.interaction).map(({ name, theme, interaction }) => ({ name, theme, interaction })),
  redirects: routeResults.filter((entry) => entry.finalPath !== entry.route).map(({ name, theme, route, finalPath }) => ({ name, theme, route, finalPath })),
  consoleErrors: routeResults.flatMap((entry) => entry.consoleErrors),
  reactWarnings: routeResults.flatMap((entry) => entry.reactWarnings),
  pageErrors: routeResults.flatMap((entry) => entry.pageErrors),
  failedRequests: routeResults.flatMap((entry) => entry.failedRequests),
  unexpectedResponses: routeResults.flatMap((entry) => entry.unexpectedResponses),
}
console.log(JSON.stringify(summary, null, 2))
