const fs = require("fs");

/**
 * createFileNameList
 * Read a txt including the list of files and generate an array.
 * @param {string} fileName name of the file to read
 * **/

exports.createFilNameList = function createFileNameList(file) {
  const f = fs.readFileSync(file, "utf-8");
  return f;
};

/**
 * getFileList
 * Returns list of files from the passed directory path.
 * If file extention(s) are passed as an array, then only the matching files will be returned.
 *
 * @param {string} dirPath path of the directory.
 * @param {array} extentions <OPTIONAL> List of extentions to be matched.
 * @return {array} fileList returns the list of file names.
 */

exports.getFileList = function getFileList(dirPath, extentions) {
  const allFiles = fs.readdirSync(dirPath, { withFileTypes: true });

  const fileList = allFiles.filter(Dirent => Dirent.isFile()).map(Dirent => Dirent.name);

  if (!extentions) return fileList;

  const allExtentions = extentions.join("|");
  const regex = new RegExp("\\.(" + allExtentions + ")$");

  return fileList.filter(name => name.match(regex));
};

/**
 * getFileListRcr
 * Returns list of files from the passed directory path including files under the subdirectories.
 * If file extention(s) are passed as an array, then only the matching files will be returned.
 *
 * @param {string} dirPath path of the directory.
 * @param {array} extentions <OPTIONAL> List of extentions to be matched.
 * @return {array} fileList returns the matching files in an array of object format {path: <path>, filename: <filename>}.
 */

exports.getFileListRcr = function getFileListRcr(dirPath, extentions) {
  const fileList = fs.readdirSync(dirPath, { withFileTypes: true }).flatMap(Dirent => (Dirent.isFile() ? { path: dirPath + "\\" + Dirent.name, filename: Dirent.name } : getFileListRcr(`${dirPath}\\${Dirent.name}`, extentions)));

  if (!extentions) return fileList;

  const joinnedExtentions = extentions.join("|");
  const regex = new RegExp("\\.(" + joinnedExtentions + ")$");

  return fileList.filter(obj => obj.filename.match(regex));
};
/**
 * searchFileList
 * Returns list of files from the passed directory path.
 * If file extention(s) are passed as an array, then only the matching files will be returned.
 *
 * @param {string} dirPath path of the directory.
 * @param {string} regex
 * @return {array} fileList returns the list of file names.
 */

exports.searchFileList = function searchFileList(dirPath, regex) {
  const allFiles = fs.readdirSync(dirPath, { withFileTypes: true });

  const fileList = allFiles.filter(Dirent => Dirent.isFile()).map(Dirent => Dirent.name);

  const rgx = new RegExp(regex);

  return fileList.filter(name => name.match(rgx));
};

/**
 * searchFileRcr
 * Returns list of files from the passed directory path including files under the subdirectories.
 * If file extention(s) are passed as an array, then only the matching files will be returned.
 *
 * @param {string} dirPath path of the directory.
 * @param {regex} regex
 * @return {array} filepath returns full filepath of matching files in an array.
 */

exports.searchFileListRcr = function searchFileListRcr(dirPath, regex) {
  const fileList = fs.readdirSync(dirPath, { withFileTypes: true }).flatMap(Dirent => (Dirent.isFile() ? { path: dirPath + "\\" + Dirent.name, filename: Dirent.name } : searchFileListRcr(`${dirPath}\\${Dirent.name}`, regex)));

  const rgx = new RegExp(regex);

  return fileList.filter(obj => obj.filename.match(rgx));
};

exports.getFANZAjson = async function getFANZAjson(url) {
  const response = await fetch(FANZAapiURL);
  const responseJson = response.json();
  return responseJson.result.result_count > 0 ? data.result.items : null;
};

/**
 * <bool> hasNestedKey
 * Returns true if passed key exists in the obj.
 *
 * @param {object} obj An object.
 * @param {string} key key to be searched in the obj.  Use dot notation.
 * @returns {bool} true if the key exists, false if not.
 */
function hasNestedKey(obj, key) {
  const keys = key.split(".");
  const ckey = keys.shift();
  return !obj.hasOwnProperty(ckey) ? false : obj.hasOwnProperty(ckey) && keys.length === 0 ? true : hasNestedKey(obj[ckey], keys.join("."));
}

module.exports.hasNestedKey = hasNestedKey;
