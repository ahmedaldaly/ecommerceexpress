const paypal = require('../config/paypalConfig');
const asyncHandler = require('express-async-handler');

module.exports.createPayment = asyncHandler(async (req, res) => {
  const { totalAmount } = req.body; // المبلغ الذي يرسله العميل في الـ body

  // التحقق من صحة المبلغ
  if (!totalAmount || isNaN(totalAmount)) {
    return res.status(400).json({ message: 'Invalid amount provided' });
  }

  const payment = { // تفاصيل الدفع
    intent: 'sale', // نوع الدفع: بيع مباشر
    payer: { // طريقة الدفع حددناها بي بال
      payment_method: 'paypal',
    },
    redirect_urls: { // لو تمت العمليه هيحولنا لاول رابط النجاح يعني لو اتكنسل التاني 
      return_url: 'http://localhost:4000/api/v1/paypal/success',
      cancel_url: 'http://localhost:4000/api/v1/paypal/cancel',
    },
    transactions: [{ // تفاصيل الدفع المبلغ والعمله
      amount: {
        currency: 'USD', // العملة
        total: totalAmount.toFixed(2) // المبلغ المرسل من العميل
      },
      description: 'Purchase description' // وصف الدفع
    }]
  };

  // انشاء الدفع
  paypal.payment.create(payment, (error, payment) => {
    if (error) { // لو في ايرور
      console.error('PayPal payment creation error:', error.response || error);
      res.status(500).json({ message: 'Error creating payment', error: error.response });
    } else {  // لو تم الدفع بنجاح
      const redirectUrl = payment.links.find(link => link.rel === 'approval_url').href; // استخراج رابط التاكيد
      res.json({ redirectUrl }); // إرسال رابط تأكيد الدفع للمستخدم
    }
  });
});

module.exports.successPayment = asyncHandler(async (req, res) => {
  const { paymentId, PayerID } = req.query;

  const executePaymentJson = {
    payer_id: PayerID,
    transactions: [{
      amount: {
        currency: 'USD',
        total: totalAmount.toFixed(2), // يمكن تعديل هذه القيمة أيضًا إذا كنت تريد استخدام نفس المبلغ من الـ client
      }
    }]
  };

  paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
    if (error) {
      console.error('Payment execution error:', error.response || error);
      res.status(500).json({ message: 'Error executing payment', error: error.response });
    } else {
      res.json({ message: 'Payment successful!', payment });
    }
  });
});

module.exports.cancelPayment = asyncHandler(async (req, res) => {
  res.send('Payment canceled.');
});
