# Developing
## Getting up and running
* `npm i`
* `npm run seed` - Seed the current calendar month with events, or use the [advanced seeding options](#seeding). 
* `npm run dev`

## Running tests
While developing, please run `vitest watch`, in order to monitor that all tests are passing.

Since Qalendar is making heavy use of the native JavaScript Date-Object, which has the possibility to create difference output in different time zones, please also run `npm run test:docker` before pushing. This will spin up 3 docker containers, in 3 different time zones, and then run all tests.

## Seeding

For seeding several months or even a year, you can use the following CLI: `node src/development/faker/seed.js`. Two arguments are available:

1. `--months`

For example:
```
node src/development/faker/seed.js --months="2022.01 2022.02 2022.03"
```
will yield events in the first three months of 2022.

2. `--year` 

For example:
```
node src/development/faker/seed.js --year=2022
```
will yield events in all months of 2022.

Please note that all previously seeded events are deleted upon running the CLI.