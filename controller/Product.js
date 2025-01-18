const fs = require('fs');
const path = require('path');
const { Product, validateProduct } = require('../models/Product');
const asyncHandler = require('express-async-handler');
const {cloudUpload,removeImage }= require('../config/connectFireBase');
const {Category} = require ('../models/Categores')
// عرض المنتجات
module.exports.GetProduct = asyncHandler(async (req, res) => {
  const Products = await Product.find();
  if (!Products) {
    return res.status(404).json('No Product Found');
  }
  res.status(200).json(Products);
});


module.exports.GetOneProduct = asyncHandler(async (req, res) => {
  const Products = await Product.findById(req.params.id);
  if (!Products) {
    return res.status(404).json('No Product Found');
  }
  res.status(200).json(Products);
});


// إضافة منتج
module.exports.AddProduct = asyncHandler(async (req, res) => {
  // التحقق من صحة البيانات النصية
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // التحقق من وجود التصنيف (Category) في قاعدة البيانات
  const category = await Category.findOne({ name: req.body.category });
  if (!category) {
    const filePath = path.resolve(__dirname, '../image', req.file.filename);
    fs.unlinkSync(filePath);
    return res.status(400).json({ message: 'Category not found' });
  }

  // التحقق من وجود ملف الصورة
  if (!req.file) {
    return res.status(400).json('No Image Found');
  }

  // رفع الصورة إلى Cloudinary
  try {
    const filePath = path.resolve(__dirname, '../image', req.file.filename);
    const uploadResult = await cloudUpload(filePath);

    // حذف الصورة من السيرفر المحلي
    fs.unlinkSync(filePath);

    // إنشاء منتج جديد
    const newProduct = new Product({
      title: req.body.title,
      desc: req.body.desc,
      category: category.name, // 
      price: req.body.price,
      review: req.body.review,
      sale: req.body.sale,
      image: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
    });

    // حفظ المنتج في قاعدة البيانات
    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image to Cloudinary', error });
  }
});


// remove Product

module.exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log(product)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' }); // أضف return هنا
  }

  try {
    // حذف المنتج
    await Product.findByIdAndDelete(req.params.id);
   
    // التحقق من وجود الصورة وحذفها
    if (product.image && product.image.public_id) {
      await removeImage(product.image.public_id);
    }

    // إرسال استجابة نجاح
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error });
  }
});
// update
module.exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  try {
    let newImage = product.image; // الاحتفاظ بالصورة القديمة كافتراضي

    // التحقق من وجود صورة جديدة
    if (req.file) {
      const filePath = path.resolve(__dirname, '../image', req.file.filename);

      // رفع الصورة الجديدة
      newImage = await cloudUpload(filePath);

      // حذف الصورة القديمة إذا تم رفع صورة جديدة
      if (product.image && product.image.public_id) {
        await removeImage(product.image.public_id);
      }

      // حذف الملف المحلي بعد رفع الصورة الجديدة
      fs.unlinkSync(filePath);
    }

    // إعداد البيانات الجديدة
    const updatedProductData = {
      title: req.body.title || product.title,
      desc: req.body.desc || product.desc,
      sale: req.body.sale || product.sale,
      review: req.body.review || product.review,
      price: req.body.price || product.price,
      category: req.body.category || product.category,
      image: newImage, // استخدم الصورة الجديدة أو القديمة
    };

    // تحديث المنتج في قاعدة البيانات
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updatedProductData },
      { new: true } // إرجاع المنتج المُحدث
    );

    return res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Error updating product', error });
  }
});