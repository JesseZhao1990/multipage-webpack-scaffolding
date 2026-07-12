// Babel 会根据 browserslist 和实际使用按需注入 core-js polyfill。
console.log([3].includes(3))
async function test () {
  const res = await new Promise(resolve => { resolve('哈哈哈哈') })
  console.log(res);
}
test()
