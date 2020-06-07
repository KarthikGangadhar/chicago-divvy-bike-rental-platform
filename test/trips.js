/*
 * API Tests
 *
 */

// Dependencies
const app = require('./../main');
const assert = require('assert');
const http = require('http');
const config = require('./../lib/config');

// Holder for Tests
const api = {};

// Helpers
const helpers = {};
helpers.makeGetRequest = function (path, callback) {
    // Configure the request details
    let requestDetails = {
        'protocol': 'http:',
        'hostname': 'localhost',
        'port': config.httpPort,
        'method': 'GET',
        'path': path,
        'headers': {
            'Content-Type': 'application/json',
            'authorization': config.apikey
        }
    };

    // Send the request
    let req = http.request(requestDetails, function (res) {
        callback(res);
    });
    req.end();
};

helpers.makeGetRequestWithoutAPIKey = function (path, callback) {
    // Configure the request details
    let requestDetails = {
        'protocol': 'http:',
        'hostname': 'localhost',
        'port': config.httpPort,
        'method': 'GET',
        'path': path,
        'headers': {
            'Content-Type': 'application/json',
        }
    };

    // Send the request
    let req = http.request(requestDetails, function (res) {
        callback(res);
    });
    req.end();
};

// Make a request to /stations
api['/trips?stations=89,90,91,92,93,94&date=4/3/2019 should respond to GET with 200'] = function (done) {
    helpers.makeGetRequest('/trips?stations=89,90,91,92,93,94&date=4/3/2019', function (res) {
        assert.equal(res.statusCode, 200);
        done();
    });
};

// Make a request to /stations without api key
api['/trips?stations=89,90,91,92,93,94&date=4/3/2019 should respond to GET with 400'] = function (done) {
    helpers.makeGetRequestWithoutAPIKey('/trips?stations=89,90,91,92,93,94&date=4/3/2019', function (res) {
        assert.equal(res.statusCode, 400);
        done();
    });
};

// Export the tests to the runner
module.exports = api;