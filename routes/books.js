const express = require('express');
// 1) On importe le middleware auth pour qu'il soit exécuté avant les gestionnaires des routes
const auth = require('../middleware/auth')
// 2) On importe le middleware de configuration multer
const multer = require ('../middleware/multer-config')

const routeCtrl = require('../controllers/books')

//on utilise la méthode "router" de Express. Permet de remplacer "app.get" par "router.get"
const router = express.Router()


// On utilise createBook via le contrôleur
// 1) On met le middleware avant le gestionnaire de routes (ctrl) pour que ce soit pris en compte avant le gestionnaire des routes = sert à rien. Le middleware transmet les infos au middleware suivant, le gestionnaire de routes
// 2) On met le middleware multer entre l'authentification et la route : il faut que le middleware d'authentification ait fait son travail en amont. Vérif du token
//2) On modifie la gestion de la route car, en ajoutant multer, format de la requête aura changé. Il faut le prendre en compte (fichier controllers)
router.post('/', auth, multer, routeCtrl.createBook )

// ajout d'une route dynamique, en fonction de l'id
router.put('/:id', auth, routeCtrl.modifyBook)

router.delete('/:id', auth, routeCtrl.deleteBook)

// middleware "auth" non requis
router.get('/:id', routeCtrl.getOneBook);

// middleware "auth" non requis
router.get('/', routeCtrl.getAllBooks);

module.exports = router;