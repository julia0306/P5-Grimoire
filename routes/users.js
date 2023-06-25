const express = require ('express');
const router = express.Router();
const userCtrl = require('../controllers/users')

// On crée les deux routes "post": le frontend envoie des informations (mail et mdp):

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login)

module.exports = router;