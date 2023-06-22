// var fs = require('fs');
// var stdin = process.stdin;
// var WebSocket = require('ws');
// var mongoose = require('mongoose'); // import mongoose

// // Connect to MongoDB using the provided mongoURI with the database name "memo"
// mongoose.connect(
//   'mongodb+srv://sangunlee6:dIlI9Wk9cYV1Lz5V@cluster0.0fq3hzh.mongodb.net/memo?retryWrites=true&w=majority',
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );

// // Define memo schema
// var memoSchema = new mongoose.Schema({
//   content: String,
// });

// // Compile model from schema
// var Memo = mongoose.model('Memo', memoSchema);

// if (process.argv.length !== 3) {
//   console.log('usage : node editor.js file_name');
//   process.exit(0);
// }

// var fileName = process.argv[2];
// var output = fs.createWriteStream(__dirname + '/' + fileName);

// // WebSocket 서버 생성
// const wss = new WebSocket.Server({ noServer: true });

// wss.on('connection', function (ws) {
//   ws.on('message', function (message) {
//     var messageObj = JSON.parse(message);

//     if (messageObj.type === 'save') {
//       var newMemo = new Memo({ content: messageObj.content.join('\n') });
//       newMemo
//         .save()
//         .then(() => {
//           console.log('Memo saved to MongoDB');
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//     } else {
//       // 받은 메시지를 모든 클라이언트에게 전송
//       wss.clients.forEach(function (client) {
//         client.send(message);
//       });
//     }
//   });
// });

// stdin.on('data', function (chunk) {
//   if (chunk.toString().startsWith('.exit')) {
//     console.log('exit...');
//     output.end();
//     process.exit(0);
//   } else {
//     // 입력한 텍스트를 터미널에 출력
//     // process.stdout.write(chunk);

//     // 입력한 텍스트를 파일에 저장
//     // output.write(chunk);

//     // 입력한 텍스트를 웹 소켓 클라이언트로 전송
//     wss.clients.forEach(function (client) {
//       client.send(chunk.toString());
//     });
//   }
// });

// process.on('SIGINT', function () {
//   console.log('exit...');
//   process.exit(0);
// });

// // HTTP 서버 생성
// const httpServer = require('http').createServer((req, res) => {
//   if (req.method === 'GET' && req.url === '/') {
//     fs.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
//       if (err) {
//         console.error('Could not find or open file for reading\n');
//       } else {
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(data);
//       }
//     });
//   }
// });

// httpServer.on('upgrade', function upgrade(request, socket, head) {
//   wss.handleUpgrade(request, socket, head, function done(ws) {
//     wss.emit('connection', ws, request);
//   });
// });

// // 서버를 원하는 포트에 바인딩
// const port = 8080; // 포트 번호에 맞게 수정

// httpServer.listen(port, function () {
//   console.log(`WebSocket server is listening on port ${port}`);
// });
// const { createWorker } = require('tesseract.js');

// async function extractTextFromImage(imagePath) {
//   const worker = createWorker();
//   console.log('here?');
//   await worker.load();
//   await worker.loadLanguage('kor');
//   await worker.initialize('kor');

//   const {
//     data: { text },
//   } = await worker.recognize(imagePath);

//   await worker.terminate();

//   return text;
// }

// // 이미지 파일 경로를 전달하여 텍스트 추출
// // const imagePath =
// //   'file:///Users/im-anna/Desktop/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202023-06-23%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2012.25.11.png';
// const imagePath = './img/1.png';

// extractTextFromImage(imagePath)
//   .then((text) => {
//     console.log('Extracted Text:', text);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// const tesseract = require('node-tesseract-ocr');

// const config = {
//   lang: 'eng+kor',
//   oem: 1,
//   psm: 3,
// };

// tesseract
//   .recognize('./img/1.png', config)
//   .then((text) => {
//     console.log('Result:', text);
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });
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
