const my = require("./myUtil.js");
round0 = my.round(0);

process.stdout.write("\x1b[?25l");
process.on("exit", () => process.stdout.write("\x1b[?25h"));
class Progressbar {
  progressBarId = 0;

  constructor() {
    this.bars = [];
    this.name;
    this.start;
    this.now;
    this.end;
    this.percentage = 0;
    this.bar = "";
    this.comment = "";
  }

  getId = () => {
    return this.progressBarId;
  };

  getPercenetage = () =>
    (this.percentage = round0((this.now / this.end) * 100));

  getBar = () => {
    this.bar = Array(round0(this.percentage / 5))
      .fill("━")
      .concat(Array(round0(20 - this.percentage / 5)).fill(" "))
      .join("");
  };

  render = () => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `\x1b[2K${this.name.padStart(20, " ")}: \x1b[92m${
        this.bar
      }\x1b[0m ${String(this.getPercenetage()).padStart(3, " ")}% (${
        this.now
      }/${this.end})${this.comment}`
    );
  };

  create = (name, start, end) => {
    this.name = name;
    this.start = start;
    this.end = end;
    this.now = this.start;
    this.getPercenetage();
    this.getBar();
    this.render();
    progressBarId++;
  };

  increment = (value, comment = "") => {
    this.now += value;
    this.getPercenetage();
    this.getBar();
    this.comment = " - " + comment;
    this.render();
    if (this.getPercenetage === 100) process.exit(0);
  };

  pause = () => {};
  delete = () => process.stdout.write("\x1b[2K");
}

const pb = new Progressbar("series A for all", 0, 10);
const pb2 = new Progressbar("series B", 0, 10);
pb1.forward(0);
pb2.forward(0);
setTimeout(() => {
  pb1.forward(1);
}, 1000);
setTimeout(() => {
  pb1.forward(1);
}, 1500);
setTimeout(() => {
  pb1.forward(1);
}, 2000);
setTimeout(() => {
  pb1.forward(4);
}, 2500);
setTimeout(() => {
  pb1.forward(2);
}, 3000);
setTimeout(() => {
  pb1.forward(1);
}, 3500);

setTimeout(() => {
  pb2.forward(2);
}, 1000);
setTimeout(() => {
  pb2.forward(2);
}, 1200);
setTimeout(() => {
  pb2.forward(2);
}, 1400);
setTimeout(() => {
  pb2.forward(2);
}, 1600);
setTimeout(() => {
  pb2.forward(2);
}, 3000);

module.exports = Progressbar;
