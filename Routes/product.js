const router = require('express').Router();
const { GetProduct,
   AddProduct,
    deleteProduct,
     updateProduct ,
     GetOneProduct} = require('../controller/Product');
const {verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
  vrifayToken} = require('../middleware/authratition')
const upload = require('../config/connectMulter');

router.route('/')
  .get(GetProduct) // عرض المنتجات
  .post( upload.single('image'), AddProduct); // إضافة منتج مع رفع صورة

router.route('/:id')
.delete(verifyTokenAndAdmin,deleteProduct)
.put ( verifyTokenAndAdmin,upload.single('image'),updateProduct)
.get (GetOneProduct)
module.exports = router;