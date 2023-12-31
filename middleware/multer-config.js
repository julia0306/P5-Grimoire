// Multer va permettre de faciliter la gestion d'envoi de fichiers à notre API via requête HTTP
// Grâce à Multer, on va pouvoir expliquer comment gérer les images, quel nom leur donner etc. 
// On crée un dossier Images, puis un middleware (multer-config)

const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };

// Fonction diskStorage pour lui dire qu'on va l'enregistrer sur le disque 
const  storage  = multer.diskStorage({
    // besoin de 2 éléments: destination et filename
    // destination = une fonction qui prend 3 arguments et qui dit dans quel dossier enregistrer les images.
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    //Deuxième élement: filename. Explique à Multer quel nom de fichier donner. Evite d'avoir deux fichiers avec le même nom. 
    filename: (req, file, callback) => {
        // On génère le nouveau nom pour le fichier. On utilise le nom d'origine avec la fonction originalname. Possible qu'il y ait des espaces, on les remplace par des underscore. On split autour des espaces. Ca crée un tableau avec les élements du nom. On remplace les espaces par des underscore
        const name = file.originalname.split(' ').join('_');
        // On retire l'extension
        const nameWithoutExtension= name.split('.')[0];
        // On ajoute une extension au fichier. On a accès au mimetype du fichier. On se prépare un dictionnaire "const MIME_TYPES". Les 4 mimetypes qu'on peut avoir sont ceux inscrits dans le dictionnaire. On crée l'extension du fichier grâce à notre dictionnaire 
        const extension = MIME_TYPES[file.mimetype];
        // On appelle le callback avec un premier argument null ppour dire qu'il n'y a pas d'erreur puis on crée le filename entier. Name + timestamp (date.now -> rend le plus unique possible) + "." + extension
        callback(null, nameWithoutExtension + Date.now() + '.' + extension);
    }
})

// On exporte le middleware configuré. On appelle la méthode multer et la méthode single pour indiquer que c'est un fichier unique
module.exports = multer({storage:storage}).single('image');