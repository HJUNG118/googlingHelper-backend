const express = require('express');
require('dotenv').config();
const { connectDB, getDB } = require('../../config/mongodb');
const router = express.Router();
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

const { extractUserName } = require('../../function/extractUserName');

router.post('/', async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7);
    }
    const username = await extractUserName(userToken);
    await connectDB('memo');
    const memoCollection = getDB('memo').collection(username);
    const projection = { memoTitle: 1, time: 1 };
    const result = await memoCollection.find({}, projection).toArray();
    const memoData = result.map((doc) => ({
      memoTitle: doc.memoTitle,
      time: doc.time,
    }));
    if (memoData.length === 0) {
      res.status(200).json({ message: 'empty' });
    } else {
      res.status(200).json({ memoData });
    }
  } catch (error) {
    res.status(500).json({ message: 'error' });
  }
});

module.exports = router;
