const mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    ingredients: [{
        name: {
            type: String,
            required: false
        },
        amount: {
            type: Number,
            required: false

        }
    }]
});

var Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = {
    Recipe
}