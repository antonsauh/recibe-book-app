const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const {Recipe} = require('./models/recipe');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

mongoose.connect('mongodb://localhost:27017/RecipeBook', {
    useMongoClient: true
});

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/signup', (req, res) => {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token)=> {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.post('/api/signin', (req, res) => {
    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.delete('/api/signout', (req, res) => {
    req.user.removeToken(req.body.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})

app.put('/api/recipes', (req, res) => {
    req.body.forEach(function(recipe) {
        if(recipe._id) {
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
