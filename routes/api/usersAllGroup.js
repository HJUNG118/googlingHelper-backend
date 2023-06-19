const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

// token과 secretkey이용해서 _id, username추출
const extractAllGroup = async (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    const decodedUser = decoded.user; // 사용자 ID 반환
    const userID = String(decodedUser.id);
    const client = await MongoClient.connect(conn_str);
    const database = client.db('test');
    const usersCollection = database.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userID) });

    if (user) {
      const groups = Object.entries(user.group).map(([groupName, groupOwner]) => {
        return {
          groupName: groupName,
          groupOwner: groupOwner,
        };
      });
      return groups;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Invalid token');
  }
};

router.post('/', async (req, res) => {
  try {
    // const { userToken } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const allGroup = await extractAllGroup(userToken, process.env.jwtSecret);
    res.status(200).json(allGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
