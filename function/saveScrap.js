require("dotenv").config();
const { MongoClient } = require("mongodb");
const conn_str = process.env.mongoURI;

const saveScrap = async (username, keyWord, url, date, time, title, texts) => {
  let client;
  try {
    client = await MongoClient.connect(conn_str);
    const session = client.startSession(); // 세션 생성
    session.startTransaction(); // 트랜잭션 시작
    console.log("Atlas에 연결 완료");
    const database = client.db("scrapData");
    console.log(username);
    const scrapCollection = database.collection(username);

    if (texts === undefined) {
      texts = [];
    }

    const existingScrap = await scrapCollection.findOne({
      keyWord: keyWord,
      title: title,
    });

    if (existingScrap) {
      existingScrap.text.push(...texts);
      const updateResult = await scrapCollection.updateOne(
        { _id: existingScrap._id },
        { $set: { text: existingScrap.text } }
      );
      if (updateResult.modifiedCount > 0) {
        return "complete";
      } else {
        throw new Error("Failed to update");
      }
    } else {
      const newScrap = {
        user: username,
        keyWord: keyWord,
        title: title,
        url: url,
        time: time,
        date: date,
        text: texts, // texts 배열로 저장
      };

      const insertResult = await scrapCollection.insertOne(newScrap);
      if (insertResult.insertedId) {
        return "complete";
      } else {
        throw new Error("Failed to insert");
      }
    }
  } catch (error) {
    return Promise.reject(error);
  } finally {
    if (client) {
      client.close();
    }
  }
};

module.exports = { saveScrap };
