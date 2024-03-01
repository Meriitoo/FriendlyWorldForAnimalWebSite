const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Email is required!'],
        minLength: 2,
    },
    kind: {
        type: String, 
        required: true,
        minLength: 3,
    },
    photoImage: {
        type: String, 
        required: true,
        validate: /^https?:\/\//,
    },
    years: {
        type: Number, 
        required: true,
        min: 1,
        max: 100,
    },
    need: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 20,
    },
    description: {
        type: String, 
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    location: {
        type: String, 
        required: true,
        minLength: 5,
        maxLength: 15,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User', //User is the model, which is creating the relationship between them
    },
    donations: [{
            type: mongoose.Types.ObjectId, //this is array, because more users can buy this crypto
            ref: 'User',      
        }],
});

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;

