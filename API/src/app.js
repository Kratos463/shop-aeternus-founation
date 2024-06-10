const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Define the whitelist for CORS
var whitelist = ['http://localhost:3000', 'https://shop.aeternus.foundation', 'https://metafortunaverse.com', 
'https://bot.aeternus.foundation']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Enable credentials (cookies, authorization headers, etc.)
};

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '25kb' }));

// Configure CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware for serving static files
app.use(express.static('public'));


// Import routes and API key middleware
const apiKeyMiddleware = require('./Middleware/apikey.middleware.js');
const userRoutes = require('./Routes/user.routes.js');
const cartRoutes = require("./Routes/cart.routes.js")
const wishlistRoutes = require("./Routes/wishlist.routes.js")
const reviewRoutes = require("./Routes/review.routes.js")
const blogRoutes = require("./Routes/blog.routes.js")
const voucherRoutes = require("./Routes/voucher.routes.js")
const paymentRoutes = require("./Routes/payment.routes.js")
const adminRoutes = require("./Routes/admin.routes.js")
const orderRoutes = require("./Routes/order.routes.js")
const walletRoutes = require("./Routes/wallet.routes.js")
const discountRoutes = require("./Routes/discount.routes.js")
const {verifyEmail} = require("./Controllers/User/user.controller.js")

// Apply API key middleware to /api routes
app.use('/api', apiKeyMiddleware);

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/voucher', voucherRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/discount', discountRoutes);
app.get('/verify-email', verifyEmail)

// admin route
app.use("/api/v1/admin", adminRoutes)

module.exports = { app };
