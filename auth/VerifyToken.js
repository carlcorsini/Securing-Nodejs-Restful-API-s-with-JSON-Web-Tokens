const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  // grab token from headers
  let token = req.headers['x-access-token'];
  // check if token exists
  if (!token) return res.status(403).send({ auth: false, message: "No token provided"});

  // Validate/verify the token
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, messaged: "Failed to autheticate the token" });
    req.userId = decoded.id;
    next()
  })
}

module.exports = verifyToken;