let array = [];

fn1 = (v) => {
  return new Promise((res) => {
    res(`resolved f1! ${v * 5}`);
  });
};

fn2 = (v) => {
  return new Promise((res) => {
    res(`resolved f2! ${v * 10}`);
  });
};

output = (res) => {
  console.log(res);
};

array.push(fn1(10));
array.push(fn2(10));

Promise.resolve(array[1]).then((r) => output(r));
Promise.resolve(array[0]).then((r) => output(r));
