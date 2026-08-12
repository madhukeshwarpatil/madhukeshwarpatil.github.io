// QA driver for the code-helix background: console errors, canvas/fallback
// gating, scroll-through screenshots, overflow probe at narrow widths.
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:4174'
const OUT = new URL('../qa-shots/', import.meta.url).pathname

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })

async function run(name, { width = 1440, height = 900, reducedMotion = false } = {}) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))

  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1800))

  const state = await page.evaluate(() => ({
    canvas: document.querySelector('.bg3d canvas') !== null,
    fallback: document.querySelector('.bg3d-fallback') !== null,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))
  console.log(`[${name}]`, JSON.stringify(state))

  await page.screenshot({ path: `${OUT}helix-${name}-hero.png` })

  // Scroll positions: mid-experience, skills, contact/bottom.
  for (const [label, frac] of [['mid', 0.35], ['skills', 0.62], ['end', 1]]) {
    await page.evaluate((f) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: max * f, behavior: 'instant' })
    }, frac)
    await new Promise((r) => setTimeout(r, 1400))
    await page.screenshot({ path: `${OUT}helix-${name}-${label}.png` })
  }

  console.log(errors.length ? `[${name}] CONSOLE ERRORS:\n${errors.map((e) => '  - ' + e).join('\n')}` : `[${name}] no console errors`)
  await page.close()
}

await run('desktop', { width: 1440, height: 900 })
await run('mobile', { width: 390, height: 844 })
await run('narrow', { width: 320, height: 700 })
await run('rm', { width: 1440, height: 900, reducedMotion: true })

await browser.close()
console.log('done')
