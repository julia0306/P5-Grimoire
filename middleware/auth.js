const jwt = require ('jsonwebtoken');

module.exports =(req, res, next) => {
    // Possible qu'il se passe tout un tas d'erreurs don les gérer avec try... catch. En cas d'erreur, on renvoie une erreur 401 en passant en valeur notre erreur histoire d'avoir des infos concernant le pb. 
    try{
        //On récupère le header et on le split entre le bearer et le token. On veut récupérer le token qui est en deuxième

        const token = req.headers.authorization().split(' ')(1)
        // On a le token; on veut le décoder. Pour cela, on fait appel à la méthode "verify" de jsonwebtoken. On lui passe le token qu'on a récupéré ainsi que la clé secrète. En cas d'erreur, on renvoie une erreur (cf catch)
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId
        // On récupère le userId. On rajoute cette valeur à notre objet request qui est transmis aux routes appelées par la suite
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({error})
    }
}

// On a un middleware qui vérifie le token et on le transmet aux autres middlewares ou aux gestionnaires de routes