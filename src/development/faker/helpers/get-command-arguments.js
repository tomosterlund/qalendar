const getCommandArguments = () => {
	const argumentsEnteredByUser = process.argv
	const argumentsToReturn = {}

	for (const arg of argumentsEnteredByUser) {
		// Add a months' argument, as a list, such as: 2022.01&2022.02&2022.03
		// For January, February and March 2022
		if (arg.includes('--months=')) {
			console.log(arg)
			argumentsToReturn.months = arg.split('=')[1].split(' ')
		}
	}

	return argumentsToReturn
}

module.exports = getCommandArguments