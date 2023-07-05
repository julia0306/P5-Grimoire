//// Ce fichier permet l'enregistrement de la logique métier pour les routes "users"
// On récupère le modèle "user"
// On installe le package "bcrypt"
// On installe le package "jsonwebtoken"

const bcrypt = require ('bcrypt')
const User = require ('../models/User')
const jwt = require('jsonwebtoken')


// Deux fonctions: signup pour enregistrement d'utilisateurs, login pour connecter utilisateurs existants
exports.signup = (req, res, next) => {
    let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!req.body.email || !req.body.email.match(emailFormat)) {
        return res.status(400).json({ message: "L'adresse mail saisie n'est pas correcte" });
    
    }
    //méthode test vérifie si le mail respecte la condition
    if (!req.body.password || !/[A-Z]/.test(req.body.password)) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir une lettre majuscule' });
      }
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
            if (!user){
                // L'utilisateur n'existe pas
                return res.status(401).json({error: 'Paire identifiant / mot de passe incorrecte'})
            } else{
                // On compare le mot de passe de la requête et celui enregistré en BDD
                bcrypt.compare(req.body.password, user.password)
                // La valeur est-elle fausse ? Erreur d'identification
                .then (valid =>{ 
                    if (!valid){
                        // erreur de mdp incorrect
                        return res.status(401).json({message: 'Paire identifiant / mot de passe incorrecte'});
                    }
                        // Requête réussie
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h'}
                        )
                    });

                })
                // Erreur serveur
                .catch(error => {
                    return res.status(500).json({error})
                })
            }
        })
        // Erreur d'exécution de la requête (erreur serveur et non erreur de paire mdp / email)
        .catch(error => {
            return res.status(500).json({error})
        })

}