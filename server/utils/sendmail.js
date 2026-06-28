
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
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async (to, subject, text) => {
    try {
        console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "Loaded" : "Missing");

        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "Expense Tracker",
                    email: "gezhil24@gmail.com"  // must be verified in Brevo
                },
                to: [{ email: to }],
                subject: subject,
                textContent: text
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Email sent:", response.data.messageId);
        return true;

    } catch (error) {
        console.error("❌ Error sending email:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = sendMail;