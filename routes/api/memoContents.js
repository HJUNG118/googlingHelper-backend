require("dotenv").config();
const { client } = require("../../config/mongodb");
const express = require("express");
const router = express.Router();
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());

const { connectDB, getDB } = require("../../config/mongodb");
const { extractUserName } = require("../../function/extractUserName");

router.post("/", async (req, res) => {
  try {
    const { time } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const username = await extractUserName(userToken);
    await connectDB("memo");
    const memoCollection = getDB("memo").collection(username);
    const query = {
      time: time,
    };
    const memo = await memoCollection.findOne(query);
    if (memo) {
      const responseData = {
        memoTitle: memo.memoTitle,
        memoContent: memo.memoContents,
      };
      res.status(200).json(responseData);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
