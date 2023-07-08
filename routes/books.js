const express = require('express');

//on utilise la méthode "router" de Express. Permet de remplacer "app.get" par "router.get"
const router = express.Router();

// 1) On importe le middleware auth pour qu'il soit exécuté avant les gestionnaires des routes
const auth = require('../middleware/auth');
// 2) On importe le middleware de configuration multer
const multer = require ('../middleware/multer-config');
const optimizeImage = require ('../middleware/sharp')

const bookCtrl = require('../controllers/books');




// On utilise createBook via le contrôleur
// 1) On met le middleware avant le gestionnaire de routes (ctrl) pour que ce soit pris en compte avant le gestionnaire des routes = sert à rien. Le middleware transmet les infos au middleware suivant, le gestionnaire de routes
// 2) On met le middleware multer entre l'authentification et la route : il faut que le middleware d'authentification ait fait son travail en amont. Vérif du token
//2) On modifie la gestion de la route car, en ajoutant multer, format de la requête aura changé. Il faut le prendre en compte (fichier controllers)
router.post('/', auth, multer, optimizeImage, bookCtrl.addBook )

// ajout d'une route dynamique, en fonction de l'id
// ajout de multer pour pouvoir modifier
router.put('/:id', auth, multer, optimizeImage, bookCtrl.updateBook)

router.delete('/:id', auth, bookCtrl.deleteBook)

router.get('/bestrating', bookCtrl.getBestRatedBooks);
// middleware "auth" non requis
router.get('/:id', bookCtrl.getOneBook);

// middleware "auth" non requis
router.get('/', bookCtrl.getAllBooks);

router.post('/:id/rating', auth, bookCtrl.rateBook)


module.exports = router;