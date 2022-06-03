/**
 * A little helper class (Extended-Date), for allowing destructuring of a date
 * */
class EDate extends Date {
  get fullYear() {
    return this.getFullYear();
  }

  get month() {
    return this.getMonth();
  }

  get date() {
    return this.getDate();
  }
}

export default EDate;
