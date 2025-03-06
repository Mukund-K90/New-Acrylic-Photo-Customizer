const nodemailer = require("nodemailer");
const { CONFIG } = require("../config/config");

module.exports.mailService = async (to, sub,html ,data) => {
    console.log(CONFIG.port, CONFIG.email, CONFIG.emailPassword);

    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: CONFIG.email,
                pass: CONFIG.emailPassword,
            },
            tls: {
                rejectUnauthorized: true,
            },
        });

        let mailOption = {
            from: CONFIG.email,
            to: to,
            subject: sub,
            html: html,
        };

        transporter.sendMail(mailOption, async (err, info) => {
            if (err) {
                return console.log(err);
            }
            console.log("Message sent:%s", info.accepted);
            console.log("Preview URL:%s", nodemailer.getTestMessageUrl(info));
        });
    } catch (error) {
        console.error(error);
    }
};