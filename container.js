class Container {
  constructor() {
    this.array = [];
  }

  add = (obj) => {
    if (!obj.hasOwnProperty("id")) throw new Error("ID missing.");
    if (this.array.filter((entry) => entry.id === obj.id)[0])
      throw new Error("Duplicate ID");
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

const array = Object.freeze(new Container());

class Pb {
  constructor(obj) {
    this.obj = obj;
    array.add(obj);
  }

  add = (obj) => array.add(obj);

  show = () => array.show();
}

const p1 = { id: 1, p: { t: 1, s: 10 } };
const p2 = { id: 2, p: { t: 2, s: 20 } };
const p3 = { id: 3, p: { t: 3, s: 30 } };

const P1 = new Pb(p1);
const P3 = new Container();
P3.add(p3);
const P2 = new Pb(p2);

P1.show();
