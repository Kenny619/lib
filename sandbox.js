const moveFiles = require("../lib/file.js");
const my = require("./myUtil.js");

const roundTo2 = my.round(2);
console.log(roundTo2(1.005));

const string = "test 02";
const regex = RegExp(/^(.*?) (\d{1,3})$/);
const [name, vol] = string.match(regex) && [RegExp.$1, parseInt(RegExp.$2)];
console.log(name, vol);

const testAry = [
  {
    head: {
      h1: 1,
      h2: 2,
      h3: 3,
    },
    body: {
      title: 1,
      h1: 1,
      h2: 2,
      p: {
        title: "p1",
        body: "p2",
      },
    },
    footer: {
      title: 1,
      container: [
        {
          h1: 1,
          h2: 2,
          ul: [{ l1: 1 }, { l2: 2 }, { l3: 3 }],
        },
      ],
    },
  },
];

const testObj = {
  first: {
    head: 1,
    body: {
      second: {
        third: {
          core: 1,
        },
        footer: "second",
      },
      footer: "first",
    },
    meta: [
      {
        first: "meta1-1",
        second: "meta1-2",
      },
      { first: "meta2-1", second: "meta2-2" },
    ],
  },
};

const searchObjAll = obj => {
  Object.entries(obj).forEach(o => {});
};

console.log(my.pluck(testAry, "h1"));
