# ADR 0002: Good Night static frontend and Supabase cloud boundary

- Status: Accepted for the Good Night web app scope
- Date: 2026-10-10

## Context

The supplied Good Night prototype is a self-contained Thai HTML/CSS/JavaScript app with tested sleep calculations and a local-first interaction model. The team repository already has a separate Python stats service and ADR 0001 selects the shared React/Vite and Flask/PostgreSQL stack for the wider project. Replacing either would expand this feature and risk unrelated lab work.

The app needs optional account-backed synchronization, owner-only storage, offline access to its static shell, and safe account deletion. There is no Supabase project or hosting environment provisioned in this repository.

## Decision

- Keep the supplied app as a static frontend under `web/`; do not add a framework or bundler.
- Use Supabase Auth and the Data API for the app's optional cloud mode. Keep the deployed-project URL and anon/publishable key in an ignored local `web/config.js`; never expose a secret/service-role key in browser code.
- Store cloud sleep rows in `public.entries` and profile/preferences in `public.profiles`. Enable RLS, grant client CRUD only to `authenticated`, and scope all four operations to `auth.uid() = user_id`.
- Use a small verified-user Edge Function for account deletion. Never accept the target user ID from browser input.
- Keep local-only mode available on `file://` and loopback development origins. A hosted page without valid cloud configuration fails closed.
- Cache only the same-origin static app shell; do not intercept Supabase API requests.
- Keep the existing stats service, its Python tests, and ADR 0001 unchanged.

## Consequences

- The app can be run locally without a backend, and cloud mode can be enabled by a project owner without a frontend build step.
- Cloud deployment requires a real Supabase project, schema migration, Auth redirect settings, a static HTTPS host, and deployment of the account-deletion function. These external steps remain manual and are not done by this implementation.
- Local-first entries remain browser-specific until cloud mode is configured and the user signs in. Pending cloud edits/deletes remain queued until acknowledged; cloud data is not merged over a pending local operation.
- The static Supabase path is scoped to this Good Night UI. It does not replace the wider project's React/Flask architecture decision or make the existing stats-service consume the sleep records.
- Local SQL/RLS integration tests require Docker and Supabase CLI; browser-independent JavaScript tests run with Node alone.
