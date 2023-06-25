const express = require('express');
const app = express();
const mongoose = require('mongoose');

//On importe les routes
const bookRoutes = require('./routes/books')
const userRoutes = require('./routes/users')

mongoose.connect('mongodb+srv://JTaylor:P5Grimoire_JT@p5-grimoire.vwnuvln.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// middleware qui permet d'accéder au corps de la requête (intercepte les requêtes qui contiennent du json et mettent à disposition le corps de la requête req.body):
app.use(express.json());

// CORS : permet à l'application d'accéder à l'API sans problème
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/books', bookRoutes);
  app.use('/api/auth', userRoutes)

module.exports = app;