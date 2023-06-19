const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const conn_str = process.env.mongoURI;
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());

const { keyWordByDate } = require("../../function/keyWordByDate");
const { saveUserScrap } = require("../../function/saveUserScrap");
const { getDateAndTime } = require("../../function/getDateAndTime");

// token과 secretkey이용해서 _id, username추출
const extractUserName = async (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    const decodedUser = decoded.user; // 사용자 ID 반환
    const userID = String(decodedUser.id);
    const client = await MongoClient.connect(conn_str);
    const database = client.db("test");
    const usersCollection = database.collection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(userID) });
    if (user) {
      const userName = user.name;
      return userName;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error("Invalid token");
  }
};

router.post("/", async (req, res) => {
  try {
    const { keyWord, url, title } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const dateTime = await getDateAndTime();
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const result = await saveUserScrap(
      username,
      keyWord,
      url,
      dateTime.date,
      dateTime.time,
      title
    );
    const dataToSend = await keyWordByDate(username);
    res.status(200).json(dataToSend);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;