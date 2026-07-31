# Vercel Deployment and Submission Freeze

## Deployment target

The application is a static React/Vite build with no runtime API, secret, database, login, or payment dependency. The repository-root `vercel.json` is the source of truth.

| Setting | Value |
| --- | --- |
| Repository | `Lova-clover/doegamdok90` |
| Root Directory | `.` |
| Install Command | `npm --prefix app ci` |
| Build Command | `npm --prefix app run build` |
| Output Directory | `app/dist` |
| Environment Variables | None |

## First deployment

1. Open <https://vercel.com/new> and import `Lova-clover/doegamdok90`.
2. Keep the project root at `.` so `vercel.json` is detected.
3. Do not add environment variables.
4. Deploy and wait for the production status to become Ready.
5. Disable deployment protection for the production URL so judges can enter without an account.

## Post-deploy smoke test

Run the full path in a signed-out browser window:

1. Open the production URL without login.
2. Select Korea vs Ghana at 61 minutes.
3. Enter the tactics board and move one player.
4. Change at least one tactical control and verify the causal explanation changes.
5. Apply a valid substitution.
6. Start the simulation and verify motion continues through the goal line.
7. Confirm `GOAL` appears only after the ball reaches the goal line.
8. Open the manager report and verify all four comparison columns render.
9. Reload and confirm saved progress remains usable.
10. Repeat the critical path at 390px width.

Also verify:

```bash
cd app
npm ci
npm test
npm run build
npm audit --omit=dev
```

## Competition submission freeze

The competition rules state that commits after the final submission deadline may be treated as submission modification. Before the deadline:

- [ ] Production URL is public and tested in a signed-out browser.
- [ ] GitHub repository is public and the default branch is `main`.
- [ ] README contains the final production URL and YouTube link.
- [ ] YouTube video is public or unlisted and plays without sign-in.
- [ ] The final commit SHA is recorded with the submitted links.
- [ ] Vercel is pinned to that commit.
- [ ] No automated bot, dependency updater, formatter, or scheduled workflow can commit after the deadline.
- [ ] Team members understand that no post-deadline commit is allowed.

After the freeze, do not edit README, tags, generated files, or source code until the organizer explicitly permits changes.
