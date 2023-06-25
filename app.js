const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Book = require('./models/Book')

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

app.post('/api/books', (req, res, next) => {
    //On enlève l'id des données car il est généré automatiquement et pa prévu par le modèle
    delete req.body._id;
    const book = new Book({
        // opérateur spread qui va aller copier les champs qu'il y a dans le body de la request
        ...req.body
    });
    book.save()
        .then(()=> res.status(201).json({message: 'Livre enregistré'}))
        .catch(error => res.status(400).json({error}))
})

// ajout d'une route dynamique, en fonction de l'id
app.get('/api/books/:id', (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  });

app.get('/api/books', (req, res, next) => {
    //méthode find qui retourne tous les objets
    Book.find()
    //on retourne le tableau de tous les things trouvés dans la BDD
        .then(books=> res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
});



module.exports = app;