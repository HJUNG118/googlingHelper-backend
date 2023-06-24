require('dotenv').config();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;

const saveScrap = async (username, keyWord, url, date, time, title, texts, img) => {
  const client = await MongoClient.connect(conn_str);
  try {
    // Connect to the database
    const db = client.db('scrapData');
    const scrapCollection = db.collection(username);

    // Check if the scrap already exists
    const existingScrap = await scrapCollection.findOne({ title: title, keyWord: keyWord });
    let updateResult;
    if (existingScrap) {
      // Update existing scrap with texts and/or img
      if (texts && texts.length > 0) {
        console.log('texts in');
        updateResult = await scrapCollection.updateOne({ _id: existingScrap._id }, { $push: { text: texts } });
      }
      if (img && img.length > 0) {
        console.log('img in');
        updateResult = await scrapCollection.updateOne({ _id: existingScrap._id }, { $push: { img: img } });
      }
      if (updateResult && updateResult.modifiedCount > 0) {
        return 'update';
      } else {
        throw new Error('Failed to update');
      }
    } else {
      console.log('new');
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
    throw error;
  } finally {
    if (client) {
      client.close();
    }
  }
};

module.exports = { saveScrap };
