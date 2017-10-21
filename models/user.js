const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            unique: true,
            validate : {
                validator: validator.isEmail,
                message: '{VALUE} is not valid email'
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }]    
});

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, '123');
        
    } catch (e) {   
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded.id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}
UserSchema.statics.findByCredentials = function (email, password) {
    return this.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, function(err, res) {
                if(err) {
                    return reject();
                } else if (res) {
                    return resolve(user);
                } else {
                    return reject();
                }
            });
        });
    });
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, '123').toString();

    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });
};

UserSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })

    } else {
        next();
    }
})

var User = mongoose.model('User', UserSchema)

module.exports = {
    User
}