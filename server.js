require('dotenv').config();
console.log('→ connecting to', process.env.MONGO_URI);

const express           = require('express');
const expressLayouts    = require('express-ejs-layouts');
const mongoose          = require('mongoose');
const path              = require('path');
const recipesRouter     = require('./routes/recipes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));

app.use('/', recipesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Listening on port ${PORT}`));
