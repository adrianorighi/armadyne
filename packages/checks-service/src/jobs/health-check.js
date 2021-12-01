const cron = require('node-cron');

const { check } = require('../services')
const { find, count } = require('../database/mongodb');

const healthCheckJob = async () => {
  const EVERY_MINUTE = '* * * * *';
  const EVERY_30_SECONDS = '*/30 * * * * *'

  console.log('Started cronjob');

  const hasMonitors = await count('monitors');

  if (hasMonitors) {
    cron.schedule(EVERY_MINUTE, async () => {
      const checks = await find('monitors');
      checks.forEach((job) => {
        check(job);
      })
    });
  }

}

module.exports = healthCheckJob