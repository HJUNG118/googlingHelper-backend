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

// 스크랩 하나 삭제
const deleteUserScrap = async (username, url, title, date, res) => {
  try {
    const client = await MongoClient.connect(conn_str);
    const database = client.db('search');
    const userScrapCollection = database.collection(username);
    const result = await userScrapCollection.findOne({ user: username });
    let dataDeleted = false;

    // keyWords 배열을 순회하면서 데이터 삭제
    for (let i = 0; i < result.keyWords.length; i++) {
      const keywordData = result.keyWords[i].data;
      const keywordDate = result.keyWords[i].date;
      if (keywordDate !== date) {
        continue;
      } else {
        const dataIndex = keywordData.findIndex((item) => item.title === title && item.url === url);
        if (dataIndex !== -1) {
          keywordData.splice(dataIndex, 1);
          dataDeleted = true;

          if (keywordData.length === 0) {
            // 데이터 배열이 비었을 경우 해당 키워드 삭제
            result.keyWords.splice(i, 1);
            if (result.keyWords.length === 0) {
              // keyWords 배열이 모두 비었을 경우 컬렉션 삭제
              await userScrapCollection.drop();
            }
          }
          break; // 삭제 완료 후 루프 종료
        }
      }
    }
    if (!dataDeleted) {
      // 해당 데이터가 없을 경우 에러 응답
      res.status(404);
      return { message: '해당 데이터를 찾을 수 없음' };
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
    const { url, title, date } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const message = await deleteUserScrap(username, url, title, date, res);
    res.status(200).json(message);
  } catch (error) {
    console.error('Atlas 및 데이터 삭제 오류:', error);
    res.status(500).json('오류');
  }
});

module.exports = router;
