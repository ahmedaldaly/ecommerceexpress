const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const FavoritesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});
const Favorites = mongoose.model('Favorites', FavoritesSchema);

function validateFavorites(obj) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    product: Joi.objectId().required(),
  });
  return schema.validate(obj)
}
module.exports ={
    validateFavorites,
    Favorites,
}