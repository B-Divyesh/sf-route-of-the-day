import './styles.css';
import {
  applyMove,
  createPuzzle,
  dailySeed,
  describeRule,
  practiceIndex,
  isComplete,
  isValidPath,
  positionKey,
  routeCode,
  samePosition,
  type Position,
  type Puzzle,
} from './core';

const app = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;
if (!app) throw new Error('The app container is missing.');

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Route of the Day — Draw a daily route',
    description: 'Draw one short route across a new spatial puzzle each day. Play free in your browser with no account.',
  },
  '/demo': {
    title: 'Demo — Route of the Day',
    description: 'Finish a half-drawn sample route in the Route of the Day demo.',
  },
  '/privacy': {
    title: 'Privacy — Route of the Day',
    description: 'Read how Route of the Day stores puzzle progress in your browser.',
  },
  '/terms': {
    title: 'Terms — Route of the Day',
    description: 'Read the terms for playing Route of the Day.',
  },
  '/404': {
    title: 'Page not found — Route of the Day',
    description: 'This Route of the Day page could not be found.',
  },
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

function logo(): string {
  return `<svg class="mark" viewBox="0 0 44 44" aria-hidden="true">
    <circle cx="8" cy="31" r="5"></circle><path d="M13 31h7V13h11"></path><path d="m35 8 5 5-5 5-5-5z"></path>
  </svg>`;
}

function header(demo: boolean): string {
  return `<header class="site-header">
    <div class="header-inner">
      <a class="wordmark" href="/" data-route>${logo()}<span>Route of the Day</span></a>
      <nav aria-label="Main navigation">
        <a href="/" data-route>Daily</a>
        <a href="/demo" data-route ${demo ? 'aria-current="page"' : ''}>Demo</a>
        <a href="/#how" data-route>How it works</a>
        <a href="/privacy" data-route>Privacy</a>
      </nav>
    </div>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <div><strong>Route of the Day</strong><p>Draw one short spatial route each day.</p></div>
    <div class="footer-links"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://hello-factory.sociobot.in" rel="noreferrer">Built by Param Factory <span class="sr-only">(external site)</span></a></div>
    <p class="build">v1.0.0 · Generated hero art is disclosed in the design notes.</p>
  </footer>`;
}

function demoBanner(): string {
  return `<aside class="demo-banner" aria-label="Demo status">
    <span><strong>Demo</strong> — sample data, nothing is saved</span>
    <div><button class="text-button" type="button" data-reset-demo>Reset demo</button><a href="/" data-start-real data-route>Start for real</a></div>
  </aside>`;
}

function ruleMarkers(puzzle: Puzzle, position: Position): string {
  if (puzzle.rule.kind === 'checkpoint' && puzzle.rule.points.some((point) => samePosition(point, position))) {
    return '<span class="marker ring" aria-hidden="true">○</span>';
  }
  if (puzzle.rule.kind === 'scenic' && puzzle.rule.points.some((point) => samePosition(point, position))) {
    return '<span class="marker tree" aria-hidden="true">♠</span>';
  }
  return '';
}

function cellLabel(puzzle: Puzzle, position: Position, selected: boolean, blocked: boolean): string {
  const coordinate = `${String.fromCharCode(65 + position.col)}${position.row + 1}`;
  if (samePosition(position, puzzle.start)) return `${coordinate}, Start, ${selected ? 'route selected' : 'open'}`;
  if (samePosition(position, puzzle.finish)) return `${coordinate}, Finish, ${selected ? 'route selected' : 'open'}`;
  if (blocked) return `${coordinate}, blocked`;
  if (puzzle.rule.kind === 'checkpoint' && puzzle.rule.points.some((point) => samePosition(point, position))) return `${coordinate}, ring marker${selected ? ', route selected' : ''}`;
  if (puzzle.rule.kind === 'scenic' && puzzle.rule.points.some((point) => samePosition(point, position))) return `${coordinate}, tree marker${selected ? ', route selected' : ''}`;
  return `${coordinate}, ${selected ? 'route selected' : 'open'}`;
}

function safePath(storage: Storage, key: string, puzzle: Puzzle, fallback: Position[]): Position[] {
  try {
    const value = storage.getItem(key);
    if (!value) return fallback;
    const parsed: unknown = JSON.parse(value);
    if (!isValidPath(puzzle, parsed)) {
      storage.removeItem(key);
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function storedValue(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function storageAvailable(storage: Storage): boolean {
  try {
    const key = '__route_test__';
    storage.setItem(key, '1');
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function createGame(puzzle: Puzzle, demo: boolean, practice: boolean): string {
  const storage = demo ? sessionStorage : localStorage;
  const key = `${demo ? 'demo:' : 'route:'}path:v1:${puzzle.seed}`;
  const fallback = demo ? puzzle.solution.slice(0, 4) : [puzzle.start];
  const path = safePath(storage, key, puzzle, fallback);
  const complete = isComplete(puzzle, path);
  const tilesLeft = puzzle.solution.length - path.length;
  const nextPractice = practice ? practiceIndex(new URLSearchParams(location.search).get('practice')) + 1 : 1;
  const focusPosition = path[path.length - 1];
  window.__ROUTE_PUZZLE__ = puzzle;

  return `<section class="game-shell" aria-labelledby="puzzle-heading" data-game data-seed="${escapeHtml(puzzle.seed)}" data-solution="${escapeHtml(JSON.stringify(puzzle.solution))}" data-storage-key="${escapeHtml(key)}" data-demo="${demo}" data-practice="${practice}">
    <div class="game-heading">
      <div>
        <p class="section-kicker">${escapeHtml(puzzle.label)}</p>
        <h2 id="puzzle-heading">Connect Start to Finish</h2>
      </div>
      <div class="seed-stamp"><span>Seed</span><strong>${escapeHtml(puzzle.seed)}</strong></div>
    </div>
    <p class="rule"><span aria-hidden="true">↳</span> ${escapeHtml(describeRule(puzzle))}</p>
    <div class="game-layout">
      <div class="board-wrap">
        <div class="board" role="group" aria-label="Route puzzle grid. Use arrow keys to move, then Enter or Space to place a tile.">
          ${Array.from({ length: puzzle.size * puzzle.size }, (_, index) => {
            const position = { row: Math.floor(index / puzzle.size), col: index % puzzle.size };
            const selectedIndex = path.findIndex((step) => samePosition(step, position));
            const selected = selectedIndex >= 0;
            const blocked = puzzle.blocked.some((cell) => samePosition(cell, position));
            const start = samePosition(position, puzzle.start);
            const finish = samePosition(position, puzzle.finish);
            return `<button class="cell${selected ? ' selected' : ''}${blocked ? ' blocked' : ''}${start ? ' start' : ''}${finish ? ' finish' : ''}" type="button" data-row="${position.row}" data-col="${position.col}" aria-label="${cellLabel(puzzle, position, selected, blocked)}" aria-pressed="${selected}" ${blocked ? 'disabled' : ''} tabindex="${samePosition(position, focusPosition) ? '0' : '-1'}">
              <span class="coordinate" aria-hidden="true">${String.fromCharCode(65 + position.col)}${position.row + 1}</span>
              ${start ? '<span class="landmark start-symbol" aria-hidden="true">●</span>' : ''}
              ${finish ? '<span class="landmark finish-symbol" aria-hidden="true">◆</span>' : ''}
              ${ruleMarkers(puzzle, position)}
              ${selected ? `<span class="route-order" aria-hidden="true">${selectedIndex + 1}</span>` : ''}
            </button>`;
          }).join('')}
        </div>
        <div class="board-key" aria-hidden="true"><span>● Start</span><span>◆ Finish</span><span>▧ Blocked</span></div>
      </div>
      <aside class="route-panel" aria-label="Route status">
        <div class="tile-meter"><span>Tiles left</span><strong data-tiles-left>${tilesLeft}</strong></div>
        <p class="status" data-status aria-live="polite">${complete ? 'Route complete.' : demo ? 'The sample route is half drawn. Continue from the orange tile.' : 'Choose a square beside Start.'}</p>
        <div class="game-actions">
          <button class="secondary-button" type="button" data-undo ${path.length <= 1 ? 'disabled' : ''}>Undo tile</button>
          <button class="text-button" type="button" data-restart>Restart puzzle</button>
        </div>
        <p class="input-help">Keyboard: use Arrow keys, then Enter or Space. Backspace removes a tile.</p>
      </aside>
    </div>
    <div class="finish-panel${complete ? '' : ' hidden'}" data-finish tabindex="-1">
      <p class="completion-mark" aria-hidden="true">✓</p>
      <div><h3>Route complete</h3><p>You connected both landmarks in ${puzzle.solution.length} tiles.</p><p class="solution-code">Published solution: <span>${escapeHtml(routeCode(puzzle.solution))}</span></p></div>
      <div class="finish-actions">
        <button class="secondary-button" type="button" data-restart>Play this route again</button>
        <a class="primary-button" href="/?practice=${nextPractice}" data-route>${practice ? 'Play next archive route' : 'Play an archive route'}</a>
      </div>
    </div>
  </section>`;
}

function landingPage(): string {
  const params = new URLSearchParams(location.search);
  const requestedPractice = practiceIndex(params.get('practice'));
  const todaySeed = dailySeed();
  const completedDaily = storedValue(localStorage, 'route:daily-complete:v1') === todaySeed;
  const practice = requestedPractice > 0 && completedDaily;
  const practiceNumber = practice ? requestedPractice : 0;
  if (requestedPractice > 0 && !completedDaily) history.replaceState(history.state, '', '/');
  const archiveDate = new Date();
  archiveDate.setUTCDate(archiveDate.getUTCDate() - practiceNumber);
  const seed = practice ? dailySeed(archiveDate) : todaySeed;
  const puzzle = createPuzzle(seed, practice);

  return `${header(false)}
    <main id="main">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">${practice ? 'Practice with an archived daily seed' : 'A new spatial puzzle every day'}</p>
          <h1 tabindex="-1">${practice ? 'Draw an archive route' : 'Draw today’s route'}</h1>
          <p class="hero-summary">For daily-puzzle players who want a short spatial challenge without words, scores, or an account.</p>
          <div class="hero-action"><a class="primary-button" href="/demo" data-route>Try it with sample data</a><span>Opens a half-finished sample puzzle.</span></div>
          <ul class="plain-facts" aria-label="Game facts"><li>Free to play</li><li>No account</li><li>Progress stays in this browser</li></ul>
        </div>
        <div class="hero-game">${createGame(puzzle, false, practice)}</div>
      </section>
      ${practice ? `<div class="mode-strip archive-mode"><span>Archive practice · not scored</span><a href="/" data-route>Return to today’s route</a></div>` : ''}
      <figure class="world-strip"><img src="/assets/route-landscape.webp" width="960" height="640" loading="lazy" decoding="async" alt="An abstract orange route connects two landmarks across interlocking map tiles." /><figcaption>Each route is built from one published daily seed.</figcaption></figure>
      <section class="archive-section" aria-labelledby="archive-heading">
        <div><p class="section-kicker">Practice archive</p><h2 id="archive-heading">Play another generated route</h2><p>Practice puzzles use published seeds and do not affect the daily route.</p></div>
        ${completedDaily ? '<a class="secondary-button" href="/?practice=1" data-route>Open practice routes</a>' : '<p class="locked-note"><span aria-hidden="true">◇</span> Finish today’s route to open practice mode.</p>'}
      </section>
      <section class="how-section" id="how" aria-labelledby="how-heading">
        <div class="section-intro"><p class="section-kicker">How it works</p><h2 id="how-heading">Build one continuous route</h2></div>
        <ol class="steps">
          <li><span>1</span><div><h3>Start at the circle</h3><p>Select one open square beside the last route tile.</p></div></li>
          <li><span>2</span><div><h3>Meet today’s rule</h3><p>Visit each marker and stay within the tile limit.</p></div></li>
          <li><span>3</span><div><h3>Reach the diamond</h3><p>Finish the daily route, then play more archive seeds.</p></div></li>
        </ol>
      </section>
      <section class="privacy-section" aria-labelledby="not-heading">
        <div><p class="section-kicker">What it does not do</p><h2 id="not-heading">No accounts, rankings, or streak penalties</h2></div>
        <p>Your route progress uses browser storage. The game sends no personal details and loads no third-party scripts.</p>
        <a href="/privacy" data-route>Read the privacy details</a>
      </section>
    </main>${footer()}`;
}

function demoPage(): string {
  const puzzle = createPuzzle('sample-map-7');
  puzzle.label = 'Sample route';
  return `${demoBanner()}${header(true)}<main id="main" class="demo-main">
    <section class="demo-intro"><p class="eyebrow">One-click sample</p><h1 tabindex="-1">Finish a sample route</h1><p>Continue the half-drawn route. ${escapeHtml(describeRule(puzzle))}</p></section>
    ${createGame(puzzle, true, false)}
    <section class="demo-note"><h2>What happens here</h2><p>This sample uses a separate demo storage key. Starting the daily puzzle clears it.</p></section>
  </main>${footer()}`;
}

function privacyPage(): string {
  return `${header(false)}<main id="main" class="text-page"><p class="eyebrow">Privacy</p><h1 tabindex="-1">See what stays in your browser</h1>
    <p class="lede">Route of the Day has no accounts, analytics, advertising, or third-party scripts.</p>
    <h2>Data stored on this device</h2><p>The game stores your current route and completed daily seed in browser storage. Demo progress uses a separate session key beginning with <code>demo:</code>.</p>
    <h2>Data sent over the network</h2><p>Your browser requests the game files from this site. Game progress does not leave your device.</p>
    <h2>Delete your progress</h2><p>Clear this site’s browser storage to remove all saved progress. You can also restart any puzzle from its route panel.</p>
    <h2>Contact</h2><p>Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>
    <p class="updated">Effective 1 September 2026.</p></main>${footer()}`;
}

function termsPage(): string {
  return `${header(false)}<main id="main" class="text-page"><p class="eyebrow">Terms</p><h1 tabindex="-1">Read the game terms</h1>
    <p class="lede">Route of the Day is a free browser puzzle for personal use.</p>
    <h2>Using the game</h2><p>You may play and share your own results. Do not interfere with the site or use it to harm others.</p>
    <h2>Availability</h2><p>The game is provided as available. Puzzles and features may change, and the site may sometimes be unavailable.</p>
    <h2>Intellectual property</h2><p>The game code is available under the MIT License. Product artwork remains subject to the repository’s stated provenance.</p>
    <h2>Contact</h2><p>Questions can be sent to <a href="mailto:hello@sociobot.in">hello@sociobot.in</a>.</p>
    <p class="updated">Effective 1 September 2026.</p></main>${footer()}`;
}

function notFoundPage(): string {
  return `${header(false)}<main id="main" class="not-found"><div><p class="eyebrow">404</p><h1 tabindex="-1">Find your way back to the route</h1><p>This page does not exist. The daily puzzle is ready from the home page.</p><a class="primary-button" href="/" data-route>Play today’s route</a></div><div class="lost-route" aria-hidden="true">● ─┐<br>&nbsp;&nbsp;&nbsp;└─ ?</div></main>${footer()}`;
}

function persistPath(game: HTMLElement, puzzle: Puzzle, path: Position[]): void {
  const storage = game.dataset.demo === 'true' ? sessionStorage : localStorage;
  if (!storageAvailable(storage)) {
    const status = game.querySelector<HTMLElement>('[data-status]');
    if (status) status.textContent = 'This route works, but this browser cannot save it after a reload.';
    return;
  }
  storage.setItem(game.dataset.storageKey ?? '', JSON.stringify(path));
}

function bindGame(): void {
  const game = document.querySelector<HTMLElement>('[data-game]');
  const puzzle = window.__ROUTE_PUZZLE__;
  if (!game || !puzzle) return;
  const storage = game.dataset.demo === 'true' ? sessionStorage : localStorage;
  const key = game.dataset.storageKey ?? '';
  const fallback = game.dataset.demo === 'true' ? puzzle.solution.slice(0, 4) : [puzzle.start];
  let path = safePath(storage, key, puzzle, fallback);
  let pointerDrawing = false;
  let focused = path[path.length - 1];

  const focusCell = (position: Position): void => {
    const cell = game.querySelector<HTMLButtonElement>(`.cell[data-row="${position.row}"][data-col="${position.col}"]`);
    if (!cell || cell.disabled) return;
    game.querySelectorAll<HTMLButtonElement>('.cell').forEach((candidate) => { candidate.tabIndex = -1; });
    cell.tabIndex = 0;
    cell.focus();
  };

  const update = (message: string, completed = false): void => {
    game.querySelectorAll<HTMLButtonElement>('.cell').forEach((cell) => {
      const position = { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
      const selectedIndex = path.findIndex((step) => samePosition(step, position));
      const selected = selectedIndex >= 0;
      cell.classList.toggle('selected', selected);
      cell.setAttribute('aria-pressed', String(selected));
      cell.setAttribute('aria-label', cellLabel(puzzle, position, selected, cell.classList.contains('blocked')));
      cell.querySelector('.route-order')?.remove();
      if (selected) cell.insertAdjacentHTML('beforeend', `<span class="route-order" aria-hidden="true">${selectedIndex + 1}</span>`);
    });
    const tiles = game.querySelector<HTMLElement>('[data-tiles-left]');
    const status = game.querySelector<HTMLElement>('[data-status]');
    const finish = game.querySelector<HTMLElement>('[data-finish]');
    if (tiles) tiles.textContent = String(Math.max(0, puzzle.solution.length - path.length));
    if (status) status.textContent = message;
    game.querySelectorAll<HTMLButtonElement>('[data-undo]').forEach((button) => { button.disabled = path.length <= 1; });
    finish?.classList.toggle('hidden', !completed);
    persistPath(game, puzzle, path);
    if (completed) {
      if (game.dataset.demo !== 'true' && game.dataset.practice !== 'true') localStorage.setItem('route:daily-complete:v1', puzzle.seed);
      finish?.focus();
    }
  };

  const select = (position: Position): void => {
    if (samePosition(path[path.length - 1], position)) return;
    const result = applyMove(puzzle, path, position);
    if (result.path === path && !result.complete) {
      update(result.message, false);
      return;
    }
    path = result.path;
    focused = position;
    update(result.message, result.complete);
  };

  const reset = (): void => {
    path = game.dataset.demo === 'true' ? puzzle.solution.slice(0, 4) : [puzzle.start];
    focused = path[path.length - 1];
    update(game.dataset.demo === 'true' ? 'The sample route is reset. Continue from the orange tile.' : 'The route is clear. Choose a square beside Start.');
    focusCell(focused);
  };

  game.querySelectorAll<HTMLButtonElement>('.cell:not(:disabled)').forEach((cell) => {
    const position = { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
    cell.addEventListener('click', () => select(position));
    cell.addEventListener('pointerdown', () => {
      pointerDrawing = true;
      window.addEventListener('pointerup', () => { pointerDrawing = false; }, { once: true });
    });
    cell.addEventListener('pointerenter', () => { if (pointerDrawing) select(position); });
    cell.addEventListener('focus', () => { focused = position; });
  });
  game.querySelectorAll<HTMLButtonElement>('[data-undo]').forEach((button) => button.addEventListener('click', () => {
    if (path.length > 1) {
      path = path.slice(0, -1);
      update('Removed the last tile.');
    }
  }));
  game.querySelectorAll<HTMLElement>('[data-restart]').forEach((button) => button.addEventListener('click', reset));
  game.querySelector('.board')?.addEventListener('keydown', (event) => {
    const keyboardEvent = event as KeyboardEvent;
    const movements: Record<string, Position> = {
      ArrowUp: { row: -1, col: 0 }, ArrowDown: { row: 1, col: 0 },
      ArrowLeft: { row: 0, col: -1 }, ArrowRight: { row: 0, col: 1 },
    };
    if (keyboardEvent.key === 'Backspace') {
      keyboardEvent.preventDefault();
      if (path.length > 1) { path = path.slice(0, -1); update('Removed the last tile.'); }
      return;
    }
    const movement = movements[keyboardEvent.key];
    if (!movement) return;
    keyboardEvent.preventDefault();
    const next = { row: focused.row + movement.row, col: focused.col + movement.col };
    if (next.row < 0 || next.col < 0 || next.row >= puzzle.size || next.col >= puzzle.size) return;
    const nextCell = game.querySelector<HTMLButtonElement>(`.cell[data-row="${next.row}"][data-col="${next.col}"]`);
    if (nextCell && !nextCell.disabled) {
      focused = next;
      focusCell(next);
    }
  });
}

type RouteHistoryState = { routeScroll?: { x: number; y: number } };

function rememberScrollPosition(): void {
  const state = (history.state ?? {}) as RouteHistoryState;
  history.replaceState({ ...state, routeScroll: { x: window.scrollX, y: window.scrollY } }, '', location.href);
}

function bindGlobal(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((anchor) => anchor.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || anchor.target) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    if (anchor.hasAttribute('data-start-real')) {
      Object.keys(sessionStorage).filter((key) => key.startsWith('demo:')).forEach((key) => sessionStorage.removeItem(key));
    }
    rememberScrollPosition();
    history.pushState({ routeScroll: { x: 0, y: 0 } } satisfies RouteHistoryState, '', `${url.pathname}${url.search}${url.hash}`);
    render(true);
  }));
  document.querySelector('[data-reset-demo]')?.addEventListener('click', () => {
    Object.keys(sessionStorage).filter((key) => key.startsWith('demo:')).forEach((key) => sessionStorage.removeItem(key));
    render(false);
    document.querySelector<HTMLButtonElement>('[data-reset-demo]')?.focus();
  });
}

function updateMeta(path: string): void {
  const meta = routeMeta[path] ?? routeMeta['/404'];
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', meta.description);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  canonical?.setAttribute('href', `https://route-of-the-day.sociobot.in${path === '/' ? '/' : path}`);
}

function render(focusHeading = false, restoreScroll = false): void {
  const path = location.pathname.replace(/\/$/, '') || '/';
  updateMeta(path);
  app.innerHTML = path === '/' ? landingPage()
    : path === '/demo' ? demoPage()
      : path === '/privacy' ? privacyPage()
        : path === '/terms' ? termsPage()
          : notFoundPage();
  bindGlobal();
  bindGame();
  if (location.hash === '#how') requestAnimationFrame(() => document.querySelector('#how')?.scrollIntoView());
  else if (restoreScroll) {
    const { x = 0, y = 0 } = ((history.state ?? {}) as RouteHistoryState).routeScroll ?? {};
    requestAnimationFrame(() => {
      window.scrollTo(x, y);
      document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    });
  } else if (focusHeading) requestAnimationFrame(() => document.querySelector<HTMLElement>('h1')?.focus());
  const announcement = document.querySelector<HTMLElement>('#route-announcer');
  if (announcement) announcement.textContent = document.title;
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
rememberScrollPosition();
window.addEventListener('popstate', () => render(true, true));
window.addEventListener('offline', () => {
  const status = document.querySelector<HTMLElement>('[data-status]');
  if (status) status.textContent = 'You are offline. The loaded puzzle still works.';
});

document.body.insertAdjacentHTML('beforeend', '<div id="route-announcer" class="sr-only" aria-live="polite"></div>');
render();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
