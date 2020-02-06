const fs = require('fs');
const path = require('path');
const http = require('http');
const pipeline = require('stream').pipeline;


const SERVER = process.env.SERVER || 'http://localhost:8080';

module.exports = sendFile;

function sendFile(filePath = process.argv[2]) {

  if (!filePath) rej('No file path provided');

  filePath = path.resolve(__dirname, filePath);
  filePathGz = `${ filePath }.gz`;

  let req;
  let uploadPromise = new Promise((res, rej) => {

    function errHandler(desc) {
      return (err) => {
        if (!err) return;

        writeStream.destroy();
        readStream.destroy();

        fs.promises
        .unlink(filePathGz)
        .finally(() => { rej(desc) });
      }
    }
    
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(filePathGz);
    writeStream.on('finish', res);

    req = http.request(SERVER, {
      headers: { filename: path.basename(filePath) },
      method: 'POST'
    });

    pipeline(readStream, req,
      errHandler('Fail while sending file'));

    req.on('response', () => 
      pipeline.bind(req, writeStream,
        errHandler('Fail while recieving'))
    );
    
  });

  Object.defineProperty(uploadPromise, 'abort', () => { req.abort() });
  return uploadPromise;
}

if (process.argv[2]) sendFile().catch(console.error);