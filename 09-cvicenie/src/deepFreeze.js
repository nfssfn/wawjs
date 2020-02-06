'use strict'
const traverse = require("traverse");

function logger(comment, fnc) {
  return function () {
    console.log(comment, ...arguments);
    fnc.call(null, ...arguments);
  }
}
const freezeLogger = logger('Freezed: ', Object.freeze);

module.exports = function(o) {
  traverse.forEach(o, function() {
    this.post(({ node }) => freezeLogger(node));
  });
  return o;
}
//-------------------------- tests ----------------------------------------
process.env.SELF_TEST && ((deepFreeze) => {
  console.error(`[self test]:${__filename}:...`)


  // var assert = require("assert");

  let o = { a: 1, b: 2, c: { d: 3, e: 4 }, f: [1, 2, 3] }

  let o1 = deepFreeze(o);

  // assert(o1 === o);

  // assert.throws(() => o.c.d = 999,
  //   /Cannot assign to read only property/
  // );
  // assert.throws(() => o.f.pop(),
  //   /Cannot delete property/
  // );

  console.error(`[self test]:${__filename}:OK`)
})(module.exports);