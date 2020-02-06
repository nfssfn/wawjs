/*
Implementation of "better" introspection functions
Just as an excercise, 
some of them may be useful in real life as well
*/
module.exports = {
  allOwnKeys,
  allOwnValues,
  allOwnEntries,
  getProtoChain,
  allKeys,
  forIn,
  shallowClone,
  hasInheritedProperty,
  hasOverridenProperty
};
// Object.keys supporting Symbols and non-enumerables 
function allOwnKeys(o) {
  return [
    ...Object.getOwnPropertyNames(o),
    ...Object.getOwnPropertySymbols(o)
  ];
}
// Object.values supporting Symbols and non-enumerables 
function allOwnValues(o) {
  return allOwnKeys(o).map(opt => o[opt])
}
// Object.entries supporting Symbols and non-enumerables 
function allOwnEntries(o) {
  return allOwnKeys(o).map(opt => [opt, o[opt]])
}
// [obj,...protos] array of objects in proto chain
// starting with obj itself and up-the chain
function getProtoChain(obj) {
  let chain = [obj];
  
  while (obj = Object.getPrototypeOf(obj))
    chain.push(obj);

  return chain;
}
// Object.keys including, inherited, not-enumeble, symbols  
function allKeys(obj) {
  let keys = [];
  
  getProtoChain(obj).forEach(proto =>
    (allOwnKeys(proto).forEach((key) => {
      if (!keys.includes(key))
        keys.push(key);
    }))
  );

  return keys;
}

// for..in loop supporting Symbols and non-enumerable
// for own and inherited properties
function forIn(obj, callback) {
  allKeys(obj).reverse().forEach(callback)
}
// create copy of object 
// with same propereties, 
// including symbols, 
// same values 
// and same property ownership 
function shallowClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

// if the property exists only in proto chain
// not on object
function hasInheritedProperty(obj, prop) {
  return obj[prop] && !Object.hasOwnProperty.call(obj, prop);
}

function hasOverridenProperty(obj, prop) {

  function allKeys(obj) {
    let keys = [];
    for (let i in keys)
      keys.push(i);
  
    getProtoChain(obj).forEach(proto => {
      keys.push( ...allOwnKeys(proto) );
    });
  
    return keys;
  }

  let keys = allKeys(obj);
  return keys.indexOf(prop) !== keys.lastIndexOf(prop);
}