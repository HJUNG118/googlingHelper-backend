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
    const user = await usersCollection.findOne({_id: new ObjectId(userID)});
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

const getDateAndTime = async () => {
  const now = new Date(); // 현재 시간을 가져옴
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;
  const time = now.toLocaleTimeString(); // 시간을 추출 (HH:mm:ss 형식)
  const dateTime = {
    time: time,
    date: date,
  };
  return dateTime;
};

// 개인 유저 스크랩하기
const saveUserScrap = async (username, keyWord, url, date, time, title, res) => {
  try {
    const client = await MongoClient.connect(conn_str);
    console.log('Atlas에 연결 완료');
    const database = client.db('search');
    const userScrapCollection = database.collection(username);
    const collectionExists = (await userScrapCollection.countDocuments()) > 0;

    // user에 해당하는 스크랩 컬렉션이 있다면
    if (collectionExists) {
      const query = {
        'keyWords.keyWord': keyWord,
        'keyWords.date': date,
      };
      const keyWordObj = {
        title: title,
        url: url,
        time: time,
      };

      const existingScrap = await userScrapCollection.findOne(query);
      if (existingScrap && existingScrap.keyWords.some((kw) => kw.data.some((data) => data.title === title))) {
        console.log('중복된 스크랩입니다.');
        return res.status(409).send('중복된 스크랩');
      }

      const update = {
        $push: {
          'keyWords.$.data': keyWordObj,
        },
      };
      const result = await userScrapCollection.updateOne(query, update);
      // 날짜나 키워드가 달라지면 새로운 keyWord 필드 추가
      if (result.matchedCount === 0) {
        await userScrapCollection.updateOne(
          { user: username },
          {
            $push: {
              keyWords: {
                keyWord: keyWord,
                data: [
                  {
                    title: title,
                    url: url,
                    time: time,
                  },
                ],
                date: date,
              },
            },
          }
        );
      } else {
        console.log('url이 성공적으로 추가되었다.');
      }
    } else {
      // user에 해당하는 스크랩 컬렉션이 없다면 완전 새롭게 생성
      const newDocument = {
        user: username,
        keyWords: [
          {
            keyWord: keyWord,
            data: [
              {
                title: title,
                url: url,
                time: time,
              },
            ],
            date: date,
          },
        ],
      };
      await userScrapCollection.insertOne(newDocument);
    }
    client.close();
    res.status(200).send('저장완료');
  } catch (error) {
    console.error('Atlas 및 데이터 저장 오류:', error);
    res.status(400);
  }
};

router.post('/', async (req, res) => {
  const { userToken, keyWord, url, title } = req.body;
  const dateTime = await getDateAndTime();
  const username = await extractUserName(userToken, process.env.jwtSecret);
  // 6489af7bf433c92057edd0b0
  saveUserScrap(username, keyWord, url, dateTime.date, dateTime.time, title, res);
});

module.exports = router;
