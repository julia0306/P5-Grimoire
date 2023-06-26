// on récupère le bookSchema
const Book = require('../models/Book')

exports.createBook = (req, res, next) => {
    // On parse l'objet requête. Il sera envoyé sous forme de chaine de caractères 
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        // opérateur spread qui va aller copier les champs du bookObject
        ...bookObject,
        userID: req.auth.userID,
        imageUrl: `{req.protocol}://${req.get('host')}/images/${req.file.filename}`
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