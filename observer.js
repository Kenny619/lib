const my = require("./myUtil.js");

class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe = (fn) => this.observers.push(fn);

  unsubscribe = (fn) =>
    (this.observers = this.observers.filter((f) => f !== fn));

  notify = (data) => this.observers.forEach((f) => f(data));
}

/** instanciation */
const observer = new Observable();
const round0 = my.round(0);
const ms = 500;

/** async tasks */
function atask(id) {
  const timeout = Math.random() * ms;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        `ID:${(id + "").padStart(3, "0")} resolved after ${round0(timeout)}ms.`
      );
    }, timeout);
  });
}

let atasks = Array(100)
  .fill(0)
  .map((a, i) => {
    return { id: i, fn: atask(a + i) };
  });
//atasks.forEach((obj) => obj.fn.then((msg) => console.log(msg)));

/** logic
 * 0. add ID to all async tasks.
 * 1. Store all async tasks to container array.  All tasks executed.
 * 2. Set resolverId to 0
 * 3. Call .then on atask whose ID equals to resolverId
 * 3-1 print result
 * 3-2 pop async task from the container array
 * 3-3 increment resolverId
 * 3-x go back to 3.
 * 4 when container.length becomes 0, clearInterval.
 * 5.end
 */

const resolver = (resolveId) => {
  if (atasks.length === 0) return false;
  const obj = my.getObject(atasks, "id", resolveId)[0];
  Promise.resolve(obj.fn).then((r) => {
    console.log(r);
    atasks = atasks.filter((entry) => entry !== obj);
    //resolveId++;
    if (atasks.length > 0) resolver(++resolveId);
  });
};

resolver(0);

/**
 *
 * @param {Object} object - Object = {id: Number, fn: atask(n)}
 * @param {Number} previousId - ID from most recent resolved atask
 */
