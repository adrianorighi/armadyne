require('dotenv').config()

const smtp = {
    host: 'smtp.mailtrap.io',
    port: 2525,
    user: '13cfbc9e4f5c74',
    pass: 'b1af63ef80b397',
    secure: false, // true for 465, false for other ports
    from: 'noreply@adrianorighi.com'
}

module.exports = smtp;