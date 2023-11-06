/**
 * Checks if the given datetime is beyond 15 minutes from the current local time.
 *
 * @param {string} datetimeStr - The datetime string in "yyyy-mm-ddTHH:MM" format to compare.
 * @returns {boolean} `true` if the given datetime is beyond 15 minutes from the current local time, `false` otherwise.
 */

class FantaDT {
  constructor(date, time) {
    this.date = date;
    this.time = time;

    this.datetime = new Date([this.date, this.time].join("T"));
    this.generateLocalDatetime();
  }

  generateLocalDatetime = () => {
    this.dateLocal = this.datetime.toLocaleDateString();
    this.timeLocal = this.datetime.toLocaleTimeString();
    [this.yearLocal, this.monthLocal, this.dayLocal] = this.dateLocal.split("/");
    [this.hhLocal, this.mmLocal, this.ssLocal] = this.timeLocal.split(":");
    [this.yearLocal, this.monthLocal, this.dayLocal] = this.dateLocal.split("/");
    [this.hhLocal, this.mmLocal, this.ssLocal] = this.timeLocal.split(":");
  };

  getDatetime = () => {
    return this.datetime;
  };

  getDatetimeLocal = () => {
    return [this.yearLocal, this.monthLocal, this.dayLocal].join("-") + "T" + [this.hhLocal, this.mmLocal].join(":");
  };

  getYYYYMMstring = () => {
    return this.yearLocal + this.monthLocal.padStart(2, "0");
  };

  getCalendarPosition = () => {
    const dpicker = new Date(this.yearLocal, this.monthLocal - 1, 1);
    const numCol = this.datetime.getDay() + 1; //🐛 === this needs to be in local date;
    const numRow = Math.floor((publishDT.getDate() + this.datetime.getDay() - 1) / 7) + 1;
    return { Numrow: numRow, Numcol: numCol };
  };

  getAmPm = () => {
    return this.hhLocal >= 0 && this.hhLocal < 12 ? "am" : "pm";
  };

  adjustMinutes = () => {
    console.log(this.datetime, this.datetime.getMinutes());
    if (this.datetime.getMinutes() % 5 !== 0) {
      const newMM = Math.ceil(this.datetime.getMinutes() / 5) * 5;
      this.datetime = new Date(`${this.date}T${this.datetime.getHours()}:${newMM}`);
      this.generateLocalDatetime();
    }
  };

  getDatePickerYearMonth = calendarYearMonth => {
    calendarYYYYMM = calendarYearMonth.replace(/月/, "").split("年");
    calendarYYYYMM[1] = String(DatePickerYearMonth[1]).padStart(2, "0");
    return calendarYYYYMM.join("");
  };

  getHour = () => {
    return this.hhLocal;
  };

  getMinutes = () => {
    return this.mmLocal;
  };

  delayPostingByXmin = x => {
    this.datetime = new Date(this.datetime.getTime() + x * 60000);
    this.generateLocalDatetime();
  };

  isSchedulable = datetimeStr => {
    const givenDate = new Date(datetimeStr);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = givenDate - currentDate;

    // Check if the time difference is greater than 15 minutes (900,000 milliseconds)
    return timeDifference > 900000;
  };
}

module.exports = FantaDT;
