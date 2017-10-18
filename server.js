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
        var newRecipe = new Recipe(recipe);
        if(newRecipe._id) {
            Recipe.findByIdAndUpdate(newRecipe._id, newRecipe).then((recipe)=> {
            }).catch((e) => {
                res.send(e);
            })
        }else {
            newRecipe.save().then(() => {
            }).catch((e) => {
                res.send(e);
            })
        }
    });
    res.status(200).send("all done");
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