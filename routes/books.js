const express = require('express');
//on utilise la méthode "router" de Express. Permet de remplacer "app.get" par "router.get"
const router = express.Router()

const routeCtrl = require('../controllers/books')

// On utilise createBook via le contrôleur
router.post('/', routeCtrl.createBook )

router.put('/:id', routeCtrl.modifyBook)

router.delete('/:id', routeCtrl.deleteBook)

// ajout d'une route dynamique, en fonction de l'id
router.get('/:id', routeCtrl.getOneBook);

router.get('/', routeCtrl.getAllBooks);

module.exports = router;