import resizeImg from "../dist/resizeImage.js";

const src = "H:\\storage\\img\\pic_temp\\sd\\selected\\_kdp\\world beauties vol1 - sorted";
const dst = "H:\\storage\\img\\pic_temp\\sd\\selected\\_kdp\\resized";

resizeImg(src, dst, 99, "jpg", { height: 1280, width: 800, fit: "outside" });
