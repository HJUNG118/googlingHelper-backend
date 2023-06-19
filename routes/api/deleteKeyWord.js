const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const conn_str = process.env.mongoURI;
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

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

const deleteKeyWord = async (username, keyWord, date, res) => {
  try {
    const client = await MongoClient.connect(conn_str);
    const database = client.db('search');
    const userScrapCollection = database.collection(username);
    const result = await userScrapCollection.findOne({ user: username });

    // keyWord에 해당하는 데이터 삭제
    result.keyWords = result.keyWords.filter((keyword) => !(keyword.date === date && keyword.keyWord === keyWord));

    if (result.keyWords.length === 0) {
      // keyWords 배열이 모두 비었을 경우 컬렉션 삭제
      await userScrapCollection.drop();
    }

    await userScrapCollection.updateOne({ user: username }, { $set: { keyWords: result.keyWords } });
    return { message: '데이터 삭제 완료' };
  } catch (error) {
    console.error(error);
    res.status(500).json('스크랩 삭제 오류');
  }
};

router.delete('/', async (req, res) => {
  try {
    const { keyWord, date } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
      console.log(userToken);
    }
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const message = await deleteKeyWord(username, keyWord, date, res);
    res.status(200).json(message);
  } catch (error) {
    console.error('Atlas 및 데이터 삭제 오류:', error);
    res.status(500).json('오류');
  }
});

module.exports = router;
