const {test, expect} = require("@playwright/test");

const pause = (page, ms) => page.waitForTimeout(ms);

async function clickWithCursor(page, locator, waitBefore = 420, waitAfter = 650) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error("Target is not visible");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y, {steps: 18});
  await pause(page, waitBefore);
  await page.mouse.down();
  await pause(page, 90);
  await page.mouse.up();
  await pause(page, waitAfter);
}

async function installCursor(page) {
  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.id = "demo-real-cursor";
    Object.assign(cursor.style, {
      position: "fixed", left: "0", top: "0", width: "22px", height: "22px",
      border: "3px solid white", borderRadius: "50%", background: "#91e52f",
      boxShadow: "0 0 0 2px rgba(0,0,0,.72), 0 0 14px rgba(145,229,47,.85)",
      pointerEvents: "none", zIndex: "2147483647", transform: "translate(-50%,-50%)",
      opacity: "0", transition: "width 90ms, height 90ms, opacity 150ms",
    });
    document.body.appendChild(cursor);
    document.addEventListener("mousemove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.style.opacity = "1";
    }, true);
    document.addEventListener("mousedown", () => {
      cursor.style.width = "14px";
      cursor.style.height = "14px";
    }, true);
    document.addEventListener("mouseup", () => {
      cursor.style.width = "22px";
      cursor.style.height = "22px";
    }, true);
  });
}

test("record real doegamdok90 flow", async ({page}) => {
  await page.goto("http://127.0.0.1:5173", {waitUntil: "networkidle"});
  await page.evaluate(() => localStorage.clear());
  await page.reload({waitUntil: "networkidle"});
  await installCursor(page);
  await expect(page.getByRole("dialog")).toBeVisible();
  await pause(page, 900);

  await clickWithCursor(page, page.getByTestId("scenario-kor-por-2022-minute-65"), 350, 900);
  await clickWithCursor(page, page.locator("button.intro-primary"), 420, 1100);

  await expect(page.getByTestId("board-panel")).toBeVisible();
  await pause(page, 900);
  await clickWithCursor(page, page.getByRole("button", {name: "3-4-3"}), 360, 850);

  const player = page.locator('[data-testid^="player-"]').nth(5);
  await clickWithCursor(page, player, 320, 350);
  const pitch = page.getByTestId("pitch");
  const pitchBox = await pitch.boundingBox();
  if (!pitchBox) throw new Error("Pitch is not visible");
  await page.mouse.move(pitchBox.x + pitchBox.width * 0.68, pitchBox.y + pitchBox.height * 0.56, {steps: 22});
  await pause(page, 350);
  await page.mouse.click(pitchBox.x + pitchBox.width * 0.68, pitchBox.y + pitchBox.height * 0.56);
  await pause(page, 850);

  const widthControl = page.getByTestId("control-width");
  await widthControl.scrollIntoViewIfNeeded();
  const controlBox = await widthControl.boundingBox();
  if (!controlBox) throw new Error("Width control is not visible");
  await page.mouse.move(controlBox.x + controlBox.width * 0.78, controlBox.y + controlBox.height / 2, {steps: 20});
  await pause(page, 300);
  await page.mouse.click(controlBox.x + controlBox.width * 0.78, controlBox.y + controlBox.height / 2);
  await pause(page, 900);

  await clickWithCursor(page, page.getByTestId("run-simulation"), 420, 900);
  await expect(page.getByRole("dialog")).toBeVisible();
  await clickWithCursor(page, page.locator('[data-testid^="live-call-"]').nth(0), 380, 700);
  await clickWithCursor(page, page.getByTestId("start-live-simulation"), 420, 700);

  await expect(page.getByLabel("시뮬레이션 일시정지")).toBeVisible();
  await clickWithCursor(page, page.getByLabel(/재생 속도 1배/), 250, 500);
  await expect(page.getByTestId("view-report")).toBeVisible({timeout: 40000});
  await pause(page, 1100);
  await clickWithCursor(page, page.getByTestId("view-report"), 350, 1000);
  await expect(page.getByTestId("report-view")).toBeVisible();
  await page.mouse.move(1850, 70, {steps: 15});
  await pause(page, 2200);
});