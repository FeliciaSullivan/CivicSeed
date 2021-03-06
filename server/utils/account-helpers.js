'use strict';

var bcrypt = require('bcrypt')

module.exports = (function () {

  return {

    // Generates a hashed password and salt
    hashPassword: function (password, cb) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          cb({
            hash: hash,
            salt: salt
          })
        })
      })
    }

  }

}())
