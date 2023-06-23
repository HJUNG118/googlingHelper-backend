const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

const MY_OCR_API_URL = process.env.MY_OCR_API_URL;
const MY_OCR_SECRET_KEY = process.env.MY_OCR_SECRET_KEY;

const { getDateAndTime } = require('../../function/getDateAndTime');
const { extractUserName } = require('../../function/extractUserName');
const { saveScrap } = require('../../function/saveScrap');
let accumulatedTexts = '';
router.post('/', async (req, res) => {
  try {
    const { keyWord, title, textChunk, isLastChunk } = req.body; // 'isLastChunk' 플래그를 추가합니다.
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7);
    }
    const dateTime = await getDateAndTime();
    const username = await extractUserName(userToken, process.env.jwtSecret);

    accumulatedTexts += textChunk; // 받은 텍스트 청크를 누적합니다.

    // 마지막 청크가 받아졌을 때 누적된 텍스트를 처리합니다.
    if (isLastChunk) { // 마지막 청크인지 판단하는 방법을 구현해야 합니다.
      const result = await processImageAsync(username, keyWord, dateTime.date, dateTime.time, title, accumulatedTexts);
      res.status(200).json({ message: result });
      accumulatedTexts = ''; // 누적된 텍스트를 리셋합니다.
    } else {
      res.status(200).json({ message: 'Text chunk received successfully.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Asynchronous function to process the image
const processImageAsync = async (username, keyWord, date, time, title, texts) => {
  const MY_OCR_API_URL = process.env.MY_OCR_API_URL;
  const MY_OCR_SECRET_KEY = process.env.MY_OCR_SECRET_KEY;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-OCR-SECRET': MY_OCR_SECRET_KEY,
    },
  };
  const timestamp = new Date().getTime();
  const combinedText = texts.join('');
  try {
    console.log(combinedText);
    // const response = await axios.post(
    //   MY_OCR_API_URL,
    //   {
    //     images: [
    //       {
    //         format: 'png',
    //         name: 'medium',
    //         data: texts,
    //       },
    //     ],
    //     lang: 'ko',
    //     requestId: 'string',
    //     resultType: 'string',
    //     timestamp: timestamp,
    //     version: 'V1',
    //   },
    //   config
    // );
    // // const ocrResult = response.data;
    // let sumText;
    // response.data.images[0].fields.forEach((element) => {
    //   sumText += ' ' + element.inferText;
    // });
    const sumText = '실험1';
    const result = await saveScrap(username, keyWord, null, date, time, title, sumText, null);
    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports = router;
