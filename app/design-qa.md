# Design QA - Touchline Replay 90

## Comparison Target

- Source visual truth: `C:\dacker-soccer\app\references\broadcast-war-room-reference.png`
- Final implementation screenshot: `C:\dacker-soccer\app\tmp\qa-board-final-1440.png`
- Full-view comparison: `C:\dacker-soccer\app\tmp\design-qa-comparison-final.png`
- Focused comparison: `C:\dacker-soccer\app\tmp\design-qa-focused-final.png`
- Viewport: 1440 x 1024
- State: 2026 Korea Republic vs Czechia, 60', balanced 4-3-3 preset, Hwang Heechan substituted in, Fate Shift +21

## Findings

No actionable P0, P1, or P2 differences remain.

The implementation preserves the source design's major composition: compact black broadcast header, narrow briefing rail, dominant central pitch, narrow staff/control rail, red formation state, green/amber/red tactical overlays, bottom metrics, and match timeline. The displayed scenario and match facts intentionally differ because the implementation uses the current 2026 Korea Republic vs Czechia scenario.

## Required Fidelity Surfaces

- Fonts and typography: Korean system sans-serif stack renders clearly at the intended dense product sizes. Headings, small labels, scoreboard values, player names, and control labels preserve the source hierarchy. Letter spacing is zero. No desktop or mobile clipping remains.
- Spacing and layout rhythm: 246px / flexible pitch / 318px desktop grid closely matches the source proportions. Panel radii are 6px or less. Header, formation bar, metric strip, and timeline align consistently. The 390px mobile layout uses tabs instead of squeezing the desktop grid.
- Colors and visual tokens: charcoal surfaces, natural pitch green, semantic red, mint, cyan, and amber map closely to the source. State colors have sufficient contrast and are not color-only because every state includes text or an icon.
- Image quality and asset fidelity: the project uses a generated, project-owned top-down pitch asset at `public/assets/pitch-dark-vertical.png`. It is sharp, correctly framed, and replaces no source logo or copyrighted broadcast asset. Phosphor icons are used for interface controls.
- Copy and content: all visible content is coherent with the 2026 scenario. Mission, constraints, official match facts, coach feedback, simulation events, and report reasons use the same decision model.
- Icons: a single MIT-licensed Phosphor icon family is used. Stroke weight, size, and semantic use are consistent.
- States and interactions: intro presets, formation selection, player selection, drag movement, keyboard movement, substitutions, range controls, audio toggle, simulation, report, replay, editing, and share fallback are implemented.
- Accessibility: semantic buttons, pressed states, range labels, focus outlines, reduced-motion support, keyboard player movement, and readable contrast are present.
- Responsiveness: 390 x 844 testing showed no horizontal overflow. Board, briefing, staff, and tactics tabs work. The full report scrolls to its final action row.

## Primary Interaction Evidence

- Intro recommendation button resolved uniquely and opened the board.
- Hwang Heechan bench action resolved uniquely and swapped the selected starter with the bench player.
- Drag test changed the player's inline position from `left: 20%; top: 30%` to `left: 28.2703%; top: 23.9304%`.
- Tempo and risk sliders accepted new values and recalculated Fate Shift.
- Simulation completed and exposed the report button.
- Manager report rendered with coach score 85 and Fate Shift +21 in the tested winning path.
- Desktop and mobile browser console errors checked: 0.

## Comparison History

### Iteration 1

- Earlier finding: the first comparison used different interaction states; the source showed a selected substitute and Fate Shift +18 while the implementation showed an untouched preset and Fate Shift +8.
- Fix: captured the matching substitution state and calibrated explainable mission bonuses for width, central cover, tempo, and fresh runners.
- Post-fix evidence: `tmp\design-qa-comparison-v2.png`, Fate Shift +21.

### Iteration 2

- Earlier finding: after substitution, focus replacement left the briefing rail slightly scrolled and hid its top kicker.
- Fix: reset only the briefing rail scroll position after a substitution state update.
- Post-fix evidence: `tmp\qa-board-final-1440.png`; briefing title and kicker are fully visible.

### Iteration 3

- Earlier finding: the mobile intro could break the final Korean word awkwardly, and the tactics tab had too much unused space.
- Fix: applied Korean keep-all wrapping and retained the Fate Meter above mobile controls.
- Post-fix evidence: `tmp\qa-mobile-controls-v2.png` and 390px report screenshots.

## Follow-up Polish

- P3: the implementation adds a small broadcast icon before the wordmark; the source uses text only. It is intentional brand reinforcement and does not alter hierarchy.
- P3: the right staff rail is slightly less text-dense than the generated source. The extra breathing room protects Korean readability at smaller browser widths.
- P3: only the flagship 2026 scenario is fully authored in this MVP; the next release should add one contrasting lead-protection scenario.

## Final Result

final result: passed
