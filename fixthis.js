require("dotenv").config();
const fs = require("fs");
const path = require("path");

const Util = require("./lib/util.js");
const fUtil = new Util();
const createUploadObj = require("./lib/createUploadObj.js");
const { moveDir } = require("../lib/file.js");
const prepImages = require("./lib/prepImages.js");
const createImgSeries = require("./lib/createImgSeries.js");

//publish dir
const root = process.env.DIR_STAGE;
const doneDir = process.env.DIR_NAME_DONE;
const completeTxt = process.env.FILE_COMPLETE;
const dirNameRaw = process.env.DIR_NAME_RAW;
const dirNamePublish = process.env.DIR_NAME_PUBLISH;

const configFileName = process.env.FILE_CONFIG;
const descDir = process.env.DESC_FILE_REPO;

//debug mode; if turned on, skips headless, complete.txt, and moving dir
const DEBUG_MODE = false; //true; // false;

////////driver/////////////////////////////////////////////////////
const uploadObjs = createImgSeries(root, completeTxt);
if (uploadObjs.length === 0)
  fUtil.throwNewError(`No directories with images found.`);

console.log(uploadObjs);
return false;

const paramGenerator = paramGenConstructor(uploadObjs);
//recur(uploader, paramGenerator);
thread(4, uploader, paramGenerator, recur);

function paramGenConstructor(passedObj) {
  if (passedObj.length === 0) return false;
  let obj = passedObj;

  return () => {
    if (obj.length === 0) return false;
    return obj.shift();
  };
}

function thread(maxThreads, uploader, paramGen, recursion) {
  for (n = 0; n < maxThreads; n++) {
    recursion(uploader, paramGen);
  }
}

function recur(fn, paramGen) {
  const param = paramGen();
  if (!param) return false; //end recursion

  fn(param).then((r) => {
    console.log(r);
    recur(fn, paramGen);
  });
}

async function uploader(obj) {
  try {
    await prepImages(obj.dirPath);
  } catch (err) {
    fUtil.throwNewError(
      `Failed to run prepImages on ${obj.dirPath}.  \r\n${err}`
    );
  }

  return false;

  //puppeteering
  const optHeadless = DEBUG_MODE ? false : true;
  //
  const browser = await puppeteer.launch({ headless: optHeadless });
  const page = await browser.newPage();
  await page.goto(urlSite, { waitUntil: "load" });
  await page.goto(urlLogin, { waitUntil: "networkidle0" });
  console.log(`⏩ ${obj.dir} - browser launched`);

  //login
  await page.waitForSelector("input[name=login]");
  await page.type("input[name=login]", fid);
  await page.type("input[name=password]", fpw);
  await page.click("#on_submit");
  console.log(`⏩ ${obj.dir} - logged in`);
  await page.waitForTimeout(1000);

  //Creating post
  await page.goto(urlNewPost, { waitUntil: "load" });
  console.log(`⏩ ${obj.dir} - Opened post page`);

  //await page.waitForNetworkIdle();
  await page.waitForSelector("input[name=title]");
  await page.type("input[name=title]", obj.dir);
  console.log(`⏩ ${obj.dir} - tile done `);

  //image upload
  const imgToPublish = fs
    .readdirSync(publishDir)
    .map((f) => path.join(publishDir, f));
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.waitForSelector(".image-panel__add-button button"),
    page.click(".image-panel__add-button button"),
  ]);
  await fileChooser.accept(imgToPublish);
  await page.waitForSelector("ul.image-panel__list");
  await page.waitForTimeout(1000);

  console.log(`⏩ ${obj.dir} - uploading images `);

  //validate the number of images uploaded.
  const uploadedImgCnt = await page.evaluate(
    () =>
      document.querySelectorAll(
        "div.image-panel > div.image-panel__body > div > ul.image-panel__list > li"
      ).length
  );
  if (imgToPublish.length !== uploadedImgCnt) {
    console.warn(
      `Missing upload images.  Uploaded ${uploadedImgCnt}/${
        imgFiles.length
      }.  Missing ${imgFiles.length - uploadedImgCnt} images.`
    );
  }

  await page.waitForTimeout(1000);

  //description text
  const descTxt = fs.readFileSync(path.join(descDir, obj.config.desc), "utf-8");
  await page.type("textarea[name=body]", descTxt);
  console.log(`⏩ ${obj.dir} - desc done `);

  //date
  //create date obj
  const vol = (obj.dir.match(/0?(\d{1,3})$/) && RegExp.$1) || 0;
  const [year, month, day] = obj.config.date.split("-");
  const publishDT = new Date(
    Number(year),
    Number(month) - 1,
    Number(day) + Number(vol) - 1
  );
  const publishDtYearMonth =
    publishDT.getFullYear() + String(publishDT.getMonth() + 1).padStart(2, "0");

  //currentYearMonth = Month of the date picker calendar displayed in yyyymm
  await page.click("div.my-2 > button.v-btn");
  await page.waitForSelector(".v-dialog__content--active");
  await page.waitForTimeout(500);

  console.log(`⏩ ${obj.dir} - Opening date picker... `);

  function getDatePickerYearMonth() {
    return (async () => {
      let element = await page.$("div.accent--text > button");
      let DatePickerYearMonth = await page.evaluate(
        (el) => el.textContent,
        element
      );
      DatePickerYearMonth = DatePickerYearMonth.replace(/月/, "").split("年");
      DatePickerYearMonth[1] = String(DatePickerYearMonth[1]).padStart(2, "0");
      return DatePickerYearMonth.join("");
    })();
  }
  let DatePickerYearMonth = await getDatePickerYearMonth();

  //click on "Previous/Next" month button until publish yearMonth matches date picker yearMonth.
  while (publishDtYearMonth !== DatePickerYearMonth) {
    const label =
      publishDtYearMonth < DatePickerYearMonth
        ? "Previous month"
        : "Next month";
    await page.click(`button[aria-label="${label}"`);
    await page.waitForTimeout(500);
    DatePickerYearMonth = await getDatePickerYearMonth();
  }

  const dpicker = new Date(publishDT.getFullYear(), publishDT.getMonth(), 1);
  const numCol = publishDT.getDay() + 1;
  const firstDay = dpicker.getDay();
  const numRow = Math.floor((publishDT.getDate() + firstDay - 1) / 7) + 1;

  await page.click(
    `div.v-date-picker-table tr:nth-child(${numRow}) td:nth-child(${numCol}) button`
  );
  //await page.waitForTimeout(500);
  console.log(`⏩ ${obj.dir} - Date set `);
  await page.click("a[href='#tab-time']");
  //await page.waitForTimeout(500);
  await page.click("span.v-time-picker-clock__item--active");
  //  await page.waitForTimeout(500);
  await page.click("span.v-time-picker-clock__item--active");

  console.log(`⏩ ${obj.dir} - setting time. `);

  //time
  await page.waitForTimeout(500);
  if (obj.config.time === "pm")
    await page.click(
      "div.v-time-picker-clock__ampm > div.v-picker__title__btn:nth-child(2)"
    );
  await page.waitForTimeout(500);
  await page.click(
    "#tab-time > div > div.v-picker__actions.v-card__actions > button:nth-child(3)"
  );
  await page.waitForTimeout(500);

  console.log(`⏩ ${obj.dir} - setting tag. `);
  //tag
  for (t of obj.config.tag.split(",")) {
    await page.type("input#input-114", t, { delay: 5 });
    await page.click("button[aria-label='append icon'");
    await page.waitForTimeout(500);
  }

  console.log(`⏩ ${obj.dir} - setting meta`);
  if (obj.config.taste === "real") {
    await page.click("button[value='illust_taste']");
    await page.click("button[value='real_taste']");
  }
  //await page.waitForTimeout(2000);
  if (obj.config.rating === "r18") {
    await page.click("button[value='1']");
    await page.click("button[value='2']");
  } else {
    await page.click("button[value='2']");
    await page.click("button[value='1']");
  }
  //await page.waitForTimeout(2000);
  if (obj.config.plan === "paid") {
    await page.click("div.v-select__selection");
    await page.waitForTimeout(500);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(500);
    await page.keyboard.press("Enter");
  }
  await page.waitForTimeout(500);
  /*
  await page.waitForTimeout(1000);
  await page.click(".layout-edit-post__actions > li:nth-child(1) > button:nth-child(1)");
*/

  console.log(`⏩ ${obj.dir} - reserve setting.`);
  await page.click(
    "#app > div.v-application--wrap > div.app-container > div.layout-container > div > div.l-main.is-pc > div > div.layout-edit-post__side > ul > li:nth-child(1) > button"
  );
  await page.waitForSelector(".v-image__image--cover");
  console.log(`💾 ${obj.dir} - Upload complete.`);
  await browser.close();

  if (DEBUG_MODE === false) {
    const srcDir = path.join(root, obj.dir);
    const arcDir = path.join(root, doneDir, obj.dir);
    await moveDir(srcDir, arcDir, false, "cut");
    try {
      fs.rmSync(srcDir, { recursive: true, force: true });
    } catch (err) {
      return `❌ Failed update for ${obj.dir}. ERROR: ${err}`;
    }

    try {
      fs.appendFileSync(path.join(root, completeTxt), `\r\n${obj.dir}`);
      console.log(`🗃️ ${obj.dir} - Files archived under /${doneDir}`);
      //      console.log("All process completed.  Exiting program.");
    } catch (err) {
      return `❌ Failed update for ${obj.dir}. ERROR: ${err}`;
    }
  }
  return `🚀 ${obj.dir} - Process complete.`;
}
