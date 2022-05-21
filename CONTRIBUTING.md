# Developing
## Getting up and running
* `npm i`
* `node src/development/faker/seed-month.js` - seed the current calendar month with events
* `npm run dev`

## Running tests
While developing, please run `vitest watch`, in order to monitor that all tests are passing.

Since Qalendar is making heavy use of the native JavaScript Date-Object, which has the possibility to create difference output in different time zones, please also run `npm run test:docker` before committing. This will spin up 3 docker containers, in 3 different time zones, and then run all tests.