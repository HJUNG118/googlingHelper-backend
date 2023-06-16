const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;
const { ObjectId } = require('mongodb');

const checkEmail = async (email, res) => {
  try {
    const client = await MongoClient.connect(conn_str);
    const database = client.db('test');
    const usersCollection = database.collection('users');

    const existingUser = await usersCollection.findOne({ email });

    client.close();

    if (existingUser) {
      // 이메일에 해당하는 사용자가 이미 존재하는 경우
      return;
    } else {
      // 이메일에 해당하는 사용자가 존재하지 않는 경우
      return res.status(400).json({ errors: [{ msg: 'Invalid email' }] });
    }
  } catch (error) {
    throw error;
  }
};

router.post('/', async (req, res) => {
  const { email } = req.body;
  await checkEmail(email);
  res.status(200);
});

module.exports = router;