
const bar1 = new Progressbars("123", 0, 10);
const bar2 = new Progressbars("123456", 0, 20);

setTimeout(() => bar1.increment(1), 300);
setTimeout(() => bar1.increment(2), 600);
setTimeout(() => bar1.increment(3), 900);
setTimeout(() => bar1.increment(2), 1200);
setTimeout(() => bar1.increment(2), 1500);

setTimeout(() => bar2.increment(3), 200);
setTimeout(() => bar2.increment(7), 400);
setTimeout(() => bar2.increment(3), 800);
setTimeout(() => bar2.increment(3), 1000);
setTimeout(() => bar2.increment(4), 1200);
