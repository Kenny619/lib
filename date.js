const Holiday = require("date-holidays");
const tz = require("countries-and-timezones");
const { DateTime } = require("luxon");

class DateLib {
  constructor(dateStr, locale = "JP") {
    // Parse the date string in the format 'yyyy-mm-dd'
    const [year, month, day] = dateStr.split("-").map(Number);
    this.date = new Date(year, month - 1, day); // Subtract 1 from the month since months are 0-based in JavaScript
    this.locale = locale;
    this.hd = new Holiday(this.locale);
    this.tz = tz.getTimezonesForCountry(locale.toUpperCase());
  }

  getDateInfo() {
    const dateString = this.date.toISOString().slice(0, 10); // Format as "yyyy-mm-dd"
    const dayOfWeek = this.date.getDay(); // 0 (Sunday) - 6 (Saturday)
    const weekOfMonth = Math.ceil((this.date.getDate() + (dayOfWeek + 1 - (this.date.getDate() % 7))) / 7);
    const dayOfYear = Math.floor((this.date - new Date(this.date.getFullYear(), 0, 0)) / 86400000);
    const weekOfYear = Math.ceil((dayOfYear + dayOfWeek) / 7);
    const columnNumber = dayOfWeek + 1; // Start column numbering from 1
    const rowNumber = Math.ceil((this.date.getDate() + (7 - dayOfWeek)) / 7);
    const isHoliday = this.hd.isHoliday(this.date);

    return {
      date: dateString,
      timeStamp: timeStamp,
      dayOfWeek: dayOfWeek,
      weekOfMonth: weekOfMonth,
      weekOfYear: weekOfYear,
      dayOfYear: dayOfYear,
      rowNumber: rowNumber,
      columnNumber: columnNumber,
      locale: this.locale,
      isHoliday: isHoliday,
      timezone: this.tz,
    };
  }
  calculateDate(years = 0, months = 0, days = 0) {
    this.date.setFullYear(this.date.getFullYear() + years);
    this.date.setMonth(this.date.getMonth() + months);
    this.date.setDate(this.date.getDate() + days);
  }

  addWeeks(weeksToAdd) {
    const currentDayOfWeek = this.date.getDay(); // 0 (Sunday) - 6 (Saturday)
    const daysToAdd = weeksToAdd * 7 - currentDayOfWeek;
    this.calculateDate(0, 0, daysToAdd);
  }

  getDaysDifference() {
    const today = new Date();
    const timeDifference = this.date - today;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    return dayDifference;
  }

  printMonthCalendar() {
    const monthStart = new Date(this.date);
    monthStart.setDate(1);
    const monthEnd = new Date(this.date);
    monthEnd.setMonth(this.date.getMonth() + 1, 0); // Go to the last day of the month

    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const firstDayOfWeek = monthStart.getDay();
    const totalDaysInMonth = (monthEnd - monthStart) / (1000 * 60 * 60 * 24) + 1;

    console.log(dayNames.join("  "));

    for (let i = 0; i < firstDayOfWeek; i++) {
      process.stdout.write("    ");
    }

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const currentDate = new Date(this.date);
      currentDate.setDate(i);

      if (currentDate.getDate() === this.date.getDate()) {
        process.stdout.write(`\x1b[31m${currentDate.getDate().toString().padStart(2)}\x1b[0m`);
      } else {
        process.stdout.write(currentDate.getDate().toString().padStart(2));
      }

      if ((firstDayOfWeek + i) % 7 === 0 || i === totalDaysInMonth) {
        console.log();
      } else {
        process.stdout.write("  ");
      }
    }
  }
}

module.exports = DateLib;
