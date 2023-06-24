require('dotenv').config();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;
const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

const { extractUserName } = require('../../function/extractUserName');
const { getDateAndTime } = require('../../function/getDateAndTime');

router.post('/', async (req, res) => {
  const client = await MongoClient.connect(conn_str);
  try {
    const { memoTitle, memoContents, time } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const database = client.db('memo');
    const memoCollection = database.collection('memos');
    await memoCollection.createIndex({ memoTitle: 1 });
    const query = {
      username: username,
      time: time,
    };
    const existingMemo = await memoCollection.findOne(query);
    if (existingMemo) {
      // 이미 도큐먼트가 존재하는 경우 업데이트
      const update = {
        $set: { memoTitle: memoTitle, memoContents: memoContents },
      };
      await memoCollection.updateOne(query, update);

      client.close();
      res.status(200).json({ message: 'updated' });
    } else {
      // 도큐먼트가 존재하지 않는 경우 새로 생성
      const newMemo = {
        username: username,
        time: time,
        memoTitle: memoTitle,
        memoContents: memoContents,
      };
      await memoCollection.insertOne(newMemo);
      client.close();
      res.status(200).json({ message: 'created' });
    }
  } catch (error) {
    console.error(error);
    client.close();
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
