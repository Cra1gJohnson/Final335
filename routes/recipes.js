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
  res.render('index', {recipes});

});

router.get('/search/:id', async(req, res) => {
  const mongoId = req.params.id;
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mongoId}`);
    const meal = response.data.meals ? response.data.meals[0] : null;
    console.log(!meal);
    if (!meal) {
      return res.status(404).send('Recipe not found');
    }
    res.render('recipeDetail', {title: meal.strMeal, meal});
  } catch (err) {
    res.status(500).send('Error fetching recipe details');
  }
});

router.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find().sort('-addedAt');
  res.render('favorites', { favorites, title: 'My Favorite Recipes' });
});

router.post('/favorites', async (req, res) => {
  try {
    const {id, title, image} = req.body
    await Favorite.create({ recipeId: id, title, image });
    res.status(200).json({success: true})
  } catch (e) {
    console.error(e)
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

router.get('/favorites/:id', async (req, res) => {
  const mongoId = req.params.id;
  try {
    // Find the favorite by MongoDB _id
    const favorite = await Favorite.findById(mongoId);
    if (!favorite) {
      return res.status(404).send('Favorite not found');
    }
    // Use the recipeId from the favorite document
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favorite.recipeId}`);
    const meal = response.data.meals ? response.data.meals[0] : null;
    if (!meal) {
      return res.status(404).send('Recipe not found');
    }
    res.render('favoriteDetail', { title: meal.strMeal, meal });
  } catch (err) {
    res.status(500).send('Error fetching recipe details');
  }
});

router.post('/favorites/:id/remove', async (req, res) => {
  await Favorite.findByIdAndDelete(req.params.id);
  res.redirect('/favorites');
});

router.get('/favoritesRemoval', async (req, res) => {
  await Favorite.deleteMany({});
  res.redirect('/favorites');
});

module.exports = router;
