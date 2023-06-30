require('dotenv').config();
const { MongoClient } = require('mongodb');

const conn_str = process.env.mongoURI;
const client = new MongoClient(conn_str, { useNewUrlParser: true, useUnifiedTopology: true });

const connectDB = async (dbName = 'default') => {
  try {
    await client.connect();
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

const getDB = (dbName = 'default') => {
  if (!client.topology.isConnected()) {
    throw Error('DB not connected. Call connectDB first.');
  }
  return client.db(dbName);  // dbName 인자로 원하는 DB를 선택
};

module.exports = { connectDB, getDB };
