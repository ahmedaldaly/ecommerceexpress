const fs = require('fs');
const path = require('path');
const { Category } = require('../models/Categores');
const asyncHandler = require('express-async-handler');
const { cloudUpload, removeImage } = require('../config/connectFireBase');

// Get all categories
module.exports.GettGategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories.length) {
    return res.status(404).json({ message: 'No categories found' });
  }
  res.status(200).json(categories);
});

// Get one category
module.exports.OneCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.status(200).json(category);
});

// Delete category

module.exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  console.log(category)
  if (!category) {
    return res.status(404).json({ message: 'category not found' }); // أضف return هنا
  }

  try {
    // حذف المنتج
    await Category.findByIdAndDelete(req.params.id);
   
    // التحقق من وجود الصورة وحذفها
    if (category.image && category.image.public_id) {
      await removeImage(category.image.public_id);
    }

    // إرسال استجابة نجاح
    return res.status(200).json({ message: 'category deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error });
  }
});

module.exports.AddCategory = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image found' });
  }

  try {
      const filePath = path.resolve(__dirname, '../image', req.file.filename);
        const uploadResult = await cloudUpload(filePath);
    
        // حذف الصورة من السيرفر المحلي
        fs.unlinkSync(filePath);
    
    // إنشاء الفئة الجديدة
    const newCategory = new Category({
      name: req.body.name,
      image: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },  // حفظ الرابط في قاعدة البيانات
    });

    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
});
