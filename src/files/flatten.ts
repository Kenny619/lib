import fsp from "node:fs/promises";
import path from "node:path";
import { isDstDirWritable, validateDirectoryPath } from "./utils/fileUtils.js";
import * as dir from "./index.js";
export async function flatten(srcDir: string, dstDir: string, separator = "_") {
	//throw an error when  \, /, :, *, ?, ", <, >, | is used
	const invalidChars = new RegExp(/[\\\\/:\\*\\?\\"\\<\\>\\|]/);
	if (invalidChars.test(separator)) {
		throw new Error(`Separator:${separator} cannot be used in filenames.`);
	}

	//throw an error when dir path are invalid
	try {
		await validateDirectoryPath(srcDir);
		await isDstDirWritable(dstDir);
		const filesInSrc = await fsp.readdir(srcDir);
		if (filesInSrc.length === 0) {
			throw new Error(`No file found in ${srcDir}`);
		}
	} catch (e) {
		throw new Error(`${e}`);
	}

	let files: string[] = [];
	try {
		files = await dir.getFilePaths(srcDir);
	} catch (e) {
		throw new Error(`getFilePaths failed.  ${e}`);
	}

	for (const file of files) {
		const dstFilePath = getDstFilePath(path.dirname(file), path.basename(file), separator, srcDir, dstDir);

		try {
			await fsp.copyFile(file, dstFilePath);
		} catch (e) {
			throw new Error(`copyFile failed ${e}`);
		}
	}

	console.log("flatten complete");
	return true;
}

function getDstFilePath(dirName: string, fileName: string, separator: string, srcDir: string, dstDir: string) {
	//delete common prefix=dirpath from dirName and replace / to separator
	let fNamePrefix = dirName.replace(srcDir, "");
	const regex = new RegExp(`^${separator}`);
	fNamePrefix = fNamePrefix.split("\\").join(separator).replace(regex, "");
	const ttlLength = fNamePrefix.length + fileName.length;

	if (ttlLength > 255) {
		console.log("filename length exceeds 255 chars.  shortening file name");
		const delCharCnt = ttlLength - 255 + 3; // +3 for replacing ... with deleted characters.

		const newFname =
			fileName > fNamePrefix
				? `${fNamePrefix}${separator}${path.basename(fileName).slice(0, ttlLength - delCharCnt)}....${path.extname(
						fileName,
					)}`
				: `${fNamePrefix.slice(0, ttlLength - delCharCnt)}...${separator}${fileName}`;

		return path.join(dstDir, newFname);
	}
	return `${dstDir}\\${fNamePrefix}${separator}${fileName}`;
}

export default flatten;
