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

    this.UTCdatetime = new Date([this.date, this.time].join("T"));
    this.generateLocalDatetime();
  }

  generateLocalDatetime = () => {
    this.localDate = this.UTCdatetime.toLocaleDateString();
    this.localTime = this.UTCdatetime.toLocaleTimeString();
    [this.localYear, this.localMonth, this.localDay] =
      this.localDate.split("/");
    [this.localHH, this.localMM, this.localSS] = this.localTime.split(":");

    this.localDatetimeString =
      [
        this.localYear,
        this.localMonth.padStart(2, "0"),
        this.localDay.padStart(2, "0"),
      ].join("-") +
      "T" +
      [this.localHH.padStart(2, "0"), this.localMM.padStart(2, "0")].join(":");
    this.localDatetime = new Date(this.localDatetimeString);
  };

  getDatetime = () => {
    return this.UTCdatetime;
  };

  getLocalDatetime = () => {
    return this.localDatetimeString;
  };

  getLocalYearMonthString = () => {
    return this.localYear + this.localMonth.padStart(2, "0");
  };

  getCalendarPosition = () => {
    const thisMonth = new Date(this.localYear, this.localMonth - 1, 1);
    const numCol = this.localDatetime.getDay() + 1;
    const numRow =
      Math.floor((thisMonth.getDay() + this.localDatetime.getDate() - 1) / 7) +
      1;
    return { Numrow: numRow, Numcol: numCol };
  };

  getAmPm = () => {
    return this.localHH >= 0 && this.localHH < 12 ? "am" : "pm";
  };

  adjustMinutes = () => {
    if (this.getLocalMinutes % 5 !== 0) {
      const diffMinutes =
        Math.ceil(this.getLocalMinutes() / 5) * 5 - this.getLocalMinutes();
      this.UTCdatetime = new Date(
        this.UTCdatetime.getTime() + diffMinutes * 60 * 1000
      );
      this.generateLocalDatetime();
    }
  };

  getDatePickerYearMonth = (calendarYearMonth) => {
    calendarYYYYMM = calendarYearMonth.replace(/月/, "").split("年");
    calendarYYYYMM[1] = String(DatePickerYearMonth[1]).padStart(2, "0");
    return calendarYYYYMM.join("");
  };

  getUTCHour = () => {
    return this.UTCHH;
  };

  getLocalMinutes = () => {
    return this.localMM;
  };

  getLocalHour = () => {
    return this.localHH;
  };

  getLocalMinutes = () => {
    return this.localMM;
  };

  getLocalTime = () => {
    return this.localHH + ":" + this.localMM;
  };

  setTimeToXminLater = (x) => {
    this.UTCdatetime = new Date(Date.now() + x * 60 * 1000);
    this.generateLocalDatetime();
  };

  isSchedulable = () => {
    const nowDatetime = new Date();
    // Check if the time difference is greater than 15 minutes (900,000 milliseconds)
    return this.UTCdatetime.getTime() > nowDatetime.getTime() + 15 * 60 * 1000;
  };
}

module.exports = FantaDT;
