const errorHandler = require("./errorHandler");
const nodemailer = require("nodemailer");
const SENDER_EMAIL = process.env.SMTP_SENDER_USER;
const SENDER_PASS = process.env.SMTP_SENDER_PASS;

const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net", // GoDaddy SMTP server
    port: 465, // GoDaddy SMTP port (secure)
    secure: true, // Use SSL
    auth: {
        user: SENDER_EMAIL, // Your GoDaddy email address
        pass: SENDER_PASS, // Your GoDaddy email password
    },
});

const sendActivationEmail = async (email, token) => {
    try {
        const activationLink = `${process.env.FRONTEND_URL}/activate/${token}`;
        const message = `
            Please click the following link to activate your account: ${activationLink}
        `;
        await sendEmail({
            email,
            subject: "Account Activation Link",
            message,
        });
    } catch (error) {
        errorHandler("sendActvationEmail system error", error);
    }
};
const sendEmail = async ({ email, subject, message }) => {
    const mailOptions = {
        from: SENDER_EMAIL, // Sender address
        to: email, // Recipient address
        subject: subject, // Subject line
        html: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.response}`);
        return true;
    } catch (error) {
        logger.error("Error sending email:", error);
        throw new Error(error);
    }
};
module.exports = {
    sendActivationEmail,
    sendEmail,
};
