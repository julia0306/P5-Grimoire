const express = require('express');
// On importe le middleware auth pour qu'il soit exécuté avant les gestionnaires des routes
const auth = require('../middleware/auth')
//on utilise la méthode "router" de Express. Permet de remplacer "app.get" par "router.get"
const router = express.Router()

const routeCtrl = require('../controllers/books')

// On utilise createBook via le contrôleur
// On met le middleware avant le gestionnaire de routes (ctrl) pour que ce soit pris en compte avant le gestionnaire des routes = sert à rien. Le middleware transmet les infos au middleware suivant, le gestionnaire de routes
router.post('/', auth, routeCtrl.createBook )

// ajout d'une route dynamique, en fonction de l'id
router.put('/:id', auth, routeCtrl.modifyBook)

router.delete('/:id', auth, routeCtrl.deleteBook)

// middleware "auth" non requis
router.get('/:id', routeCtrl.getOneBook);

// middleware "auth" non requis
router.get('/', routeCtrl.getAllBooks);

module.exports = router;