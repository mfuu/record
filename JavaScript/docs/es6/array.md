### 扩展运算符

#### 含义：扩展运算符（spread）是三个点（...），将一个数组转为用逗号分隔的参数序列
```js
console.log(...[1,2,3]) // 1 2 3
```
函数调用时使用
```js
function _push(array, ...item) {
  return array.push(...item)
}
function _add(x, y){
  return x + y
}
const arr = [4, 5]
_add(...arr) // 9
```
扩展运算符后放表达式
```js
const temp = [...(n > 0 ? [1, 2] : []), 3]
```

### 替代apply方法
```js
function fn(a, b, c) {
  // ...
}
let args = [1, 2, 3]

// es5写法
fn.apply(null, args)

// es6写法
fn(...args)
```
求出一个数组最大元素
```js
// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```
将一个数组添加到另一个数组的尾部
```js
var arr1 = [0, 1, 2]
var arr2 = [3, 4, 5]

// ES5的 写法
Array.prototype.push.apply(arr1, arr2)

// ES6 的写法
arr1.push(...arr2)
```

### 复制数组
