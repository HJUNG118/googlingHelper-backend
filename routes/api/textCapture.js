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

router.post('/', async (req, res) => {
  try {
    const { keyWord, title, texts } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7);
    }
    const dateTime = await getDateAndTime();
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const result = await processImageAsync(username, keyWord, dateTime.date, dateTime.time, title, texts);
    res.status(200).json({ message: result });
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
  const combinedText = chunks.join('');
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
