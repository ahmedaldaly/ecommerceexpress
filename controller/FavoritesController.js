const {validateFavorites, Favorites} = require('../models/Favoriteslist')
const asyncHandler = require ('express-async-handler');
const {User} = require('../models/User')
const {Product} = require('../models/Product');
module.exports.addFavourites =asyncHandler (async(req,res)=> {
    const {error} = validateFavorites(req.body);
    if (error){
        return res.status(400).json({message:'error data'})
    }
    const found = await Favorites.findOne({user:req.body.user , product: req.body.product})
    if (found) {
        res.status(400).json({message:'product orady added Favorites'})
    }else {
        const favorites = new Favorites ({
            user: req.body.user,
            product: req.body.product,
        });
        await favorites.save()
        res.status(201).json(favorites)
    }
})
module.exports.getFavorites = asyncHandler(async(req,res)=> {
    try{
        const favorites = await Favorites.findOne({user: req.params.id});
        if (!favorites) {
            return res.status(404).json({message:"not found favorites items"})
        }else {
            const item = await Product.findById(favorites.product);
            if (!item){
                return res.status(404).json({message:'products note found'});
            }else{
                res.status(200).json(item)
            }
        }
    }catch(error){
        res.status(400).json(error)
    }
})
module.exports.removeItem = asyncHandler(async(req,res)=> {
    const foundItem = Favorites.findById(req.params.id)
    if(!foundItem){
        res.status(404).json({message:'item is not favorites'});
    }else {
        const delet = Favorites.findByIdAndDelete(req.params.id);
        res.status(200).json({message:'item is removed in favorites'});
    }
})