import type { Puzzle } from './core';

declare global {
  interface Window {
    __ROUTE_PUZZLE__?: Puzzle;
  }
}

export {};
