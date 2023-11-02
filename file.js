const fs = require("fs");
const path = require("path");

/**
 * Copy/Move files under srcDir to dstDir
 *
 * @param {string} srcDir - The source directory to move files from.
 * @param {string} dstDir - The destination directory to move files to.
 * @param {RegExp|boolean} [regExp=false] - An optional regular expression for filtering file names.
 * @param {string} [mode=copy] - An optional moving mode.  Default is set to "copy".  When set to 'cut', moved files will be deleted from thr source directory.
 * @throws {Error} Whenever fs.file operation returns err.
 */

function moveDir(srcDir, dstDir, regExp = false, mode = "copy") {
  return new Promise((resolve, reject) => {
    let counter = 0;
    if (!fs.existsSync(srcDir)) reject(`⛔ dir ${srcDir} does not exist.`);
    if (srcDir === dstDir) reject(`⛔ Destination is pointing to the source directory.`);
    //create dstDir
    fs.mkdir(dstDir, { recursive: true }, err => {
      if (err) reject(`⛔ Failed to create dir ${dstDir}\r\n${err}`);

      fs.readdir(srcDir, { withFileTypes: true, recursive: true }, (err, files) => {
        if (err) reject(`⛔ Failed to read files from ${dstDir}\r\n${err}`);

        const ff = files.filter(f => !f.isDirectory() && regExp.test(f.name));
        const fileVol = ff.length;

        files.forEach(file => {
          if (regExp) {
            if (!regExp.test(file.name)) return false;
          }

          const subDir = file.path.replace(srcDir, "");
          const srcFilePath = path.join(file.path, file.name);
          const dstFilePath = path.join(dstDir, subDir, file.name);

          if (file.isDirectory()) {
            if (!fs.existsSync(path.join(dstDir, subDir))) fs.mkdirSync(path.join(dstDir, subDir));
            return false;
          }

          if (!fs.existsSync(path.join(dstDir, subDir))) fs.mkdirSync(path.join(dstDir, subDir));

          fs.copyFile(srcFilePath, dstFilePath, err => {
            if (err) reject(`⛔ Failed to copy file \r\nFROM:${srcFilePath}\r\nTO:${dstFilePath}\r\n${err}`);
            counter++;

            if (mode === "cut") {
              fs.unlink(srcFilePath, err => {
                if (err) console.log(`⚠ Failed to delete file ${file}`);
              });
            }

            if (counter === fileVol) {
              resolve(counter);
            }
          });
        });
      });
    });
  });
}

/**
 * Copy/Move a single
 *
 * @param {string} srcFilePath - The source directory to move files from.
 * @param {string} dstFilePath - The dstination directory to move files to.
 * @param {string} [mode=copy] - An optional moving mode.  Default is set to "copy".  When set to 'cut', moved files will be deleted from thr source directory.
 * @throws {Error} If the source directory doesn't exist or if the dstination is the same as the source.
 * @returns {string} dstFilePath
 */

function moveFile(srcFilePath, dstFilePath, mode = "copy") {
  return new Promise((resolve, reject) => {
    const dstPath = dstFilePath.replace(/[^\\?]+$/gi, "");

    if (!fs.existsSync(srcFilePath)) reject(`⛔ dir ${srcFilePath} does not exist.`);
    if (srcFilePath === dstFilePath) reject(`⛔ dstination is pointing to the source directory.`);
    //create dstFilePath
    fs.mkdir(dstPath, { recursive: true }, err => {
      if (err) reject(`⛔ Failed to create dir ${dstPath}\r\n${err}`);

      fs.copyFile(srcFilePath, dstFilePath, err => {
        if (err) reject(`⛔ Failed to copy file \r\nFROM:${srcFilePath}\r\nTO:${dstFilePath}\r\n${err}`);

        if (mode === "cut") {
          fs.unlink(srcFilePath, err => {
            if (err) console.log(`⚠ Failed to delete file ${file}`);
          });
        }
        resolve(dstFilePath);
      });
    });
  });
}
module.exports = {
  moveDir,
  moveFile,
};
