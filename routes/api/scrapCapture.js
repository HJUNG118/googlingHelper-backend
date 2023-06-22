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

const { saveScrap } = require('../../function/saveScrap');

router.post('/', async (req, res) => {
  try {
    const { keyWord, url, title, texts, img } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7);
    }
    const dateTime = await getDateAndTime();
    const username = await extractUserName(userToken, process.env.jwtSecret);

    // Your axios.post code here
    const MY_OCR_API_URL = process.env.MY_OCR_API_URL;
    const MY_OCR_SECRET_KEY = process.env.MY_OCR_SECRET_KEY;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': MY_OCR_SECRET_KEY,
      },
    };
    const timestamp = new Date().getTime();

    // Assume base64Image is received as a parameter or from the request body
    const base64Image = img; // Replace with the received base64 image
    const base64Text = texts;

    /* Axios URL Call & Work Response Data, text가 캡쳐되서 온다면 */
    if (base64Text) {
      const response = await axios.post(
        MY_OCR_API_URL,
        {
          images: [
            {
              format: 'png',
              name: 'medium',
              data: base64Image,
            },
          ],
          lang: 'ko',
          requestId: 'string',
          resultType: 'string',
          timestamp: timestamp,
          version: 'V1',
        },
        config
      );
      // Handle the response and do further processing if needed
      const ocrResult = response.data;
      console.log(ocrResult);

      // Save the OCR result or perform other operations
      await saveScrap(username, keyWord, url, dateTime.date, dateTime.time, title, ocrResult, base64Image);
    } else {
      // 이미지 저장하기->texts가 null
      await saveScrap(username, keyWord, url, dateTime.date, dateTime.time, title, base64Text, base64Image);
    }
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error' });
  }
});
