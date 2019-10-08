var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET home page. */
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

router.post('/', function (req, res) {
  User.create({ email: req.body.email, password: req.body.password }).then(docs => {
    res.status(200).json(docs);
  }).catch(err => {
    res.status(500).json(err);
  })
});

module.exports = router;
