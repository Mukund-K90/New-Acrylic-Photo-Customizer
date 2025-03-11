const express = require('express');
const { placeOrder, getUserOrders } = require('../controller/BillingController');
const router = express.Router();
const { authorization } = require('../middleware/auth.middleware');


router.post('/place-order', authorization, placeOrder);
router.get('/', authorization, getUserOrders);

module.exports = router;