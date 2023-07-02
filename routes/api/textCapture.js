const axios = require("axios");
const fs = require("fs");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const app = express();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

app.use(express.json());
const cors = require("cors");
app.use(cors());

const MY_OCR_API_URL = process.env.MY_OCR_API_URL;
const MY_OCR_SECRET_KEY = process.env.MY_OCR_SECRET_KEY;

const { getDateAndTime } = require("../../function/getDateAndTime");
const { extractUserName } = require("../../function/extractUserName");
const { saveScrap } = require("../../function/saveScrap");

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
      cb(null, `texts/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  //* 용량 제한
  limits: { fileSize: 5 * 1024 * 1024 },
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

    // const resizeurl = imageUrl.replace(/\/original\//, '/resize/');
    const result = await processImageAsync(
      username,
      keyWord,
      url,
      dateTime.date,
      dateTime.time,
      title,
      imgUrl
    );
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const processImageAsync = async (
  username,
  keyWord,
  url,
  date,
  time,
  title,
  imgUrl
) => {
  const MY_OCR_API_URL = process.env.MY_OCR_API_URL;
  const MY_OCR_SECRET_KEY = process.env.MY_OCR_SECRET_KEY;
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-OCR-SECRET": MY_OCR_SECRET_KEY,
    },
  };
  const timestamp = new Date().getTime();
  let combinedText = "";
  try {
    const response = await axios.post(
      MY_OCR_API_URL,
      {
        images: [
          {
            format: "png",
            name: "medium",
            url: imgUrl,
          },
        ],
        lang: "ko",
        requestId: "string",
        resultType: "string",
        timestamp: timestamp,
        version: "V1",
      },
      config
    );
    response.data.images[0].fields.forEach((element) => {
      combinedText += " " + element.inferText;
    });
    const result = await saveScrap(
      username,
      keyWord,
      url,
      date,
      time,
      title,
      combinedText,
      null
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = router;
