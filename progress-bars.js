const rl = require("readline");
const my = require("./myUtil.js");
round0 = my.round(0);

const std = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Array container class
 */
class Container {
  constructor() {
    this.array = [];
  }

  update = (obj) => {
    if (!obj.hasOwnProperty("id")) throw new Error("ID missing.");
    let updated = false;
    this.array.forEach((entry, index) => {
      if (entry.id === obj.id) {
        this.array[index] = obj;
        updated = true;
      }
    });
    if (updated === false) this.array.push(obj);
  };

  get = (id) => {
    if (this.array.length === 0) return false;
    return this.array.filter((entry) => entry.id === id)[0];
  };

  getAll = () => {
    return this.array;
  };

  length = () => {
    return this.array.length;
  };

  reset = () => {
    if (this.array.length !== 0) this.array = [];
  };

  delete = (id) => {
    if (typeof id !== "number") throw new Error("ID must be a Number.");
    this.array.forEach((entry, index) => {
      if (entry.id === id) this.array.splice(index, 1);
    });
  };

  isEmpty = () => {
    return this.array.length === 0 ? true : false;
  };

  show = () => console.log(this.array);

  showJson = () => console.log(JSON.stringify(this.array));
}

const array = Object.freeze(new Container());

class Progressbars {
  constructor(name, start, end, comment = "") {
    this.id = array.getAll().length;
    this.name = name;
    this.start = start;
    this.end = end;
    this.now = this.start;
    this.comment = comment;
    this.percentage = 0;
    this.bar;
    this.completed = false; //true when all instances reach 100%
    this.updateArray();
    this.render();
  }

  isCompleted = () => {
    return array.getAll().every((entry) => entry.percentage === 100);
  };

  updateArray = () => {
    this.getPercenetage();
    this.getBar();
    const obj = {
      id: this.id,
      name: this.name,
      start: this.start,
      end: this.end,
      now: this.now,
      percentage: this.percentage,
      bar: this.bar,
      comment: this.comment,
    };
    array.update(obj);
  };

  increment = (value, comment = "") => {
    this.now += value;
    this.comment = comment;
    this.updateArray();
    this.render();

    if (this.isCompleted()) {
      // (array.every((entry) => entry.percentage === 100)) {
      std.write("\x1B[?25h"); //unhide
      std.close();
    }
  };

  /**
   * Display a string in bold.
   * @param {String} string - input string
   * @returns {String} sring wrapped in a bold ANSI code.
   */

  bold = (string) => {
    return `\u001b[1m${string}\x1b[0m`;
  };

  /**
   * Adds Color to a string.
   * @param {String} string
   * @param {Number} ANSIcolorNumber
   * @returns {String} - string wrapped in ANSI code.
   * ** PickAColorAnyColor -> https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
   */
  color = (string, ANSIcolorNumber) => {
    return `\x1b[38;5;${ANSIcolorNumber}m${string}\x1b[0m`;
  };

  render = () => {
    const bars = array.getAll();
    /** get terminal width */
    const width = process.stdout.columns || 50;
    /**
     * 15 percentage + fraction
     * 20 bar
     * 15 name
     */

    /** adjust name position */
    const nameColumnWidth = Math.max(...bars.map((o) => o.name.length));
    const taskColumnWidth = Math.max(...bars.map((o) => String(o.end).length));

    /** move cursor back to the beginning of printed lines and clear everything below */
    if (bars.length > 1) {
      rl.moveCursor(std, 0, 0 - bars.length - 1);
    }

    std.write("\n");
    let output = "";
    for (let entry of bars) {
      output += `${entry.name.padStart(nameColumnWidth, " ")}:\x1b[38;5;156m${
        entry.bar
      }\x1b[0m ${String(entry.percentage).padStart(3, " ")}% (${String(
        entry.now
      ).padStart(taskColumnWidth, " ")}/${String(entry.end).padStart(
        taskColumnWidth,
        " "
      )}) ${entry.comment}\n`;
    }
    std.write("\x1B[?25l"); //hide cursor
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
  delete = () => array.delete(this.id);
}

module.exports = Progressbars;
