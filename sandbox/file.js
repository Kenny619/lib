import fs, { Dirent } from "fs";

const srcDir = "C:\\Users\\kenny\\OneDrive\\Pictures";
const compatibleFileFomats = ["jpeg", "jpg", "png", "webp", "gif", "jp2", "tiff", "avif", "heif", "jxl", "raw", "tile"];
const pickImgFiles = (Dirent) => {
	if (!Dirent.isFile()) return false;
	const ext = Dirent.name.match(/\.([^.]+)$/) && RegExp.$1;
	return ext === null ? false : compatibleFileFomats.includes(ext);
};
const srcFileDirent = fs.readdirSync(srcDir, { withFileTypes: true }).filter(pickImgFiles);

const calc = {
	add: (a, b) => a + b,
	subtract: (a, b) => a - b,
	multiply: (a, b) => a * b,
	divide: (a, b) => a / b,
};
const operator = "add";
const r = calc[operator](3, 5);
console.log(r);
