const asyncHandler = require('express-async-handler');
const {Product} =require ('../models/Product')
const {User} =require ('../models/User')
const {
  Order,
  validateOrder,
  validateOrderUpdate,
} = require('../models/Order');

module.exports.addOrder =asyncHandler (async(req,res)=>{
    const {error} = validateOrder (req.body);
    if (error) {
        res.status(400).json({message:`error enter data ${error.details[0].message}`})
    }
    const findProduct = await Product.findById(req.body.product);
    if (!findProduct) {
        res.status(404).json({message:'Product Note Found'})
    }
    const findUser = await User.findById(req.body.user);
    if (!findUser) {
        res.status(404).json({message:'note found user'})
    }
    const er = await Order.findOne({user:req.body.user ,product :req.body.product})
    if (er) {
        res.status(400).json ({message: 'Order already exists for this user and product'})
    }else{
         try {
    const order = new Order ({
        user: findUser._id,
        product:findProduct._id,
        quantity:req.body.quantity,
        address:req.body.address,
    })
    const sup = await order.save();
    res.status(201).json({message:'add order success'})
   }catch(error) {
    res.status(400).json (error)
   }
    }
  
});
module.exports.getAllOrder = asyncHandler (async(req,res)=> {
    const order = await Order.find();
    if (!order) {
        res.status(404).json({message:'order is empty'})
    }
    res.status(200).json(order)
})
module.exports.getOneOrder = asyncHandler (async(req,res)=> {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404).json({message:'order is empty'})
    }
    res.status(200).json(order)
})
module.exports.getUserOrder = asyncHandler (async(req,res)=> {
    const order = await Order.findOne({user:req.params.id});
    if (!order) {
        res.status(404).json({message:'order is empty'})
    }else {
        const product =await Product.findById(order.product);
        if (!product){
            res.status(400).json({message:'product not found'})
        }else (
            res.status(200).json(product)
        )
    }
   
})
module.exports.editStatus = asyncHandler(async(req,res)=> {
    const {error} = validateOrderUpdate(req.body)
    if (error) {
        return res.status(400).json({message:error.details[0].message})
    };
    const found = await Order.findById(req.params.id)
    if (!found) {
        return res.status(404).json({message:'order note found'})
    }

    try{
        const order = await Order.findByIdAndUpdate(req.params.id, {
            $set : {
                status:req.body.status,
            }
        }  ,{new:true}
    )
    await order.save()
    res.status(201).json({message:'success'})
    }catch(err){
        res.status(400).json(err)
    }
})
module.exports.deletOrder = asyncHandler(async(req,res)=> {
    const found = await Order.findById(req.params.id)
    if (!found) {
        return res.status(404).json({message:'order note found'})
    }

    try{
        const order = await Order.findByIdAndDelete(req.params.id)
    res.status(201).json({message:'Order deleted'})
    }catch(err){
        res.status(400).json(err)
    }
})