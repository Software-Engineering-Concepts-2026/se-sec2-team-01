# Good Night web app setup

Good Night is a static HTML app under `web/`. It stores local-mode data in this browser and uses Supabase Auth and the PostgREST API only when cloud configuration is present. The existing `services/stats-service` is separate and unchanged.

## Run locally without Supabase

Requirements: Python 3 or another static HTTP server. The browser-independent tests require Node.js 24; no npm install or bundler is needed.

From the repository root, run:

```powershell
python -m http.server 4173 --directory web
```

Open `http://localhost:4173`. Do not create `web/config.js` for local-only use; localhost then defaults to local mode. The browser stores this mode's data in its own origin's local storage. It is not synced to another device and clearing browser storage removes it. Opening `web/index.html` directly with `file://` also uses local mode, but the service worker/PWA install requires localhost or HTTPS.

## Connect a Supabase project

1. Create or select a Supabase project you control. No project is created or configured by this repository.
2. Apply `supabase/migrations/20261010000000_good_night_schema.sql` using the Supabase CLI migration workflow, or paste `supabase/schema.sql` into that project's SQL Editor. The migration and schema file are kept in sync by a Node test.
3. In Supabase Auth, keep email/password sign-up enabled. For a hosted project, verify the Site URL is the exact deployed Good Night URL and add that exact URL (including any path/subpath) to allowed redirect URLs. The app's recovery flow uses the Site URL because it does not send a custom redirect; it reads the recovery token from the URL hash. See the official [redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls) and [password-based Auth guide](https://supabase.com/docs/guides/auth/passwords).
4. The app enforces a minimum password length of 8. Keep the Supabase minimum at 8 or update the app's validation/help text if the project requires a longer password. Email confirmation is enabled in the local CLI config; local confirmation links are captured by the Supabase local Mailpit inbox. Hosted Supabase projects require confirmation by default. Configure custom SMTP for production delivery; the default email sender is rate-limited and best-effort. See [password security](https://supabase.com/docs/guides/auth/password-security).
5. Copy `web/config.example.js` to the ignored, local-only `web/config.js`. Set `mode: 'cloud'`, `supabaseUrl`, and the browser-safe anon/publishable key. Keep `schemaV2: true` after applying the schema. Never put a Supabase secret/service-role key in `web/`, browser storage, a URL, or Git.
6. Serve the app from the repository root with the same static-server command above. The browser config supports local Supabase over HTTP only when both the app and Supabase endpoint use loopback; hosted app/project URLs require HTTPS.

The app refuses to boot on a hosted origin if cloud configuration is missing or invalid. This prevents a hosted deployment from quietly saving to a device-local account instead of the expected cloud account.

## Local Supabase and RLS tests

Local database tests require Docker and the Supabase CLI. From the repository root:

```powershell
supabase start
supabase db reset
supabase test db
```

`db reset` applies the checked-in migration to the local stack. The pgTAP suites in `supabase/tests/` create throwaway Auth users inside a transaction and verify anonymous denial, own-row CRUD, and cross-user read/insert/update/delete denial; they roll back their fixtures. Do not point test suites at production user data. See Supabase's [RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security) for the policy and pgTAP model.

`supabase/config.toml` sets the local Auth Site URL to `http://localhost:4173`, allows the matching loopback redirect, and enables email confirmation. Check the local Mailpit link printed by `supabase status` for confirmation/recovery messages. The CLI status output can contain server-side secret keys: do not paste or share it; only the project URL and anon/publishable key belong in `web/config.js`.

For a local cloud-mode browser test, use the local project URL and anon/publishable key shown by the CLI, and keep the Supabase host at `127.0.0.1` or `localhost`. Copy only the browser-safe key into `web/config.js`.

## Deploy account deletion

The client calls `POST /functions/v1/delete-account` with the signed-in user's access token. The `delete-account` Edge Function requires a verified user JWT and derives the deletion target only from the verified claims. The server-side admin client is used only inside the function; never send its secret key to the browser. Deploy from a machine already authorized for the Supabase project:

```powershell
supabase link --project-ref <your-project-ref>
supabase functions deploy delete-account
```

Account deletion removes the Auth account; the schema's `ON DELETE CASCADE` foreign keys remove that account's profile and sleep entries. Auth deletion revokes refresh tokens, but already-issued access tokens may remain usable until they expire ([Supabase User Management](https://supabase.com/docs/guides/auth/managing-user-data)). Test this only with a disposable account before enabling the feature for real users.

## Checks

```powershell
node --test tests/web/*.test.mjs
.\.venv\Scripts\python.exe -m pytest -q
```

The Node suite does not need dependencies. The Python command is the existing stats-service test suite. `supabase test db` is a separate integration check and needs the local Supabase stack.

No Supabase project, credentials, production Auth settings, hosting, function deployment, or branch-protection settings are provisioned by these files.

## Deploy through the team repository

The team repository can publish only the static frontend with the `Deploy Good Night` GitHub Actions workflow. Before the first deployment, a repository maintainer must:

1. In **Settings → Pages**, select **GitHub Actions** as the build and deployment source.
2. In **Settings → Secrets and variables → Actions → Variables**, add `SUPABASE_URL` (the project's HTTPS origin) and `SUPABASE_PUBLISHABLE_KEY` (the browser-safe `sb_publishable_` key). The workflow creates the ignored `web/config.js` while building; do not add a secret/service-role key.
3. After the reviewed app changes are integrated into `main` under the team's branch/review process, the workflow deploys the `web/` directory and reports the final URL in the `github-pages` environment. For this repository, the expected project-site URL is `https://software-engineering-concepts-2026.github.io/se-sec2-team-01/`.
4. In Supabase Auth URL Configuration, set the Site URL to that final URL and add the same URL to Redirect URLs before testing signup, confirmation, and password recovery.

GitHub Pages publishes the website publicly even when the source repository is private (subject to the organization's plan/settings). The Supabase publishable key is therefore visible in the browser by design; database access must remain constrained by RLS. This workflow publishes the frontend only. The `delete-account` Edge Function is a separate Supabase deployment and must be deployed and tested before account deletion is available in production.
