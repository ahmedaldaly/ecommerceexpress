const asyncHandler = require('express-async-handler');
const { Product } = require('../models/Product');
const {Category} = require('../models/Categores');

module.exports.searchProduct = asyncHandler(async (req, res) => {
  // الحصول على الحرف الذي تبحث عنه
  const title = req.body.title;

  // إذا لم يتم إرسال العنوان
  if (!title) {
    return res.status(400).json({ message: 'Please provide a title' });
  }

  // البحث عن المنتجات التي تبدأ بالحرف باستخدام تعبير عادي
//   الدالة ريحيكس دي بتبحث في المنتجات الي بتبدء بالكلمه الي بعتناها ودي في المونجو
//  الاوبشن بيجعل البحث غير حساس يعني لو جالنا حرف كابتل يحيب المنتجات الي بنفس الحرف اسمول بردو
  const products = await Product.find({ title: { $regex: `^${title}`, $options: 'i' } });

  // إذا لم يتم العثور على أي منتجات
  if (products.length === 0) {
    return res.status(404).json({ message: 'No products found' });
  }

  // إرجاع المنتجات
  res.status(200).json(products);
});


module.exports.GetProductByCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)
    const product = await Product.findOne({title:req.params.id})
    if (!category || !product) {
        res.status(404).json({message:'Product Not Found'})
    }
    res.status(200).json ({data:{
      title:product.title,
      desc:product.desc,
      category:category.name,
      price:product.price,
      review:product.review,
      sale:product.sale,
      image:product.image.url
    }})
  });
  