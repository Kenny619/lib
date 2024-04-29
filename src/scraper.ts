import fs from "fs";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import axios from "axios";

export async function googleSearch(searchWords: string, mode = "search") {
	const w = searchWords.split(" ");
	const query = w.length > 1 ? w.join("+") : searchWords;
	let url: string;
	let serpSelector: string;
	let titleSelector: string;
	let linkSelector: string;

	switch (mode) {
		case "news":
			url = `https://www.google.co.jp/search?q=${query}&bih=676&tbm=nws&oq=${query}&sclient=gws-wiz-news`;
			serpSelector = "div#search > div > h1 + div > div > div > div";
			titleSelector = "a > div > div:nth-child(2) > div:nth-child(2)";
			linkSelector = "a";
			break;
		default:
			url = `https://www.google.co.jp/search?q=${query}`;
			serpSelector = "div#search > div > h1 + div > div";
			titleSelector = "h3";
			linkSelector = "a";
			break;
	}
	const ua = randomUA("./src/app/files/ua.txt");
	function randomUA(sourceFilePath: string): string {
		const f = fs.readFileSync(sourceFilePath, "utf-8");
		const ua = f.split("\r\n");
		const i = Math.floor(Math.random() * ua.length + 1);
		return ua[i];
	}

	const headers = {
		headers: {
			"Accept-Encoding": "text/html; charset=UTF-8",
			"User-Agent": ua,
		},
	};

	let dom: Document;
	try {
		const response = await axios.get(url, headers);
		const jd = new JSDOM(response.data);
		dom = jd.window.document;
	} catch (err: unknown) {
		throw new Error("Failed to acquire data");
	}

	const cards = dom.querySelectorAll(serpSelector);
	interface serp {
		link: string;
		title: string;
	}
	const serp: serp[] = [];
	if (cards.length === 0) {
		throw new Error("No result.");
	}

	for (const c of cards) {
		const link = c.querySelector(linkSelector)?.getAttribute("href");
		const title = c.querySelector(titleSelector)?.textContent;
		if (link && title) serp.push({ link: link, title: title });
	}
	return serp;
}
