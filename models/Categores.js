const Joi = require('joi');
const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
  name: {
    required: true,
    minLength: 5,
    maxLength: 50,
    trim: true,
    type: String,
    unique: true,
  },
  image: {
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
},
});
const Category = mongoose.model('Category', categorySchema);

module.exports = {
  Category,
};
