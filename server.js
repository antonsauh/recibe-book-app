const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const {Recipe} = require('./models/recipe');

mongoose.connect('mongodb://localhost:27017/RecipeBook', {
    useMongoClient: true
});

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.put('/api/recipes', (req, res) => {
    req.body.forEach(function(recipe) {
        console.log(recipe);
        if(recipe._id) {
            console.log("here");
            Recipe.findByIdAndUpdate(recipe._id, {$set: recipe}).then((recipe)=> {
            }).catch((e) => {
                res.send(e);
            })
        }else {
            var newRecipe = new Recipe(recipe);
            newRecipe.save().then(() => {
            }).catch((e) => {
                res.send(e);
            })
        }
    });
});

app.get('/api/recipes', (req, res) => {
    Recipe.find().then((recipes) => {
        res.send(recipes);
    }, (err) => {
        res.status(400).send(err);
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});


app.listen(3000, () => {
    console.log("app started on port " + 3000);
});