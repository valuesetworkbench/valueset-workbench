'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ColorHash = require('color-hash'),
    request = require('request'),
    AvatarGenerator = require('initials-avatar-generator').AvatarGenerator,
    User = mongoose.model('User');


var colorHash = new ColorHash();

exports.getPhoto = function(req, res) {

    var id = req.params.id;

    User.findById(id).exec(function(err, user) {

        if (user.photo && (user.photo.startsWith("http:") || user.photo.startsWith("https:"))) {
            request.get({
                headers: {
                    'accept': 'image/*'
                },
                url: user.photo}).pipe(res);
        } else {

            var text = (user.username == 'admin') ? "A" : user.firstName.charAt(0) + user.lastName.charAt(0)
            var option = {
                width: 75,
                text: text,
                color: colorHash.hex(user.username)
            };
            var avatarGenerator = new AvatarGenerator();
            avatarGenerator.generate(option, function (image) {
                res.setHeader("content-type", "image/png");

                image.stream('png').pipe(res);
            });
        }

    });

};

