const {Order} =require('../models/Order');
const asyncHandler = require('express-async-handler')
const {Product} = require('../models/Product')
const{User} = require('../models/User')
const jwt = require ('jsonwebtoken')

module.exports.addOrder = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // فك تشفير التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const findUser = await User.findById(decoded.id);

        if (!findUser) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const findProduct = await Product.findById(req.body.product);
        if (!findProduct) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        // التحقق من وجود الطلب مسبقًا لنفس المستخدم ونفس المنتج
        const existingOrder = await Order.findOne({ user: decoded.id, product: req.body.product });
        if (existingOrder) {
            return res.status(400).json({ message: 'Order already exists for this user and product' });
        }

        // إنشاء طلب جديد
        const newOrder = new Order({
            user: decoded.id,
            product: req.body.product,
        });

        await newOrder.save();
        return res.status(201).json({ message: 'Order added successfully', data: newOrder });

    } catch (err) {
        return res.status(400).json({ message: "Invalid token or request error", error: err.message });
    }
});
module.exports.updateOrder  =asyncHandler(async(req,res)=> {
    const order = await Order.findById(req.params.id)
    if(!order){
       return res.status(404).json({message:'Order not Found'})
    }
    const Update =await Order.findByIdAndUpdate(req.params.id,{
        $set:{
            quantity:req.body.quantity,
            address:req.body.address,
            stuts:req.body.stuts,
        },
    },{new:true})
    res.status(201).json(Update)
})
module.exports.getAllOrder = asyncHandler(async (req, res) => {
    try {
      const order =  await Order.find()
      const productId = order[0]?.product;
      const usertId = order[0]?.user;
      const users =await User.findById(usertId)
      const products =await Product.findById(productId)
        return res.status(201).json({ order:order,User:users, data:products});
    } catch (err) {
        return res.status(400).json({ message: "not found order", error: err.message });
    }
});

module.exports.getUserOrder = asyncHandler(async (req, res) => {
    try {
      const order =  await Order.findOne({user:req.params.id})
      const productId = order.product;
      const products =await Product.findById(productId)
        return res.status(201).json({products});
    } catch (err) {
        return res.status(400).json({ message: "not found order", error: err.message });
    }
});

module.exports.delet = asyncHandler(async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
      
        return res.status(201).json({ message: 'Order delete successfully'});

    } catch (err) {
        return res.status(400).json({ message: "Invalid token or request error", error: err.message });
    }
});