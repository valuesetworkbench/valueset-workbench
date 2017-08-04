var _ = require('lodash');

'use strict';

exports.stripTrailingSlash = function (url) {
    return url.replace(/\/+$/, "");
}

exports.getResourceNameFromMsg = function (body) {
    var suffix = "Msg";

    var msgKey = _.findKey(body, function (obj, key) {
        return key.indexOf(suffix, key.length - suffix.length) !== -1;
    });

    if (msgKey) {
        return msgKey.substring(0, msgKey.lastIndexOf(suffix));
    }
}

exports.findResource = function (body) {
    var msgKey = _.findKey(body, function (obj, key) {
        var suffix = "Msg";
        return key.indexOf(suffix, key.length - suffix.length) !== -1;
    });

    if (msgKey) {
        var resourceKey = _.findKey(body[msgKey], function (key) {
            return key !== 'heading';
        });

        return body[msgKey][resourceKey];
    }
}

exports.addChangeMetadata = function (user, resource) {
    var resourceKey = Object.keys(resource)[0];

    if (!resource[resourceKey].changeDescription) {
        resource[resourceKey].changeDescription.changeSource = {
            content: user.email
        };
    }

    return resource;
}