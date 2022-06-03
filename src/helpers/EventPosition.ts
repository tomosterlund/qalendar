/**
 * The following class contains methods for calculating where to position
 * calendar events within a given day
 * */
export default class EventPosition {
  protected turnMinutesIntoPercentageOfHour(minutes: number): string {
    const oneMinutePercentage = 100 / 60;

    const minutePoints = oneMinutePercentage * minutes;

    if (minutePoints < 10) return "0" + minutePoints;

    return minutePoints.toString();
  }

  /**
   * Every hour between 'dayStart' and 'dayEnd' is 100, in this function referred to as 100 points
   * If an event starts 30 minutes after 'dayStart', it should have 50 pointsIntoDay
   * If a day consists of 4 hours (400 points), we then have to count
   * (50 / 400) * 100 = 12.5 => event starts after 12.5 percent of the day
   *
   * Result is supposed to be a number between 0 and 100, and is used for setting the CSS- top- and height-attributes for events
   * */
  getPercentageOfDayFromDateTimeString(
    dateTimeString: string,
    dayStart: number,
    dayEnd: number
  ) {
    const pointsInDay = dayEnd - dayStart;
    const hour = dateTimeString.substring(11, 13);
    const minutes = dateTimeString.substring(14, 16);
    const minutesPoints = this.turnMinutesIntoPercentageOfHour(+minutes);
    const eventPoints = +(hour + minutesPoints);
    const eventPointsIntoDay = eventPoints - dayStart;

    return (eventPointsIntoDay / pointsInDay) * 100;
  }
}
