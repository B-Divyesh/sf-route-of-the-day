import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { applyMove, createPuzzle, dailySeed, estimatedRoundSeconds, isComplete, practiceIndex, type Position, type Puzzle } from '../src/core';

async function solution(page: Page): Promise<Position[]> {
  return page.locator('[data-game]').evaluate((element) => JSON.parse(element.getAttribute('data-solution') ?? '[]'));
}

async function solveByClick(page: Page): Promise<void> {
  const path = await solution(page);
  for (const point of path.slice(1)) {
    await page.locator(`.cell[data-row="${point.row}"][data-col="${point.col}"]`).click();
  }
}

function findTileLimitRoute(puzzle: Puzzle): { path: Position[]; overflow: Position } {
  const candidates = (position: Position, path: Position[]): Position[] => {
    const options = [
      { row: position.row - 1, col: position.col },
      { row: position.row + 1, col: position.col },
      { row: position.row, col: position.col - 1 },
      { row: position.row, col: position.col + 1 },
    ];
    return options.filter((candidate) => (
      candidate.row >= 0
      && candidate.col >= 0
      && candidate.row < puzzle.size
      && candidate.col < puzzle.size
      && !puzzle.blocked.some((blocked) => blocked.row === candidate.row && blocked.col === candidate.col)
      && !path.some((step) => step.row === candidate.row && step.col === candidate.col)
    ));
  };

  const visit = (path: Position[]): { path: Position[]; overflow: Position } | undefined => {
    if (path.length === puzzle.solution.length) {
      const overflow = candidates(path[path.length - 1], path)[0];
      return overflow ? { path, overflow } : undefined;
    }
    for (const next of candidates(path[path.length - 1], path)) {
      const result = applyMove(puzzle, path, next);
      if (result.path.length !== path.length + 1 || result.complete) continue;
      const route = visit(result.path);
      if (route) return route;
    }
    return undefined;
  };

  const route = visit([puzzle.start]);
  if (!route) throw new Error('Expected an alternate route that reaches the tile limit.');
  return route;
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

test('@claim:demo-ready ?demo=1 opens half-finished and resets its isolated sample', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('route:test-sentinel', 'daily-progress'));
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('.date-stamp')).toHaveAttribute('aria-label', 'Sample route sample-map-7');
  await expect(page.locator('.cell.selected')).toHaveCount(4);
  const path = await solution(page);
  await page.locator(`.cell[data-row="${path[4].row}"][data-col="${path[4].col}"]`).click();
  await expect(page.locator('.cell.selected')).toHaveCount(5);
  const resetDemo = page.getByRole('button', { name: 'Reset demo' });
  await resetDemo.focus();
  await resetDemo.press('Enter');
  await expect(page.locator('.cell.selected')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeFocused();
  const keys = await page.evaluate(() => Object.keys(sessionStorage));
  expect(keys.every((key) => key.startsWith('demo:'))).toBe(true);
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({
    'route:test-sentinel': 'daily-progress',
  });
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('route:test-sentinel'))).toBe('daily-progress');
});

test('@claim:daily-date the daily route is stable for the UTC date', async ({ browser }) => {
  const first = await browser.newContext();
  const second = await browser.newContext();
  const firstPage = await first.newPage();
  const secondPage = await second.newPage();
  await Promise.all([firstPage.goto('/'), secondPage.goto('/')]);
  const [firstDate, secondDate] = await Promise.all([
    firstPage.locator('[data-game]').getAttribute('data-date'),
    secondPage.locator('[data-game]').getAttribute('data-date'),
  ]);
  await expect(firstPage.locator('.date-stamp')).toContainText('Date');
  expect(firstDate).toBe(dailySeed());
  expect(secondDate).toBe(firstDate);
  expect(await solution(firstPage)).toEqual(await solution(secondPage));
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  expect(dailySeed(tomorrow)).not.toBe(firstDate);
  await Promise.all([first.close(), second.close()]);
});

test('@claim:round-duration representative routes meet the documented three-to-five-minute pace', () => {
  for (let index = 0; index < 100; index += 1) {
    const seconds = estimatedRoundSeconds(createPuzzle(`duration-${index}`));
    expect(seconds).toBeGreaterThanOrEqual(180);
    expect(seconds).toBeLessThanOrEqual(300);
  }
});

test('@claim:local-progress progress survives reload in this browser', async ({ page }) => {
  await page.goto('/');
  const path = await solution(page);
  await page.locator(`.cell[data-row="${path[1].row}"][data-col="${path[1].col}"]`).click();
  await expect(page.locator('.cell.selected')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('.cell.selected')).toHaveCount(2);
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

test('@claim:archive-gate only today’s exact completion marker opens archive practice', async ({ page }) => {
  const today = dailySeed();
  const yesterday = new Date(`${today}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const publishedPracticeSeed = dailySeed(yesterday);

  await page.goto('/?practice=1');
  await expect(page.getByRole('heading', { name: 'Draw today’s spatial route', level: 1 })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('[data-game]')).toHaveAttribute('data-date', today);
  await expect(page.locator('.archive-mode')).toHaveCount(0);

  await page.evaluate((seed) => localStorage.setItem('route:daily-complete:v1', seed), publishedPracticeSeed);
  await page.goto('/?practice=1');
  await expect(page.getByRole('heading', { name: 'Draw today’s spatial route', level: 1 })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Open practice routes' })).toHaveCount(0);

  await page.evaluate((seed) => localStorage.setItem('route:daily-complete:v1', seed), today);
  await page.goto('/?practice=1');
  await expect(page.getByRole('heading', { name: 'Draw an archive route', level: 1 })).toBeVisible();
  await expect(page.locator('[data-game]')).toHaveAttribute('data-date', publishedPracticeSeed);
  await expect(page.locator('.archive-mode')).toBeVisible();
});

test('@claim:practice-progress archive play uses an earlier date and leaves saved daily progress unchanged', async ({ page }) => {
  await page.goto('/');
  const dailyPath = await solution(page);
  const todayDate = await page.locator('[data-game]').getAttribute('data-date');
  expect(todayDate).toBeTruthy();
  await page.locator(`.cell[data-row="${dailyPath[1].row}"][data-col="${dailyPath[1].col}"]`).click();
  await page.evaluate((date) => localStorage.setItem('route:daily-complete:v1', date ?? ''), todayDate);
  const before = await page.evaluate((date) => ({
    path: localStorage.getItem(`route:path:v1:${date}`),
    complete: localStorage.getItem('route:daily-complete:v1'),
  }), todayDate);

  await page.goto('/?practice=1');
  const archiveDate = new Date(`${todayDate}T00:00:00Z`);
  archiveDate.setUTCDate(archiveDate.getUTCDate() - 1);
  await expect(page.locator('[data-game]')).toHaveAttribute('data-date', dailySeed(archiveDate));
  await solveByClick(page);
  await expect(page.getByRole('heading', { name: 'Route complete', level: 3 })).toBeVisible();
  const after = await page.evaluate((date) => ({
    path: localStorage.getItem(`route:path:v1:${date}`),
    complete: localStorage.getItem('route:daily-complete:v1'),
  }), todayDate);
  expect(after).toEqual(before);
});

test('@claim:free-access play starts without an account or payment step', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-game]')).toBeVisible();
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.getByText(/buy|subscribe|payment/i)).toHaveCount(0);
});

test('@claim:privacy-surface the sample has no private-data request or account, ranking, streak, analytics, ad, font, or third-party surface', async ({ page }) => {
  const requests: Array<{ url: string; method: string; body: string | null }> = [];
  page.on('request', (request) => requests.push({
    url: request.url(),
    method: request.method(),
    body: request.postData(),
  }));

  await page.goto('/?demo=1');
  const path = await solution(page);
  await page.locator(`.cell[data-row="${path[4].row}"][data-col="${path[4].col}"]`).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();

  const controls = await page.locator('a, button, input, select, textarea, [role="button"], [role="link"], [role="textbox"]')
    .evaluateAll((elements) => elements.map((element) => (
      (element.getAttribute('aria-label') ?? element.textContent ?? '').replace(/\s+/g, ' ').trim()
    )));
  const prohibitedControls = controls.filter((name) => /\b(account|sign[ -]?in|log[ -]?in|rank(?:ing|s)?|leaderboard|streak|analytic(?:s)?|ad(?:s)?|advertis(?:e|ing|ement)?|subscribe|buy|payment)\b/i.test(name));
  expect(prohibitedControls).toEqual([]);

  const origin = new URL(page.url()).origin;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((request) => new URL(request.url).origin === origin)).toBe(true);
  expect(requests.every((request) => request.method === 'GET' && request.body === null)).toBe(true);

  const externalResourceOrigins = await page.evaluate(() => performance.getEntriesByType('resource')
    .map((entry) => new URL(entry.name).origin)
    .filter((resourceOrigin) => resourceOrigin !== location.origin));
  expect(externalResourceOrigins).toEqual([]);
  const externalAssetOrigins = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>(
    'script[src], link[rel="stylesheet"], link[rel="preload"][as="font"]',
  )).map((element) => new URL(
    element instanceof HTMLScriptElement ? element.src : element.href,
    location.href,
  ).origin).filter((resourceOrigin) => resourceOrigin !== location.origin));
  expect(externalAssetOrigins).toEqual([]);
});

test('@claim:tile-limit reaching the tile limit blocks the next tile until removal or restart', async ({ page }) => {
  const puzzle = createPuzzle(dailySeed());
  const route = findTileLimitRoute(puzzle);
  await page.goto('/');
  await expect(page.locator('[data-game]')).toHaveAttribute('data-date', puzzle.seed);
  for (const step of route.path.slice(1)) {
    await page.locator(`.cell[data-row="${step.row}"][data-col="${step.col}"]`).click();
  }
  await expect(page.locator('.cell.selected')).toHaveCount(puzzle.solution.length);
  await page.locator(`.cell[data-row="${route.overflow.row}"][data-col="${route.overflow.col}"]`).click();
  await expect(page.locator('[data-status]')).toHaveText('The tile limit is reached. Step back and try another route.');
  await expect(page.locator('.cell.selected')).toHaveCount(puzzle.solution.length);

  await page.getByRole('button', { name: 'Undo tile' }).click();
  await expect(page.locator('.cell.selected')).toHaveCount(puzzle.solution.length - 1);
  const last = route.path[route.path.length - 1];
  await page.locator(`.cell[data-row="${last.row}"][data-col="${last.col}"]`).click();
  await expect(page.locator('.cell.selected')).toHaveCount(puzzle.solution.length);

  await page.getByRole('button', { name: 'Restart puzzle' }).click();
  await expect(page.locator('.cell.selected')).toHaveCount(1);
  const first = route.path[1];
  await page.locator(`.cell[data-row="${first.row}"][data-col="${first.col}"]`).click();
  await expect(page.locator('.cell.selected')).toHaveCount(2);
});

test('@claim:route-undo selecting the previous tile and Backspace each remove one tile and play continues', async ({ page }) => {
  await page.goto('/?demo=1');
  const path = await solution(page);
  const next = page.locator(`.cell[data-row="${path[4].row}"][data-col="${path[4].col}"]`);
  const previous = page.locator(`.cell[data-row="${path[3].row}"][data-col="${path[3].col}"]`);

  await next.click();
  await expect(page.locator('.cell.selected')).toHaveCount(5);
  await previous.click();
  await expect(page.locator('.cell.selected')).toHaveCount(4);
  await expect(page.locator('[data-status]')).toHaveText('Removed the last tile.');
  await next.click();
  await expect(page.locator('.cell.selected')).toHaveCount(5);

  await next.focus();
  await page.keyboard.press('Backspace');
  await expect(page.locator('.cell.selected')).toHaveCount(4);
  await expect(page.locator('[data-status]')).toHaveText('Removed the last tile.');
  await next.click();
  await expect(page.locator('.cell.selected')).toHaveCount(5);
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

test('@claim:pointer-input mouse clicks follow the same route rules', async ({ page }) => {
  await page.goto('/demo');
  const path = await solution(page);
  for (const point of path.slice(4)) {
    const cell = page.locator(`.cell[data-row="${point.row}"][data-col="${point.col}"]`);
    await cell.scrollIntoViewIfNeeded();
    const box = await cell.boundingBox();
    expect(box).not.toBeNull();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
  await expect(page.getByRole('heading', { name: 'Route complete', level: 3 })).toBeVisible();
});

test('@claim:reproducible-solution every published date has a known route that completes', () => {
  const start = new Date('2026-01-01T00:00:00Z');
  for (let offset = 0; offset < 100; offset += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + offset);
    const puzzle = createPuzzle(dailySeed(date));
    let path = [puzzle.start];
    for (const step of puzzle.solution.slice(1)) path = applyMove(puzzle, path, step).path;
    expect(isComplete(puzzle, path)).toBe(true);
  }
});

test('@claim:date-route-code the game shows the date before play and route code after completion', async ({ page }) => {
  await page.goto('/');
  const date = dailySeed();
  await expect(page.locator('.date-stamp')).toHaveAttribute('aria-label', `Date ${date}`);
  const path = await solution(page);
  await solveByClick(page);
  const expectedCode = path.map(({ row, col }) => `${String.fromCharCode(65 + col)}${row + 1}`).join('–');
  await expect(page.locator('.solution-code')).toContainText(expectedCode);
});

test('@claim:frame-rate route rendering sustains at least 50 frames per second during active route updates', async ({ page }) => {
  await page.goto('/?demo=1');
  const measurement = await page.evaluate(async () => {
    const game = document.querySelector<HTMLElement>('[data-game]');
    if (!game) throw new Error('The demo game is missing.');
    const path = JSON.parse(game.getAttribute('data-solution') ?? '[]') as Position[];
    const add = game.querySelector<HTMLButtonElement>(`.cell[data-row="${path[4].row}"][data-col="${path[4].col}"]`);
    const remove = game.querySelector<HTMLButtonElement>(`.cell[data-row="${path[3].row}"][data-col="${path[3].col}"]`);
    if (!add || !remove) throw new Error('The timed route controls are missing.');

    let frames = 0;
    let updates = 0;
    let mutations = 0;
    let addNext = true;
    const observer = new MutationObserver((entries) => { mutations += entries.length; });
    observer.observe(game, { subtree: true, childList: true, attributes: true });
    const start = performance.now();
    const elapsed = await new Promise<number>((resolve) => {
      const tick = (time: number) => {
        frames += 1;
        (addNext ? add : remove).click();
        addNext = !addNext;
        updates += 1;
        if (time - start >= 1100) resolve(time - start);
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    observer.disconnect();
    return { frames, updates, mutations, elapsed, fps: frames * 1000 / elapsed };
  });
  expect(measurement.updates).toBeGreaterThanOrEqual(50);
  expect(measurement.mutations).toBeGreaterThan(measurement.updates);
  expect(measurement.fps).toBeGreaterThanOrEqual(50);
});

test('invalid practice dates recover to the daily route without a page error', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/?practice=1e309');
  await expect(page.getByRole('heading', { name: 'Draw today’s spatial route', level: 1 })).toBeVisible();
  await expect(page.locator('[data-game]')).toBeVisible();
  expect(await page.locator('[data-game]').getAttribute('data-date')).toBe(dailySeed());
  expect(errors).toEqual([]);
  expect(practiceIndex('abc')).toBe(0);
  expect(practiceIndex('-1')).toBe(0);
  expect(practiceIndex('0')).toBe(0);
  expect(practiceIndex('1e309')).toBe(0);
  expect(practiceIndex('999999')).toBe(36_500);
});

test('invalid saved route arrays reset safely and leave a keyboard focus stop on the board', async ({ page }) => {
  await page.goto('/');
  const puzzle = await page.evaluate(() => window.__ROUTE_PUZZLE__);
  expect(puzzle).toBeTruthy();
  if (!puzzle) return;
  const nonAdjacent = Array.from({ length: puzzle.size * puzzle.size }, (_, index) => ({
    row: Math.floor(index / puzzle.size), col: index % puzzle.size,
  })).find((position) => Math.abs(position.row - puzzle.start.row) + Math.abs(position.col - puzzle.start.col) > 1);
  expect(nonAdjacent).toBeTruthy();
  if (!nonAdjacent) return;
  const invalidPaths: unknown[] = [
    [puzzle.start, { row: 99, col: 99 }],
    [puzzle.start, nonAdjacent],
    [puzzle.start, puzzle.blocked[0]],
    [puzzle.start, puzzle.solution[1], puzzle.start],
    [...puzzle.solution, puzzle.solution[puzzle.solution.length - 1]],
    [puzzle.start, { row: '1', col: 1 }],
  ];

  for (const invalidPath of invalidPaths) {
    await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
      key: `route:path:v1:${puzzle.seed}`,
      value: invalidPath,
    });
    await page.reload();
    await expect(page.locator('.cell.selected')).toHaveCount(1);
    await expect(page.locator('[data-tiles-left]')).toHaveText(String(puzzle.solution.length - 1));
    await expect(page.locator('.cell[tabindex="0"]')).toHaveCount(1);
    await expect(page.locator(`.cell[data-row="${puzzle.start.row}"][data-col="${puzzle.start.col}"]`)).toHaveAttribute('tabindex', '0');
  }
});

test('Back restores the prior landing scroll position while moving focus to its heading', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const priorScroll = await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return window.scrollY;
  });
  expect(priorScroll).toBeGreaterThan(500);
  await page.getByRole('link', { name: 'Read the privacy details' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.waitForFunction((expected) => window.scrollY >= expected - 8, priorScroll);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(priorScroll - 8);
  await expect(page.locator('h1')).toBeFocused();
});

test('static deployment configuration serves missing routes with HTTP 404', () => {
  const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as {
    routes?: Array<{ route?: string; rewrite?: string }>;
    navigationFallback?: unknown;
    responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }>;
  };
  expect(config.navigationFallback).toBeUndefined();
  expect(config.routes?.filter((route) => ['/demo', '/privacy', '/terms'].includes(route.route ?? '')))
    .toEqual([
      { route: '/demo', rewrite: '/index.html' },
      { route: '/privacy', rewrite: '/index.html' },
      { route: '/terms', rewrite: '/index.html' },
    ]);
  expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  const page = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8');
  expect(page).toContain('<h1>Page not found</h1>');
  expect(page).toContain('<header class="site-header">');
  expect(page).toContain('<footer>');
  expect(page).toContain('href="/privacy"');
  expect(page).toContain('href="/terms"');
  expect(page).toContain('rel="canonical" href="https://route-of-the-day.sociobot.in/404"');
  expect(page).toContain('property="og:title"');
  expect(page).toContain('name="twitter:card"');
  expect(page).toContain('rel="icon" href="/favicon.svg"');
});

test('the static 404 document has the shared skeleton, metadata, and no serious axe issues', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Route of the Day');
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Page not found', level: 1 })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://route-of-the-day.sociobot.in/404');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Route of the Day');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  const results = await new AxeBuilder({ page }).analyze();
  const severe = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
});

test('routes have one h1, correct titles, no serious axe issues, and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const routes = [
    ['/', 'Route of the Day — Draw a daily route'],
    ['/?demo=1', 'Demo — Route of the Day'],
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
  await expect(page.getByRole('heading', { name: 'Page not found', level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});

test('the 390px layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page.getByRole('heading', { name: 'Connect Start to Finish' })).toBeVisible();
});

test('the 390px mobile layout gives every visible action a 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const tooSmall = await page.locator('a[href], button:not(:disabled)').evaluateAll((elements) => elements
    .filter((element) => {
      const style = window.getComputedStyle(element);
      return style.visibility !== 'hidden' && style.display !== 'none' && (element as HTMLElement).offsetParent !== null;
    })
    .map((element) => {
      const box = element.getBoundingClientRect();
      return { label: element.getAttribute('aria-label') ?? element.textContent?.trim(), width: box.width, height: box.height };
    })
    .filter(({ width, height }) => width < 44 || height < 44));
  expect(tooSmall).toEqual([]);
});
