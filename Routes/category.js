const router = require('express').Router();
const {
  GettGategory,
  AddCategory,
  deleteCategory,
  OneCategory,
} = require('../controller/Category');
const {verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
  vrifayToken} = require('../middleware/authratition')

const upload = require('../config/connectMulter');

router
  .route('/')
  .get(GettGategory)
  .post(upload.single('image'), AddCategory);

router
  .route('/:id')
  .delete(verifyTokenAndAdmin, deleteCategory)
  .get(verifyTokenAndAdmin, OneCategory)
module.exports = router;
