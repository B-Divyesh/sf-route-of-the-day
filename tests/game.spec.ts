import { expect, test, type Browser, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { applyMove, createPuzzle, dailySeed, isComplete, type Position } from '../src/core';

async function solution(page: Page): Promise<Position[]> {
  return page.locator('[data-game]').evaluate((element) => JSON.parse(element.getAttribute('data-solution') ?? '[]'));
}

async function solveByClick(page: Page): Promise<void> {
  const path = await solution(page);
  for (const point of path.slice(1)) {
    await page.locator(`.cell[data-row="${point.row}"][data-col="${point.col}"]`).click();
  }
}

test('generated puzzles are deterministic and solvable', async () => {
  for (let index = 0; index < 100; index += 1) {
    const puzzle = createPuzzle(`test-${index}`);
    expect(createPuzzle(`test-${index}`)).toEqual(puzzle);
    let path = [puzzle.start];
    for (const step of puzzle.solution.slice(1)) path = applyMove(puzzle, path, step).path;
    expect(isComplete(puzzle, path)).toBe(true);
  }
});

test('@claim:demo-ready demo opens half-finished and resets its isolated sample', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('.cell.selected')).toHaveCount(4);
  const path = await solution(page);
  await page.locator(`.cell[data-row="${path[4].row}"][data-col="${path[4].col}"]`).click();
  await expect(page.locator('.cell.selected')).toHaveCount(5);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.cell.selected')).toHaveCount(4);
  const keys = await page.evaluate(() => Object.keys(sessionStorage));
  expect(keys.every((key) => key.startsWith('demo:'))).toBe(true);
  expect(await page.evaluate(() => Object.keys(localStorage).length)).toBe(0);
});

test('@claim:daily-seed the daily seed is stable for the UTC date', async ({ browser }) => {
  const first = await browser.newContext();
  const second = await browser.newContext();
  const firstPage = await first.newPage();
  const secondPage = await second.newPage();
  await Promise.all([firstPage.goto('/'), secondPage.goto('/')]);
  const [firstSeed, secondSeed] = await Promise.all([
    firstPage.locator('[data-game]').getAttribute('data-seed'),
    secondPage.locator('[data-game]').getAttribute('data-seed'),
  ]);
  expect(firstSeed).toBe(dailySeed());
  expect(secondSeed).toBe(firstSeed);
  expect(await solution(firstPage)).toEqual(await solution(secondPage));
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  expect(dailySeed(tomorrow)).not.toBe(firstSeed);
  await Promise.all([first.close(), second.close()]);
});

test('@claim:local-progress progress survives reload and sends no cross-origin requests', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/');
  const path = await solution(page);
  await page.locator(`.cell[data-row="${path[1].row}"][data-col="${path[1].col}"]`).click();
  await expect(page.locator('.cell.selected')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('.cell.selected')).toHaveCount(2);
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:complete-run a daily route reaches the end screen and restart clears it', async ({ page }) => {
  await page.goto('/');
  await solveByClick(page);
  await expect(page.getByRole('heading', { name: 'Route complete', level: 3 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Play an archive route' })).toBeVisible();
  await page.getByRole('button', { name: 'Play this route again' }).click();
  await expect(page.locator('.cell.selected')).toHaveCount(1);
  await expect(page.locator('[data-finish]')).toBeHidden();
  await page.reload();
  await expect(page.getByRole('link', { name: 'Open practice routes' })).toBeVisible();
});

test('@claim:free-access play starts without an account or payment step', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-game]')).toBeVisible();
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.getByText(/buy|subscribe|payment/i)).toHaveCount(0);
});

test('@claim:offline-play a loaded puzzle remains playable when the browser goes offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/demo');
  await context.setOffline(true);
  const path = await solution(page);
  await page.locator(`.cell[data-row="${path[4].row}"][data-col="${path[4].col}"]`).click();
  await expect(page.locator('.cell.selected')).toHaveCount(5);
  await context.close();
});

test('@claim:multi-input the puzzle works with keyboard and touch', async ({ browser, page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const path = await solution(page);
  let current = path[3];
  await page.locator(`.cell[data-row="${current.row}"][data-col="${current.col}"]`).focus();
  for (const next of path.slice(4)) {
    const key = next.row < current.row ? 'ArrowUp' : next.row > current.row ? 'ArrowDown' : next.col < current.col ? 'ArrowLeft' : 'ArrowRight';
    await page.keyboard.press(key);
    await page.keyboard.press('Enter');
    current = next;
  }
  await expect(page.getByRole('heading', { name: 'Route complete', level: 3 })).toBeVisible();

  const touchContext = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const touchPage = await touchContext.newPage();
  await touchPage.goto('/');
  const touchPath = await solution(touchPage);
  for (const point of touchPath.slice(1)) await touchPage.locator(`.cell[data-row="${point.row}"][data-col="${point.col}"]`).tap();
  await expect(touchPage.getByRole('heading', { name: 'Route complete', level: 3 })).toBeVisible();
  await touchContext.close();
});

test('@claim:frame-rate route rendering samples at least 50 frames per second', async ({ page }) => {
  await page.goto('/demo');
  const frames = await page.evaluate(() => new Promise<number>((resolve) => {
    let count = 0;
    const start = performance.now();
    const tick = (time: number) => {
      count += 1;
      if (time - start >= 1000) resolve(count);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }));
  expect(frames).toBeGreaterThanOrEqual(50);
});

test('routes have one h1, correct titles, no serious axe issues, and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const routes = [
    ['/', 'Route of the Day — Draw a daily route'],
    ['/demo', 'Demo — Route of the Day'],
    ['/privacy', 'Privacy — Route of the Day'],
    ['/terms', 'Terms — Route of the Day'],
    ['/missing-page', 'Page not found — Route of the Day'],
  ];
  for (const [route, title] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('the 390px layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page.getByRole('heading', { name: 'Connect Start to Finish' })).toBeVisible();
});
