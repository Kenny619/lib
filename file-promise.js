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
  return new Promise((resolve, reject) => {
    let counter = 0;
    if (!fs.existsSync(srcDir))
      throw new Error(`⛔ dir ${srcDir} does not exist.`);
    if (srcDir === destDir)
      throw new Error(`⛔ Destination is pointing to the source directory.`);
    //create destDir
    fs.mkdir(destDir, { recursive: true }, (err) => {
      if (err) throw new Error(`⛔ Failed to create dir ${destDir}\r\n${err}`);

      fs.readdir(
        srcDir,
        { withFileTypes: true, recursive: true },
        (err, files) => {
          if (err)
            throw new Error(
              `⛔ Failed to read files from ${destDir}\r\n${err}`
            );

          const ff = files.filter((f) => !f.isDirectory());
          const fileVol = ff.length;

          files.forEach((file) => {
            if (regExp) {
              if (!regExp.test(file.name)) return false; //exlude from copy process.
            }

            const subDir = file.path.replace(srcDir, "");
            const srcFilePath = path.join(file.path, file.name);
            const destFilePath = path.join(destDir, subDir, file.name);

            if (file.isDirectory()) {
              if (!fs.existsSync(path.join(destDir, subDir)))
                fs.mkdirSync(path.join(destDir, subDir));
              return false;
            }

            if (!fs.existsSync(path.join(destDir, subDir)))
              fs.mkdirSync(path.join(destDir, subDir));

            fs.copyFile(srcFilePath, destFilePath, (err) => {
              if (err)
                throw new Error(
                  `⛔ Failed to copy file \r\nFROM:${srcFilePath}\r\nTO:${destFilePath}\r\n${err}`
                );
              counter++;
              if (counter == fileVol) {
                resolve(counter);
              }

              const operation = mode === "copy" ? "copied" : "moved";

              if (mode === "cut") {
                fs.unlink(srcFilePath, (err) => {
                  if (err) console.log(`⚠ Failed to delete file ${file}`);
                  //  console.log(`✅ ${operation} ${srcFilePath}`);
                });
              } else {
                //console.log(`✅ ${operation} ${srcFilePath}`);
              }
            });
          });
        }
      );
    });
  });
}
module.exports = moveFiles;
