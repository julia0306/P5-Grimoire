// On récupère le modèle "user"
// On installe le package bcrypt

const bcrypt = require ('bcrypt')
const User = require ('../models/User')


// Deux fonctions: signup pour enregistrement d'utilisateurs, login pour connecter utilisateurs existants
exports.signup = (req, res, next) => {
    // On hash le MDP. Le salt = combien de fois on exécute l'algorithme de hashage. Ici 10 fois. 
    bcrypt.hash(req.body.password,10)
        .then (hash =>{
            // On crée un user à partir du modèle "user"
            const user = new User ({
                email: req.body.email,
                // On récupère le hash comme mdp pour ne pas l'enregistrer en dur
                password: hash
            });
            // méthode save pour enregistrer le user en BDD
            user.save()
                // statut 201 pour un objet créé
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}))
        })
        // Erreur 500 = erreur serveur
        .catch (error => res.status(500).json({error}))

}

exports.login = (req, res, next) => {
    // On utilise la méthode findOne()
    User.findOne({email: req.body.email})
        // la requête réussit
        .then( user => {
            if (user === null){
                // L'utilisateur n'existe pas
                res.status(401).json({message: 'Paire identifiant / mot de passe incorrecte'})
            } else{
                // On compare le mot de passe de la requête et celui enregistré en BDD
                bcrypt.compare(req.body.password, user.password)
                // La valeur est-elle fausse ? Erreur d'identification
                .then (valid =>{ if (!valid){
                    // erreur de mdp incorrect
                    res.status(401).json({message: 'Paire identifiant / mot de passe incorrecte'})
                } else {
                    // Requête réussie
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    })
                }

                })
                // Erreur serveur
                .catch(error => {
                    res.status(500).json({error})
                })
            }
        })
        // Erreur d'exécution de la requête (erreur serveur et non erreur de paire mdp / email)
        .catch(error => {
            res.status(500).json({error})
        })

}