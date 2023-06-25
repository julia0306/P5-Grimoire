// on récupère le bookSchema
const Book = require('../models/Book')

exports.createBook = (req, res, next) => {
    //On enlève l'id des données car il est généré automatiquement et pa prévu par le modèle
    delete req.body._id;
    const book = new Book({
        // opérateur spread qui va aller copier les champs qu'il y a dans le body de la request
        ...req.body
    });
    book.save()
        .then(()=> res.status(201).json({message: 'Livre enregistré'}))
        .catch(error => res.status(400).json({error}))
}

exports.modifyBook = (req, res, next) => {
    Book.updateOne({_id: req.params.id }, {...req.body, _id:req.params.id})
        .then(()=> res.status(200).json({message: 'Livre modifié'}))
        .catch(error => res.status(400).json({error}))
}

exports.deleteBook = (req, res, next) =>{
    Book.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: 'Livre supprimé'}))
        .catch(error => res.status(400).json({error}))
}

exports.getOneBook =  (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  }

exports.getAllBooks = (req, res, next) => {
    //méthode find qui retourne tous les objets
    Book.find()
    //on retourne le tableau de tous les things trouvés dans la BDD
        .then(books=> res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
}