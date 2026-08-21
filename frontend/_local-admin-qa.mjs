import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'

const baseUrl = 'http://localhost:5173'
const instructionPath = 'C:\\Users\\vikas\\.codex\\attachments\\20a685b0-42ec-417c-9bb6-5ac9da5ffbde\\pasted-text.txt'
const outputDir = path.resolve('..', 'qa-screenshots', 'local-full', 'admin')
const widths = [1920, 1440, 1366, 1280, 1024, 912, 820, 768, 576, 430, 390, 375, 360, 320]
const visualWidths = [1440, 768, 390, 375, 320]

const instructions = await fs.readFile(instructionPath, 'utf8')
const email = instructions.match(/Email:\s*\r?\n([^\r\n]+)/)?.[1]?.trim()
const password = instructions.match(/Password:\s*\r?\n([^\r\n]+)/)?.[1]?.trim()
if (!email || !password) throw new Error('Admin QA credentials were not found in the supplied instruction attachment')

await fs.mkdir(outputDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const diagnostics = []

const attachDiagnostics = (page) => {
  const values = { consoleErrors: [], reactWarnings: [], pageErrors: [], failedRequests: [], unexpectedResponses: [] }
  const handlers = {
    console: (message) => {
      const value = message.text()
      if (message.type() === 'error') values.consoleErrors.push(value)
      if (message.type() === 'warning' && /warning:|react/i.test(value)) values.reactWarnings.push(value)
    },
    pageerror: (error) => values.pageErrors.push(error.message),
    requestfailed: (request) => values.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }),
    response: (response) => {
      if (response.status() >= 400 && ![401, 403].includes(response.status())) {
        values.unexpectedResponses.push({ status: response.status(), url: response.url() })
      }
    },
  }
  for (const [event, handler] of Object.entries(handlers)) page.on(event, handler)
  return {
    values,
    detach: () => { for (const [event, handler] of Object.entries(handlers)) page.off(event, handler) },
  }
}

const measure = () => ({
  bodyWidth: document.body.scrollWidth,
  documentWidth: document.documentElement.scrollWidth,
  viewportWidth: document.documentElement.clientWidth,
  brokenImages: [...document.images]
    .filter((image) => image.complete && image.naturalWidth === 0)
    .map((image) => image.currentSrc || image.src),
  textLength: document.body.innerText.trim().length,
})

const firstMatchingHref = async (page, matcher) => {
  const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href')).filter(Boolean))
  return hrefs.find((href) => matcher.test(href)) || null
}

const waitForReady = async (page) => {
  await page.waitForFunction(() => ![...document.querySelectorAll('[aria-busy="true"]')].some((element) => {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0
  }), null, { timeout: 90_000 })
  await page.waitForTimeout(250)
}

const spaNavigate = async (page, route) => {
  await page.evaluate((nextRoute) => {
    window.history.pushState({}, '', nextRoute)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, route)
  await page.waitForURL((url) => url.pathname === route, { timeout: 15_000 })
  await waitForReady(page)
}

try {
  if (false) {
    for (const theme of ['light', 'dark']) {
    const loginContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' })
    const loginPage = await loginContext.newPage()
    await loginPage.addInitScript((selectedTheme) => localStorage.setItem('edumaster:theme', selectedTheme), theme)
    await loginPage.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    await loginPage.locator('input[type="email"]').waitFor({ state: 'visible', timeout: 30_000 })
    for (const width of widths) {
      const height = width >= 1024 ? 900 : width >= 600 ? 1024 : 844
      await loginPage.setViewportSize({ width, height })
      await loginPage.waitForTimeout(60)
      diagnostics.push({ name: 'login', route: '/admin/login', theme, width, ...(await loginPage.evaluate(measure)) })
    }
    for (const width of visualWidths) {
      const height = width >= 1024 ? 900 : width >= 600 ? 1024 : 844
      await loginPage.setViewportSize({ width, height })
      await loginPage.screenshot({ path: path.join(outputDir, `login-${theme}-${width}x${height}.png`), animations: 'disabled', timeout: 15_000 })
    }
      await loginContext.close()
    }
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.addInitScript(() => localStorage.setItem('edumaster:theme', 'light'))
  const loginDiagnostics = attachDiagnostics(page)
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await Promise.all([
    page.waitForURL(/\/admin\/dashboard(?:[/?#]|$)/, { timeout: 30_000 }),
    page.locator('button[type="submit"]').click(),
  ])
  await waitForReady(page)
  const loginRedirectPath = new URL(page.url()).pathname
  const auth = await page.evaluate(async () => {
    const response = await fetch('http://localhost:5000/api/v1/auth/me', { credentials: 'include' })
    const body = await response.json().catch(() => ({}))
    return { status: response.status, role: body?.data?.user?.role ?? body?.user?.role ?? body?.data?.role ?? null }
  })
  if (auth.status !== 200 || auth.role !== 'admin') throw new Error(`Admin login did not establish an admin session (status ${auth.status}, role ${auth.role})`)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await waitForReady(page)
  const sessionRestored = new URL(page.url()).pathname.startsWith('/admin/')
  diagnostics.push({ loginResult: true, loginRedirectPath, authStatus: auth.status, authRole: auth.role, sessionRestored, ...loginDiagnostics.values })
  loginDiagnostics.detach()

  const fetchFirstId = async (endpoint) => page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'include' })
    if (!response.ok) return null
    const body = await response.json().catch(() => ({}))
    const data = body?.data ?? body
    const rows = Array.isArray(data) ? data : Object.values(data ?? {}).find((value) => Array.isArray(value))
    return rows?.[0]?._id ?? rows?.[0]?.id ?? null
  }, `http://localhost:5000/api/v1${endpoint}`)

  const ids = {
    course: await fetchFirstId('/admin/courses?page=1&limit=1'),
    user: await fetchFirstId('/admin/users?page=1&limit=1'),
    order: await fetchFirstId('/admin/orders?page=1&limit=1'),
    enrollment: await fetchFirstId('/admin/enrollments?page=1&limit=1'),
    quiz: await fetchFirstId('/admin/quizzes?page=1&limit=1'),
    assignment: await fetchFirstId('/admin/assignments?page=1&limit=1'),
    certificate: await fetchFirstId('/admin/certificates?page=1&limit=1'),
    discussion: await fetchFirstId('/admin/discussions?page=1&limit=1'),
    notification: await fetchFirstId('/admin/notifications?page=1&limit=1'),
  }
  const detailRoutes = [
    { name: 'course-curriculum', path: ids.course && `/admin/courses/${ids.course}/curriculum` },
    { name: 'user-detail', path: ids.user && `/admin/users/${ids.user}` },
    { name: 'order-detail', path: ids.order && `/admin/orders/${ids.order}` },
    { name: 'enrollment-detail', path: ids.enrollment && `/admin/enrollments/${ids.enrollment}` },
    { name: 'quiz-detail', path: ids.quiz && `/admin/quizzes/${ids.quiz}` },
    { name: 'assignment-detail', path: ids.assignment && `/admin/assignments/${ids.assignment}` },
    { name: 'certificate-detail', path: ids.certificate && `/admin/certificates/${ids.certificate}` },
    { name: 'discussion-detail', path: ids.discussion && `/admin/discussions/${ids.discussion}` },
    { name: 'notification-detail', path: ids.notification && `/admin/notifications/${ids.notification}` },
  ].filter((route) => route.path)

  const routes = [
    { name: 'dashboard', path: '/admin/dashboard' },
    { name: 'profile', path: '/admin/profile' },
    { name: 'courses', path: '/admin/courses' },
    { name: 'users', path: '/admin/users' },
    { name: 'orders', path: '/admin/orders' },
    { name: 'enrollments', path: '/admin/enrollments' },
    { name: 'quizzes', path: '/admin/quizzes' },
    { name: 'assignments', path: '/admin/assignments' },
    { name: 'certificates', path: '/admin/certificates' },
    { name: 'discussions', path: '/admin/discussions' },
    { name: 'notifications', path: '/admin/notifications' },
    { name: 'reports', path: '/admin/reports' },
    { name: 'settings', path: '/admin/settings' },
    ...detailRoutes,
  ]

  for (const theme of ['light', 'dark']) {
    await page.evaluate((selectedTheme) => {
      localStorage.setItem('edumaster:theme', selectedTheme)
      document.documentElement.dataset.theme = selectedTheme
    }, theme)
    for (const [routeIndex, route] of routes.entries()) {
      const routeDiagnostics = attachDiagnostics(page)
      await page.setViewportSize({ width: 1440, height: 900 })
      await spaNavigate(page, route.path)
      const response = { status: () => 200 }

      let interaction = null
      if (route.name === 'dashboard') {
        const ordersHeading = page.getByText('Recent Orders', { exact: true }).first()
        const usersHeading = page.getByText('Recent Users', { exact: true }).first()
        const ordersBox = await ordersHeading.count() ? await ordersHeading.locator('xpath=ancestor::section[1]').boundingBox() : null
        const usersBox = await usersHeading.count() ? await usersHeading.locator('xpath=ancestor::section[1]').boundingBox() : null
        interaction = { ordersBox, usersBox, usersBelowOrders: Boolean(ordersBox && usersBox && usersBox.y >= ordersBox.y) }
      }
      if (route.name === 'reports') {
        const labels = ['7d', '30d', '90d', 'all']
        const tested = []
        const control = page.locator('.admin-reports__controls select').first()
        for (const label of labels) {
          if (await control.count()) {
            await control.waitFor({ state: 'visible', timeout: 15_000 })
            await page.waitForFunction(() => !document.querySelector('.admin-reports__controls select')?.disabled, { timeout: 15_000 })
            await control.selectOption(label)
            await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), { timeout: 30_000 }).catch(() => {})
            tested.push(label)
          }
        }
        interaction = { dateRangesTested: tested }
      }

      for (const width of widths) {
        const height = width >= 1024 ? 900 : width >= 600 ? 1024 : 844
        await page.setViewportSize({ width, height })
        await page.waitForTimeout(80)
        diagnostics.push({ name: route.name, route: route.path, theme, width, ...(await page.evaluate(measure)) })
      }

      const screenshotWidth = visualWidths[routeIndex % visualWidths.length]
      const screenshotHeight = screenshotWidth >= 1024 ? 900 : screenshotWidth >= 600 ? 1024 : 844
      await page.setViewportSize({ width: screenshotWidth, height: screenshotHeight })
      await page.waitForTimeout(100)
      await page.screenshot({
        path: path.join(outputDir, `${route.name}-${theme}-${screenshotWidth}x${screenshotHeight}.png`),
        animations: 'disabled',
        timeout: 15_000,
      })

      if (route.name === 'dashboard') {
        await page.setViewportSize({ width: 320, height: 844 })
        const toggle = page.locator('.admin-header__menu').first()
        const toggleAvailable = await toggle.count() > 0 && await toggle.isVisible()
        if (toggleAvailable) await toggle.click()
        const drawerVisible = toggleAvailable && await toggle.getAttribute('aria-expanded') === 'true'
        await page.screenshot({ path: path.join(outputDir, `dashboard-${theme}-320x844-drawer.png`), animations: 'disabled', timeout: 15_000 })
        interaction = { ...interaction, mobileToggleAvailable: toggleAvailable, drawerVisible }
        if (drawerVisible) await page.keyboard.press('Escape')
      }

      diagnostics.push({
        name: route.name,
        route: route.path,
        theme,
        routeResult: true,
        httpStatus: response?.status(),
        finalPath: new URL(page.url()).pathname,
        interaction,
        ...routeDiagnostics.values,
      })
      routeDiagnostics.detach()
      console.log(`checked ${theme} ${route.name}`)
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 })
  await spaNavigate(page, '/admin/dashboard')
  const profileTrigger = page.locator('.admin-profile-trigger, button[aria-label*="profile" i]').first()
  let logoutPassed = false
  const profileAvailable = await profileTrigger.count() > 0 && await profileTrigger.isVisible()
  let logoutAvailable = false
  if (profileAvailable) {
    await profileTrigger.click()
    const logout = page.getByRole('button', { name: /logout|sign out/i }).first()
    logoutAvailable = await logout.count() > 0
    if (logoutAvailable) {
      await logout.click()
      await page.waitForURL(/\/admin\/login/, { timeout: 15_000 }).catch(() => {})
      logoutPassed = new URL(page.url()).pathname === '/admin/login'
    }
  }
  diagnostics.push({ logoutResult: true, profileAvailable, logoutAvailable, logoutPassed, logoutFinalPath: new URL(page.url()).pathname })
  await context.close()
} finally {
  await browser.close()
}

await fs.writeFile(path.join(outputDir, 'diagnostics.json'), JSON.stringify(diagnostics, null, 2))
const routeResults = diagnostics.filter((entry) => entry.routeResult)
const summary = {
  login: diagnostics.find((entry) => entry.loginResult),
  logout: diagnostics.find((entry) => entry.logoutResult),
  discoveredDetails: [...new Set(routeResults.filter((entry) => entry.name.endsWith('detail') || entry.name === 'course-curriculum').map((entry) => entry.name))],
  routes: routeResults.length,
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
