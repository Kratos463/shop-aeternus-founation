const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        // Create a transporter object using SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        // Define the mail options
        const mailOptions = {
            from: `"ShopAtrno" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Email Verification for Shop Atrno',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                        <img src="cid:logo" alt="Shop Atrno" style="max-width: 150px; margin-bottom: 20px;">
                        <h2 style="color: #ff4c3b;">Welcome to Shop Atrno!</h2>
                        <p>We're thrilled to have you here. Just one more step to get started with your shopping adventure.</p>
                        <p>Please click the link below to verify your email address and activate your account:</p>
                        <p>
                            <a href="http://localhost:9000/verify-email?token=${verificationToken}" 
                               style="display: inline-block; padding: 10px 20px; color: white; background-color: #ff4c3b; text-decoration: none; border-radius: 5px;">
                                Verify Email
                            </a>
                        </p>
                        <p>If you didn't sign up for Shop Atrno, please ignore this email.</p>
                        <p>Happy Shopping!</p>
                        <p>Best Regards,</p>
                        <p>The Shop Atrno Team</p>
                        <div style="margin-top: 20px;">
                            <a href="https://www.facebook.com/profile.php?id=61556123022506&mibextid=ZbWKwL" style="margin: 0 10px;">
                                <img src="cid:facebook" alt="Facebook" style="width: 24px;">
                            </a>
        
                            <a href="https://www.instagram.com/shopatrno?igsh=MTgwcmVkbTJlOWp3ZA==" style="margin: 0 10px;">
                                <img src="cid:instagram" alt="Instagram" style="width: 24px;">
                            </a>
                        </div>
                        <p style="font-size: 12px; color: #888; margin-top: 20px;">&copy; 2024 Shop Atrno. All rights reserved.</p>
                        <p style="font-size: 12px; color: #888;">Please do not reply to this email. If you have any questions, contact us at <a href="mailto:support@shopatrno.com" style="color: #ff4c3b;">support@shopatrno.com</a>.</p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: 'logo.jpg',
                    path: path.join(__dirname, '../../public/images/logo.jpg'),
                    cid: 'logo'
                },
                {
                    filename: 'facebook.jpeg',
                    path: path.join(__dirname, '../../public/images/facebook.jpeg'),
                    cid: 'facebook'
                },
                {
                    filename: 'instagram.jpeg',
                    path: path.join(__dirname, '../../public/images/instagram.jpeg'),
                    cid: 'instagram'
                }
            ]
        };

        // Send the email
        await transporter.sendMail(mailOptions);
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
