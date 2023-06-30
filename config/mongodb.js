require('dotenv').config();
const conn_str = process.env.mongoURI;
const { MongoClient } = require('mongodb');

const client = new MongoClient(conn_str, { useNewUrlParser: true });

const connectDB = async () => {
  try {
    await client.connect();
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = { connectDB, client };
