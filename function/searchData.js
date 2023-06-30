require("dotenv").config();
const { client } = require("../config/mongodb");

const searchData = async (username, search) => {
  try {
    const session = client.startSession();
    session.startTransaction();

    const database = client.db("scrapData");
    const scrapCollection = database.collection(username);

    // Check if the 'text' index already exists
    const indexes = await scrapCollection.indexes();
    const textIndexExists = indexes.some((index) => index.name === "text_1");

    // If the 'text' index doesn't exist, create it
    if (!textIndexExists) {
      await scrapCollection.createIndex({ text: "text" });
    }

    // Using text search for 'search' term
    const documents = await scrapCollection
      .find({ $text: { $search: search } })
      .toArray();

    let result = [];
    for (const doc of documents) {
      const foundElements = doc.text.filter((element) =>
        element.includes(search)
      );
      result = result.concat(foundElements);
    }

    return result;
  } catch (error) {
    client.close();
    return Promise.reject(error);
  }
};

module.exports = { searchData };
