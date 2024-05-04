import * as dir from "../dist/files/index.js";

const srcDir = "C:\\dev\\sandbox\\files\\10files";
const dstDir = "C:\\dev\\sandbox\\files\\10files_flatten";

dir.flatten(srcDir, dstDir, "-");
