require('dotenv').config()

const express = require('express');

const healthCheckJob = require('./jobs/health-check');

const bot = require('./services/telegram');

const mongodb = require('./database/mongodb');

const app = express();
const router = express.Router();

mongodb.connect();

healthCheckJob();

bot.setup();

app.use(router);

app.listen(process.env.PORT || 3000, () => console.info(`Server started on port ${process.env.PORT || 3000}`))