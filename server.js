const express = require('express');
const connectDB = require('./config/db');
// var WebSocket = require('ws');
const app = express();
const PORT = 8080;
// const wss = new WebSocket.Server({
//   server: HTTPServer, // WebSocket서버에 연결할 HTTP서버를 지정한다.
// });

app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send('API Running');
});

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

const authRouter = require('./routes/api/auth');
app.use('/api/auth', authRouter);

const registerRouter = require('./routes/api/register');
app.use('/api/register', registerRouter);

const loginRouter = require('./routes/api/login');
app.use('/api/login', loginRouter);

const logoutRouter = require('./routes/api/logout');
app.use('/api/logout', logoutRouter);

const deleteUserScrapRouter = require('./routes/api/deleteUserScrap');
app.use('/api/deleteUserScrap', deleteUserScrapRouter);

const deleteKeyWordRouter = require('./routes/api/deleteKeyWord');
app.use('/api/deleteKeyWord', deleteKeyWordRouter);

// const saveUserScrapRouter = require("./routes/api/saveUserScrap");
// app.use("/api/saveUserScrap", saveUserScrapRouter);

// const keyWordByDateRouter = require("./routes/api/keyWordByDate");
// app.use("/api/keyWordByDate", keyWordByDateRouter);

const giveUserName = require('./routes/api/giveUserName');
app.use('/api/giveUserName', giveUserName);

const checkEmail = require('./routes/api/checkEmail');
app.use('/api/checkEmail', checkEmail);

const saveScrapRouter = require('./routes/api/saveScrap');
app.use('/api/saveScrap', saveScrapRouter);

const deleteScrapTextRouter = require('./routes/api/deleteScrapText');
app.use('/api/deleteScrapText', deleteScrapTextRouter);

const checkStorageRouter = require('./routes/api/checkStorage');
app.use('/api/checkStorage', checkStorageRouter);

const memoContentsRouter = require('./routes/api/memoContents');
app.use('/api/memoContents', memoContentsRouter);

const saveMemoRouter = require('./routes/api/saveMemo');
app.use('/api/saveMemo', saveMemoRouter);

const allMemoTitleRouter = require('./routes/api/allMemoTitle');
app.use('/api/allMemoTitle', allMemoTitleRouter);

connectDB();

// const HTTPServer = http.createServer(app);

// HTTPServer.on('upgrade', function upgrade(request, socket, head) {
//   wss.handleUpgrade(request, socket, head, function done(ws) {
//     wss.emit('connection', ws, request);
//   });
// });

// HTTPServer.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
