# Submission And Vote Plan - Touchline Replay 90

## 1. Submission Strategy

This competition has two gates:

1. Public vote top 10.
2. Internal judge review.

The product must therefore work for two audiences:
- Casual voter: "This is fun and I want to try/share it."
- Judge: "This is original, interactive, complete, and well-planned."

## 2. Public Vote Strategy

Public voters often decide quickly. Optimize for:

- A clear title: "월드컵 운명의 15분을 다시 지휘하세요."
- A familiar scenario: South Korea vs Portugal inspired scenario first.
- A fast result: first simulation within 3 minutes.
- A shareable ending: Manager Persona Card.

Recommended public copy:

```text
내가 감독이었다면 2022년 그 경기의 마지막 15분은 달라졌을까?
선수를 드래그하고, 교체하고, 전술을 바꿔 운명을 다시 써보세요.
```

Vote-page thumbnail idea:
- Tactical pitch with a big "67'" clock.
- Three labels: Real Match / My Call / Coach Pick.
- Big result number: Fate Shift +23.

## 3. Judge Review Strategy

Judges need proof, not just polish.

Make these visible in the app:
- Data source badge: OpenFootball + curated scenario JSON.
- No-login badge: "심사용 즉시 플레이".
- Interaction proof: drag, substitution, sliders, overlay, simulation.
- Planning consistency: route names and labels match the PDF.
- Explanation proof: result reasons tied to user actions.

## 4. 3-Minute Demo Script

0:00-0:08
- Open app.
- Show title and scenario cards.
- Say: "이 서비스는 월드컵의 결정적 15분을 감독으로 다시 플레이하는 전술 시뮬레이터입니다."

0:08-0:25
- Select "승리가 필요한 67분".
- Show score, minute, mission, constraint.
- Say: "단순 전술판이 아니라 실제 경기 맥락과 목표가 있습니다."

0:25-0:55
- Enter board.
- Change 4-2-3-1 to 3-4-3 or 4-3-3.
- Drag wide runner into weak flank.
- Show Fate Meter changing.

0:55-1:20
- Make substitution.
- Adjust tempo/width/risk.
- Show Coach Room Trio warning.
- Fix rest defense by moving DM deeper.

1:20-1:45
- Run Fate Simulation.
- Show event cards.

1:45-2:20
- Show Manager Report.
- Highlight Real vs Me vs Coach.
- Show Manager Persona Card.

2:20-2:45
- Quick switch to Scenario 2 and Scenario 3 to prove extensibility.

2:45-3:00
- End with share card and no-login deployment note.

## 5. Implementation Priority For Winning

Priority 0 - Must not fail:
- App loads.
- Scenario starts.
- Drag works.
- Simulation always returns report.

Priority 1 - Winning differentiators:
- Decision Moment Card.
- Fate Meter.
- Coach Room Trio.
- Real vs Me vs Coach report.
- Persona card.

Priority 2 - Polish:
- Smooth animations.
- Mobile tabs.
- Shareable image or encoded URL.
- Keyboard movement.

Priority 3 - Nice later:
- Set-piece bonus mode.
- Assistant voice variations.
- More scenarios.

## 6. Scope Tradeoff

If time gets tight, cut in this order:

1. Bonus Scenario 4.
2. Share image export.
3. Mobile advanced drag.
4. Extra formation presets.
5. Detailed player role editor.

Do not cut:
- Scenario context.
- Drag placement.
- Simulation report.
- Fate Meter.
- Real vs Me comparison.

## 7. GitHub README Checklist

README should include:
- What the service does.
- Why it fits the competition.
- Live URL.
- Demo video URL.
- Tech stack.
- How to run locally.
- Data sources and licenses.
- No-login/no-key judging note.
- Main user flow screenshots or GIFs.

## 8. Final Submission Checklist

Before 2026-08-03 10:00:

- Deployed URL works externally.
- GitHub repo is public or accessible as required.
- Demo video is uploaded and unlisted/public.
- README is complete.
- App does not require login.
- App does not require paid API or private key.
- Data attribution is visible.
- Browser tested in Chrome and Edge.
- No post-deadline commits after final submission.

## 9. Presentation Narrative

Do not present it as:
- "We made a football tactics board."

Present it as:
- "We made a counterfactual manager simulator where the user rewrites a decisive World Cup window."

This wording matters. It moves the product from a tool to an experience.

