const sharp = require('sharp');
const fs = require ('fs')

const optimizeImage = async (req, res, next) => {
  // Si pas de fichier
    if (!req.file) {
      return next();
    }
    // On récupère le chemin d'accès de l'image
    const imagePath = req.file.path;
    // on définit le nouveau chemin
    const optimizedImagePath = `${imagePath.split('.')[0]}_optimized.webp`;

    try {
      // On redimensionne l'image en utilisant Sharp. On en modifie l'extension et on enregistre l'image
      await sharp(imagePath)
        .resize(410, 540, {fit: 'contain'})
        .webp({ quality: 80 })
        .toFile(optimizedImagePath);

      // On supprime l'image d'origine et on met à jour son chemin d'accès 
      fs.unlink(imagePath, (err) => {
        req.file.path = optimizedImagePath
        if (err) {
          console.error(err)
        }
      next();
    })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de l'optimisation de l'image" })
    }
  };

module.exports = optimizeImage;