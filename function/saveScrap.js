require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const conn_str = process.env.mongoURI;

const saveScrap = async (username, keyWord, url, date, time, title, texts, img) => {
  const client = await MongoClient.connect(conn_str);
  try {
    const session = client.startSession(); // 세션 생성
    session.startTransaction(); // 트랜잭션 시작
    const database = client.db('scrapData');
    const scrapCollection = database.collection(username);
    const existingScrap = await scrapCollection.findOne({ date: date, title: title });
    let updateResult;
    if (existingScrap) {
      const existingScrapId = new ObjectId(existingScrap._id);
      if (texts && texts.length > 0) {
        updateResult = await scrapCollection.updateOne({ _id: existingScrapId }, { $push: { text: texts } });
      } else if (img && img.length > 0) {
        updateResult = await scrapCollection.updateOne({ _id: existingScrapId }, { $push: { img: img } });
      } else {
        client.close();
        return 'duplicate';
      }
      if (updateResult && updateResult.modifiedCount > 0) {
        client.close();
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
        client.close();
        return 'complete';
      } else {
        throw new Error('Failed to insert');
      }
    }
  } catch (error) {
    client.close();
    return Promise.reject(error);
  }
};

module.exports = { saveScrap };
