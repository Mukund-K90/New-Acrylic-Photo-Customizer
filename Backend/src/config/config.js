require('dotenv').config(); // Load environment variables from .env file

exports.CONFIG = {
    port: process.env.PORT || 8080,
    razorPayKeyId: process.env.RAZORPAY_KEY_ID,
    razorPayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    dbUrl: process.env.DB_URL,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    jwtSecret:process.env.JWT_SECRET,
    tokenExp:process.env.JWT_EXP
};
