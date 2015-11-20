'use strict';

const Promise = require('bluebird');
const jsonfile = require('jsonfile');

const fs = require('fs');

class FileUtils {
  createDirSync(path) {
    var dirExists = false;

    try {
      var stats = fs.lstatSync(path);

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
        fs.mkdirSync(path);
      } catch (e) {
        //eat the error
        console.log(e);
      }
    }
  }

  createFileSync(path, fileData) {
    var fileExists = false;
    fileData = fileData || '';

    try {
      var stats = fs.lstatSync(path);

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
        fs.writeFileSync(path, fileData);
      } catch (e) {
        //eat the error
        console.log(e);
      }
    }
  }

  readJsonFile(path) {
    return new Promise((resolve, reject) => {
      jsonfile.readFile(path, (err, data) => {
        // if (err && !(err.message && err.message === 'Unexpected end of input')) return reject(err);
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }

  writeJsonFile(path, fileData) {
    return new Promise((resolve, reject) => {
      jsonfile.writeFile(path, fileData, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }
}

module.exports = new FileUtils();
