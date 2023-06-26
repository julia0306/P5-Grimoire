// on récupère le bookSchema
const Book = require('../models/Book');
const fs = require ('fs')

exports.addBook = (req, res, next) => {
    // On parse l'objet requête. Il sera envoyé sous forme de chaine de caractères 
    const bookObject = JSON.parse(req.body.book);
    // On supprime les deux champs ci-dessous:
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        // opérateur spread qui va aller copier les champs du bookObject
        ...bookObject,
        // On extrait le userId de l'objet requête
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // On enregistre cette objet dans la BDD avec la méthode save()
    book.save()
        .then(()=> res.status(201).json({message: 'Livre enregistré'}))
        .catch(error => res.status(400).json({error}))
}

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ?{
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId){
                    res.status(401).json({message: "Non autorisé"})
            } else {
                Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
                    .then (()=> res.status(200).json({message: 'Livre modifié'}))
                    .catch (error => res.status(400).json({error}))
            }
        })
}
    // // selon que l'utilisateur aura -ou non - transmis un fichier, le format ne sera pas le même
//     // Fichier sous forme de chaine de caractère si fichier transmis ou non 
//     // Si modif avec fichier, il y a un champ file dans la requête
//     Book.updateOne({_id: req.params.id }, {...req.body, _id:req.params.id})
//         .then(()=> res.status(200).json({message: 'Livre modifié'}))
//         .catch(error => res.status(400).json({error}))
// }

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
    //on retourne le tableau de tous les books trouvés dans la BDD
        .then(books=> res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
}