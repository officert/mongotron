'use strict';

const fs = require('fs');

class FileUtils {
  createDir(dirName) {
    var dirExists = false;

    try {
      var stats = fs.lstatSync(dirName);

      if (stats.isDirectory()) {
        dirExists = true;
      }
    } catch (e) {
      //eat the error because you'll get an error if the dir doesn't exists,
      //in which case we should create the dir
      console.log(e);
    }

    if (!dirExists) {
      try {
        fs.mkdirSync(dirName);
      } catch (e) {
        //eat the error
        console.log(e);
      }
    }
  }

  createFile(fileName) {
    var fileExists = false;

    try {
      var stats = fs.lstatSync(fileName);

      if (stats.isFile()) {
        fileExists = true;
      }
    } catch (e) {
      //eat the error because you'll get an error if the dir doesn't exists,
      //in which case we should create the dir
      console.log(e);
    }

    if (!fileExists) {
      try {
        fs.writeFileSync(fileName, '');
      } catch (e) {
        //eat the error
        console.log(e);
      }
    }
  }
}

module.exports = new FileUtils();
