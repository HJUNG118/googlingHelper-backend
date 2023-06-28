require('dotenv').config();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;

const searchData = async (username, search) => {
  const client = await MongoClient.connect(conn_str);
  try {
    const session = client.startSession();
    session.startTransaction();

    const database = client.db('scrapData');
    const scrapCollection = database.collection(username);

    const documents = await scrapCollection.find({}).toArray();

    console.log(documents);

    let result = [];
    for (const doc of documents) {
      const foundElements = doc.text.filter(element => element.includes(search));
      result = result.concat(foundElements);
    }

    return result;
  } catch (error) {
    client.close();
    return Promise.reject(error);
  }
};

module.exports = { searchData };
