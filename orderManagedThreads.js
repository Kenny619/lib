const my = require("./myUtil.js");
const round0 = my.round(0);

class ThreadContainer {
  constructor() {
    this.array = [];
  }

  update = (obj) => {
    if (!obj.hasOwnProperty("id")) throw new Error("ID missing.");
    let updated = false;
    this.array.forEach((entry, index) => {
      if (entry.id === obj.id) {
        this.array[index] = obj;
        updated = true;
      }
    });
    if (updated === false) this.array.push(obj);
  };

  get = (id) => {
    if (this.array.length === 0) return false;
    return this.array.filter((entry) => entry.id === id)[0];
  };

  getAll = () => {
    return this.array;
  };

  length = () => {
    return this.array.length;
  };

  reset = () => {
    if (this.array.length !== 0) this.array = [];
  };

  delete = (id) => {
    if (typeof id !== "number") throw new Error("ID must be a Number.");
    this.array.forEach((entry, index) => {
      if (entry.id === id) this.array.splice(index, 1);
    });
  };

  isEmpty = () => {
    return this.array.length === 0 ? true : false;
  };

  show = () => console.log(this.array);

  showJson = () => console.log(JSON.stringify(this.array));
}

const array = Object.freeze(new ThreadContainer());

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
    this.NumOfTasks = params.length;

    /** Serialize parameter array by adding id */
    this.params = params.map((entry, index) => {
      entry.id = index;
      return entry;
    });

    /** Completed task id tracker  */
    this.tasksCompleted = 0;

    /** Initialize thread.  Promises up to max number of thread starts working from here */
    for (let n = 0; n < this.maxThreads; n++) {
      if (this.isAvailable()) {
        /** store promises in an obj = {id: this.getParam.id, fn:fn1(this.getParam)} */
        this.createTask();
      }
    }

    //array.show();
  }

  isAvailable = () => {
    return this.params.length > 0 ? true : false;
  };

  getParam = () => {
    return this.isAvailable() ? this.params.shift() : false;
  };

  createTask = () => {
    const param = this.getParam();
    const obj = { id: param.id, fn: this.fn1(param), param: param };
    array.update(obj);
  };

  run = () => {
    if (this.tasksCompleted === this.NumOfTasks) {
      console.log("Completed all tasks.");
      return false;
    }
    /** resursion */
    const prms = array.get(this.tasksCompleted);
    Promise.resolve(prms.fn)
      .then((res) => {
        this.fn2(res)
          .then((msg) => {
            console.log(msg);
            this.tasksCompleted++;
            this.createTask();
            this.run();
          })
          .catch((err) => fn2FialedAction(err));
      })
      .catch((err) => fn1FailedAction(err));
  };
}

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
      resolve(obj);
    }, timeout);
  });
}

function save(obj) {
  const timeout = Math.random() * ms;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
    };
  });

const ms = 500;

const threads = new Threads(4, params, createPost, save);
threads.run();

//module.exports = Threads();
