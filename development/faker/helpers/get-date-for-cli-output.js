const { CLI_MONTH_ARG_PATTERN } = require("../faker-config");

/**
 * monthArg is expected to carry the format YYYY.MM
 * */
const getDateForCliOutput = (monthArg = null) => {
  if (CLI_MONTH_ARG_PATTERN.test(monthArg)) {
    return new Date(
      monthArg.substring(0, 4),
      +monthArg.substring(5, 7) - 1
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  }

  return "Current month";
};

module.exports = getDateForCliOutput;
