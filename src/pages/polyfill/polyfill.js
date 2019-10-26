import '@babel/polyfill';

// 之后就可以随意使用，ES6的特征了
console.log([3].includes(3))
async function test () {
  const res = await new Promise((resolve, reject) => { resolve('哈哈哈哈') })
  console.log(res);
}
test()
