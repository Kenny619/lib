import fsp from "node:fs/promises";
import path from "node:path";
import * as fUtil from "./utils/fileUtils.js";

type filterOnlyOption = Omit<inputOption, "mode">;
async function getFilePaths(root: string, option: filterOnlyOption = {}) {
	//root directory validation
	try {
		await fUtil.validateDirectoryPath(root);
	} catch (e) {
		throw new Error(`${root} is not a valid directory.  ${e}`);
	}

	let files = [];
	try {
		files = (await fsp.readdir(root, { withFileTypes: true, recursive: true }))
			.filter((f) => !f.isDirectory())
			.map((f) => path.join(f.path, f.name));
	} catch (e) {
		throw new Error(`${e}`);
	}
	if (option) {
		const filterResults = await Promise.all(files.map((file) => fUtil.optionFilter(file, option)));
		return files.filter((_, i) => filterResults[i]);
	}

	return files;
}

async function getFileCount(root: string, option: filterOnlyOption = {}) {
	try {
		const filesPaths = await getFilePaths(root, option);
		return filesPaths.length;
	} catch (e) {
		throw new Error(`${e}`);
	}
}

export { getFileCount, getFilePaths };
