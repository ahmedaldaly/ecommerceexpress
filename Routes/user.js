const router = require ('express').Router();
const {getUser,getOneUser,deleteUser,updateUser} = require ('../controller/UserContoller');
const adminAuth =require ('../middleware/authratition')
// /api/vi/users
router.get('/', getUser);
router.route('/:id').get (getOneUser).delete (deleteUser).put(updateUser);
module.exports =router;