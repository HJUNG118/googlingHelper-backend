/* server.js */

// (1) express 모듈 가져오기
const express = require("express");
// (2) ./config/db 경로에서 connectDB 함수 가져오기
// → DB 에 연결하는 함수
const connectDB = require("./config/db");
// (3) Express application 생성
// → app 을 통해 서버를 구성하고 미들웨어 및 라우팅 추가
const app = express();
// (4) 서버가 실행할 포트 번호 설정 : 6000번
const PORT = 8080;

app.use(express.json());
const cors = require('cors');
app.use(cors());

// (5) 클라이언트에서 전송된 JSON 데이터를 파싱
// → JSON 파싱이 되어야 req.body 처럼 데이터에 접근 가능
app.use(express.json({ extended: false }));

// (6) [GET, url : / ] 로 들어왔을 때 처리할 핸들러 등록
app.get("/", (req, res) => {
  // (7) 응답으로 메세지 전달
  res.send("API Running");
});

// (8) authRouter : ./routes/api/auth 파일 경로에 있는 라우터 객체
const authRouter = require("./routes/api/auth");
// (9) [ 모든 요청, url : /api/auth ] 로 들어왔을 떄 authRouter 로 처리
app.use("/api/auth", authRouter);


// (10) [모든 요청, url : /api/register ] 로 들어왔을 때 registerRouter 로 처리
const registerRouter = require("./routes/api/register");
app.use("/api/register", registerRouter);

const loginRouter = require("./routes/api/login");
app.use("/api/login", loginRouter);

const deleteUserScrapRouter = require("./routes/api/deleteUserScrap");
app.use("/api/deleteUserScrap", deleteUserScrapRouter);

const saveUserScrapRouter = require("./routes/api/saveUserScrap");
app.use("/api/saveUserScrap", saveUserScrapRouter);

const keyWordByDateRouter = require("./routes/api/keyWordByDate");
app.use("/api/keyWordByDate", keyWordByDateRouter);

const deleteKeyWordRouter = require("./routes/api/deleteKeyWord");
app.use("/api/deleteKeyWord", deleteKeyWordRouter);

const giveUserName = require("./routes/api/giveUserName");
app.use("/api/giveUserName", giveUserName);

const logoutRouter = require("./routes/api/logout");
app.use("/api/logout", logoutRouter);

// (11) MongoDB 와 서버 연결
connectDB();
// (12) Express application 을 PORT 번호에서 실행
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


