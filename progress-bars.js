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

  updateArray = id => {
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

    if (array.every(entry => entry.percentage === 100)) {
      std.close();
    }
  };

  render = () => {
    /** get terminal width */
    const width = process.stdout.columns || 50;
    /**
     * 15 percentage + fraction
     * 20 bar
     * 15 name
     */

    /** adjust name position */
    const nameColumnWidth = Math.max(...array.map(o => o.name.length));
    const taskColumnWidth = Math.max(...array.map(o => String(o.end).length));

    /** move cursor back to the beginning of printed lines and clear everything below */
    if (array.length > 1) rl.moveCursor(std, 0, 0 - array.length);
    rl.clearScreenDown();

    let output = "";
    for (let entry of array) {
      output += `${entry.name.padStart(nameColumnWidth, " ")}:\x1b[38;5;156m${entry.bar}\x1b[0m ${String(entry.percentage).padStart(3, " ")}% (${String(entry.now).padStart(taskColumnWidth, " ")}/${String(entry.end).padStart(taskColumnWidth, " ")})${entry.comment}\n`;
    }
    std.write(output);
  };

  getPercenetage = () => (this.percentage = round0((this.now / this.end) * 100));

  getBar = () => {
    this.bar = Array(round0(this.percentage / 5))
      .fill("━")
      .concat(Array(round0(20 - this.percentage / 5)).fill(" "))
      .join("");
  };

  pause = () => {};
  delete = () => array.splice(this.id, 1);
}

const bar1 = new Progressbars("123", 0, 10);
const bar2 = new Progressbars("123456", 0, 20);

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
