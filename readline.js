const rl = require("readline");

const width = process.stdout.columns || defaultColumns;
//console.log(width);

const std = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});
std.write("line1:\n");
std.write("line2:\n");
std.write("line3:\n");
setTimeout(() => {
  rl.moveCursor(process.stdout, 0, -3);
  //rl.clearLine(process.stdout, 0);
  rl.clearScreenDown();
  std.write("line1:new!\n");
  std.write("line2:new!\n");
  std.write("line3:new!\n");
  std.close();
}, 1000);
// rl.moveCursor(process.stdout, 0, -4);
// rl.clearLine(process.stdout, 0);
