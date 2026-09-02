# Route of the Day — visual thesis

## Direction

**Generative geometry: a pocket transit map assembled by hand.** The game board is the hero. A field of fine contour lines and offset route fragments makes each screen feel like a small printed map, while chunky square tiles keep the puzzle readable at phone size. The identity belongs to a spatial route game, not a generic software landing page.

The page is deliberately asymmetric on wide screens: copy occupies a narrow west column and the live board sits east. On phones the board moves directly below the first action. Straight edges, clipped corners, coordinate labels, and diagram-like ticks form the shape language. Cards are used only for the board and independent status panels.

## Palette

The palette comes from an imagined night map printed with mineral inks.

| Token | Value | Use |
| --- | --- | --- |
| Ink night | `#142521` | Page background, primary text on light surfaces |
| Paper | `#F5F0E4` | Main surface and high-contrast text |
| Parchment | `#E7DECB` | Secondary surfaces and map grid |
| Moss | `#35684F` | Muted routes and secondary controls |
| Signal orange | `#B93E24` | Primary action and active route |
| Sun yellow | `#F2C14E` | Focus and reward highlights |
| Lake blue | `#267A8B` | Landmark and informational accents |
| Error brick | `#A52E2E` | Invalid route feedback |

No light/dark switch is provided. This is an explicitly single-mode night-map art direction: dark page field, pale board, and pale text. Body contrast is at least 4.5:1; color never carries game state alone because routes use line shapes and landmarks use symbols.

## Type

- Display: `Georgia`, a self-hosted system serif, for the editorial map-title voice.
- Body and controls: `Arial`, a system sans serif, for compact clarity.
- Coordinates and seeds: `ui-monospace`, for stable tabular labels.

No font files or third-party font requests are needed. Headlines are sparse and large; utility labels remain plain and direct.

## Spacing and layout

The base unit is 8px. Spacing tokens are 4, 8, 16, 24, 32, 48, 64, and 96px. Text measure stays under 68 characters. All controls are at least 44px high, and the grid uses a square aspect ratio with a phone-safe maximum width of 560px.

At 390px, secondary prose and the decorative hero crop drop below the game. The daily board remains visible in the first viewport after the primary action.

## Game interaction grammar

Players select adjacent road cells to draw one continuous route from Start `●` to Finish `◆`. Pointer drag, tap-by-tap, Enter/Space, and Arrow keys share one deterministic path reducer. Backtracking one cell erases the last step. Crossing blocked cells, revisiting a cell, or exceeding the tile budget gives immediate text and shape feedback. The daily constraint changes among checkpoint, exact-turn, and scenic-cell rules.

Difficulty is controlled by board size and detours: practice starts with 5×5 boards and 7–9 route tiles; the daily board is 6×6 with an 8–10 tile budget. Every generated puzzle is derived from a known solution first, so it is always solvable. No duration is promised because each player’s route planning pace differs.

## Motion and sound

Route segments draw in over 180ms from the preceding cell. Completion emits a single expanding contour ring over 500ms. No animation loops and nothing flashes. `prefers-reduced-motion` removes transforms and uses instant state changes. The game has no sound, avoiding surprise audio and reducing initial weight.

## Original asset plan

- Live board, route symbols, logo, and map texture: hand-authored HTML/CSS/SVG and deterministic TypeScript.
- Hero/social scene: one generated abstract aerial route landscape, used as a quiet underlay and the source for the Open Graph crop. It contains no interface text.
- Favicons: hand-authored SVG route mark; apple-touch PNG rasterized locally.

## Art prompt sheet

**Subject:** an impossible pocket-sized transit landscape made from interlocking square route tiles, one continuous orange road joining a circular landmark and diamond landmark. **World:** abstract topographic night map, no people. **Materials:** cut paper, mineral ink, subtle embossed contour lines. **Light:** soft raking museum light. **Lens/composition:** top-down, wide landscape, useful quiet negative space around the central geometry. **Palette words:** ink green-black, warm paper, signal orange, lake blue, sun yellow. **Negative list:** no text, letters, numbers, logos, watermark, hands, people, vehicles, flags, gradients, UI screenshot, photoreal city.

## Asset provenance

`public/assets/route-landscape.webp` and its social crop are generated for this product with the factory image model (`factory-image`) on 2026-09-01 from the prompt sheet above. Candidates are reviewed for text artifacts, unintended symbols, seams, and palette fit. The shipped WebP is optimized under 300KB. All SVG art is original code authored for this repository. System fonts use the operating system license.
