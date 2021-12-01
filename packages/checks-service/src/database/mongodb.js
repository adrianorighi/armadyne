const { MongoClient } = require('mongodb')

const { connectionString, database } = require('../configs/database')

const mongoClient = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connect = async () => {
  try {
    const client = await mongoClient.connect();
    console.log('Connected to MongoDb');
    return client;
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    process.exit(-1);
  }
}

/**
 * Insert one row into the database
 * @param {string} collection 
 * @param {object} data 
 * @returns inserted object
 */
const save = async (collection, data) => {
  try {
    await mongoClient.connect()
    return mongoClient.db(database)
      .collection(collection)
      .insertOne(data);
  } catch (error) {
    console.error(`Database save error: ${error}`);
  }
}

/**
 * Delete one row from the database
 * @param {string} collection 
 * @param {object} condition 
 * @returns deleted object
 */
 const remove = async (collection, condition) => {
  try {
    await mongoClient.connect()
    return mongoClient.db(database)
      .collection(collection)
      .deleteOne(condition);
  } catch (error) {
    console.error(`Database remove error: ${error}`);
  }
}

const findOne = async (collection, condition) => {
  try {
    await mongoClient.connect()
    return mongoClient.db(database)
      .collection(collection)
      .findOne(condition);
  } catch (error) {
    console.error(`Database findOne error: ${error}`);
  }
}

const find = async (collection, condition) => {
  try {
    await mongoClient.connect()
    return mongoClient.db(database)
      .collection(collection)
      .find(condition);
  } catch (error) {
    console.error(`Database find error: ${error}`);
  }
}

const count = async (collection, condition) => {
  try {
    await mongoClient.connect()
    return mongoClient.db(database)
      .collection(collection)
      .count(condition);
  } catch (error) {
    console.error(`Database count error: ${error}`);
  }
}

module.exports = { connect, save, remove, findOne, count, find };