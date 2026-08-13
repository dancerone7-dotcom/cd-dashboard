# Centenarian Decathlon dashboard release checklist

Release candidate: model `3.2` on `agent/cd-dashboard-v3`.

This checklist separates completed engineering evidence from approvals that must come from named people. A checked engineering item is not clinical approval.

1. **Automated model validation and CI**
   - [x] Local validator covers 36 goals, 83 metrics, finite projections, import/export, print generation, evidence grades, balance units, privacy boundaries, and accessible tab semantics.
   - [x] GitHub Actions workflow is published at `.github/workflows/validate.yml`.
   - [x] Push and pull-request runs passed on workflow commit `f01a3bd`.

2. **Clinical calibration register**
   - [x] The 22 unvalidated candidate thresholds are listed and remain supporting trajectory only.
   - [ ] Named clinical owner approves, revises, or rejects every candidate before any is made scoreable.

3. **Single-leg balance protocol**
   - [x] Timed single-leg balance uses seconds for the observed value, 30-second target, and age-decline projection.
   - [x] Timed stance is not labeled as a VALD centre-of-pressure output.
   - [ ] Assessment/VALD protocol owner ratifies the capture SOP: surface, arms, vision condition, cap, trials, and weaker-side rule.

4. **Full export QA**
   - [x] Synthetic 36-goal export generates exactly 38 letter-landscape pages.
   - [x] All pages were rendered and visually inspected for clipping, blank goal pages, non-finite values, and summary fit.

5. **Task-demand proxy evidence**
   - [x] Every aerobic task mapping carries A, B, or C evidence.
   - [x] Grades set minimum uncertainty and downweight broad proxies in cross-goal prioritization.
   - [ ] Clinical owner resolves the operational-definition decisions in the calibration register.

6. **Responsive and accessibility QA**
   - [x] Desktop and 390 px mobile layouts have no page-wide horizontal overflow.
   - [x] Reference, Build report, and Report tabs have keyboard/ARIA tab behavior.
   - [x] Visible controls have accessible names, focus is visible, and tested normal text meets WCAG AA contrast.

7. **Data governance and privacy**
   - [x] Source scan finds no application calls that transmit entered clinical data.
   - [x] Demo data and an export privacy warning are visible in the application.
   - [x] Public-demo boundary and sensitive-export handling are documented.
   - [ ] Privacy/security owner approves the public-origin boundary, identifier convention, retention, and incident-response ownership.

8. **Independent review**
   - [x] Project owner approves opening the pull request and demo deployment for team review only.
   - [ ] Clinical reviewer completes the signoff table in `docs/clinical-calibration.md`.
   - [ ] Technical reviewer approves the pull request after examining the model diff, validator, and rendered PDF.
   - [x] Pull request is ready for team review; this does not represent clinical or production approval.

9. **Merge, deploy, and smoke test**
   - [ ] Merge the approved pull request to `main`.
   - [ ] Confirm GitHub Pages publishes that exact merge commit.
   - [ ] Smoke-test Reference, Build report, Report, JSON import/export, and PDF export on the public URL.

10. **V4 review-preview traceability**
   - [ ] Treat the branch commit reviewed in PR #3 as the source of truth; the dashboard exposes model `4.0` and approved source `a9a2d06548972359593d79e36aef8c5519d2ca45` as non-clinical build metadata.
   - [ ] Deploy `/v4-review/` only through a separate, explicit main-branch commit that copies `index.html` from the exact newly approved branch SHA without editing the copied file.
   - [ ] After every preview deployment, verify the live preview file hash/title against that approved SHA and verify the root URL remains unchanged.
   - [ ] Do not assume `/v4-review/` represents the current PR merely because PR #3 has new commits; update this identifier and redeploy only after explicit approval.

## Release decision

The project owner approves publishing this build solely as a demo for team review. Do not use it with real patient data or for clinical decisions while any item in sections 2, 3, 7, or 8 is open. The public GitHub Pages site remains demo-only until the privacy/security owner documents a different deployment decision.
