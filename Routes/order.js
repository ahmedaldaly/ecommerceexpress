const router = require('express').Router();
const {addOrder,getAllOrder,getOneOrder,editStatus,deletOrder,getUserOrder} = require ('../controller/OrderController')
const {verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization,
    vrifayToken} = require('../middleware/authratition')
// /api/vi/order/add
router.route('/').post(verifyTokenAndOnlyUser,addOrder).get(verifyTokenAndAdmin,getAllOrder)
router.route('/:id').get(getOneOrder).put(verifyTokenAndAdmin,editStatus).delete(verifyTokenAndAuthorization,deletOrder)
router.route('/userorder/:id').get(getUserOrder)
module.exports = router;