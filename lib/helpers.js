/*
 * Helpers for various tasks
 *
 */

// Dependencies
const config = require('./config');
const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

// Container for all the helpers
const helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

// Export the module
module.exports = helpers;