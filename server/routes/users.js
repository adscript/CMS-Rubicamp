var express = require('express');
var router = express.Router();
const User = require('../models/user');

// ================================================ REGISTER ROUTER =================================================
router.post('/register', function (req, res) {
  let response = {
    status: false,
    message: '',
    data: {},
    token: ''
  }

  let { email, password, retypePassword } = req.body;
  if (password == retypePassword) {
    User
      .findOne({
        email
      }).then(docs => {
        if (docs) {
          response.message = 'Email already exist';
          res.json(response);
        } else {
          const user = new User({
            email, password
          })
          user.save().then(result => {
            response.status = true;
            response.message = 'Register Successfull';
            response.data.email = email;
            response.token = result.token;
            res.json(response);
          })
        }
      }).catch(err => {
        response.message = 'Email or password not valid';
        res.json(response);
      })
  } else {
    response.message = 'Password not match';
  }
});

// ==================================================== LOGIN OAUTH ===================================================
router.post('/login', function (req, res) {
  let { email, password } = req.body;
  let response = {
    status: false,
    message: '',
    data: {},
    token: ''
  }

  User.find({
    email
  }).then(user => {
    if (user) {
      if (user[0].comparePassword(password)) {
        response.status = true;
        response.message = 'Logged in successfully';
        response.data.email = email;
        response.token = user[0].generateToken();
        User.update({ email }, { token: response.token }, ((err) => {
          if (err) response.message = err.toString();
          res.status(201).json(response);
        }))
      }
      else {
        response.message = 'Wrong Password';
        res.status(400).json(response);
      }
    } else {
      response.message = 'no email found';
      res.status(400).json(response);
    }
  })
});

// ================================================ CHECK TOKEN ===============================================
router.post('/check', function (req, res) {
  let token = req.header('Authorization');
  let response = {
    valid: false
  }
  try {
    let objEmail = User.checkToken(token);
    if (objEmail) {
      User.find({ email: objEmail.email }).then(user => {
        if (user)
          response.valid = true;
        res.json(response);
      }).catch(err => res.json(response));
    } else {
      res.json(response);
    }
  } catch {
    res.json(response);
  }
});

// =============================================== DESTROY TOKEN =================================================
router.get('/logout', function (req, res){
  let token = req.header('Authorization');
  let response = {
    logout: false
  }
  let objEmail = User.checkToken(token);
  if (objEmail) {
    User.find({ email: objEmail.email }).then(user => {
      if (user)
        response.logout = true;
      res.json(response);
    }).catch(err => res.json(response));
  } else {
    res.json(response);
  }
})

module.exports = router;
