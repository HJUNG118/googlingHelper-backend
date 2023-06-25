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
    const username = await extractUserName(userToken);
    const database = client.db('memo');
    const memoCollection = database.collection('memos');
    const query = { username: username };
    const projection = { memoTitle: 1, time: 1 };
    const result = await memoCollection.find(query, projection).toArray();
    const memoData = result.map((doc) => ({
      memoTitle: doc.memoTitle,
      time: doc.time,
    }));
    res.status(200).json({ memoData });
  } catch (error) {
    res.status(500).json({ message: 'error' });
  } finally {
    client.close();
  }
});

module.exports = router;
