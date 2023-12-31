
// on récupère le bookSchema et on importe file system (fs) pour utiliser la fonction "unlink"
const Book = require('../models/Book');
const fs = require ('fs')


exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject.userId;
    //On crée une nouvelle instance de modèle Book avec les données du livre
    const book = new Book({
        // opérateur spread qui va aller copier les champs du bookObject
        ...bookObject,
        userId: req.auth.userId,
        // Mise à jour de l'url pour correspondre à la config que j'ai faite de Sharp
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split('.')[0]}_optimized.webp`
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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split('.')[0]}_optimized.webp`
    } : {...req.body};
    delete bookObject.userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId){
                // Code erreur 403, spécifié par le doc "Exigences API". Idem pour le message 
                    return res.status(403).json({message: "unauthorized request"})
            } else if (req.file) {
                const filename = book.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => { });
            }
            // Ci-dessus, on supprime l'image si celle-ci a été modifiée lors  de la modification d'un livre
            Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
                .then (()=> res.status(200).json({message: 'Livre modifié'}))
                .catch (error => res.status(400).json({error}))
        })
}


exports.deleteBook = (req, res, next) =>{
    // On utilise l'id pour aller chercher le livre en question en BDD
    Book.findOne({_id: req.params.id})
    .then(book =>{
        // On vérifie les droits
        if(book.userId != req.auth.userId){
            return res.status(401).json({message: 'Non-autorisé'});
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
    const userId = req.auth.userId;
  
    Book.findOne({_id:id})
    .then ((book)=>{
        if (book.ratings.find(rating => rating.userId === userId)) {
            return res.status(401).json({message: 'Non-autorisé'})
        }
        return Book.findOneAndUpdate(
            { _id:id},
            { $push: { ratings: {userId, grade} }}, //$push = opérateur MongoDB qui permet d'ajouter un élément à un array
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
       return res.status(200).json(book); 
    })
    .catch((error) => res.status(400).json({ error })); 
}


exports.getBestRatedBooks=(req, res, next) =>{
   Book.find()
      .sort({ averageRating: -1 }) // Sort in descending order based on rating
      .limit(3)
    //on retourne le tableau des topRatedBooks
    .then(book=> res.status(200).json(book))
    .catch(error => res.status(400).json({error}))
}