const express = require('express');
const axios = require('axios');
const Favorite = require('../models/favorite');
const router = express.Router();

const API_KEY = process.env.RECIPE_API_KEY;

router.get('/', async (req, res) => {
  res.render('index', { recipes: null });
});

router.post('/search', async (req, res) => {
  const ingredients = req.body.ingredients;
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredients)}`;

  const response = await axios.get(url);
  const recipes = response.data.meals || [];
  res.render('index', { recipes });
});

router.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find().sort('-addedAt');
  res.render('favorites', { favorites });
});

router.post('/favorites', async (req, res) => {
  const { id, title, image } = req.body;
  await Favorite.create({ recipeId: id, title, image });
  res.redirect('/favorites');
});

module.exports = router;
