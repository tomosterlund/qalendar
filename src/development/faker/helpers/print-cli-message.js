const getDateForCLIOutput = require('./get-date-for-cli-output');

const printCliMessage = monthsToSeed => {
	const successMessage = 'Wrote calendar events to src/development/data/seeded-events.ts'
	console.log('\n')
	console.log('\x1b[42m%s\x1b[0m', 'Seeding was successful!')
	console.log(successMessage)
	console.log('\n')

	if (monthsToSeed && monthsToSeed.length) {
		console.log('Seeded the following months:')

		for (const month of monthsToSeed) {
			console.log(getDateForCLIOutput(month))
		}
	} else {
		console.log('Seeded the current month')
	}

	console.log('\n')
}

module.exports = printCliMessage