require('dotenv').config();
const { connectDB, getDB } = require('../config/mongodb');

const searchData = async (username, search) => {
  try {
    // const session = client.startSession();
    // session.startTransaction();

    await connectDB('scrapData');
    const scrapCollection = getDB('scrapData').collection(username);

    // Check if the 'text' index already exists
    const indexes = await scrapCollection.indexes();
    const textIndexExists = indexes.some((index) => index.name === 'text_1');

    // If the 'text' index doesn't exist, create it
    if (!textIndexExists) {
      await scrapCollection.createIndex({ text: 'text' });
    }

    // Using text search for 'search' term
    const documents = await scrapCollection.find({ text: { $regex: search } }).toArray();

    let result = [];
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
