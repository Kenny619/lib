import fs from "fs";
import path from "path";

function moveDir(srcDir: string, dstDir: string, regularExpression: string | boolean = false, mode = "copy") {
	return new Promise((resolve, reject) => {
		let counter = 0;
		const regexp: RegExp | boolean = regularExpression ? new RegExp(regularExpression as string) : false;

		fs.mkdir(dstDir, { recursive: true }, (err) => {
			if (err) return reject(`Failed to create dir ${dstDir}\n${err}`);

			fs.readdir(srcDir, { withFileTypes: true, recursive: true }, (err, files) => {
				if (err) return reject(`Failed to read files from ${srcDir}\n${err}`);

				const filteredFiles = regexp
					? files.filter((f) => !f.isDirectory() && regexp.test(f.name))
					: files.filter((f) => !f.isDirectory());

				const fileVol = filteredFiles.length;

				for (const file of filteredFiles) {
					const subDir = file.path.replace(srcDir, "");
					const srcFilePath = path.join(file.path, file.name);
					const dstFilePath = path.join(dstDir, subDir, file.name);
					const dstPath = path.join(dstDir, subDir);

					if (!fs.existsSync(dstPath)) fs.mkdirSync(dstPath);

					fs.copyFile(srcFilePath, dstFilePath, (err) => {
						if (err) return reject(`Failed to copy file FROM:${srcFilePath} TO:${dstFilePath}\n${err}`);

						counter++;

						if (mode === "cut") {
							fs.unlink(srcFilePath, (err) => {
								if (err) console.log(`Failed to delete file ${file}`);
							});
						}

						if (counter === fileVol) {
							resolve(counter);
						}
					});
				}
			});
		});
	});
}

/**
 *
 *
 * Copy/Move a single file
 *
 * @param {string} srcFilePath - The source directory to move files from.
 * @param {string} dstFilePath - The dstination directory to move files to.
 * @param {string} [mode=copy] - An optional moving mode.  Default is set to "copy".  When set to 'cut', moved files will be deleted from thr source directory.
 * @throws {Error} If the source directory doesn't exist or if the dstination is the same as the source.
 * @returns {string} dstFilePath
 */

function moveFile(srcFilePath: string, dstFilePath: string, mode = "copy") {
	return new Promise((resolve, reject) => {
		const dstPath = dstFilePath.replace(/[^\\?]+$/gi, "");

		if (!fs.existsSync(srcFilePath)) reject(`⛔ dir ${srcFilePath} does not exist.`);
		if (srcFilePath === dstFilePath) reject("⛔ dstination is pointing to the source directory.");
		//create dstFilePath
		fs.mkdir(dstPath, { recursive: true }, (err) => {
			if (err) reject(`⛔ Failed to create dir ${dstPath}\r\n${err}`);

			fs.copyFile(srcFilePath, dstFilePath, (err) => {
				if (err) reject(`⛔ Failed to copy file \r\nFROM:${srcFilePath}\r\nTO:${dstFilePath}\r\n${err}`);

				if (mode === "cut") {
					fs.unlink(srcFilePath, (err) => {
						if (err) console.log(`⚠ Failed to delete file ${srcFilePath}`);
						resolve(dstFilePath);
					});
				} else {
					resolve(dstFilePath);
				}
			});
		});
	});
}
module.exports = {
	moveDir,
	moveFile,
};
