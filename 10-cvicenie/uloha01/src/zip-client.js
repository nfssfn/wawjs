const fs = require('fs');
const path = require('path');
const http = require('http');
const pipeline = require('stream').pipeline;


const SERVER = process.env.SERVER || 'http://localhost:8080';

module.exports = sendFile;

function sendFile(filePath = process.argv[2], abortAfter = -1) {

  if (!filePath) rej('No file path provided');

  let req;
  let uploadPromise = new Promise((res, rej) => {

    function errHandler(desc) {
      return (err) => {
        if (!err) return;

        writeStream.destroy();
        readStream.destroy();

        fs.promises
        .unlink(filePathGz).catch(()=>{})
        .finally(() => { rej(desc) });
      }
    }

    filePath = path.resolve(__dirname, filePath);
    filePathGz = `${ filePath }.gz`;

    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(filePathGz);
    writeStream.on('finish', res);

    req = http.request(SERVER, {
      headers: { filename: path.basename(filePath) },
      method: 'POST'
    });

    pipeline(readStream, req,
      errHandler('Fail during sending file'));

    req.on('response', (res) => {
      pipeline(res, writeStream,
        errHandler('Fail during recieving'));
    });
    
  });

  if (abortAfter >= 0)
    setTimeout(() => { (!req.finished && !req.aborted)&&req.abort(); }, abortAfter);

  return uploadPromise;
}

if (process.argv.length == 3) sendFile().catch(console.error);