//const my = require("./myUtil.js");
const Progressbar = require("./progress-bar.js");
//const pb = new Progressbar("progress", 0, 10);

const pb = new Progressbar();

const pb1 = pb.create("seriesA", 0, 10);
pb1.increment(1);
