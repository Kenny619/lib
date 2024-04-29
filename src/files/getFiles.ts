import fsp from "node:fs/promises";
import path from "node:path";

async function getFilePaths(root: string) {
	try {
		return (await fsp.readdir(root, { withFileTypes: true, recursive: true }))
			.filter((f) => !f.isDirectory())
			.map((f) => path.join(f.path, f.name));
	} catch (e) {
		throw new Error(`${e}`);
	}
}

async function getFileCount(root: string) {
	try {
		const files = (await fsp.readdir(root, { withFileTypes: true, recursive: true }))
			.filter((f) => !f.isDirectory())
			.map((f) => path.join(f.path, f.name));
		return files.length;
	} catch (e) {
		throw new Error(`${e}`);
	}
}

export { getFileCount, getFilePaths };
