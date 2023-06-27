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

router.post('/', async (req, res) => {
  const client = await MongoClient.connect(conn_str);
  try {
    const { time } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const username = await extractUserName(userToken);
    const database = client.db('memo');
    const memoCollection = database.collection(username);
    const query = {
      time: time,
    };
    const memo = await memoCollection.findOne(query);
    client.close();
    if (memo) {
      const responseData = {
        memoTitle: memo.memoTitle,
        memoContent: memo.memoContents,
      };
      res.status(200).json(responseData);
    } else {
      res.status(404).json({ message: 'not found' });
    }
  } catch (error) {
    console.error(error);
    client.close();
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
