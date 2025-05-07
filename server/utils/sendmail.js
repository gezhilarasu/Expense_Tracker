const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

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