const router = require ('express').Router();
const {addFavourites,getFavorites,removeItem} = require('../controller/FavoritesController')
const {verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization,
    vrifayToken} = require('../middleware/authratition')
//  /api/vi/favorites/add
router.route('/add').post(vrifayToken,addFavourites);
router.route ('/:id').get(verifyTokenAndOnlyUser,getFavorites).delete(verifyTokenAndOnlyUser,removeItem)
module.exports=router;