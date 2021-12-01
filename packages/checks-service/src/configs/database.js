require('dotenv').config()

const database = {
  connectionString: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERNAME}.${process.env.MONGODB_CONNECTION_STRING}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
  database: process.env.MONGODB_DATABASE
}

module.exports = database;