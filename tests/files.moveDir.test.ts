import fsp from "node:fs/promises";
import * as dir from "src/files/files";
import type { inputOption } from "src/files/moveDir";
import { describe, expect, test } from "vitest";

/* scenarios
directory
1. Invalid srcDir throws 'not a valid directory' error
2. Invalid dstDir throws ENOENT error

filter
3. Invalid option.dirName throws 'not a valid RegExp' error
4. Invalid option.fileName throws 'not a valid RegExp' error
5. Invalid option.extName throws 'not a valid RegExp' error
6. option.dirNameFilter applicable to all source files copy 0 files
7. option.fileNameFilter applicable to all source files copy 0 files
8. option.extNameFilter applicable to all source files copy 0 files
*/

describe("Fn: strToRegExp", async () => {
	test("1. Invalid srcDir throws 'not a valid directory' error", async () => {
		const srcDir = "";
		const dstDir = "";
		const option: inputOption = { mode: "copyDiff" };
		await expect(dir.moveDir(srcDir, dstDir, option)).rejects.toThrow(/not a valid directory/);
	});

	test("2. Invalid dstDir throws ENOENT error", async () => {
		const srcDir = "D:\\sandbox\\src";
		const dstDir = "I:\\sandbox\\dest";
		const option: inputOption = { mode: "copyDiff" };
		await expect(dir.moveDir(srcDir, dstDir, option)).rejects.toThrow(/enoent/i);
	});

	test("3. Invalid option.dirName throws 'not a valid RegExp' error", async () => {
		const srcDir = "D:\\sandbox\\src";
		const dstDir = "D:\\sandbox\\dst";
		const option: inputOption = { dirNameFilter: "\\", mode: "copyDiff" };
		await expect(dir.moveDir(srcDir, dstDir, option)).rejects.toThrow(/not a valid RegExp/);
		await fsp.rm(dstDir, { recursive: true, force: true });
	});

	test("4. Invalid option.fileName throws 'not a valid RegExp' error", async () => {
		const srcDir = "D:\\sandbox\\src";
		const dstDir = "D:\\sandbox\\dst";
		const option: inputOption = { fileNameFilter: "\\", mode: "copyDiff" };
		await expect(dir.moveDir(srcDir, dstDir, option)).rejects.toThrow(/not a valid RegExp/);
		await fsp.rm(dstDir, { recursive: true, force: true });
	});

	test("5. Invalid option.extName throws 'not a valid RegExp' error. ", async () => {
		const srcDir = "D:\\sandbox\\src";
		const dstDir = "D:\\sandbox\\dst";
		const option: inputOption = { extNameFilter: "\\", mode: "copyDiff" };
		await expect(dir.moveDir(srcDir, dstDir, option)).rejects.toThrow(/not a valid RegExp/);
		await fsp.rm(dstDir, { recursive: true, force: true });
	});

	test("6. option.dirNameFilter applicable to all source files copy 0 files", async () => {
		const srcDir = "D:\\sandbox\\src";
		const dstDir = "D:\\sandbox\\dst";
		const option: inputOption = { dirNameFilter: "dst", mode: "copyOverwrite" };
		try {
			await dir.moveDir(srcDir, dstDir, option);
		} catch (e) {
			throw new Error(`${e}`);
		}
		await expect(dir.getFileCount(dstDir)).resolves.toBe(0);
		await fsp.rm(dstDir, { recursive: true, force: true });
	});
});
