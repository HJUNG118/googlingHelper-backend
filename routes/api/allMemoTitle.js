const express = require('express');
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;
const router = express.Router();
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

const { extractUserName } = require('../../function/extractUserName');

router.post('/', async (req, res) => {
  const client = await MongoClient.connect(conn_str);
  try {
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7);
    }
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const database = client.db('memo');
    const memoCollection = database.collection('memos');

    // 도큐먼트들의 memoTitle 필드를 추출
    const query = { username: username };
    const projection = { memoTitle: 1 };
    const result = await memoCollection.find(query, projection).toArray();
    const memoTitles = result.map((doc) => doc.memoTitle);

    res.status(200).json({ memoTitles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error' });
  } finally {
    client.close();
  }
});

module.exports = router;
