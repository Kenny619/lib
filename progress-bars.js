const rl = require("readline");
const my = require("./myUtil.js");
round0 = my.round(0);

const std = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});
/**
 * private properties
 */
array = [];

/**
 * Use SuperClass and subclass to manage barz and each instances?
 * Manage each instance = object by incremental serial number
 * Call create to generate new objects
 * All objects are contained in this.barz
 * Whenever
 */
class Progressbars {
  constructor(name, start, end, comment = "") {
    this.id = array.length;
    this.name = name;
    this.start = start;
    this.end = end;
    this.now = this.start;
    this.comment = comment;
    this.percentage = 0;
    this.bar;
    this.updateArray(this.id);
    this.render();
  }

  updateArray = (id) => {
    this.getPercenetage();
    this.getBar();
    const obj = {
      id: array.length,
      name: this.name,
      start: this.start,
      end: this.end,
      now: this.now,
      percentage: this.percentage,
      bar: this.bar,
      comment: this.comment,
    };
    array[id] = obj;
  };

  increment = (value, comment = "") => {
    this.now += value;
    this.comment = comment;
    this.updateArray(this.id);
    this.render();

    if (array.every((entry) => entry.percentage === 100)) {
      std.close();
    }
  };

  render = () => {
    let output = "";

    for (let entry of array) {
      output += `\x1b[2K${entry.name.padStart(20, " ")}: \x1b[92m${
        entry.bar
      }\x1b[0m ${String(entry.percentage).padStart(3, " ")}% (${entry.now}/${
        entry.end
      })${entry.comment}\n`;
    }
    std.write(output);
  };

  getPercenetage = () =>
    (this.percentage = round0((this.now / this.end) * 100));

  getBar = () => {
    this.bar = Array(round0(this.percentage / 5))
      .fill("━")
      .concat(Array(round0(20 - this.percentage / 5)).fill(" "))
      .join("");
  };

  pause = () => {};
  delete = () => array.splice(this.id, 1);
}

const bar1 = new Progressbars("series A", 0, 10);
const bar2 = new Progressbars("series B", 0, 20);

setTimeout(() => bar1.increment(1), 300);
setTimeout(() => bar1.increment(2), 600);
setTimeout(() => bar1.increment(3), 900);
setTimeout(() => bar1.increment(2), 1200);
setTimeout(() => bar1.increment(2), 1500);

setTimeout(() => bar2.increment(3), 200);
setTimeout(() => bar2.increment(7), 400);
setTimeout(() => bar2.increment(3), 800);
setTimeout(() => bar2.increment(3), 1000);
setTimeout(() => bar2.increment(4), 1200);

module.exports = Progressbars;
