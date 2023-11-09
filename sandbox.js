let ary = Array(4).fill(undefined);
Object.seal(ary);
ary.push(1);
ary.push(2);
ary.push(3);
ary.push(4);
ary.push(5);
console.log(ary);
