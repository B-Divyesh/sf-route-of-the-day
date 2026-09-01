export type Position = { row: number; col: number };
export type Rule =
  | { kind: 'checkpoint'; points: Position[] }
  | { kind: 'turns'; turns: number }
  | { kind: 'scenic'; points: Position[] };

export type Puzzle = {
  seed: string;
  size: number;
  start: Position;
  finish: Position;
  solution: Position[];
  blocked: Position[];
  rule: Rule;
  label: string;
};

export type MoveResult = { path: Position[]; message: string; complete: boolean };

const BASE_PATHS: Position[][] = [
  [
    { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 },
    { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 2 },
    { row: 3, col: 3 }, { row: 4, col: 3 }, { row: 4, col: 4 },
  ],
  [
    { row: 0, col: 1 }, { row: 1, col: 1 }, { row: 1, col: 2 },
    { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 3, col: 3 },
    { row: 3, col: 4 }, { row: 4, col: 4 }, { row: 5, col: 4 },
  ],
  [
    { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 1 },
    { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 3, col: 3 },
    { row: 4, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 5 },
  ],
  [
    { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 },
    { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 2 },
    { row: 4, col: 2 }, { row: 4, col: 3 }, { row: 5, col: 3 },
    { row: 5, col: 4 },
  ],
];

export function positionKey(position: Position): string {
  return `${position.row}:${position.col}`;
}

export function samePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomFactory(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function transform(position: Position, size: number, rotation: number, flip: boolean): Position {
  let row = position.row;
  let col = flip ? size - 1 - position.col : position.col;
  for (let index = 0; index < rotation; index += 1) {
    [row, col] = [col, size - 1 - row];
  }
  return { row, col };
}

function countTurns(path: Position[]): number {
  let turns = 0;
  for (let index = 2; index < path.length; index += 1) {
    const previous = path[index - 1];
    const before = path[index - 2];
    const current = path[index];
    if (previous.row - before.row !== current.row - previous.row || previous.col - before.col !== current.col - previous.col) {
      turns += 1;
    }
  }
  return turns;
}

export function createPuzzle(seed: string, practice = false): Puzzle {
  const size = 6;
  const numericSeed = hashSeed(seed);
  const random = randomFactory(numericSeed);
  const base = BASE_PATHS[numericSeed % BASE_PATHS.length];
  const rotation = (numericSeed >>> 3) % 4;
  const flip = ((numericSeed >>> 5) & 1) === 1;
  const solution = base.map((position) => transform(position, size, rotation, flip));
  const solutionKeys = new Set(solution.map(positionKey));
  const candidates: Position[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const position = { row, col };
      if (!solutionKeys.has(positionKey(position))) candidates.push(position);
    }
  }
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [candidates[index], candidates[swap]] = [candidates[swap], candidates[index]];
  }
  const blocked = candidates.slice(0, practice ? 6 : 9);
  const ruleIndex = numericSeed % 3;
  const middle = solution[Math.floor(solution.length / 2)];
  const rule: Rule = ruleIndex === 0
    ? { kind: 'checkpoint', points: [middle] }
    : ruleIndex === 1
      ? { kind: 'turns', turns: countTurns(solution) }
      : { kind: 'scenic', points: [solution[2], solution[solution.length - 3]] };

  return {
    seed,
    size,
    start: solution[0],
    finish: solution[solution.length - 1],
    solution,
    blocked,
    rule,
    label: practice ? `Archive route · ${seed}` : 'Today’s route',
  };
}

export function describeRule(puzzle: Puzzle): string {
  const tiles = puzzle.solution.length;
  if (puzzle.rule.kind === 'turns') return `Use exactly ${tiles} tiles and make ${puzzle.rule.turns} turns.`;
  if (puzzle.rule.kind === 'scenic') return `Use exactly ${tiles} tiles and visit both tree markers.`;
  return `Use exactly ${tiles} tiles and pass the ring marker.`;
}

export function isComplete(puzzle: Puzzle, path: Position[]): boolean {
  if (path.length !== puzzle.solution.length || !samePosition(path[path.length - 1], puzzle.finish)) return false;
  if (puzzle.rule.kind === 'turns') return countTurns(path) === puzzle.rule.turns;
  return puzzle.rule.points.every((point) => path.some((step) => samePosition(step, point)));
}

export function applyMove(puzzle: Puzzle, path: Position[], next: Position): MoveResult {
  const current = path[path.length - 1];
  const blocked = puzzle.blocked.some((position) => samePosition(position, next));
  if (blocked) return { path, message: 'That square is blocked. Choose an open square.', complete: false };
  if (path.length > 1 && samePosition(path[path.length - 2], next)) {
    const shortened = path.slice(0, -1);
    return { path: shortened, message: 'Removed the last tile.', complete: false };
  }
  const adjacent = Math.abs(current.row - next.row) + Math.abs(current.col - next.col) === 1;
  if (!adjacent) return { path, message: 'Choose a square beside the end of your route.', complete: false };
  if (path.some((position) => samePosition(position, next))) {
    return { path, message: 'Routes cannot cross themselves. Step back or choose another square.', complete: false };
  }
  if (path.length >= puzzle.solution.length) {
    return { path, message: 'The tile limit is reached. Step back and try another route.', complete: false };
  }
  const updated = [...path, next];
  const complete = isComplete(puzzle, updated);
  if (samePosition(next, puzzle.finish) && !complete) {
    return { path: updated, message: 'You reached Finish, but the route does not meet today’s rule.', complete: false };
  }
  return { path: updated, message: complete ? 'Route complete.' : `${updated.length} of ${puzzle.solution.length} tiles placed.`, complete };
}

export function dailySeed(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function practiceIndex(value: string | null): number {
  if (value === null || value.trim() === '') return 0;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return 0;
  // Keep archival dates inside the supported JavaScript Date range while
  // allowing decades of published daily routes.
  return Math.min(parsed, 36_500);
}

export function estimatedRoundSeconds(puzzle: Puzzle): number {
  // This is a documented pace target: one considered move per route tile.
  return puzzle.solution.length * 20;
}

export function routeCode(path: Position[]): string {
  return path.map(({ row, col }) => `${String.fromCharCode(65 + col)}${row + 1}`).join('–');
}
