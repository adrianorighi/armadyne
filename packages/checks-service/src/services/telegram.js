process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const { save, remove, count, find } = require('../database/mongodb');
const { token } = require('../configs/telegram');

const TELEGRAM_TOKEN = token; // Armadyne

const telegram = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const answerCallbacks = {};

telegram.on('message', function (message) {
  var callback = answerCallbacks[message.chat.id];
  if (callback) {
    delete answerCallbacks[message.chat.id];
    return callback(message);
  }
});

const start = async () => {
  try {
    console.log('Started Telegram');

    telegram.onText(/\/start/, async (msg) => {
      const { from: { username, first_name, last_name }, chat: { id: chat_id } } = msg;

      if (username != 'adrianorighi') {
        return telegram.sendMessage(msg.chat.id, `Desculpe, este bot não está disponível para você!`)
      }

      const name = `${first_name} ${last_name}`

      const find = await count('users', { chat_id, username });

      if (find > 0) {
        return telegram.sendMessage(chat_id, `${name},  você já está cadastrado!`)
      }

      await save('users', { chat_id, name, username });

      return telegram.sendMessage(chat_id, `Bem-vindo!`)
    })
  } catch (e) {
    console.log('Telegram error: ', e)
  }
}

const sendMessageAllUsers = async (message) => {
  try {
    console.log('Sending message all users Telegram');
    const checkHasUsers = await count('users');

    if (checkHasUsers === 0) {
      console.log('No matching users.');
      return;
    }

    const users = await find('users');
    users.forEach((user) => {
      telegram.sendMessage(user.chat_id, message);
    })

  } catch (e) {
    console.log('Telegram send message all users error: ', e);
  }
}

const exit = async () => {
  try {
    telegram.onText(/\/exit/, async (msg) => {
      const { from: { username }, chat: { id: chat_id } } = msg;

      await remove('users', { chat_id, username });

      telegram.sendMessage(chat_id, `Descadastrado com sucesso! \n "Taking Mankind Into The Future"`);
    });
  } catch (e) {
    console.log('Telegram exit error: ', e);
  }
}

const monitor = async () => {
  try {
    telegram.onText(/\/monitor/, async (message) => {
      telegram.sendMessage(message.chat.id, "Enter monitor name:").then(async () => {
        answerCallbacks[message.chat.id] = async (answer) => {
          const name = answer.text;
          telegram.sendMessage(message.chat.id, "Enter health check endpoint (http/https):").then(async () => {
            answerCallbacks[message.chat.id] = async (answer) => {
              const address = answer.text;
              await save('monitors', { name, address, telegram_notify: true, email_notify: false });
              telegram.sendMessage(message.chat.id, `Monitor ${name} cadastrado com sucesso e iniciado!`)
            }
          });
        }
      });
    });
  } catch (e) {
    console.log('Telegram monitor error: ', e)
  }
}

const setup = async () => {
  start();
  exit();
  monitor();
}
module.exports = { start, sendMessageAllUsers, exit, monitor, setup }