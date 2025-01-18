const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlingth: 5,
    maxlingth: 50,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
    minlingth: 5,
    maxlingth: 200,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // مرجع إلى الكاتيجوري
    ref: 'Category', // اسم النموذج المرتبط
    
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    minlingth: 1,
  },
  review: {
    type: Number,
    required: true,
    trim: true,
    enum: [1,2,3,4,5],
  },
 
  sale: {
    type: Number,
    trim: true,
  },
  image: {
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
},
});

const Product = mongoose.model ('product', productSchema)
function validateProduct(obj) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required().trim(),
    desc: Joi.string().min(5).max(200).required().trim(),
    category: Joi.string().required(), // استخدام valid بدلاً من enum
    price: Joi.number().min(1).required(), // إزالة trim لأنه غير صالح مع الأرقام
    review: Joi.number().required(), // استخدام valid بدلاً من enum
    sale: Joi.number().optional(), // sale هو اختياري (بدون required)
    image: Joi.object({
      public_id: Joi.string().required(),
      url: Joi.string().required(),
    }) 
  });

  return schema.validate(obj); // يجب أن تعيد نتيجة التحقق
}


module.exports = {
    Product,
    validateProduct,
}