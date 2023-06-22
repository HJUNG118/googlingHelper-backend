const axios = require('axios');
const fs = require('fs');

const MY_OCR_API_URL =
  'https://a9ioimjqm9.apigw.ntruss.com/custom/v1/23288/7bcec74f82cb87718d2a3ef0d35891bfe200f1ee13c8a5b3afc7d2e5023ee08e/general';
const MY_OCR_SECRET_KEY = 'alZZZGxXQlF4dlpGUWRWTnBFSmNJSXR6UXZIdWVKVmE=';

let config = {
  headers: {
    'Content-Type': 'application/json',
    'X-OCR-SECRET': MY_OCR_SECRET_KEY,
  },
};

let timestamp = new Date().getTime();
let sumText = '';

const imagePath = './img/9.png'; // Replace with the actual local file path
const imageData = fs.readFileSync(imagePath); // 파일 읽어서 이진 데이터 생성
const base64Image = Buffer.from(imageData).toString('base64'); // 인코딩해서 텍스트 형식으로 변환

/* Axios URL Call & Work Response Data */
axios
  .post(
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
  )
  .then(function (response) {
    /* Make Response Data to Text Data */
    response.data.images[0].fields.forEach((element) => {
      console.log(element.inferText);
      sumText += ' ' + element.inferText;
    });

    console.log('-------------------');
    console.log(sumText);
    console.log('-------------------');

    /* Save Text File */
    fs.writeFileSync('ncp_ocr.txt', sumText, 'utf-8');
  })
  .catch(function (error) {
    console.log(error);
  });
