const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const puppeteer = require('puppeteer');

const conn_str = 'mongodb+srv://sangunlee6:CH85SeCjNpTusjyG@cluster0.ohxqbnx.mongodb.net/?retryWrites=true&w=majority'; // MongoDB 연결 문자열
const uri = 'mongodb://localhost:27017';
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 개인 유저 스크랩하기
const saveUserScrap = async (user, keyWord, url, date) => {
  try {
    const client = await MongoClient.connect(uri);
    console.log('Atlas에 연결 완료');
    const database = client.db('search');
    const userScrapCollection = database.collection(user);
    const collectionExists = await userScrapCollection.countDocuments() > 0;
    // user에 해당하는 스크랩 컬렉션이 있다면
    if (collectionExists) {
      console.log('컬렉션 있음')
      const query = {
        user: user,
        'keyWords.keyWord': keyWord,
        'keyWords.date': date,
      };
      const update = {
        $push: {
          'keyWords.$.urls': url,
        },
      };
      // 검색어에 해당하는 url배열이 있으면 새 url추가, 없으면 그냥 keyWords배열에 push
      const result = await userScrapCollection.updateOne(query, update);
      if (result.matchedCount === 0) {
        await userScrapCollection.updateOne(
          { user: user },
          {
            $push: {
              keyWords: {
                keyWord: keyWord,
                urls: [url],
                date: date,
              },
            },
          },
        );
      } else {
        console.log('url이 성공적으로 추가되었다.');
      }
    } else { // user에 해당하는 스크랩 컬렉션이 없다면 생성
      console.log('컬렉션 없음')
      const newDocument = {
        user: user,
        keyWords: [
          {
            keyWord: keyWord,
            urls: [url],
            date: date,
          },
        ],
      };
      await userScrapCollection.insertOne(newDocument);
    }
    console.log('스크랩 데이터 정상적으로 저장 완료');
    client.close();
  } catch (error) {
    console.error('Atlas 및 데이터 저장 오류:', error);
  }
};

// 익스텐션 스크랩하면 db에 searchUrl, searchTitle, searchDate 저장
app.post('/scrap', (req, res) => {
  const { user, keyWord, url, date } = req.body; // 로그인 아이디도 같이 받아야 할것 같음
  saveUserScrap(user, keyWord, url, date);
  res.status(200).json({ message: 'data sucessfully' });
});

app.listen(8080, () => {
  console.log('서버가 8080포트에 연결');
});
