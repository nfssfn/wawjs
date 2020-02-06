 const async = require("async");
 const fs = require("fs");
 module.exports = saveSomewhere;

function saveSomewhere(paths, data, cb) {
  tasks = paths.map((path) => {
    return function(cb) {
      fs.writeFile(path, data, 'utf8', (err) => {
        if (err) return cb(err)
        return cb(undefined, path);
      });
    }
  });
  async.tryEach(tasks, cb);
}