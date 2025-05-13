const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  recipeId: String,
  title: String,
  image: String,
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
