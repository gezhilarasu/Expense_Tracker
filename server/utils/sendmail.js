
/*
// Export the function directly, not as an object with a property
const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };
        
        // Send email and return the result
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Rethrow the error so the calling function can handle it
    }
};

module.exports = sendMail; // Export the function directly

*/
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (to, subject, text) => {
    try {

        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

        // Verify SMTP connection before sending
        await transporter.verify();
        console.log("✅ SMTP Server Connected");

        const mailOptions = {
            from: '"Expense Tracker" <gezhil24@gmail.com>',
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Email sent:", info.messageId);

        return true;

    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};

module.exports = sendMail;