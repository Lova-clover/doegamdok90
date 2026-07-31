# Wireframes - Touchline Replay 90

These wireframes are implementation-oriented. They define layout, hierarchy, and interaction zones rather than final visual style.

## 1. Desktop - Match Desk

Target width: 1440px

```text
+--------------------------------------------------------------------------------+
| Touchline Replay 90                      Data: World Cup scenarios     Start    |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [Scenario A]  [Scenario B selected]  [Scenario C]                              |
|  Protect lead   Need a goal          Break low block                            |
|                                                                                |
+------------------------------+-------------------------------------------------+
| Match Briefing               | Tactical Snapshot                               |
|                              |                                                 |
|  67'   Team 0 - 1 Opponent   |  Opponent danger       [left half-space map]    |
|  Objective: Find equalizer   |  Weak zone             [right flank map]        |
|                              |                                                 |
|  Key facts                   |  Recommended first move                         |
|  - Opponent fullback tired   |  - Add width                                    |
|  - Your striker has stamina  |  - Increase tempo carefully                     |
|  - Midfield control fading   |                                                 |
|                              |  [Take the touchline]                           |
+------------------------------+-------------------------------------------------+
| Data sources and attribution                                                   |
+--------------------------------------------------------------------------------+
```

UX notes:
- The product starts as an interactive desk, not a marketing landing page.
- One scenario is preselected.
- The CTA is specific and immersive: "감독석에 앉기" or "Take the touchline".

## 2. Desktop - Tactics Board

Target width: 1440px

```text
+--------------------------------------------------------------------------------+
| < Match Desk   67' Team 0-1 Opponent   Objective: Equalize   Save   Share      |
+----------------------+--------------------------------------+------------------+
| Scenario Brief       | Formation: [4-3-3][4-2-3-1][3-4-3]   | Tactical Controls|
|                      |                                      |                  |
| Key pressure         | +----------------------------------+ | Pressing Line    |
| - Need goal          | |                                  | | [low --o high]  |
| - Avoid counter      | |          OPPONENT HALF           | |                  |
|                      | |     weak zone overlay            | | Tempo            |
| Bench                | |                                  | | [patient-o-fast]|
| [P12] [P14] [P17]    | |    p11     p9       p7           | |                  |
| [P19] [P21] [GK]     | |                                  | | Width            |
|                      | |         p10                      | | [narrow-o-wide] |
| Selected player      | |                                  | |                  |
| Name                 | |    p8         p6                 | | Risk             |
| Role [Inside Forward]| |                                  | | [protect-o-all] |
| Fit 82               | | p3    p4      p5     p2          | |                  |
|                      | |                                  | | Attack Focus     |
| [Auto balance]       | |              GK                  | | [L][C][R][Mix]  |
| [Reset]              | +----------------------------------+ |                  |
|                      | Attack 68  Defense 54  Control 61  | Risk Radar       |
|                      | [Run 15-minute simulation]         | [radar/chart]    |
+----------------------+--------------------------------------+------------------+
| Timeline: 55' yellow card | 61' goal conceded | 67' you take over | 82' target   |
+--------------------------------------------------------------------------------+
```

UX notes:
- Pitch is the visual center.
- Left panel is context and squad.
- Right panel is decision controls and feedback.
- Bottom timeline reinforces match pressure.

## 3. Desktop - Player Inspector

```text
+----------------------------------+
| Player Name              #10     |
| AM / RW / CM                     |
| Traits: creator, half-space      |
+----------------------------------+
| Role                             |
| ( ) Playmaker                    |
| ( ) Inside Forward               |
| ( ) Box Crasher                  |
| ( ) Press Trigger                |
+----------------------------------+
| Fit in current tactic: 82        |
| + Passing helps short buildup    |
| + Creativity targets weak zone   |
| - Stamina drops with high press  |
+----------------------------------+
| [Set role] [Move to bench]       |
+----------------------------------+
```

UX notes:
- The inspector teaches without long tutorials.
- Pros and cons are tied to selected player and current tactic.

## 4. Desktop - Simulation Moment

```text
+--------------------------------------------------------------------------------+
| Simulation: 67' to 82'                                                          |
+--------------------------------------------------------------------------------+
|                                                                                |
|     67'          71'            76'               82'                           |
|      |------------|--------------|----------------|                             |
|      You          Press trap     Chance created   Final phase                   |
|                                                                                |
| +-------------------------------+  +------------------------------------------+ |
| | Mini pitch animation          |  | Event ticker                             | |
| | p7 run -> p10 pass -> shot    |  | 71' High press forced a rushed pass      | |
| |                               |  | 76' Right overload created a cutback     | |
| +-------------------------------+  | 80' Counter risk rose behind fullback    | |
|                                    +------------------------------------------+ |
|                                                                                |
| Attack +14        Defense -6        Control +5        Risk +9                  |
|                                                                                |
+--------------------------------------------------------------------------------+
```

UX notes:
- Short animation creates payoff without requiring full simulation realism.
- Metric deltas make cause and effect visible.

## 5. Desktop - Manager Report

```text
+--------------------------------------------------------------------------------+
| Manager Report                                           [Replay] [New match]   |
+-----------------------------+--------------------------------------------------+
| Coach Score                 | Tactical Verdict                                 |
|                             |                                                  |
|        84 / 100             | You found the equalizer route by overloading     |
|                             | the opponent's tired right side, but your high   |
| Persona                     | line left counter space after 78'.               |
| Counter Punch Manager       |                                                  |
|                             | Positive reasons                                 |
| [Share coach card]          | 1. Width created a clear passing lane.           |
|                             | 2. Substitution improved pace against tired FB.  |
|                             | 3. Midfield triangle restored second-ball cover. |
+-----------------------------+--------------------------------------------------+
| Before vs After                                                                |
| Attack 54 -> 78   Defense 62 -> 56   Control 49 -> 64   Risk 31 -> 48          |
+--------------------------------------------------------------------------------+
```

UX notes:
- Report balances celebration and tradeoff.
- Persona card helps public sharing.

## 6. Mobile - Tactics Board Tabs

Target width: 390px

```text
+--------------------------------------+
| 67' Team 0-1 Opponent        Report  |
+--------------------------------------+
| Objective: Equalize                  |
+--------------------------------------+
| [Board] [Squad] [Tactics] [Timeline] |
+--------------------------------------+
|                                      |
| +----------------------------------+ |
| |                                  | |
| |          Pitch board             | |
| |                                  | |
| |  tap player -> tap target zone   | |
| |                                  | |
| +----------------------------------+ |
|                                      |
| Attack 68  Defense 54  Risk 48      |
|                                      |
| [Run simulation]                    |
+--------------------------------------+
```

Mobile rules:
- Use tabs, not a squeezed desktop layout.
- Board first, details behind tabs.
- Sticky simulation button.
- Tap-to-move fallback is mandatory.

## 7. Mobile - Squad Tab

```text
+--------------------------------------+
| Squad                                |
+--------------------------------------+
| Starting XI                          |
| [#1 GK] [#2 RB] [#4 CB] [#5 CB]      |
| [#3 LB] [#6 DM] [#8 CM] [#10 AM]     |
| [#7 RW] [#9 ST] [#11 LW]             |
|                                      |
| Bench                                |
| [#12 GK] [#14 CM] [#17 FW] [#19 DF]  |
|                                      |
| Selected substitution                |
| Out: #8 CM                           |
| In:  #14 CM                          |
| [Confirm substitution]               |
+--------------------------------------+
```

## 8. Mobile - Report

```text
+--------------------------------------+
| Manager Report                       |
+--------------------------------------+
| 84 / 100                             |
| Counter Punch Manager                |
|                                      |
| You created better chances, but      |
| accepted late counter risk.          |
|                                      |
| + Width attacked weak zone           |
| + Fresh runner changed tempo         |
| - High line exposed back space       |
|                                      |
| [Replay] [New scenario] [Share]      |
+--------------------------------------+
```

## 9. Visual Direction

Preferred feel:
- Broadcast analysis desk plus modern tactical software.
- Dark pitch or deep green pitch with clear overlays.
- Restrained UI chrome so the pitch and decisions dominate.
- Use icons for actions where possible: reset, share, save, play, overlay.

Avoid:
- Marketing hero page as first screen.
- Huge decorative cards.
- Official team logos or copyrighted player photos.
- Overly complex charts that hide the main board.

