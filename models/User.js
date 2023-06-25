const mongoose = require('mongoose');

//Ajout d'un package qui va éviter les problèmes avec la base "Mongoose-unique-validator"
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    //"unique" pour éviter que plusieurs utilisateurs s'enregistrent avec la même adresse mail.
    email:{type: String, required: true, unique: true},
    //hash= type "string"
    password:{type: String, required: true}
})

//O, applique le validateur au Schema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);