const fs = require("fs");
const path = require("path");

/**
 * Recursively move files from the source directory to the destination directory.
 *
 * @param {string} srcDir - The source directory to move files from.
 * @param {string} destDir - The destination directory to move files to.
 * @param {RegExp|boolean} [regExp=false] - An optional regular expression for filtering file names.
 * @param {string} [mode=copy] - An optional moving mode.  Default is set to "copy".  When set to 'cut', moved files will be deleted from thr source directory.
 * @throws {Error} If the source directory doesn't exist or if the destination is the same as the source.
 */

function moveFiles(srcDir, destDir, regExp = false, mode = "copy") {
  let files = [];
  let counter = 0;

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(srcDir)) reject(`⛔ dir ${srcDir} does not exist.`);
    if (srcDir === destDir)
      reject(`⛔ Destination is pointing to the source directory.`);
    //create destDir
    try {
      fs.mkdirSync(destDir, { recursive: true });
    } catch (err) {
      reject(`⛔ Failed to create dir ${destDir}\r\n${err}`);
    }

    try {
      files = fs.readdirSync(srcDir, {
        withFileTypes: true,
        recursive: true,
      });
    } catch (err) {
      reject(`⛔ Failed to read files from ${srcDir}\r\n${err}`);
    }

    for (const file of files) {
      //console.log(file);
      if (regExp) {
        if (!regExp.test(file.name)) continue; //exlude from copy process.
      }

      const subDir = file.path.replace(srcDir, "");
      const srcFilePath = path.join(file.path, file.name);
      const destFilePath = path.join(destDir, subDir, file.name);

      if (file.isDirectory()) {
        if (!fs.existsSync(path.join(destDir, subDir)))
          try {
            fs.mkdirSync(path.join(destDir, subDir));
          } catch (err) {
            reject(`⛔ Failed to create dir ${destDir}\r\n${err}`);
          }
        continue;
      }

      if (!fs.existsSync(path.join(destDir, subDir)))
        try {
          fs.mkdirSync(path.join(destDir, subDir));
        } catch (err) {
          reject(`⛔ Failed to create dir ${destDir}\r\n${err}`);
        }

      try {
        fs.copyFileSync(srcFilePath, destFilePath);
        counter++;
      } catch (err) {
        reject(
          `⛔ Failed to copy file \r\nFROM:${srcFilePath}\r\nTO:${destFilePath}\r\n${err}`
        );
      }

      const operation = mode === "copy" ? "copied" : "moved";

      if (mode === "cut") {
        try {
          fs.unlinkSync(srcFilePath);
          //console.log(`✅ ${operation} ${srcFilePath}`);
        } catch (err) {
          console.log(`⚠ Failed to delete file ${file}: ${err}`);
        }
      } else {
        //console.log(`✅ ${operation} ${srcFilePath}`);
      }
    }
    resolve(`${operation} ${counter} files.`);
  });
}
module.exports = moveFiles;
