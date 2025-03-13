const express = require('express');
const { verifyPayment } = require('../controller/paymentController');
const router = express.Router();


//payment callback 
router.post('/verify-payment', verifyPayment);


module.exports = router;