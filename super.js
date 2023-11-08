let array = [];

class single {
  constructor(val) {
    this.id = array.length;
    this.value = val;
    array.push({ id: this.id, value: [this.value] });
  }

  show() {
    console.log(array);
  }

  add(val) {
    array.forEach((entry, index) => {
      if (entry.id === this.id) {
        entry.value.push(val);
      }
    });
  }
}

const a = new single("A");
const b = new single("あ");
a.show();
a.add("B");
a.add("C");
b.add("い");
b.show();

class Parent {
  getId() {
    return this.array.length;
  }

  print = () => this.array.forEach((entry) => console.log(entry));
}

class Child extends Parent {
  create(val) {
    this.id = super.getId();
    //super(array);
    this.array.push({ id: this.id, value: val });
  }

  show() {
    const obj = this.array.filter((entry) => entry.id === this.id)[0];
    console.log("id:", this.id, "obj:", obj);
  }

  update(val) {
    let obj = this.array.filter((entry) => entry.id === this.id)[0];
    console.log("returned obj:", obj.value);
    obj.value.push(val);
    console.log(this.array);
    this.array.forEach((entry, index) => {
      if ((entry.id = this.instanceId)) {
        this.array[index] = obj;
        return false;
      }
    });
  }
}

return false;
const first = new Child();
first.create("1st");
first.show();
const second = new Child();
second.create("second");
second.show();

first.update("2nd");

second.update("second");
second.update("third");

second.print();
