const router = require ('express').Router();
const {register,login} = require ('../controller/AuthController');
// /api/vi/auth/register
router.post('/register', register);
router.post('/login', login);
module.exports =router;