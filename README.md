# QA Mini Framework (Playwright)

Mini Playwright framework with API tests (GET/POST), basic reporting, and clean structure.

## Prereqs
- Node.js LTS installed (`node -v`, `npm -v`)
- Git installed (`git --version`)
- OS: Windows 10/11

## Project layout
```
D:\QA_MiniFramework\source
│
├── config/                # API endpoints and config files
├── tests/
│   └── api/               # API test specs
│       ├── posts.get.spec.ts
│       ├── posts.getById.spec.ts
│       ├── posts.post.spec.ts
│       └── posts.post.negative.spec.ts
├── package.json           # Dependencies and scripts
└── README.md
```

## Install
```bash
npm ci || npm install
```

## Useful scripts
```bash
# run all tests (all projects)
npm run test:all

# run only API tests folder
npm run test:api

# run a single test file (example)
npx playwright test tests/api/posts.getById.spec.ts --project=chromium

# open the last HTML report
npm run report:open
```

## Notes
- Reports are generated locally in the `reports/` folder and are **not** committed to Git.
- API base: https://jsonplaceholder.typicode.com (public fake API).

---

## Reports & Artifacts (Stage 9)

### Generate an HTML report
From the project root:
```bash
npx playwright test
```

### Open the latest report
```bash
npx playwright show-report reports
```

### Where to find artifacts
- HTML report: `playwright-report/index.html` (or `reports/` if configured that way).
- Test artifacts (screenshots, traces, videos): stored under `test-results/`.

### Run filtered tests
Run only Stage 8 UI tests, for example:
```bash
npx playwright test "tests/ui/.*stage8.*\.spec\.ts"
```

### Notes
- Reports and artifacts are **local only**; they are not pushed to Git.  
- Opening or viewing reports (npx playwright show-report reports) does **not** require the dev server; only running UI tests does.
- Keep your dev server running if you execute UI tests manually