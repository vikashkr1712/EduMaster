import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'

const baseUrl = 'http://localhost:5173'
const apiUrl = 'http://localhost:5000/api/v1'
const instructionPath = 'C:\\Users\\vikas\\.codex\\attachments\\20a685b0-42ec-417c-9bb6-5ac9da5ffbde\\pasted-text.txt'
const outputDir = path.resolve('..', 'qa-screenshots', 'local-full', 'admin')
const instructions = await fs.readFile(instructionPath, 'utf8')
const email = instructions.match(/Email:\s*\r?\n([^\r\n]+)/)?.[1]?.trim()
const password = instructions.match(/Password:\s*\r?\n([^\r\n]+)/)?.[1]?.trim()
if (!email || !password) throw new Error('Admin QA credentials not found')

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const page = await context.newPage()
const diagnostics = { consoleErrors: [], reactWarnings: [], pageErrors: [], failedRequests: [], unexpectedResponses: [] }
page.on('console', (message) => {
  if (message.type() === 'error') diagnostics.consoleErrors.push(message.text())
  if (message.type() === 'warning' && /warning:|react/i.test(message.text())) diagnostics.reactWarnings.push(message.text())
})
page.on('pageerror', (error) => diagnostics.pageErrors.push(error.message))
page.on('requestfailed', (request) => diagnostics.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }))
page.on('response', (response) => {
  if (response.status() >= 400 && ![401, 403].includes(response.status())) diagnostics.unexpectedResponses.push({ status: response.status(), url: response.url() })
})

const waitForApi = (fragment) => page.waitForResponse(
  (response) => response.url().includes(fragment) && response.request().method() === 'GET',
  { timeout: 90_000 },
)

const navigateAndWait = async (route, apiFragment) => {
  const responsePromise = waitForApi(apiFragment)
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  const response = await responsePromise
  if (!response.ok()) throw new Error(`${route} API returned ${response.status()}`)
  await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), null, { timeout: 90_000 })
  return response.status()
}

try {
  await page.addInitScript(() => localStorage.setItem('edumaster:theme', 'light'))
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await Promise.all([
    page.waitForURL(/\/admin\/dashboard/, { timeout: 30_000 }),
    page.locator('button[type="submit"]').click(),
  ])

  const usersStatus = await navigateAndWait('/admin/users', '/admin/users?')
  await page.getByText(/Showing 1.+of \d+ users/).first().waitFor({ state: 'visible', timeout: 30_000 })
  const usersSummary = await page.locator('.admin-user-summary strong').allTextContents()
  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => { localStorage.setItem('edumaster:theme', value); document.documentElement.dataset.theme = value }, theme)
    await page.setViewportSize({ width: 375, height: 844 })
    await page.screenshot({ path: path.join(outputDir, `users-${theme}-375x844.png`), animations: 'disabled' })
  }

  await page.setViewportSize({ width: 1440, height: 900 })
  const enrollmentsStatus = await navigateAndWait('/admin/enrollments', '/admin/enrollments?')
  await page.getByText(/Showing 1.+of \d+ enrollments/).first().waitFor({ state: 'visible', timeout: 30_000 })
  const enrollmentsSummary = await page.locator('.admin-commerce-summary strong').allTextContents()
  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => { localStorage.setItem('edumaster:theme', value); document.documentElement.dataset.theme = value }, theme)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.screenshot({ path: path.join(outputDir, `enrollments-${theme}-1440x900.png`), animations: 'disabled' })
  }

  await page.setViewportSize({ width: 768, height: 1024 })
  await navigateAndWait('/admin/reports', '/admin/reports?')
  const rangeControl = page.locator('.admin-reports__controls select')
  const ranges = []
  for (const value of ['7d', '30d', '90d', 'all']) {
    const responsePromise = waitForApi('/admin/reports?')
    await rangeControl.selectOption(value)
    const response = await responsePromise
    if (!response.ok()) throw new Error(`Reports ${value} returned ${response.status()}`)
    await page.getByRole('heading', { name: 'Course Performance' }).waitFor({ state: 'visible', timeout: 30_000 })
    ranges.push(await rangeControl.inputValue())
  }
  const reportPagination = await page.locator('.admin-report-panel--course-performance').getByText(/Showing \d+.+courses/).first().textContent().catch(() => null)

  const enrollmentId = await page.evaluate(async (url) => {
    const response = await fetch(`${url}/admin/enrollments?page=1&limit=1`, { credentials: 'include' })
    const body = await response.json()
    return body?.data?.enrollments?.[0]?._id
  }, apiUrl)
  if (!enrollmentId) throw new Error('No enrollment was available for the detail contrast check')
  await page.setViewportSize({ width: 768, height: 1024 })
  await navigateAndWait(`/admin/enrollments/${enrollmentId}`, `/admin/enrollments/${enrollmentId}`)
  await page.evaluate(() => { localStorage.setItem('edumaster:theme', 'dark'); document.documentElement.dataset.theme = 'dark' })
  const progressColor = await page.locator('.admin-enrollment-progress-panel > div:first-child').evaluate((element) => getComputedStyle(element).color)
  await page.screenshot({ path: path.join(outputDir, 'enrollment-detail-dark-768x1024.png'), animations: 'disabled' })

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${baseUrl}/admin/dashboard`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.locator('.admin-profile-trigger').click()
  const logout = page.getByRole('menuitem', { name: /^Logout$/ })
  await logout.waitFor({ state: 'visible', timeout: 15_000 })
  await Promise.all([
    page.waitForURL(/\/admin\/login/, { timeout: 30_000 }),
    logout.click(),
  ])

  console.log(JSON.stringify({
    usersStatus,
    usersSummary,
    enrollmentsStatus,
    enrollmentsSummary,
    ranges,
    reportPagination,
    progressColor,
    logoutPassed: new URL(page.url()).pathname === '/admin/login',
    ...diagnostics,
  }, null, 2))
} finally {
  await context.close()
  await browser.close()
}
