const crypto = require('crypto');
const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `
                <p>Please click the following link to verify your email:</p>
                <a href="http://localhost:9000/verify-email?token=${verificationToken}">Verify Email</a>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};


const generateVerificationToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer.toString('hex'));
            }
        });
    });
};

module.exports = { sendVerificationEmail, generateVerificationToken };
