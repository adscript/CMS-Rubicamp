var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var userSchema = new Schema({
    email: {
        type: String,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    token: String
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        // Store hash in your password DB.
        if (err)
            console.log(err);
        else {
            this.password = hash;
            this.token = this.generateToken();
            next();
        }
    })
});

userSchema.methods.generateToken = function(){
    return jwt.sign({ email: this.email }, 'adscript');
}

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

userSchema.statics.checkToken = function(token){
    return jwt.verify(token, 'adscript');
}

userSchema.methods.destroyToken = function(){
    return this.token = undefined;
}

userSchema.methods.getToken = function(){
    return this.token;
}

module.exports = mongoose.model('User', userSchema);