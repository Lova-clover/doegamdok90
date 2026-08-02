const path = require("path");

module.exports = {
  testDir: "./scripts",
  testMatch: "capture-real-flow.spec.cjs",
  timeout: 180000,
  outputDir: "./capture-output",
  reporter: "line",
  use: {
    headless: true,
    viewport: {width: 1920, height: 1080},
    deviceScaleFactor: 1,
    video: {mode: "on", size: {width: 1920, height: 1080}},
    launchOptions: {
      executablePath: path.resolve(__dirname, "node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe"),
      args: ["--autoplay-policy=no-user-gesture-required"],
    },
  },
};