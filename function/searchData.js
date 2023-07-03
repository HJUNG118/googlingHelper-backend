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
      return result; // Return an empty array
    }

    const scrapCollection = db.collection(username);
    const indexes = await scrapCollection.indexes();
    const textIndexExists = indexes.some((index) => index.name === 'text_1');

    if (!textIndexExists) {
      await scrapCollection.createIndex({ text: 'text' });
    }

    // Modified part: Build a regular expression to search for each word individually
    const searchTerms = search.split(' ');
    const searchRegexParts = searchTerms.map((term) => `(?=.*${term})`);
    const searchRegex = new RegExp(searchRegexParts.join(''), 'i');
    const documents = await scrapCollection.find({ text: { $regex: searchRegex } }).toArray();

    for (const doc of documents) {
      const foundElements = doc.text.filter((element) => searchRegex.test(element));
      result = result.concat(foundElements);
    }

    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { searchData };
