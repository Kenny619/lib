import fsp from "node:fs/promises";
import path from "node:path";
import { optionFilter, isFileMovable, isDstDirWritable, validateDirectoryPath } from "./utils/fileUtils.js";

export async function move(srcDir: string, dstDir: string, option: inputOption) {
	//Validate srcDir
	try {
		await validateDirectoryPath(srcDir);
		if (srcDir === dstDir) throw new Error("srcDir and dstDir cannot be the same.");
	} catch (e) {
		throw new Error(`${srcDir} is not a valid directory.`);
	}

	//validate dstDir.
	try {
		await isDstDirWritable(dstDir);
	} catch (e) {
		throw new Error(`${e}`);
	}

	//default to "copyDiff" mode if option is not provided
	if (!Object.hasOwn(option, "mode")) option.mode = "copyDiff";

	//Get all filePaths under srcDir.  Apply option filter.
	let files: string[] = [];
	try {
		files = (await fsp.readdir(srcDir, { withFileTypes: true, recursive: true }))
			.filter((f) => !f.isDirectory())
			.map((f) => path.join(f.path, f.name));
	} catch (e) {
		throw new Error(`${(e as Error).name}.  ${(e as Error).message}}`);
	}

	if (Object.keys(option).length > 1) {
		//async filter condition -> create a promises of check result, await to resolve all, and use them as filter condition.
		try {
			const optionFilterResults = await Promise.all(files.map((f) => optionFilter(f, option)));
			files = files.filter((_, i) => optionFilterResults[i]);
		} catch (e) {
			throw new Error(`${e}`);
		}
	}

	//Exit the program if no files to be copied/moved
	if (files.length === 0) {
		console.log(`COMPLETE:  no files found under ${srcDir}.  Moved 0 files`);
		return true;
	}

	console.log(`Identified ${files.length} files under ${srcDir}.  Start process '${option.mode}'...`);

	let successCnt = 0;

	//work from bottom to up the directory, allowing to delete empty dir in move* ops.
	files = files.reverse();
	for (const srcFilePath of files) {
		const dstPath = path.dirname(srcFilePath).replace(srcDir, dstDir);
		const dstFilePath = path.join(dstPath, path.basename(srcFilePath));

		//Skip copying/moving if file already exists in destination and cannot be copied/moved
		if (!(await isFileMovable(srcFilePath, dstFilePath, option.mode as mode))) continue;

		try {
			await fsp.mkdir(path.dirname(dstFilePath), { recursive: true });
			await fsp.copyFile(srcFilePath, dstFilePath);
			successCnt++;

			//file deletion for move* options
			if (option.mode === "moveDiff" || option.mode === "moveIfNew" || option.mode === "moveOverwrite") {
				try {
					await fsp.rm(srcFilePath, { maxRetries: 3, retryDelay: 1000 });
					const remainingFiles = await fsp.readdir(path.dirname(srcFilePath));
					if (remainingFiles.length === 0) await fsp.rmdir(path.dirname(srcFilePath));
				} catch (e) {
					console.error(`ERROR: Failed to delete file ${srcFilePath}: ${e}`);
				}
			}
		} catch (e) {
			//If midir, copyFile, unlink failes, console.error the message and continue the loop
			console.error(`${(e as Error).name}.  ${(e as Error).message} }`);
		}
	}
	console.log(`COMPLETE:  ${option.mode} completed for ${successCnt}/${files.length} files.`);
	return true;
}
