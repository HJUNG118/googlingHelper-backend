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

const authRouter = require('./routes/api/auth');
app.use('/api/auth', authRouter);

const registerRouter = require('./routes/api/register');
app.use('/api/register', registerRouter);

const loginRouter = require('./routes/api/login');
app.use('/api/login', loginRouter);

const logoutRouter = require('./routes/api/logout');
app.use('/api/logout', logoutRouter);

const deleteTitleRouter = require('./routes/api/deleteTitle');
app.use('/api/deleteTitle', deleteTitleRouter);

const deleteKeyWordRouter = require('./routes/api/deleteKeyWord');
app.use('/api/deleteKeyWord', deleteKeyWordRouter);

const giveUserName = require('./routes/api/giveUserName');
app.use('/api/giveUserName', giveUserName);

const checkEmail = require('./routes/api/checkEmail');
app.use('/api/checkEmail', checkEmail);

const saveScrapRouter = require('./routes/api/saveScrap');
app.use('/api/saveScrap', saveScrapRouter);

const deleteMemoRouter = require('./routes/api/deleteMemo');
app.use('/api/deleteMemo', deleteMemoRouter);

const deleteScrapTextRouter = require('./routes/api/deleteScrapText');
app.use('/api/deleteScrapText', deleteScrapTextRouter);

const checkStorageRouter = require('./routes/api/checkStorage');
app.use('/api/checkStorage', checkStorageRouter);

const checkKeywordRouter = require('./routes/api/checkKeyword');
app.use('/api/checkKeyword', checkKeywordRouter);

const textCaptureRouter = require('./routes/api/textCapture');
app.use('/api/textCapture', textCaptureRouter);

const imgCaptureRouter = require('./routes/api/imgCapture');
app.use('/api/imgCapture', imgCaptureRouter);

const memoContentsRouter = require('./routes/api/memoContents');
app.use('/api/memoContents', memoContentsRouter);

const saveMemoRouter = require('./routes/api/saveMemo');
app.use('/api/saveMemo', saveMemoRouter);

const allMemoTitleRouter = require('./routes/api/allMemoTitle');
app.use('/api/allMemoTitle', allMemoTitleRouter);

const searchDataRouter = require('./routes/api/searchData');
app.use('/api/searchData', searchDataRouter);

const imgCollectRouter = require('./routes/api/imgCollect');
app.use('/api/imgCollect', imgCollectRouter);

connectDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
