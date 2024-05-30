const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const send = (destinatario, assunto, texto) => {
    transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: destinatario,
        subject: assunto,
        text: texto
    });
};

module.exports = {
    send
}