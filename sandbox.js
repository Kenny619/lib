const Progressbars = require("./progress-bars.js");
const Threads = require("./orderManagedThreads.js");
const my = require("./myUtil.js");
const round0 = my.round(0);

function createPost(param) {
  const timeout = Math.random() * ms;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const obj = {
        param: param,
        msg: `${param.name}#${param.id} resolved after ${round0(
          timeout
        )}ms => `,
      };
      param.pb.increment(1, "first step done");
      resolve(obj);
    }, timeout);
  });
}

function save(obj) {
  const timeout = Math.random() * ms;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      obj.param.pb.increment(1, "complete");

      resolve(
        `${obj.msg}${obj.param.name}#${obj.param.id} resolved after ${round0(
          timeout
        )}ms! `
      );
    }, timeout);
  });
}

/** test code */
let params = Array(24)
  .fill(0)
  .map((entry, index) => {
    return {
      name: `ary${index}`,
      vol: index,
      pb: new Progressbars(`ary${index}`, 0, 2),
    };
  });

const ms = 500;

const threads = new Threads(4, params, createPost, save);
threads.run();
