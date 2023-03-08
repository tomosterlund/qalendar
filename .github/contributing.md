# Contributor's guide

## Issues

For bug reports or feature requests, choose one of the templates provided
at: https://github.com/tomosterlund/qalendar/issues/new/choose

Please note, that issues that adhere to the templates, and provide a clear description of the
problem, will have a greater chance of being resolved than issues that provide less information and
clarity.

## Developing

### Getting up and running

- `npm i`
- `husky install` - configuring the gitHooks
- `npm run seed` - Seed the current calendar month with events, or use
  the [advanced seeding options](#seeding).
- `npm run dev`

### Running tests

While developing, please run `vitest watch`, in order to monitor that all tests are passing.

Since Qalendar is making heavy use of the native JavaScript Date-Object, which has the possibility
to create difference output in different time zones, please also run `npm run test:docker` before
pushing. This will spin up 3 docker containers, in 3 different time zones, and then run all tests.

### Seeding

For seeding several months or even a year, you can use the following
CLI: `node ./development/faker/seed.js`. Two arguments are available:

1. `--months`

For example:

```
node ./development/faker/seed.js --months="2022.01 2022.02 2022.03"
```

will yield events in the first three months of 2022.

2. `--year`

For example:

```
node ./development/faker/seed.js --year=2022
```

will yield events in all months of 2022.

Please note that all previously seeded events are deleted upon running the CLI.

### Committing

This repo uses [commitlint](https://commitlint.js.org/#/) in order to enforce a consistent commit
message format. Please use the following format in your commit messages:

```
type: subject
```

Where `type` is one of the following:
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:` or `chore:`

The subject should then be a short description of your changes. The full commit message could then
for example look like:

- ```feat: add language support for Swahili```
- ```fix: add library perfect-scrollbar to prevent layout shifts```
- ```fix: spacing problem in AppHeader component```
- ```chore: update vue-tsc dependency```