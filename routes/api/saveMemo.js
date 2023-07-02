require("dotenv").config();
const { connectDB, getDB } = require("../../config/mongodb");
const express = require("express");
const router = express.Router();
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());

const { extractUserName } = require("../../function/extractUserName");

router.post("/", async (req, res) => {
  try {
    const { memoTitle, memoContents, time } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7);
    }
    const username = await extractUserName(userToken);
    await connectDB("memo");
    const memoCollection = getDB("memo").collection(username);

    await memoCollection.createIndex({ memoTitle: 1 });
    const query = {
      time: time,
    };
    const existingMemo = await memoCollection.findOne(query);
    if (existingMemo) {
      const update = {
        $set: { memoTitle: memoTitle, memoContents: memoContents },
      };
      await memoCollection.updateOne(query, update);
      res.status(200).json({ message: "updated" });
    } else {
      // 도큐먼트가 존재하지 않는 경우 새로 생성
      const newMemo = {
        time: time,
        memoTitle: memoTitle,
        memoContents: memoContents,
      };
      await memoCollection.insertOne(newMemo);
      res.status(200).json({ message: "created" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
