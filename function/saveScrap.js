require('dotenv').config();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;

const saveScrap = async (username, keyWord, url, date, time, title, texts, img) => {
  const client = await MongoClient.connect(conn_str);
  try {
    const session = client.startSession(); // 세션 생성
    session.startTransaction(); // 트랜잭션 시작
    const database = client.db('scrapData');
    const scrapCollection = database.collection(username);
    const existingScrap = await scrapCollection.findOne({ title: title, keyWord: keyWord });
    let updateResult;
    if (existingScrap) {
      if (texts && texts.length > 0) {
        updateResult = await scrapCollection.updateOne({ _id: existingScrap._id }, { $push: { text: texts } });
      } else if (img && img.length > 0) {
        updateResult = await scrapCollection.updateOne({ _id: existingScrap._id }, { $push: { img: img } });
      } else {
        return 'duplicate';
      }
      if (updateResult && updateResult.modifiedCount > 0) {
        return 'update';
      } else {
        throw new Error('Failed to update');
      }
    } else {
      const newScrap = {
        user: username,
        keyWord: keyWord,
        title: title,
        url: url,
        time: time,
        date: date,
        text: texts && texts.length > 0 ? [texts] : [], // Store texts if it exists, otherwise store an empty array
        img: img && img.length > 0 ? [img] : [], // Store img if it exists, otherwise store an empty array
      };

      const insertResult = await scrapCollection.insertOne(newScrap);
      if (insertResult.insertedId) {
        return 'complete';
      } else {
        throw new Error('Failed to insert');
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
