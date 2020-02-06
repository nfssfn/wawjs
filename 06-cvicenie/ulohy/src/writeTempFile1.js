module.exports = writeTempFile;

const fs = require("fs");
const os = require("os");
const path = require("path");


function writeTempFile(fileName, ...args) {

  
  // just hints:
  const cb = args.pop();
  const tempDir = path.join(os.tmpdir(), process.pid + '-');
  fs.mkdtemp(tempDir, (err, folder) => { 
    if (err) return cb(err); 
    try {
      fs.writeFile(folder+'/'+fileName, ...args, (err) => {
        cb(err ? err : undefined, folder+'/'+fileName);
      });
    } catch (ex) {
      cb(ex);
    }
  });
}