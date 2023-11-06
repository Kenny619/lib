let instance;

class Warning {
  constructor() {
    if (instance) throw new Error(`'Warning' instance already exists.`);
    this.messageAry = [];
  }

  insteance = this;

  add = (newWarning) => this.messageAry.push(newWarning);
  reset = () => (this.messageAry = []);
  print = () => this.messageAry.forEach((msg) => console.log(msg));
}

const warningPot = Object.freeze(new Warning());

module.exports = warningPot;
