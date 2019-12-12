
const server = require('../src/zip-server')('./tmp');
const send = require('../src/zip-client');

(async () => {

  let test1 = Date.now();
  await send('../test/zip-server.demo.js');
  await send('../test/zip-server.spec.js');
  await send('../test/zip-server.demo.js');
  await send('../test/zip-server.spec.js');
  await send('../test/zip-server.demo.js');
  await send('../test/zip-server.spec.js');
  await send('../test/zip-server.demo.js');
  await send('../test/zip-server.spec.js');
  console.log('One-by-one:', Date.now() - test1, 'ms');

  let test2 = Date.now();
  await Promise.all([
    send('../test/zip-server.demo.js'),
    send('../test/zip-server.spec.js'),
    send('../test/zip-server.demo.js'),
    send('../test/zip-server.spec.js'),
    send('../test/zip-server.demo.js'),
    send('../test/zip-server.spec.js'),
    send('../test/zip-server.demo.js'),
    send('../test/zip-server.spec.js')
  ]);
  console.log('Parallel:', Date.now() - test2, 'ms');

  server.close();
})();
