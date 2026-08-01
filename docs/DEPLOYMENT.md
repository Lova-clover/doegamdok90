# Vercel Deployment and Submission Freeze

## Deployment target

The application is a static React/Vite build with no runtime API, secret, database, login, or payment dependency. The repository-root `vercel.json` is the source of truth.

| Setting | Value |
| --- | --- |
| Repository | `Lova-clover/doegamdok90` |
| Root Directory | `.` |
| Runtime | Node.js `24.x` |
| Install Command | `npm run install:app` |
| Build Command | `npm run build` |
| Output Directory | `app/dist` |
| Environment Variables | None |

## First deployment

1. Open <https://vercel.com/new> and import `Lova-clover/doegamdok90`.
2. Keep the project root at `.` so `vercel.json` is detected.
3. Do not add environment variables.
4. Deploy and wait for the production status to become Ready.
5. Disable deployment protection for the production URL so judges can enter without an account.

## Failed deployment recovery

If Vercel reports a failed deployment:

1. In **Project Settings → Build and Deployment**, set Root Directory to `.`.
2. Remove dashboard overrides for Install, Build, and Output Directory so the committed configuration remains the source of truth.
3. If the existing project must keep Root Directory `app`, the compatibility file `app/vercel.json` supplies `npm ci`, `npm run build`, and `dist` automatically.
4. Confirm Node.js is set to `24.x`.
5. Redeploy the latest commit without reusing the previous build cache.
6. Inspect the failed deployment with `npx vercel inspect <deployment-id> --logs` after authenticating the CLI.
7. Reproduce the exact contract locally with the commands below.

```bash
npm run install:app
npm test
npm run build
npx vercel build
```

The root `package.json` exists deliberately: it gives Vercel a stable project entry point while keeping the application package isolated in `app/`.

The root-level paths in `.vercelignore` are anchored with a leading slash. Do not change `/data/` back to `data/`: the unanchored form also removes the required `app/src/data/` modules from the deployment.

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
npm run install:app
npm test
npm run build
npm --prefix app audit --omit=dev
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
