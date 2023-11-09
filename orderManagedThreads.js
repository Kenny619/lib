const my = require("./myUtil.js");

/** instanciation */
const round0 = my.round(0);
const ms = 100;
const numberOfTasks = 100;
let resolveId = 0;
let msTTL = 0;
let atasks = Array(numberOfTasks)
  .fill(0)
  .map((a, i) => {
    return { id: i, fn: createPost(a + i) };
  });
//console.time("post");
//orderedAsyncPost();
syncPost();

/**logic
 *
 * control the number of active thread using an array
 * when task is done, notify the array and pop the completed task.
 * push a new task if there are uncompleted task
 */

class Threads {
  constructor(maxThreads, params, fn1, fn2) {
    /** Max number of tasks running simultaneously */
    this.maxThreads = maxThreads;
    this.fn1 = fn1;
    this.fn2 = fn2;

    /** Serialize parameter array by adding id */
    this.paramsObj = params.map((entry, index) => {
      return { id: index, params: entry };
    });

    /** Completed task id tracker  */
    this.tasksCompleted = 0;
  }

  isAvailable = () => {
    return this.params.length > 0 ? true : false;
  };

  getParam = () => {
    return this.isAvailable() ? this.params.shift() : false;
  };

  initialize = () => {
    for (n = 0; n < this.maxThreads; n++) {
      if (this.isAvailable()) this.fn1(this.getParam());
    }
  };

  run = () => {
    if (this.tasksCompleted === param.id) {
      Promise.resolve(this.fn1(param)) // <===🔧 this needs to be unique fn and identifiable by id.
        .then(res1 => {
          this.fn2(param, res1)
            .then(msg => {
              postfn2Action(msg);
              this.tasksCompleted++;
            })
            .catch(err => fn2FialedAction(err));
        })
        .catch(err => fn1FailedAction(err));
    }
  };
}

/** thread management */
const paramGenerator = paramGenConstructor(uploadObjs);
thread(4, uploader, paramGenerator, recur);

function paramGenConstructor(passedObj) {
  if (passedObj.length === 0) return false;
  let obj = passedObj;

  return () => {
    if (obj.length === 0) return false;
    return obj.shift();
  };
}
function thread(maxThreads, uploader, paramGen, recursion) {
  for (n = 0; n < maxThreads; n++) {
    recursion(uploader, paramGen);
  }
}

function recur(fn, paramGen) {
  const param = paramGen();
  if (!param) return false; //end recursion

  fn(param).then(r => {
    console.log(r);
    recur(fn, paramGen);
  });
}

/** async tasks */
function atask(id) {
  const timeout = ms;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`ID:${(id + "").padStart(3, "0")} resolved after ${round0(timeout)}ms.`);
    }, timeout);
  });
}

function createPost(id) {
  const timeout = ms; //Math.random() * ms;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: id, time: timeout, msg: `${(id + "").padStart(3, "0")}#1: ${String(round0(timeout)).padStart(3, "0")}ms => ` });
    }, timeout);
  });
}

function save(id, obj) {
  const timeout = ms; //Math.random() * ms;
  const resultObj = obj;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let msSum = resultObj.time + timeout;
      resolve(resultObj.msg + `${(id + "").padStart(3, "0")}:#2 ${String(round0(timeout)).padStart(3, "0")}ms => TTL:${String(round0(msSum)).padStart(3, "0")}ms`);
      msTTL += msSum;
    }, timeout);
  });
}

function orderedAsyncPost() {
  if (resolveId === numberOfTasks) {
    console.log(`\r\nTTL ${Number(round0(msTTL)).toLocaleString()}ms`);
    console.log(`average time(ms)/task = ${Number(round0(msTTL / numberOfTasks))}ms.`);
    console.timeEnd("post");

    return false;
  }

  /** recursion */
  const curObj = atasks.filter(obj => obj.id === resolveId)[0];
  Promise.resolve(curObj.fn).then(res => {
    save(curObj.id, res).then(msg => {
      // console.log(msg);
      resolveId++;
      orderedAsyncPost();
    });
  });
}

/** notes 
async function syncPost() {
  console.time("syncpost");
  while (resolveId !== numberOfTasks) {
    const obj = await createPost(resolveId);
    const msg = await save(resolveId, obj);
    //  console.log(msg);
    resolveId++;
  }
  console.log(`\r\nTTL ${Number(round0(msTTL)).toLocaleString()}ms`);
  console.log(`average time(ms)/task = ${Number(round0(msTTL / numberOfTasks))}ms.`);
  console.timeEnd("syncpost");
}

const resolver = resolveId => {
  if (atasks.length === 0) return false;
  const obj = my.getObject(atasks, "id", resolveId)[0];
  Promise.resolve(obj.fn).then(r => {
    console.log(r);
    atasks = atasks.filter(entry => entry !== obj);
    //resolveId++;
    if (atasks.length > 0) resolver(++resolveId);
  });
};

//resolver(0);
*/
