require('dotenv').config();
const { connectDB, getDB } = require('../config/mongodb');

const searchData = async (username, search) => {
  try {
    await connectDB('scrapData');
    const db = getDB('scrapData');
    let result = [];
    const collections = await db.listCollections({ name: username }).toArray();
    const scrapCollectionExists = collections.length > 0;

    if (!scrapCollectionExists) {
      return result; // 빈 배열 반환
    }

    const scrapCollection = db.collection(username);

    const indexes = await scrapCollection.indexes();
    const textIndexExists = indexes.some((index) => index.name === 'text_1');

    if (!textIndexExists) {
      await scrapCollection.createIndex({ text: 'text' });
    }
    const documents = await scrapCollection.find({ text: { $regex: search } }).toArray();

    for (const doc of documents) {
      const foundElements = doc.text.filter((element) => new RegExp(search, 'i').test(element));
      result = result.concat(foundElements);
    }

    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { searchData };
