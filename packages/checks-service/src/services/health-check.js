process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const axios = require('axios');
const mail = require('../services/mail');
const telegram = require('../services/telegram');
const { save } = require('../database/mongodb');

const check = async ({ _id, name, address, telegram_notify, email_notify }) => {
  try {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    console.log(`Checking ${name} (${address})`);

    setTimeout(() => {
      source.cancel()
    }, 30000)

    const { data } = await axios.get(address, {
      timeout: 30000,
      cancelToken: source.token
    });

    if (data) {
      const inserted = await save('checks', { ...data, checked_at: new Date() });
      
      // console.log('---> Sucesso!', name, `uptime: ${data.uptime}`)
    } else {
      const inserted = await save('checks', { ...data, checked_at: new Date() });

      if (email_notify) {
        mail({ name, error: data.message, to: email_notify })
      }
      if (telegram_notify) {
        telegram.sendMessageAllUsers(`Error in ${name} check: ${data.message}`)
      }
      // console.log('---> Erro interno!', name, data.message)
    }

  } catch (e) {
    if (axios.isCancel(e)) {
      const inserted = await save('checks', { name, code: e.code, error: e.message, checked_at: new Date() });
      if (email_notify) {
        mail({ name, error: 'Request timeout (canceled 30s)', to: email_notify })
      }

      if (telegram_notify) {
        telegram.sendMessageAllUsers(`Error in ${name} check: Request timeout (canceled 30s)`)
      }

      console.log('Request canceled', name, e.message);
    } else {
      const inserted = await save('checks', { name, code: e.code, error: e.message, checked_at: new Date() });

      if (email_notify) {
        mail({ name, error: `${e.code || 0} ${e.message}`, to: email_notify })
      }

      if (telegram_notify) {
        telegram.sendMessageAllUsers(`Error in ${name} check: ${e.code || 0} ${e.message}`)
      }
      console.log('---> Erro:', name, e.code, e.message);
    }
  }
}

module.exports = check;