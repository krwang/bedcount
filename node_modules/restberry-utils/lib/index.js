var _ = require('underscore');
var _s = require('underscore.string');
var crypto = require('crypto');


var CRYPTO_BASE_64 = 'base64';
var CRYPTO_HEX = 'hex';
var CRYPTO_SHA1 = 'sha1';
var PATH_ID = ':id';
var REGEX_EMAIL = /[\w\d_]+@\w+\.\w+[\w\.]*/;
var REGEX_MONTH = /20\d{2}\-(0(?=[1-9])|1(?=[0-2]{1}))\d{1}/;
var REGEX_URL = /http[s]{0,1}:\/\/(www\.){0,1}\w+\.{1}\w+[\w\/#\?&]*/;
var REGEX_NBR_WHOLE = /^\d+$/;
var REGEX_NBR_DOT = /\d+\./;
var STR_DOT = '.';
var STR_DOT_ZERO = '.0';
var STR_EMPTY = '';
var STR_ZERO = '0';
var STR_ZERO_DOT = '0.';

module.exports = {
    base64encode: function(str) {
        return new Buffer(str).toString(CRYPTO_BASE_64);
    },

    camelCaseStr: function(str) {
        str = str.toLowerCase();
        return _s.camelize(str);
    },

    dotGet: function(obj, key) {
        var ret = obj;
        var keySplit = key.split(STR_DOT);
        for (var i in keySplit) {
            var k = keySplit[i];
            if (ret)  ret = ret[k];
        }
        return ret;
    },

    dotSet: function(obj, key, val) {
        var ret = obj;
        var keySplit = key.split(STR_DOT);
        var lastKey = keySplit.pop();
        for (var i in keySplit) {
            var k = keySplit[i];
            ret = ret[k];
        }
        if (ret)  ret[lastKey] = val;
    },

    forEachAndDone: function(objs, iter, done) {
        if (objs.length) {
            var obj = objs.pop();
            iter(obj, function() {
                module.exports.forEachAndDone(objs, iter, done);
            });
        } else {
            done();
        }
    },

    getPaths: function(dict) {
        var self = module.exports;
        var paths = [];
        for (key in dict) {
            var key = key;
            var val = dict[key];
            if (_.isObject(val)) {
                var nestedPaths = self.getPaths(val);
                if (nestedPaths.length) {
                    for (i in nestedPaths) {
                        var np = nestedPaths[i];
                        if (np.match(REGEX_NBR_WHOLE)) {
                            np = 0;
                        } else {
                            np = np.replace(REGEX_NBR_DOT, STR_ZERO_DOT);
                        }
                        paths.push(key + STR_DOT + np);
                    }
                } else if (_.isArray(val)) {
                    paths.push(key + STR_DOT_ZERO);
                }
            } else {
                paths.push(key);
            }
        }
        return _.uniq(paths);
    },

    getReqPath: function(req) {
        var path = req.url;
        if (!path)  path = req.path;
        if (req.params && req.params.id) {
            path = path.replace(PATH_ID, req.params.id);
        }
        return path;
    },

    httpMethod: {
        DELETE: 'DELETE',
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
    },

    isJSONParseable: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },

    isValidEmail: function(email) {
        if (!email)  return false;
        return email.match(REGEX_EMAIL) != null;
    },

    isValidMonth: function(month) {
        if (!month)  return false;
        return month.match(REGEX_MONTH) != null;
    },

    isValidURL: function(url) {
        if (!url)  return false;
        return url.match(REGEX_URL) != null;
    },

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + STR_EMPTY;
    },

    prependZeros: function(str, length) {
        str = str.toString();
        while (str.length < length)  str = STR_ZERO + str;
        return str;
    },

    sha1encrypt: function(salt, string) {
        var hmac = crypto.createHmac(CRYPTO_SHA1, salt)
        return hmac.update(string).digest(CRYPTO_HEX);
    },
};
