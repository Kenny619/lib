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
