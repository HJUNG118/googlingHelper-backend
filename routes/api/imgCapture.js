const express = require("express");
const multer = require("multer");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const { saveScrap } = require("../../function/saveScrap");
const { getDateAndTime } = require("../../function/getDateAndTime");
const { extractUserName } = require("../../function/extractUserName");

//* aws region 및 자격증명 설정
const s3Client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

//* AWS S3 multer 설정
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "tentenimg",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한 설정 (5MB)
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { keyWord, title, url } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7);
    }
    const dateTime = await getDateAndTime();
    const username = await extractUserName(userToken);
    const imgUrl = req.file.location;
    const resizeUrl = imgUrl.replace(/\/original\//, "/resize/");
    const result = await saveScrap(
      username,
      keyWord,
      url,
      dateTime.date,
      dateTime.time,
      title,
      null,
      resizeUrl
    );
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
