# User Flows - Touchline Replay 90

## 1. First-Time Happy Path

```mermaid
flowchart TD
  A["Open app"] --> B["See Match Desk"]
  B --> C["Choose World Cup scenario"]
  C --> D["Read score, minute, objective"]
  D --> E["Enter Tactics Board"]
  E --> F["Apply formation preset"]
  F --> G["Drag 2-3 players"]
  G --> H["Adjust pressing, tempo, width, risk"]
  H --> I["Run simulation"]
  I --> J["Watch short event sequence"]
  J --> K["Read Manager Report"]
  K --> L["Replay or share coach card"]
```

Design intent:
- The user should reach the board within one click.
- The first run should not require tactical knowledge.
- Presets and hints reduce blank-canvas anxiety.

## 2. Scenario Selection Flow

```mermaid
flowchart TD
  A["Match Desk"] --> B["Scenario list"]
  B --> C{"Scenario selected?"}
  C -- "No" --> D["Default first scenario preview"]
  C -- "Yes" --> E["Briefing panel updates"]
  D --> E
  E --> F["Show objective and key opponent pattern"]
  F --> G["Start scenario"]
```

UX rules:
- Always preselect a recommended scenario.
- Use labels like "3분 추천", "공격형", "수비형".
- Avoid forcing users to compare too many options.

## 3. Tactical Editing Flow

```mermaid
flowchart TD
  A["Tactics Board"] --> B["Formation preset"]
  A --> C["Select player"]
  C --> D["Player inspector"]
  D --> E["Change role"]
  A --> F["Drag player"]
  F --> G["Drop on pitch"]
  G --> H["Meters update"]
  A --> I["Drag bench player"]
  I --> J["Drop on starter"]
  J --> K["Confirm substitution"]
  K --> H
  H --> L{"Valid XI?"}
  L -- "Yes" --> M["Simulation enabled"]
  L -- "No" --> N["Inline fix hint"]
  N --> A
```

UX rules:
- Show consequences immediately.
- Keep reset and auto-balance visible.
- Do not punish experimental formations too early.

## 4. Simulation Flow

```mermaid
flowchart TD
  A["Click Run Simulation"] --> B["Freeze board state"]
  B --> C["Evaluate tactic locally"]
  C --> D["Generate event cards"]
  D --> E["Animate timeline"]
  E --> F["Show metric deltas"]
  F --> G["Route to report"]
```

UX rules:
- Simulation should be short and crisp.
- Always generate at least three readable events.
- Avoid black-box AI phrasing.

## 5. Report And Replay Flow

```mermaid
flowchart TD
  A["Manager Report"] --> B["Coach score"]
  B --> C["Objective outcome"]
  C --> D["Tactical reasons"]
  D --> E["Coach persona card"]
  E --> F{"Next action"}
  F -- "Replay" --> G["Return to same board"]
  F -- "New scenario" --> H["Back to Match Desk"]
  F -- "Share" --> I["Copy encoded link or export image"]
```

UX rules:
- Praise and critique should both be specific.
- Report should name the user's tactical identity.
- Replay should preserve previous choices so the user can iterate.

## 6. Mobile Flow

```mermaid
flowchart TD
  A["Open scenario"] --> B["Board tab"]
  B --> C["Tap player"]
  C --> D["Tap target zone"]
  D --> E["Meters update"]
  E --> F["Squad tab for substitution"]
  F --> G["Tactics tab for sliders"]
  G --> H["Run simulation"]
  H --> I["Report tab"]
```

Mobile design rules:
- Board remains the first tab.
- Use tap-to-move as fallback for precise drag.
- Avoid tiny controls around the pitch.
- Keep simulation CTA sticky at the bottom.

## 7. Invalid State Recovery Flow

```mermaid
flowchart TD
  A["User creates invalid tactic"] --> B["Validation detects issue"]
  B --> C["Explain issue inline"]
  C --> D{"Can auto-fix?"}
  D -- "Yes" --> E["Show Auto Fix"]
  E --> F["Apply safe correction"]
  D -- "No" --> G["Show exact required action"]
  F --> H["Simulation enabled"]
  G --> A
```

Example messages:
- "골키퍼가 빠졌습니다. 벤치에서 골키퍼를 올려주세요."
- "현재 12명이 필드에 있습니다. 한 명을 벤치로 내려주세요."
- "수비수가 2명뿐입니다. all-in 모드가 아니라면 최소 3명을 권장합니다."

## 8. Demo Flow For Submission Video

```mermaid
flowchart LR
  A["Start"] --> B["Pick Need A Goal scenario"]
  B --> C["Switch to 3-4-3"]
  C --> D["Substitute attacker"]
  D --> E["Target weak right side"]
  E --> F["Run simulation"]
  F --> G["Show coach report"]
```

Recommended narration:
- "이 서비스는 단순한 전술판이 아니라, 실제 월드컵 경기의 결정적 순간을 감독으로 다시 플레이하는 웹 시뮬레이터입니다."
- "선수를 드래그하고 지시를 바꾸면 공격, 수비, 위험도가 즉시 변합니다."
- "결과 화면에서는 내가 왜 성공했는지, 어떤 위험을 감수했는지 설명해줍니다."

