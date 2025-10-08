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
