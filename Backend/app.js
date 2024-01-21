const express = require('express');
const app = express();
const mongoose = require('mongoose');
// path fait partie de NodeJS donc pas d'installation
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();


//On importe les routes
const bookRoutes = require('./routes/books')
const userRoutes = require('./routes/users')

mongoose.connect(`mongodb+srv://${process.env.DATABASE}/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// middleware qui permet d'accéder au corps de la requête (intercepte les requêtes qui contiennent du json et mettent à disposition le corps de la requête req.body):
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet())


// CORS : permet à l'application d'accéder à l'API sans problème
app.use((req, res, next) => {
    //première ligne ajoutée en solution au problème d'affichage des images après installation de Helmet
    //https://stackoverflow.com/questions/70752770/helmet-express-err-blocked-by-response-notsameorigin-200
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  //On remet le début de la route et on indique qu'on utilise le routeur exposé par bookRoutes ou par userRoutes 
  app.use('/api/books', bookRoutes);
  app.use('/api/auth', userRoutes);
// la requête vers le répertoire image n'étant pas gérée, il faut ajouter une route. On ajoute une route qui sert des fichiers statiques (middleware "static" fourni par expres. On récupère le répertoire  et on y concatène le dossier "images")
  app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;