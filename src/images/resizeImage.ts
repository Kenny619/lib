import fs from "node:fs";
import sharp from "sharp";
import type { FormatEnum, ResizeOptions } from "sharp";
/**
 * Resize an image from the source file and save it to the destination file path.
 *
 * @param {string} srcFullpath - The path to the source image file.
 * @param {string} dstFullpath - The path to save the resized image.
 * @param {number} [quality=99] - The quality of the output image (0-100). Default=99.
 * @param {string} [outputFileType=jpg] - optional output file type (extension).  Default is "jpg".
 * @throws {Error} If an error occurs during the resizing or saving process.
 */
type option = {
	height: number;
	width: number;
};
type outputformat = "jpg" | "jpeg" | "png" | "webp";
type outputFunction = {
	[key in outputformat]: (instance: sharp.Sharp) => sharp.Sharp;
};

export default async function resizeImg(
	srcDir: string,
	dstDir: string,
	quality = 99,
	extension = "jpg",
	option: Partial<option> = {},
) {
	/** check the file format */
	const compatibleFileFomats = [
		"jpeg",
		"jpg",
		"png",
		"webp",
		"gif",
		"jp2",
		"tiff",
		"avif",
		"heif",
		"jxl",
		"raw",
		"tile",
	];

	const outputFormat: outputFunction = {
		jpg: (instance) => {
			return instance.clone().jpeg({ quality: quality, mozjpeg: true });
		},
		jpeg: (instance) => {
			return instance.clone().jpeg({ quality: quality, mozjpeg: true });
		},
		png: (instance) => {
			return instance.clone().png({ quality: quality, compressionLevel: 8 });
		},
		webp: (instance) => {
			return instance.clone().webp({ quality: quality, lossless: true });
		},
	};

	/** input validation */
	if (!compatibleFileFomats.includes(extension))
		throw new Error(`Passed extention of "${extension} is incompatible with this program.`);

	if (!fs.existsSync(srcDir)) throw new Error(`Source directory ${srcDir} does not exist.`);
	if (quality > 100 || quality < 1) throw new Error(`Value (${quality}) of quality needs to be between 1 to 100. `);

	/** list files from srcDir */
	const pickImgFiles = (Dirent: fs.Dirent) => {
		if (!Dirent.isFile()) return false;
		const ext = Dirent.name.match(/\.([^.]+)$/) && RegExp.$1;
		return ext === null ? false : compatibleFileFomats.includes(ext);
	};
	const srcFileDirents = fs.readdirSync(srcDir, { withFileTypes: true }).filter(pickImgFiles);

	/** resize option */
	const resizeParams: ResizeOptions = option;
	resizeParams.kernel = sharp.kernel.lanczos3;
	if (Object.hasOwn(option, "height") && Object.hasOwn(option, "width")) {
		resizeParams.fit = "outside";
	}

	/** destnation directory check */
	checkDir(dstDir);

	for (const dirent of srcFileDirents) {
		/** file names */
		const srcFullPath = `${dirent.path}\\${dirent.name}`;
		const dstFileName = dirent.name.replace(/\.[^.]+$/, `.${extension}`);
		const dstFilePath = `${dstDir}\\${dstFileName}`;

		const image = sharp(srcFullPath).resize(resizeParams);
		Object.keys(outputFormat).includes(extension)
			? outputFormat[extension as outputformat](image).toFile(dstFilePath)
			: image.toFormat(extension as keyof FormatEnum).toFile(dstFilePath);
	}

	const statusChecker = new Promise((resolve) => {
		setInterval(() => {
			if (checkStatus()) {
				resolve("process completed.");
			}
		}, 1000);
	});

	statusChecker.then((m) => {
		console.log(m);
		process.exit();
	});

	function checkStatus() {
		const outputs = fs.readdirSync(dstDir, { withFileTypes: true }).filter((Dirent) => Dirent.name.match(extension));
		return outputs.length === srcFileDirents.length;
	}
}

function checkDir(dstDir: string): void {
	if (!fs.existsSync(dstDir)) {
		try {
			fs.mkdirSync(dstDir, { recursive: true });
		} catch (err) {
			throw new Error(`Failed to create ${dstDir}.`);
		}
	}
	fs.access(dstDir, fs.constants.W_OK, (err) => {
		if (err) {
			throw new Error(`Directory ${dstDir} is not writable.`);
		}
	});
}
