const nodemailer = require("nodemailer");
const { host, port, secure, user, pass, from } = require("../configs/smtp");

const mail = async ({ name, error, to }) => {
  try {
    let transporter = await nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Righi Monitor 👻" <${from}>`, // sender address
      to, // list of receivers
      subject: `✕ ${name} monitor`, // Subject line
      text: `${name} monitor error reporter`, // plain text body
      html: `<b>Monitor error reporter</b><br>
      - ${name}: ${error}`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (e) {
    console.log(e)
  }
}

module.exports = mail;