const firebase = require('firebase-admin');
const serviceAccount = require('../configs/firestore.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const init = () => {
  try {
    const db = firebase.firestore();
    return db;
  } catch (e) {
    console.log(e)
  }
}

const insertUser = async ({chat_id, name, username}) => {
  try {
    const db = firebase.firestore();
    const user = await db.collection('users').where('chat_id', '==', chat_id).get()

    if (user.empty) {
      db.collection('users').add({
        chat_id,
        name,
        username
      })
    }
  } catch (e) {
    console.log(e)
  }
}

const getUsers = async () => {
  try {
    const db = firebase.firestore();
    return db.collection('users').get()
  } catch (e) {
    console.log(e)
  }
}


module.exports = { init, insertUser, getUsers }