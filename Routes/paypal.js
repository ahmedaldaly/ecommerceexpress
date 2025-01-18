const { createPayment, successPayment, cancelPayment } = require('../controller/paypalContller');
const router = require('express').Router();

// إنشاء دفع
router.post('/pay', createPayment);

// نجاح الدفع
router.get('/success', successPayment);

// إلغاء الدفع
router.get('/cancel', cancelPayment);

module.exports = router;