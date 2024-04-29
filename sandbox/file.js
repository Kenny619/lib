import fs from "node:fs/promises";
const srcDir = "C:\\";
try {
	(await fs.stat(srcDir)).isDirectory();
} catch (e) {
	console.error(e);
}
