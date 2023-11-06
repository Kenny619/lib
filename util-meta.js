const fs = require("fs");
let instance;

class Utilities {
  constructor() {}
  insteance = this;

  throwNewErr = (err) => {
    throw new Error(err);
  };

  return = (val) => {
    return val;
  };

  searchObj = (obj) => {
    Object.entries(obj).forEach((o) => {});
  };

  reset = () => (this.messageAry = []);
  print = () => this.messageAry.forEach((msg) => console.log(msg));
}

const My = Object.freeze(new Utilities());

module.exports = My;
