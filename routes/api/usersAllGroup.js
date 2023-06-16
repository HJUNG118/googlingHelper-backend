const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

// token과 secretkey이용해서 _id, username추출
const extractUserName = async (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    const decodedUser = decoded.user; // 사용자 ID 반환
    const userID = String(decodedUser.id);
    const client = await MongoClient.connect(conn_str);
    const database = client.db('test');
    const usersCollection = database.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userID) });
    if (user) {
      const userName = user.name;
      return userName;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const usersAllGroup = async (username) => {
  try {
    const client = await MongoClient.connect(conn_str);
    const database = client.db('search');
    const memberCollection = database.collection(username);

    const documents = await memberCollection.find().toArray();
    const extractedData = documents
      .filter((doc) => doc.groupName && doc.groupOwner) // groupName과 groupOwner가 모두 존재하는 문서만 필터링
      .map((doc) => ({
        [doc.groupName]: doc.groupOwner,
      }));

    client.close();
    return extractedData;
  } catch (error) {
    throw error;
  }
};

router.post('/', async (req, res) => {
  try {
    const { userToken } = req.body;
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const dataToSend = await usersAllGroup(username);
    res.status(200).json(dataToSend);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
