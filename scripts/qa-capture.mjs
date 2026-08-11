// One-off QA driver: screenshots each section, checks console errors,
// verifies WebGL canvas mounts, and tests reduced-motion fallback.
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:4173'
const OUT = new URL('../qa-shots/', import.meta.url).pathname

const sections = ['about', 'experience', 'skills', 'education', 'languages', 'contact']

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })

async function run(name, { width = 1440, height = 1100, reducedMotion = false } = {}) {
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
  await new Promise((r) => setTimeout(r, 1500))

  const hasCanvas = await page.evaluate(() => document.querySelector('.hero-canvas') !== null)
  const hasFallback = await page.evaluate(() => document.querySelector('.hero-fallback') !== null)
  console.log(`[${name}] canvas=${hasCanvas} fallback=${hasFallback}`)

  await page.screenshot({ path: `${OUT}${name}-hero.png` })

  for (const s of sections) {
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, s)
    await new Promise((r) => setTimeout(r, 1100))
    await page.screenshot({ path: `${OUT}${name}-${s}.png` })
  }

  if (errors.length) {
    console.log(`[${name}] CONSOLE ERRORS:`)
    for (const e of errors) console.log('  -', e)
  } else {
    console.log(`[${name}] no console errors`)
  }
  await page.close()
}

await run('desktop', { width: 1440, height: 1100 })
await run('mobile', { width: 390, height: 844 })
await run('rm', { width: 1440, height: 1100, reducedMotion: true })

await browser.close()
console.log('done')
