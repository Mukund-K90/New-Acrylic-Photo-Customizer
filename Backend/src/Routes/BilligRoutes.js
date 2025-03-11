const express = require('express');
const { placeOrder } = require('../controller/BillingController');
const router = express.Router();
const { authorization } = require('../middleware/auth.middleware');


router.post('/place-order', authorization, placeOrder);

module.exports = router;