import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'

const baseUrl = 'http://localhost:5173'
const outputDir = path.resolve('..', 'qa-screenshots', 'local-courses')
const widths = [1920, 1440, 1366, 1280, 1024, 912, 820, 768, 576, 430, 390, 375, 360, 320]
const screenshotWidths = new Set([1440, 768, 390, 375, 320])

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
    const consoleErrors = []
    const reactWarnings = []
    const pageErrors = []
    const failedRequests = []
    const unexpectedResponses = []

    page.on('console', (message) => {
      const value = message.text()
      if (message.type() === 'error') consoleErrors.push(value)
      if (/warning:|react/i.test(value) && message.type() === 'warning') reactWarnings.push(value)
    })
    page.on('pageerror', (error) => pageErrors.push(error.message))
    page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }))
    page.on('response', (response) => {
      if (response.status() >= 400) unexpectedResponses.push({ status: response.status(), url: response.url() })
    })

    await page.addInitScript((selectedTheme) => localStorage.setItem('edumaster:theme', selectedTheme), theme)
    await page.goto(`${baseUrl}/courses`, { waitUntil: 'networkidle', timeout: 90_000 })
    await page.locator('.ccard').first().waitFor({ state: 'visible', timeout: 30_000 })

    for (const width of widths) {
      const height = width >= 1024 ? 900 : width >= 600 ? 1024 : 844
      await page.setViewportSize({ width, height })
      await page.waitForTimeout(180)

      const metrics = await page.evaluate(() => {
        const selectors = ['.courses-toolbar-right', '.courses-filter-btn', '.courses-sort', '.ccard', '.ccard-meta', '.ccard-actions', '.cpagination']
        const boxes = Object.fromEntries(selectors.map((selector) => {
          const element = document.querySelector(selector)
          if (!element) return [selector, null]
          const rect = element.getBoundingClientRect()
          return [selector, {
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            width: Math.round(rect.width * 100) / 100,
            visible: rect.width > 0 && rect.height > 0,
          }]
        }))
        return {
          bodyWidth: document.body.scrollWidth,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
          boxes,
        }
      })

      if (screenshotWidths.has(width)) {
        await page.screenshot({ path: path.join(outputDir, `courses-${theme}-${width}x${height}.png`), fullPage: true })
      }
      diagnostics.push({ route: '/courses', theme, width, ...metrics })
    }

    await page.setViewportSize({ width: 320, height: 844 })
    const filterButton = page.locator('.courses-filter-btn')
    await filterButton.click()
    const filterUsable = await page.locator('.courses-sidebar.mobile-open, .courses-sidebar.open, .courses-sidebar.is-open').count() > 0
      || await page.locator('.courses-sidebar').isVisible()
    await page.keyboard.press('Escape')
    const sortSelect = page.locator('#courses-sort-select')
    const sortUsable = await sortSelect.isVisible() && await sortSelect.isEnabled()

    diagnostics.push({
      route: '/courses',
      theme,
      interaction: true,
      filterUsable,
      sortUsable,
      consoleErrors,
      reactWarnings,
      pageErrors,
      failedRequests,
      unexpectedResponses,
    })
    await context.close()
  }
} finally {
  await browser.close()
}

await fs.writeFile(path.join(outputDir, 'diagnostics.json'), JSON.stringify(diagnostics, null, 2))
const summary = {
  measurements: diagnostics.filter((entry) => entry.width).length,
  overflows: diagnostics.filter((entry) => entry.width && (entry.bodyWidth > entry.viewportWidth || entry.documentWidth > entry.viewportWidth)),
  brokenImages: diagnostics.flatMap((entry) => entry.brokenImages || []),
  interactions: diagnostics.filter((entry) => entry.interaction),
}
console.log(JSON.stringify(summary, null, 2))
