require('dotenv').config();
const { MongoClient } = require('mongodb');

const conn_str = process.env.mongoURI;
const client = new MongoClient(conn_str, { useNewUrlParser: true, useUnifiedTopology: true });

const connectedDBs = {}; // 이미 연결된 클라이언트를 추적하기 위한 객체

const connectDB = async (dbName = 'default') => {
  try {
    if (connectedDBs[dbName]) {
      console.log(`Already connected to ${dbName}`);
      return;
    }

    await client.connect();
    connectedDBs[dbName] = true;
    console.log(`MongoDB Connected to ${dbName}`);
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

const getDB = (dbName = 'default') => {
  if (!client.topology.isConnected()) {
    throw Error('DB not connected. Call connectDB first.');
  }
  return client.db(dbName);
};

module.exports = { connectDB, getDB };
