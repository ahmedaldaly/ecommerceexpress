
const asyncHandler = require('express-async-handler');
const { User } = require('../models/User');
const generateToken = require ('../middleware/createToken')
module.exports.getUser = asyncHandler (async (req, res)=> {
    const user = await User.find().select('-password');
    if (!user) {
        res.status (404).json ({message:'users not found'})
    } 
    
    res.status(200).json({data:user});
})
module.exports.getOneUser = asyncHandler (async (req, res)=> {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status (404).json ({message:'users not found'})
    } 
    
    res.status(200).json({data:user});
})

module.exports.deleteUser = asyncHandler (async (req, res)=> {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status (404).json ({message:'users not found'})
    } 
    const deletUser = await User.findOneAndDelete (req.params.id);
    if (!deletUser){
        res.status(404).json({message:'user note found'})
    }

    res.status(200).json({message:'user deleted successfully'});
})


module.exports.updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' }); // أضف return
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            isAdmin: req.body.isAdmin,
            isStoreOwner: req.body.isStoreOwner, // إصلاح الحقل
        },
        { new: true } // إرجاع القيمة الجديدة بعد التحديث
    );

    if (!updatedUser) {
        return res.status(404).json({ message: 'Failed to update user' }); // أضف return
    }
    
    const token = generateToken(updatedUser._id, updatedUser.isAdmin, updatedUser.isStoreOwner);
    updatedUser.token = token; // تحديث التوكن في المستخدم
    await updatedUser.save(); // حفظ التوكن الجديد

    res.status(200).json(updatedUser);
});
