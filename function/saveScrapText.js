require("dotenv").config();
const { MongoClient } = require("mongodb");
const conn_str = process.env.mongoURI;

const saveScrapText = async (username, keyWord, url, date, time, title, texts) => {
  let client;
  try {
    client = await MongoClient.connect(conn_str);
    const session = client.startSession(); // 세션 생성
    session.startTransaction(); // 트랜잭션 시작
    console.log("Atlas에 연결 완료");
    const database = client.db("scrapText");
    const scrapCollection = database.collection(username);

    const newScrap = {
      user: username,
      keyWord: keyWord,
      title: title,
      url: url,
      time: time,
      date: date,
      text: texts, // texts 배열로 저장
    };
    const result = await scrapCollection.findOne({
      keyWord: keyWord,
      title: title,
    });
    if (result) {
      return "duplicate";
    } else {
      const insertResult = await scrapCollection.insertOne(newScrap);
      if (insertResult.insertedId) {
        return "complete";
      } else {
        throw new Error("Failed");
      }
    }
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      client.close();
    }
  }
};

module.exports = { saveScrapText };
