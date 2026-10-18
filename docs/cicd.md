# Lab 10 — CI/CD and DORA Metrics

## DORA observation window and evidence

- Repository: [se-sec2-team-01](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01)
- Window: 2026-10-05 through 2026-10-19 (UTC)
- Merged PR sample: #55–#62 (8 PRs)
- GitHub Pages workflow history: [Deploy Good Night](https://github.com/Software-Engineering-Concepts-2026/se-sec2-team-01/actions/workflows/deploy-pages.yml)
- The separate Vercel deployment history was not available in the repository data used for this measurement.

## Results

| DORA metric | Observed result | Interpretation / limitation |
|---|---:|---|
| Deployment Frequency | 0 verified successful GitHub Pages deployments in this window; 1 workflow run was observed and it failed before deployment | This is a GitHub Pages measure only. Vercel is not included, so it is not a complete production deployment frequency. |
| Lead Time for Changes | Median PR-open-to-merge: **0.0171 days** (~24.6 minutes); median first-commit-to-merge: **1.521 days** | These are repository workflow proxies, not commit-to-production lead time, because successful production deployment timestamps are unavailable. |
| Change Failure Rate | **Not measurable from available evidence** | A failed Pages workflow alone does not establish that a production change failed. No deployment-to-incident mapping was available. |
| Mean Time to Restore (MTTR) | **Not measurable from available evidence** | Incident start and service-restoration timestamps were not recorded in the sampled data. |

## Calculation notes

- The PR timing medians use the 8 merged PRs in the observation window. PR-open-to-merge is the median of `merged_at - created_at`; first-commit-to-merge is the median of `merged_at - earliest commit timestamp` for each PR.
- Deployment frequency counts successful production deployments, not pushes or workflow attempts. The single failed GitHub Pages workflow is therefore reported separately and does not count as a deployment.
- Change Failure Rate requires the number of deployments that caused a production failure divided by total production deployments. The available data does not identify such failures.
- MTTR requires a measured incident-to-restoration interval; no such incident records were available.
- Repository branch-protection settings were not verified, so this report makes no claim that CI is configured as a required merge check.

## Improvement actions

1. Record successful deployment events and environment in one source, including Vercel, so deployment frequency and commit-to-production lead time can be calculated.
2. Record production incidents, the affected deployment, incident start, and restoration time to calculate change failure rate and MTTR.
3. Verify required status checks with repository administrators and retain a screenshot of the effective rule and blocked-merge state.

## Local stack

See [`docker-compose.yml`](../docker-compose.yml) and [Lab 10 Compose instructions](lab10-compose.md) for the local web + PostgreSQL + Redis exercise. The data services are isolated examples and do not replace or modify the application's Supabase data path.
