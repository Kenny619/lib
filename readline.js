const rl = require("readline");

const obj = [{ name: "123" }, { name: "123456" }];
const width = Math.max(...obj.map(o => o.name.length));
console.log(width);
return false;

//const width = process.stdout.columns || defaultColumns;
//console.log(width);

const std = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});
std.write("line1:\n");
std.write("line2:\n");
std.write("line3:\n");
rl.moveCursor(std, 0, -2);

//move the cursor back to the beginning of the output
setTimeout(() => {
  //std.write("\033[F\r");
  //rl.moveCursor(std, 0, -2);
  std.write("line2:new!");
  std.close();
}, 1000);

// setTimeout(() => {
//   rl.moveCursor(process.stdout, 0, -3);
//   //rl.clearLine(process.stdout, 0);
//   rl.clearScreenDown();
//   std.write("line1:new!\n");
//   std.write("line2:new!\n");
//   std.write("line3:new!\n");
//   std.close();
// }, 1000);
// rl.moveCursor(process.stdout, 0, -4);
// rl.clearLine(process.stdout, 0);
