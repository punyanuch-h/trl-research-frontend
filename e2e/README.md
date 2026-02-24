# Playwright E2E Tests

End-to-end tests for the TRL Research Frontend application using Playwright with Page Object Model (POM).

## Folder Structure

```
e2e/
├── .env.example          # Environment variables template
├── README.md             # This file
├── fixtures/             # Test fixtures (auth, etc.)
│   └── auth.fixture.ts
├── global-setup.ts       # Runs once before all tests
├── helpers/              # Reusable helper functions
│   └── test.helpers.ts
├── locators/             # Retry-safe selectors by feature
│   ├── auth.locators.ts
│   ├── researcher.locators.ts
│   ├── admin.locators.ts
│   └── index.ts
├── pages/                # Page Object Model
│   ├── LoginPage.ts
│   ├── SignupPage.ts
│   ├── ForgotPasswordPage.ts
│   ├── ResearcherHomePage.ts
│   ├── AdminHomePage.ts
│   └── index.ts
├── specs/                # Test specs (one file per feature)
│   ├── auth.setup.ts     # Auth state setup (optional)
│   ├── 01-auth-signup.spec.ts
│   ├── 02-auth-login.spec.ts
│   ├── 03-auth-forget-password.spec.ts
│   ├── 04-researcher-home.spec.ts
│   ├── 05-researcher-submit-research.spec.ts
│   ├── 06-researcher-view-detail.spec.ts
│   ├── 07-researcher-download.spec.ts
│   ├── 08-admin-home.spec.ts
│   ├── 09-admin-dashboard.spec.ts
│   ├── 10-admin-view-research-detail.spec.ts
│   ├── 11-admin-assessment.spec.ts
│   ├── 12-admin-add-appointment.spec.ts
│   ├── 13-admin-edit-appointment.spec.ts
│   ├── 14-admin-change-password.spec.ts
│   └── 15-admin-add-admin.spec.ts
└── test-data/            # Test data builders
    └── auth.data.ts
```

## Prerequisites

- Node.js 18+
- Application running at `http://localhost:3000` (or set `BASE_URL`)

**Note:** This app uses HashRouter, so all routes use hash format (e.g. `/#/login`, `/#/forget-password`). Page navigations in tests use `/#/path` accordingly.

## Installation

```bash
npm install
npx playwright install chromium
```

Or add to your project (already in package.json):
- `@playwright/test` (devDependency)

## Configuration

1. Copy environment template:
   ```bash
   cp e2e/.env.example e2e/.env
   ```

2. Edit `e2e/.env` with your values:
   ```
   BASE_URL=http://localhost:3000
   RESEARCHER_EMAIL=researcher@example.com
   RESEARCHER_PASSWORD=Password123
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=AdminPass123
   ```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific spec file
npx playwright test e2e/specs/02-auth-login.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run with UI
npx playwright test --ui

# Run auth tests only
npx playwright test e2e/specs/0*-auth*.spec.ts

# Run researcher tests only
npx playwright test e2e/specs/04-*.spec.ts e2e/specs/05-*.spec.ts
```

## CI/CD (GitHub Actions)

A workflow is provided at `.github/workflows/e2e.yml`. Configure these secrets in your repository:

- `RESEARCHER_EMAIL` – Researcher test account email
- `RESEARCHER_PASSWORD` – Researcher test account password
- `ADMIN_EMAIL` – Admin test account email
- `ADMIN_PASSWORD` – Admin test account password

For tests to pass in CI, the application must be deployed and reachable at `BASE_URL`, or use a service that starts the app before tests (e.g., `npm run build && npx serve dist`).

## Features Covered

| Feature | Spec File |
|---------|-----------|
| Signup (Researcher) | 01-auth-signup.spec.ts |
| Login | 02-auth-login.spec.ts |
| Forget Password | 03-auth-forget-password.spec.ts |
| Researcher Home | 04-researcher-home.spec.ts |
| Submit Research (5-step form) | 05-researcher-submit-research.spec.ts |
| View Research Detail | 06-researcher-view-detail.spec.ts |
| Download Research Result | 07-researcher-download.spec.ts |
| Admin Home | 08-admin-home.spec.ts |
| Admin Dashboard | 09-admin-dashboard.spec.ts |
| Admin View Research Detail | 10-admin-view-research-detail.spec.ts |
| Admin Assessment | 11-admin-assessment.spec.ts |
| Add Appointment | 12-admin-add-appointment.spec.ts |
| Edit Appointment | 13-admin-edit-appointment.spec.ts |
| Change Password | 14-admin-change-password.spec.ts |
| Add Admin | 15-admin-add-admin.spec.ts |

## Screenshots on Failure

Screenshots are captured automatically on failure. Output directory: `e2e/test-results/`.

## Retry-Safe Selectors

Locators use Playwright's built-in retry mechanisms (`getByRole`, `getByLabel`, `getByPlaceholder`) for stability.
