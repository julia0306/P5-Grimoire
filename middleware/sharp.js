const sharp = require('sharp');
const fs = require ('fs')

const optimizeImage = async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const imagePath = req.file.path;
    const optimizedImagePath = `${imagePath.split('.')[0]}_optimized.webp`;

    try {
      await sharp(imagePath)
        .resize(410, 540, {fit: 'contain'})
        .webp({ quality: 80 })
        .toFile(optimizedImagePath);


      fs.unlink(imagePath, ()=>{
        req.file.path =optimizedImagePath

      next();
    })
    } catch (err) {
      console.error('Error converting image to webp:', err);
      next(err);
    }
  };

module.exports = optimizeImage;