import resizeImg from "../dist/resizeImage.js";

const src = "H:\\storage\\img\\pic_temp\\sd\\selected\\__sns\\devian\\";
const dst = "H:\\storage\\img\\pic_temp\\sd\\selected\\__sns\\devian\\resized";

resizeImg(src, dst, 100, "png", { height: 1440, fit: "outside" });
