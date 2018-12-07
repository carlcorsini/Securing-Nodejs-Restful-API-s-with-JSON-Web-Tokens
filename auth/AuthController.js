const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../user/User');

//Middleware 
const VerifyToken = require('./VerifyToken');

// Enabling us to use req.body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/me', VerifyToken, (req, res, next) => {
  //returns the user
  User.findById(req.userId, { password: 0 })
    .then( user => {
      if (!user) return res.status(404).send("No User Found");
      return res.status(200).send(user);
    })
    .catch( err => res.status(500).send("There was a problem finding the user"))
});

// Register a new user 
router.post('/register', (req, res) => {
  //name, email, password 
  const { name, email, password } = req.body;
  // hash our password
  let hashPassword = bcrypt.hashSync(password, 8);

  // create a user
  User.create({
    name,
    email,
    password: hashPassword
  })
  .then(user => {
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 84600 //24 hours
    });
    // return a token
    return res.status(200).send({ auth: true, token });
  })
  // if failure return an error
  .catch( err => res.status(500).send(err.message));
})

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then( user => {
      // check if user exists in my database
      if (!user) return res.status(404).send('No user found');
      // password are valid
      let isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) return res.status(401).send({ auth: false, token: null});

      let token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 84600
      })

      //user is logged in 
      return res.status(200).send({ auth: true, token });
    })
});

// delete token from localstorage or cookie
router.get('/logout', (res, req) => {
  return res.status(200).send({ auth: false, token: null });
});

module.exports = router;