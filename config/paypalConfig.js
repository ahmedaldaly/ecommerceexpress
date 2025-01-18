const paypal = require('paypal-rest-sdk');
paypal.configure({
    mode: 'sandbox', // استخدم "live" عند الانتقال للإنتاج
    client_id: process.env.Client_ID,
    client_secret: process.env.Secret_key
});

module.exports =paypal;

// دا كود الفرونت اند للدفع
// const totalAmount = 25.00; // المبلغ الذي يحدده العميل (على سبيل المثال)

// axios.post('http://localhost:4000/api/v1/paypal/create-payment', {
//   totalAmount: totalAmount // تمرير المبلغ في الـ body
// })
//   .then(response => {
//     const redirectUrl = response.data.redirectUrl;
//     window.location.href = redirectUrl; // إعادة توجيه العميل إلى PayPal
//   })
//   .catch(error => {
//     console.error('Error creating payment:', error);
//   });