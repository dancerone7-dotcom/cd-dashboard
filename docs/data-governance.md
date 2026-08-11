# Data governance for the CD Dashboard

Status: release safeguard. This document is operational guidance, not a legal determination that a deployment is HIPAA compliant.

## Current data flow

- The application is a static browser dashboard. Entered values are held in memory and are not sent by application code to a server.
- Import reads a user-selected JSON file locally. Export creates a local JSON download. PDF export invokes the browser print dialog.
- The public GitHub repository and GitHub Pages site must contain demo data only. No patient JSON, PDF, screenshot, spreadsheet, or other identifiable health information may be committed.
- Exported JSON and PDFs contain the entered measurements and patient code. Treat them as sensitive clinical artifacts even when initials are used.

## Minimum-use rules

1. Use a random study code or approved clinical identifier, not a patient name, date of birth, MRN, address, contact information, or free-text identifier.
2. Enter only the measurements needed for the selected goals.
3. Store exports only in the organization’s approved clinical record or encrypted storage location.
4. Do not email, chat-upload, or commit exports unless the organization has approved that channel for the data involved.
5. Delete local downloads and print files according to the organization’s retention schedule.
6. Revoke access and follow the incident-response process if a file is misplaced or committed.

## Deployment boundary

The GitHub Pages deployment is public and is approved only as a demo/calculation client. Public hosting must not be described as a clinical record system. Before production clinical use, the privacy/security owner must decide whether browser-only processing on a public static origin is acceptable and document any required access controls, vendor agreements, retention rules, logging rules, and incident-response ownership.

HHS explains that health information associated with identifiers can be PHI and that HIPAA de-identification requires either Expert Determination or Safe Harbor, not merely replacing a name with initials. See the official [HHS de-identification guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html).

## Release evidence

- [ ] Repository scan confirms no patient artifacts or secrets.
- [ ] Browser network inspection confirms entered values are not transmitted.
- [ ] Privacy warning is visible before import/export use.
- [ ] Clinical owner approves the identifier convention.
- [ ] Privacy/security owner approves the deployment boundary and retention process.
- [ ] A named person owns incident response and removal of accidental commits.
