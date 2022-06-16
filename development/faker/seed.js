const fileSystem = require("fs");
const getCommandArguments = require("./helpers/get-command-arguments");
const printCliMessage = require("./helpers/print-cli-message");
const createEvents = require("./helpers/create-events");

const writeEventsToFile = () => {
  const events = [];
  const commandArguments = getCommandArguments();
  const monthsToSeed = commandArguments.months ? commandArguments.months : [];

  // Handling --months argument
  if (monthsToSeed.length) {
    for (const monthToSeed of monthsToSeed) {
      events.push(...createEvents(monthToSeed));
    }
  }

  // Handling --year argument
  if (commandArguments.year) {
    const twoDigitMonths = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    for (const mm of twoDigitMonths) {
      events.push(...createEvents(`${commandArguments.year}.${mm}`));
    }
  }

  // Handling a run of the script with no arguments (seed current month)
  if (!monthsToSeed.length && !commandArguments.year)
    events.push(...createEvents());

  const payload = new Uint8Array(
    Buffer.from(`export const seededEvents = ${JSON.stringify(events)}`)
  );

  fileSystem.writeFile(
    "./development/data/seeded-events.ts",
    payload,
    (err) => {
      if (err) console.error(err);
      else {
        printCliMessage(monthsToSeed, commandArguments.year || null);
      }
    }
  );
};

writeEventsToFile();
