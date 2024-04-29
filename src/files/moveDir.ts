import fsp from "node:fs/promises";
import path from "node:path";

/**
 * mode controls
 * 1) whether to copy files or move(cut&paste) files
 * 2) the behavior when a source file already exists in the destination
 */
export type mode =
	| "copyOverwrite" // Copy and overwirte same name files exist in destination.
	| "copyDiff" // Only copy files that exist on source, but missing in destination.
	| "copyIfNew" // Copy and overwrite same name files, only if the source file is newer than destination file.
	| "moveOverwrite" // Move and overwrite same name files exist in destination.
	| "moveDiff" // Only move files that exist on source, but missing in destination.
	| "moveIfNew"; // Move and overwrite same name files, only if the source file is newer than destination file.

/**
 * User can specify regular expression filters in the 'options' argument.
 * If filters are provided, copy/move operations will only apply to files matching the filter(s).
 * If multiple filters are provided, they will be combined (AND, not OR).
 * Only files matching all filters will be copied or moved.
 */
export type inputOption = Partial<{
	dirNameFilter: string | null; //Filter on file path
	fileNameFilter: string | null; // Filter on file name
	extNameFilter: string | null; // Filter on file extention
	mode: mode;
}>;

/**
 * type for 'option' argument after filters are converted from string to RegExp.
 */
export type regexpOption = Partial<Record<Exclude<keyof inputOption, "mode">, RegExp | null> & { mode: mode }>;

/**
 * Filter out files that do not match option.*Filter RegExp
 */
function optionFilter(filePath: string, option: regexpOption) {
	for (const key in option) {
		if (key !== "mode" && !(option[key as keyof typeof option] as RegExp).test(path.dirname(filePath))) {
			return false;
		}
	}
	return true;
}

/**
 * Convert *Name properties in option object to RegExp
 * Throws error when invalid RegExp was passed
 */
function strToRegExp(option: inputOption) {
	const reOption: regexpOption = {
		mode: option.mode as mode,
	};
	for (const key of Object.keys(option)) {
		if (key !== "mode" && option[key as keyof inputOption] !== null) {
			try {
				reOption[key as keyof Omit<regexpOption, "mode">] = new RegExp(option[key as keyof inputOption] as string);
			} catch (e) {
				throw new Error(`option.${key}: ${option[key as keyof inputOption]} is not a valid RegExp.  ${e as Error}`);
			}
		}
	}
	return reOption;
}

/**
 * Checks if copy/move operation can be performed on the file
 */
async function isFileMovable(srcFilePath: string, dstFilePath: string, mode: mode) {
	if (mode === "copyOverwrite" || mode === "moveOverwrite") return true;

	//check if a file already exist in dstFilePath
	try {
		const dstFile = await fsp.stat(dstFilePath);

		///check the last modified date.  Return true if src file is newer.
		if (mode === "copyIfNew" || mode === "moveIfNew") {
			const srcFile = await fsp.stat(srcFilePath);
			return srcFile.mtime > dstFile.mtime ? true : false;
		}

		//mode === copyDiff | moveDiff.  Return false and skip copy/move since file exists in dst
		return false;
	} catch (_) {
		//There is no file on dstFilePath.  Return true and perform copy/move operation
		return true;
	}
}

export async function moveDir(srcDir: string, dstDir: string, option: inputOption) {
	//Validate srcDir
	try {
		(await fsp.stat(srcDir)).isDirectory();
	} catch (e) {
		throw new Error(`${srcDir} is not a valid directory.`);
	}

	//validate dstDir

	async function isDstValid(dstPath: string) {
		let isDstExist = false;
		try {
			const stats = await fsp.stat(dstPath);
			stats.isDirectory();
			isDstExist = true;
		} catch (_) {}

		if (!isDstExist) {
			try {
				await fsp.mkdir(dstPath);
			} catch (e) {
				throw new Error(e as string);
			}
		}

		try {
			await fsp.access(dstPath, fsp.constants.W_OK);
			return true;
		} catch (e) {
			throw new Error(`accessFailed -> ${e}`);
		}
	}

	try {
		await isDstValid(dstDir);
	} catch (e) {
		throw new Error(`${e}`);
	}

	//default to "copyDiff" mode if option is not provided
	if (!Object.hasOwn(option, "mode")) option.mode = "copyDiff";

	//Convert option strings to RegExp
	//Throw exception if filter string are not valid regexp
	const regexOption = strToRegExp(option);

	//Get all filePaths under srcDir.  Apply option filter.
	let files: string[] = [];
	try {
		files = (await fsp.readdir(srcDir, { withFileTypes: true, recursive: true }))
			.filter((f) => !f.isDirectory())
			.map((f) => path.join(f.path, f.name))
			.filter((f) => optionFilter(f, regexOption));
	} catch (e) {
		throw new Error(`${(e as Error).name}.  ${(e as Error).message}}`);
	}

	//Exit the program if no files to be copied/moved
	if (files.length === 0) {
		console.log(`COMPLETE:  no files found under ${srcDir}.  Moved 0 files`);
		return true;
	}

	console.log(`Identified ${files.length} files under ${srcDir}.  Start ${option.mode}ing the files...`);

	let successCnt = 0;
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
					await fsp.rmdir(srcFilePath);
				} catch (e) {
					console.error(`ERROR: Failed to delete file ${srcFilePath}`);
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
