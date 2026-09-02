import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const BASE = 'https://route-of-the-day.sociobot.in';
const evidence = { checkedAt: new Date().toISOString(), base: BASE, runs: {}, errors: [], expectedConsole: [], requestUrls: [] };
const browser = await chromium.launch({ headless: true });

function observe(page, label) {
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const item = { label, type: 'console', message: message.text(), pageUrl: page.url() };
      if (/definitely-missing/.test(page.url()) && /responded with a status of 404/.test(message.text())) evidence.expectedConsole.push(item);
      else evidence.errors.push(item);
    }
  });
  page.on('pageerror', (error) => evidence.errors.push({ label, type: 'page', message: String(error) }));
  page.on('request', (request) => evidence.requestUrls.push({ label, method: request.method(), url: request.url(), type: request.resourceType() }));
}

async function getSolution(page) {
  return page.locator('[data-game]').evaluate((el) => JSON.parse(el.getAttribute('data-solution') || '[]'));
}

async function solveByClick(page, from = 1) {
  const path = await getSolution(page);
  for (const point of path.slice(from)) {
    await page.locator(`.cell[data-row="${point.row}"][data-col="${point.col}"]`).click();
  }
  return path;
}

async function fpsSample(page) {
  return page.evaluate(() => new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    const tick = (now) => {
      frames += 1;
      if (now - start >= 1000) resolve(frames);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }));
}

// Desktop daily: invalid move, real losing path, restart, win, persistence, archive win.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  observe(page, 'daily-desktop');
  const response = await page.goto(BASE, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  const puzzle = await page.evaluate(() => window.__ROUTE_PUZZLE__);
  assert.ok(puzzle);
  const initialCount = await page.locator('.cell.selected').count();
  const invalid = await page.locator('.cell:not(:disabled)').evaluateAll((cells, start) => {
    const cell = cells.find((candidate) => {
      const row = Number(candidate.dataset.row); const col = Number(candidate.dataset.col);
      return Math.abs(row - start.row) + Math.abs(col - start.col) > 1;
    });
    return cell ? { row: Number(cell.dataset.row), col: Number(cell.dataset.col) } : null;
  }, puzzle.start);
  assert.ok(invalid);
  await page.locator(`.cell[data-row="${invalid.row}"][data-col="${invalid.col}"]`).click();
  assert.equal(await page.locator('.cell.selected').count(), initialCount);
  const invalidMessage = await page.locator('[data-status]').innerText();
  assert.match(invalidMessage, /beside the end|beside Start/i);

  const losingPath = await page.evaluate(() => {
    const p = window.__ROUTE_PUZZLE__;
    const same = (a, b) => a.row === b.row && a.col === b.col;
    const blocked = (x) => p.blocked.some((b) => same(b, x));
    const dfs = (path) => {
      if (path.length === p.solution.length) return same(path.at(-1), p.finish) ? null : path;
      const last = path.at(-1);
      for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const next = { row: last.row + dr, col: last.col + dc };
        if (next.row < 0 || next.col < 0 || next.row >= p.size || next.col >= p.size) continue;
        if (same(next, p.finish) || blocked(next) || path.some((x) => same(x, next))) continue;
        const found = dfs([...path, next]);
        if (found) return found;
      }
      return null;
    };
    return dfs([p.start]);
  });
  assert.ok(losingPath, 'expected a valid non-finishing path at the tile limit');
  for (const point of losingPath.slice(1)) await page.locator(`.cell[data-row="${point.row}"][data-col="${point.col}"]`).click();
  const extraStep = await page.evaluate((path) => {
    const p = window.__ROUTE_PUZZLE__; const last = path.at(-1);
    const same = (a, b) => a.row === b.row && a.col === b.col;
    return [[1,0],[-1,0],[0,1],[0,-1]].map(([dr, dc]) => ({ row: last.row + dr, col: last.col + dc })).find((next) =>
      next.row >= 0 && next.col >= 0 && next.row < p.size && next.col < p.size &&
      !p.blocked.some((b) => same(b, next)) && !path.some((x) => same(x, next))
    ) || null;
  }, losingPath);
  assert.ok(extraStep, 'expected an open step after the exhausted route');
  await page.locator(`.cell[data-row="${extraStep.row}"][data-col="${extraStep.col}"]`).click();
  const lossMessage = await page.locator('[data-status]').innerText();
  assert.match(lossMessage, /tile limit/i);
  assert.equal(await page.locator('[data-finish]').isVisible(), false);
  await page.screenshot({ path: '.factory/evidence/verify-5-loss.png', fullPage: false });

  await page.getByRole('button', { name: 'Restart puzzle' }).click();
  assert.equal(await page.locator('.cell.selected').count(), 1);
  assert.match(await page.locator('[data-status]').innerText(), /route is clear/i);

  const solution = await solveByClick(page);
  await page.getByRole('heading', { name: 'Route complete', level: 3 }).waitFor();
  assert.equal(await page.locator('[data-finish]').evaluate((el) => document.activeElement === el), true);
  const routeCode = (await page.locator('.solution-code').innerText()).trim();
  const expectedCode = solution.map(({ row, col }) => `${String.fromCharCode(65 + col)}${row + 1}`).join('–');
  assert.ok(routeCode.includes(expectedCode));
  await page.screenshot({ path: '.factory/evidence/verify-5-end.png', fullPage: false });
  const wonStorage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  assert.equal(wonStorage['route:daily-complete:v1'], puzzle.seed);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('heading', { name: 'Route complete', level: 3 }).isVisible(), true);
  assert.equal(await page.locator('.cell.selected').count(), solution.length);
  await page.getByRole('button', { name: 'Play this route again' }).click();
  assert.equal(await page.locator('.cell.selected').count(), 1);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.cell.selected').count(), 1);
  const dailyStorageBeforeArchive = await page.evaluate((seed) => localStorage.getItem(`route:path:v1:${seed}`), puzzle.seed);
  await page.getByRole('link', { name: 'Open practice routes' }).click();
  assert.match(page.url(), /practice=1/);
  const archiveSeed = await page.locator('[data-game]').getAttribute('data-seed');
  const expectedArchiveDate = new Date(`${puzzle.seed}T00:00:00Z`);
  expectedArchiveDate.setUTCDate(expectedArchiveDate.getUTCDate() - 1);
  assert.equal(archiveSeed, expectedArchiveDate.toISOString().slice(0, 10));
  await solveByClick(page);
  await page.getByRole('heading', { name: 'Route complete', level: 3 }).waitFor();
  assert.equal(await page.getByRole('link', { name: 'Play next archive route' }).isVisible(), true);
  assert.equal(await page.evaluate((seed) => localStorage.getItem(`route:path:v1:${seed}`), puzzle.seed), dailyStorageBeforeArchive);
  assert.equal(await page.evaluate(() => localStorage.getItem('route:daily-complete:v1')), puzzle.seed);
  evidence.runs.daily = {
    seed: puzzle.seed,
    rule: puzzle.rule,
    solutionLength: solution.length,
    invalidMessage,
    losingPath,
    lossMessage,
    routeCode,
    restartCount: 1,
    persistedWinCount: solution.length,
    archiveSeed,
    archiveCompleted: true,
    responseHeaders: await response.allHeaders(),
  };
  await context.close();
}

// Demo storage sandbox and reset focus.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  observe(page, 'demo');
  await page.addInitScript(() => localStorage.setItem('route:verify-5-sentinel', 'daily'));
  await page.goto(`${BASE}/?demo=1`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.cell.selected').count(), 4);
  const path = await getSolution(page);
  await page.locator(`.cell[data-row="${path[4].row}"][data-col="${path[4].col}"]`).click();
  assert.equal(await page.locator('.cell.selected').count(), 5);
  const advancedDemoKeys = await page.evaluate(() => Object.keys(sessionStorage));
  assert.ok(advancedDemoKeys.length > 0 && advancedDemoKeys.every((key) => key.startsWith('demo:')));
  await page.getByRole('button', { name: 'Reset demo' }).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.cell.selected').count(), 4);
  assert.equal(await page.getByRole('button', { name: 'Reset demo' }).evaluate((el) => el === document.activeElement), true);
  const demoKeys = await page.evaluate(() => Object.keys(sessionStorage));
  assert.ok(demoKeys.every((key) => key.startsWith('demo:')));
  assert.equal(await page.evaluate(() => localStorage.getItem('route:verify-5-sentinel')), 'daily');
  await page.getByRole('link', { name: 'Start for real' }).click();
  assert.equal(new URL(page.url()).pathname, '/');
  assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), []);
  assert.equal(await page.evaluate(() => localStorage.getItem('route:verify-5-sentinel')), 'daily');
  evidence.runs.demo = { initialTiles: 4, advancedTiles: 5, resetTiles: 4, resetFocusRetained: true, advancedDemoKeys, demoKeysAfterReset: demoKeys, dailySentinelPreserved: true, demoKeysClearedOnExit: true };
  await context.close();
}

// Keyboard-only completion and skip-link focus treatment.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  observe(page, 'keyboard');
  await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), outline: getComputedStyle(document.activeElement).outline, rect: document.activeElement.getBoundingClientRect().toJSON() }));
  assert.match(skip.text, /skip to the puzzle/i);
  assert.ok(skip.rect.width > 0 && skip.rect.height > 0);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('h1').evaluate((el) => el === document.activeElement), true);
  const path = await getSolution(page);
  let current = path[3];
  await page.locator(`.cell[data-row="${current.row}"][data-col="${current.col}"]`).focus();
  for (const next of path.slice(4)) {
    const key = next.row < current.row ? 'ArrowUp' : next.row > current.row ? 'ArrowDown' : next.col < current.col ? 'ArrowLeft' : 'ArrowRight';
    await page.keyboard.press(key);
    await page.keyboard.press('Space');
    current = next;
  }
  await page.getByRole('heading', { name: 'Route complete', level: 3 }).waitFor();
  assert.equal(await page.locator('[data-finish]').evaluate((el) => document.activeElement === el), true);
  evidence.runs.keyboard = { skipLink: skip, completed: true, finishFocused: true };
  await context.close();
}

// Pointer-drag and touch completion in independent contexts.
{
  const pointerContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pointerPage = await pointerContext.newPage();
  observe(pointerPage, 'pointer-drag');
  await pointerPage.goto(`${BASE}/demo`, { waitUntil: 'networkidle' });
  const path = await getSolution(pointerPage);
  const startCell = pointerPage.locator(`.cell[data-row="${path[3].row}"][data-col="${path[3].col}"]`);
  await startCell.scrollIntoViewIfNeeded();
  const startBox = await startCell.boundingBox();
  await pointerPage.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2);
  await pointerPage.mouse.down();
  for (const point of path.slice(4)) {
    const box = await pointerPage.locator(`.cell[data-row="${point.row}"][data-col="${point.col}"]`).boundingBox();
    await pointerPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 3 });
  }
  await pointerPage.mouse.up();
  await pointerPage.getByRole('heading', { name: 'Route complete', level: 3 }).waitFor();
  await pointerContext.close();

  const touchContext = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const touchPage = await touchContext.newPage();
  observe(touchPage, 'touch-mobile');
  await touchPage.goto(BASE, { waitUntil: 'networkidle' });
  await touchPage.screenshot({ path: '.factory/evidence/verify-5-first-mobile.png', fullPage: false });
  const touchPath = await getSolution(touchPage);
  for (const point of touchPath.slice(1)) await touchPage.locator(`.cell[data-row="${point.row}"][data-col="${point.col}"]`).tap();
  await touchPage.getByRole('heading', { name: 'Route complete', level: 3 }).waitFor();
  evidence.runs.inputs = { pointerDragCompleted: true, touch390Completed: true };
  await touchContext.close();
}

// Corrupt saved data and unavailable storage both recover without killing play.
{
  const context = await browser.newContext();
  const page = await context.newPage();
  observe(page, 'recovery');
  await page.goto(BASE);
  const puzzle = await page.evaluate(() => window.__ROUTE_PUZZLE__);
  await page.evaluate((seed) => localStorage.setItem(`route:path:v1:${seed}`, JSON.stringify([{ row: 99, col: 99 }])), puzzle.seed);
  await page.reload();
  assert.equal(await page.locator('.cell.selected').count(), 1);
  assert.equal(await page.locator('.cell[tabindex="0"]').count(), 1);
  await page.goto(`${BASE}/?practice=1e309`);
  assert.equal(await page.locator('[data-game]').getAttribute('data-seed'), puzzle.seed);
  evidence.runs.invalidRecovery = { corruptPathReset: true, keyboardStopRetained: true, infinitePracticeRecoveredToDaily: true, retainedInvalidQuery: new URL(page.url()).search };
  await context.close();

  const noStorageContext = await browser.newContext();
  await noStorageContext.addInitScript(() => {
    Storage.prototype.setItem = function () { throw new DOMException('blocked', 'SecurityError'); };
  });
  const noStoragePage = await noStorageContext.newPage();
  observe(noStoragePage, 'storage-disabled');
  await noStoragePage.goto(BASE);
  const path = await getSolution(noStoragePage);
  await noStoragePage.locator(`.cell[data-row="${path[1].row}"][data-col="${path[1].col}"]`).click();
  const message = await noStoragePage.locator('[data-status]').innerText();
  assert.match(message, /cannot save/i);
  evidence.runs.invalidRecovery.storageUnavailableMessage = message;
  await noStorageContext.close();
}

// Accessibility, responsive target size, heading order, and 200% text zoom.
{
  const routeResults = [];
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    observe(page, `a11y-${viewport.name}`);
    for (const route of ['/', '/?demo=1', '/privacy', '/terms', '/definitely-missing']) {
      const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
      const axe = await new AxeBuilder({ page }).analyze();
      const severe = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''));
      const structure = await page.evaluate(() => {
        const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({ level: Number(h.tagName.slice(1)), text: h.textContent.trim() }));
        const jumps = headings.filter((h, i) => i > 0 && h.level > headings[i - 1].level + 1);
        const tooSmall = [...document.querySelectorAll('a[href],button:not(:disabled)')].filter((el) => {
          const s = getComputedStyle(el); const r = el.getBoundingClientRect();
          return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetParent !== null && (r.width < 44 || r.height < 44);
        }).map((el) => ({ text: (el.textContent || el.getAttribute('aria-label') || '').trim(), rect: el.getBoundingClientRect().toJSON() }));
        return {
          title: document.title,
          lang: document.documentElement.lang,
          h1: document.querySelectorAll('h1').length,
          main: document.querySelectorAll('main').length,
          header: document.querySelectorAll('header').length,
          footer: document.querySelectorAll('footer').length,
          imagesMissingAlt: document.querySelectorAll('img:not([alt])').length,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          headingJumps: jumps,
          tooSmall,
        };
      });
      assert.equal(severe.length, 0);
      assert.equal(structure.lang, 'en');
      assert.equal(structure.h1, 1);
      assert.equal(structure.main, 1);
      assert.equal(structure.header, 1);
      assert.equal(structure.footer, 1);
      assert.equal(structure.imagesMissingAlt, 0);
      assert.equal(structure.overflow, 0);
      assert.deepEqual(structure.headingJumps, []);
      assert.deepEqual(structure.tooSmall, []);
      routeResults.push({ viewport: viewport.name, route, status: response.status(), severeAxe: severe, structure });
    }
    await context.close();
  }

  const zoomContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const zoomPage = await zoomContext.newPage();
  observe(zoomPage, 'text-200');
  await zoomPage.goto(BASE);
  await zoomPage.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const zoom = await zoomPage.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, h1Visible: !!document.querySelector('h1')?.getClientRects().length, gameVisible: !!document.querySelector('[data-game]')?.getClientRects().length }));
  assert.equal(zoom.overflow, 0);
  assert.equal(zoom.h1Visible, true);
  assert.equal(zoom.gameVisible, true);
  evidence.runs.accessibility = { routes: routeResults, text200Percent: zoom };
  await zoomContext.close();
}

// Reduced-motion behavior and measured frame-rate claim.
{
  const normalContext = await browser.newContext({ reducedMotion: 'no-preference' });
  const normalPage = await normalContext.newPage();
  observe(normalPage, 'motion-normal');
  await normalPage.goto(`${BASE}/demo`);
  const normalCellTransition = await normalPage.locator('.cell').first().evaluate((el) => getComputedStyle(el).transitionDuration);
  await solveByClick(normalPage, 4);
  const normalFinishAnimation = await normalPage.locator('[data-finish]').evaluate((el) => getComputedStyle(el).animationDuration);
  const frames = [];
  for (let i = 0; i < 5; i += 1) frames.push(await fpsSample(normalPage));
  assert.ok(frames.every((count) => count >= 50));
  await normalContext.close();

  const reducedContext = await browser.newContext({ reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  observe(reducedPage, 'motion-reduced');
  await reducedPage.goto(`${BASE}/demo`);
  const reducedCellTransition = await reducedPage.locator('.cell').first().evaluate((el) => getComputedStyle(el).transitionDuration);
  await solveByClick(reducedPage, 4);
  const reducedFinishAnimation = await reducedPage.locator('[data-finish]').evaluate((el) => getComputedStyle(el).animationDuration);
  evidence.runs.rendering = { frames, normalCellTransition, reducedCellTransition, normalFinishAnimation, reducedFinishAnimation };
  await reducedContext.close();
}

// Service-worker update and an actual offline reload/play of the demo.
{
  const context = await browser.newContext();
  const page = await context.newPage();
  observe(page, 'service-worker');
  await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle' });
  const sw = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
    }
    return { scope: registration.scope, active: registration.active?.state, caches: await caches.keys(), controlled: !!navigator.serviceWorker.controller };
  });
  assert.equal(sw.active, 'activated');
  assert.equal(sw.controlled, true);
  assert.ok(sw.caches.includes('route-of-the-day-v2'));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('.cell.selected').count(), 4);
  const path = await getSolution(page);
  await page.locator(`.cell[data-row="${path[4].row}"][data-col="${path[4].col}"]`).click();
  assert.equal(await page.locator('.cell.selected').count(), 5);
  evidence.runs.serviceWorker = { ...sw, offlineReloadTiles: 4, offlinePlayTiles: 5 };
  await context.close();
}

assert.deepEqual(evidence.errors, []);
const distinctOrigins = [...new Set(evidence.requestUrls.map((entry) => new URL(entry.url).origin))];
assert.deepEqual(distinctOrigins, [BASE]);
evidence.network = {
  requestCount: evidence.requestUrls.length,
  methods: [...new Set(evidence.requestUrls.map((entry) => entry.method))],
  origins: distinctOrigins,
  crossOrigin: evidence.requestUrls.filter((entry) => new URL(entry.url).origin !== BASE),
};

await writeFile('.factory/evidence/verify-5-live.json', `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({
  daily: evidence.runs.daily,
  demo: evidence.runs.demo,
  inputs: evidence.runs.inputs,
  invalidRecovery: evidence.runs.invalidRecovery,
  rendering: evidence.runs.rendering,
  serviceWorker: evidence.runs.serviceWorker,
  network: evidence.network,
  accessibilityRoutes: evidence.runs.accessibility.routes.map((r) => ({ viewport: r.viewport, route: r.route, status: r.status, seriousCritical: r.severeAxe.length, tooSmall: r.structure.tooSmall.length, overflow: r.structure.overflow })),
  errors: evidence.errors,
}, null, 2));
await browser.close();
