const datetime = require("./datetime");
const warningPot = require("./warningPot.js");
const P = (arg) => console.log(arg);
let obj = {
  name: "test 01",
  seriesName: "test",
  volume: 1,
  dirPath: "C:\\dev\\tmp\\test 01",
  imgFiles: ["icons310px.png"],
  config: {
    date: "2023-11-07",
    time: "06:02",
  },
};

const fdt = new datetime(obj.config.date, obj.config.time);

const handler = {
  get: (obj, prop) => {
    if (!fdt.isSchedulable(obj[prop])) {
      fdt.setTimeToXminLater(10);
      fdt.adjustMinutes();
      P(`Post time updated.  The new post time is ${fdt.getLocalTime()}`);
      //Reflect.set(obj, prop, fdt.getLocalTime());
    }
  },
};

if (!fdt.isSchedulable()) {
  fdt.setTimeToXminLater(10);
  fdt.adjustMinutes();
  const { date, time } = obj.config;
  obj.originalconfig = { date, time };
  //   obj.config.date = fdt.getLocalDatetime();
  obj.config.time = fdt.getLocalTime();
  //  P(`Post time updated.  The new post time is ${fdt.getLocalTime()}`);
  P(obj);
  //Reflect.set(obj, prop, fdt.getLocalTime());
}

/*
P(fdt.isSchedulable()) || fdt.setTimeToXminLater(5);
fdt.adjustMinutes();

P(fdt.getDatetime());
P(fdt.getLocalDatetime());
P(fdt.getLocalYearMonthString());
P(fdt.getAmPm());
P(fdt.getCalendarPosition());
*/
