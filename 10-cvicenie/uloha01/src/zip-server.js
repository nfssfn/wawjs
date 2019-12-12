const fs = require('fs');
const path = require('path');
const http = require('http');
const pipeline = require('stream').pipeline;
const zlib = require('zlib');

const PORT = process.env.PORT || '8080';

module.exports = runServer;

function runServer(fileStorage = process.argv[2]) {

  if (!fileStorage) rej('No file path provided');

  fileStorage = path.resolve(__dirname, fileStorage);
  fs.promises.mkdir(fileStorage).catch(()=>{});

  return http.createServer().listen(PORT, '127.0.0.1')
  .on('request', (req, res) => {

    const filename = `${ Date.now() }.${ req.headers['filename'] }`;
    const filePath = `${ fileStorage }/${ filename }`;
    const writeStream = fs.createWriteStream(filePath);

    function errHandler(desc) {
      return (err) => {
        if (!err) return;
  
        writeStream.destroy();
        gzipStream.destroy();
  
        fs.promises.unlink(filePath).catch(()=>{})
        .finally(() => {
          
          if (process.argv.length == 3)
            console.error(desc, err)
        });
      }
    }

    pipeline(req, writeStream, errHandler('Error during writing file'));

    const gzipStream = zlib.createGzip();
    pipeline(req, gzipStream, res, errHandler('Error during compressing file'));

  });
}

if (process.argv.length == 3) runServer();
