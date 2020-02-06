function typedArray(arr) {
  Object.defineProperty(arr, 'push', {
    value: function (...args) {
      for (let el of args)
        (typeof el == 'string')&&(Array.prototype.push.call(arr, el));
    }
  });
  return arr;
}

let ar1 = [1,2,3];
ar2 = typedArray(ar1);
ar2.push('asd', 123);
console.log(ar2);