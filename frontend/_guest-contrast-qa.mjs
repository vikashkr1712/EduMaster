import { chromium } from 'playwright'
import path from 'node:path'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 768, height: 1024 }, colorScheme: 'dark', reducedMotion: 'reduce' })
const page = await context.newPage()
const outputDir = path.resolve('..', 'qa-screenshots', 'local-full', 'guest')

try {
  await page.addInitScript(() => localStorage.setItem('edumaster:theme', 'dark'))
  await page.goto('http://localhost:5173/events', { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForTimeout(400)
  const eventIcon = await page.locator('.programs-btn-how svg').evaluate((element) => ({
    circleStroke: getComputedStyle(element.querySelector('circle')).stroke,
    pathFill: getComputedStyle(element.querySelector('path')).fill,
  }))
  await page.screenshot({ path: path.join(outputDir, 'events-dark-768x1024.png'), animations: 'disabled' })

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://localhost:5173/signup', { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForTimeout(400)
  const appleFill = await page.locator('.authcard-social-btn').last().locator('svg').evaluate((element) => getComputedStyle(element).fill)
  await page.screenshot({ path: path.join(outputDir, 'signup-dark-1440x900.png'), animations: 'disabled' })

  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForTimeout(400)
  const loginFormVisible = await page.locator('form').first().isVisible()
  await page.screenshot({ path: path.join(outputDir, 'login-dark-320-full.png'), animations: 'disabled', fullPage: true, timeout: 15_000 })
  console.log(JSON.stringify({ eventIcon, appleFill, loginFormVisible }, null, 2))
} finally {
  await context.close()
  await browser.close()
}
