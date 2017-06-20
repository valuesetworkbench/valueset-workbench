'use strict';

var email = require("emailjs/email"),
    config = require('../../config/config');

exports.send = function (content, callback) {
    var server  = email.server.connect(config.email.smtp);

    server.send(content, function(err, message) { console.log(err || message); });
};