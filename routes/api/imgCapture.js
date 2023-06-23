const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const { saveScrap } = require('../../function/saveScrap');
const { getDateAndTime } = require('../../function/getDateAndTime');
const { extractUserName } = require('../../function/extractUserName');
//* aws region 및 자격증명 설정
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

//* AWS S3 multer 설정
// const upload = multer({
//   //* 저장공간
//   // s3에 저장
//   storage: multerS3({
//     // 저장 위치
//     s3: new AWS.S3(),
//     bucket: 'tentenimg',
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key(req, file, cb) {
//       cb(null, `${Date.now()}_${path.basename(file.originalname)}`); // original 폴더안에다 파일을 저장
//     },
//   }),
//   //* 용량 제한
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

//* 싱글 이미지 파일 업로드 -> uploads/ 디렉토리에 이미지를 올린다.

const upload = multer({
  //* 저장공간
  // s3에 저장
  storage: multerS3({
    // 저장 위치
    s3: new AWS.S3(),
    bucket: 'test-bucket-inpa',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, cb) {
      cb(null, `${Date.now()}_${path.basename(file.originalname)}`); // original 폴더안에다 파일을 저장
    },
  }),
  //* 용량 제한
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', upload.none('img'), async (req, res) => {
  try {
    console.log(req.file);
    const { keyWord, title } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7);
    }
    const dateTime = await getDateAndTime();
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const imageUrl = req.file.location;
    const ourl = originalUrl.replace(/\/original\//, '/thumb/');
    // console.log(imageUrl, ourl);

    const result = saveScrap(username, keyWord, null, dateTime.date, dateTime.time, title, null, imageUrl);
    // 람다에서 리사이징 처리하고 새로 버킷에 압축 이미지를 저장하니, 압축된 이미지 버킷경로로 이미지url을 변경하여 클라이언트에 제공
    // 다만, 리사이징은 시간이 오래 걸리기 때문에 이미지가 일정 기간 동안 표시되지 않을 수 있으므로, 리사이징된 이미지를 로딩하는데 실패시 원본 이미지를 띄우기 위해 originalUrl도 같이 전송
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
