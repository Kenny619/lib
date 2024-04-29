import { JSDOM } from "jsdom";

interface serp {
  link: string;
  title: string;
}

export async function searchGoogle(searchWord: string) {
  const jd = await JSDOM.fromURL(
    `https://www.google.co.jp/search?q=${encodeURIComponent(searchWord)}`,
    {
      referrer: "https://www.google.co.jp/",
    }
  );

  const dom = jd.window.document;

  //SERP cards
  const cards = dom.querySelectorAll("div#search > div > h1 + div > div");
  let serp: serp[] = [];
  if (cards.length === 0) {
    throw new Error("No result.");
  } else {
    for (let c of cards) {
      let link = c.querySelector("a")?.getAttribute("href");
      let title = c.querySelector("h3")?.textContent;
      if (link && title) serp.push({ link: link, title: title });
    }
  }
  return serp;
}
