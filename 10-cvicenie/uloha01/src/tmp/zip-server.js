const http = require("http");
const zlib = require("zlib");
const fs = require("fs");
const {pipeline} = require("stream");
const path = require("path");

module.exports = server;

function server(dirname){
  let dir;
  if(!dirname)
    dir = process.argv[2];
  else
    dir = dirname;

  //console.log(dir);

  let filename;
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()){
    //console.log("'Server error': Invalid parameter (should be valid dirpath)")
    return "Error";
  }

  let server = http.createServer();

  server.listen(8080, "localhost")
  .on("request", (req, res) => {

    filename = req.headers["filename"];           //get name of received file

    pipeline(                                 //store initial file to specified directory
      req,
      fs.createWriteStream(`${dir}/${filename}`),
      (err) => {
        if(err){
          console.log("Error during writing file");
          fs.unlinkSync(`${dir}/${filename}`);      //delete file if error occured
          return;
        }
        else{
          console.log(`File stored to ${dir}/${filename}`)
        }
      }
    )

    pipeline(                                //zip received file and send it back to client
      req,
      zlib.createGzip(),
      res,
      (err) =>{
        if(err){
          console.log("Error during zipping file");
        }
        else{
          console.log(`${filename}.gz sent...`);
        }
      }
    )
  })
  return server;
}

server(); //for cmd functionality