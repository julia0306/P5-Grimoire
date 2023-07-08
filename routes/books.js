const express = require('express');

//on utilise la méthode "router" de Express. Permet de remplacer "app.get" par "router.get"
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');
const optimizeImage = require('../middleware/sharp')
const bookCtrl = require('../controllers/books');

router.post('/', auth, multer, optimizeImage, bookCtrl.addBook )
router.put('/:id', auth, multer, optimizeImage, bookCtrl.updateBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);
router.post('/:id/rating', auth, bookCtrl.rateBook)


module.exports = router;




// INFOS MIDDLEWARE : 
// 1) On importe le middleware auth pour qu'il soit exécuté avant les gestionnaires des routes
// 2) On importe le middleware de configuration multer
// 3) On importe le middleware qui permet d'optimiser l'image
// ROUTES POST ET PUT :
// 1) On met le middleware avant le gestionnaire de routes (ctrl) pour que ce soit pris en compte avant le gestionnaire des routes = sert à rien. Le middleware transmet les infos au middleware suivant, le gestionnaire de routes
// 2) On met le middleware multer entre l'authentification et la route : il faut que le middleware d'authentification ait fait son travail en amont. Vérif du token
//3) On modifie la gestion de la route car, en ajoutant multer, format de la requête aura changé. Il faut le prendre en compte (fichier controllers)
// ajout de l'optimisation Sharp pour respecter le Green IT