// function for adding two numbers. Easy!
const add = (a: number, b: number) => a + b;
// use reduce to sum our array
export default (n: number[]) => n.reduce(add);
