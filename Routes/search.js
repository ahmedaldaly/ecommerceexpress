const router = require('express').Router();
const {searchProduct,GetProductByCategory} = require ('../controller/SearchController')

router.route ('/').post(searchProduct)
router.route ('/:id').get(GetProductByCategory)

module.exports = router;