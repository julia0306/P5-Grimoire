// Ce fichier permet l'enregistrement de la logique métier pour les routes "books"

// on récupère le bookSchema
const { error } = require('console');
const Book = require('../models/Book');
// Import de fs pour utiliser la fonction "unlink"
const fs = require ('fs')

exports.addBook = (req, res, next) => {
    // On parse l'objet requête. Il sera envoyé sous forme de chaine de caractères. JSON.parse() transforme l'objet stringifié en JS exploitable
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
    // On enregistre cet objet dans la BDD avec la méthode save()
    book.save()
        .then(()=> res.status(201).json({message: 'Livre enregistré'}))
        .catch(error => res.status(400).json({error}))
}

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ?{
        // JSON.parse() transforme objet stringifié en JS utilisable
        ...JSON.parse(req.body.book),
        // "Req.protocole[.....] filename)'`permet de reconstruire l'url complète du fichier"
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
    // On utilise l'id pour aller chercher le livre en question en BDD
    Book.findOne({_id: req.params.id})
    .then(book =>{
        // On vérifie les droits
        if(book.userId != req.auth.userId){
            res.status(401).json({message: 'Non-autorisé'});
        } else {
            // On utilise le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier
            const filename = book.imageUrl.split('/images/')[1];
            //La méthode unlink() du package  fs  permet de supprimer un fichier du système de fichiers.
            fs.unlink(`images/${filename}`, ()=> {
                Book.deleteOne({_id: req.params.id})
                    .then(() => {res.status(200).json({message: "Livre supprimé"})})
                    .catch (error => res.status(401).json({error}))
            })
        }
    })
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

exports.rateBook = (req, res, next) => {
    const id = req.params.id;
    const grade = req.body.rating;
    const userId = req.body.userId;
  
    Book.findOne({_id:id})
    .then ((book)=>{
        if (book.ratings.find(rating => rating.userId === userId)) {
            res.status(401).json({message: 'Non-autorisé'})
        }
        return Book.findOneAndUpdate(
            { _id:id},
            { $push: { ratings: {userId, grade} }},
            {new: true} // retourne le livre mis à jour//
        )
})
    .then((updatedBook) => {
        const numberOfRatings = updatedBook.ratings.length;
        const ratingTotal = updatedBook.ratings.reduce ((sum, rating) => sum + rating.grade, 0);
        updatedBook.averageRating = (ratingTotal / numberOfRatings).toFixed(1) // toFixed donne le nombre de chiffres après la virgule.
        return updatedBook.save()
    })
    .then((book) => {
        res.status(200).json(book); 
    })
    .catch((error) => res.status(400).json({ error })); 
}
//         //$push = opérateur MongoDB qui permet d'ajouter un élément à un array


exports.BestRatedBooks=(req, res, next) =>{
   const topRatedBooks = Book.find()
      .sort({ rating: -1 }) // Sort in descending order based on rating
      .limit(3)
    //on retourne le tableau des topRatedBooks
    .then(topRatedBooks=> res.status(200).json(topRatedBooks))
    .catch(error => res.status(400).json({error}))
}