const assert = require('assert');
const fs = require('fs');

const server = require('../src/zip-server');
const send = require('../src/zip-client');

let serverInstance;
describe("ULOHA #1", function() {

  before((done) => {
    serverInstance = server('./tmp');
    done();
  });


  it("01-Not existing file (number)", (done) => {
    assert
    .rejects(send(123))
    .finally(done);
  });

  it("02-Not existing file (string)", (done) => {
    assert
    .rejects(send(123))
    .finally(done);
  });

  it("03-Empty file", (done) => {
    assert
    .doesNotReject(send('../test/data/empty.file'))
    .finally(() => {
      assert(fs.existsSync('./test/data/empty.file.gz'));
      done();
    });
  });

  it("04-Not empty file", (done) => {
    assert
    .doesNotReject(send('../test/data/data.file'))
    .finally(() => {
      assert(fs.existsSync('./test/data/data.file.gz'));
      done();
    });
  });

  it("05-Not empty file with sending issue", (done) => {
    assert.rejects(send('../test/data/bigData.file', 1))
    .finally(() => {
      assert(!fs.existsSync('./test/data/bigData.file.gz'));
      done();
    });
  });
  

  after((done) => {
    serverInstance.close();
    done();
  });

});