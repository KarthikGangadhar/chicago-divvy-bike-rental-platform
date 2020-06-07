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
helpers.makeGetRequest = function(path,callback){
  // Configure the request details
  let requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'localhost',
    'port' : config.httpPort,
    'method' : 'GET',
    'path' : path,
    'headers' : {
      'Content-Type' : 'application/json',
      'authorization' : config.apikey
    }
  };

  // Send the request
  let req = http.request(requestDetails,function(res){
      callback(res);
  });
  req.end();
};

helpers.makeGetRequestWithoutAPIKey = function(path,callback){
    // Configure the request details
    let requestDetails = {
      'protocol' : 'http:',
      'hostname' : 'localhost',
      'port' : config.httpPort,
      'method' : 'GET',
      'path' : path,
      'headers' : {
        'Content-Type' : 'application/json',
      }
    };
  
    // Send the request
    let req = http.request(requestDetails,function(res){
        callback(res);
    });
    req.end();
  };

// Make a request to /ping
api['/ping should respond to GET with 404'] = function(done){
  helpers.makeGetRequest('/ping',function(res){
    assert.equal(res.statusCode,404);
    done();
  });
};

// Make a request to /stations
api['/stations?station_id=91 should respond to GET with 200'] = function(done){
  helpers.makeGetRequest('/stations?station_id=91',function(res){
    assert.equal(res.statusCode,200);
    done();
  });
};

// Make a request to /stations without api key
api['/stations?station_id=91 should respond to GET with 400'] = function(done){
    helpers.makeGetRequestWithoutAPIKey('/stations?station_id=91',function(res){
      assert.equal(res.statusCode,400);
      done();
    });
  };

// Make a request to a random path
api['A random path should respond to GET with 404'] = function(done){
  helpers.makeGetRequest('/this/path/shouldnt/exist',function(res){
    assert.equal(res.statusCode,404);
    done();
  });
};

// Export the tests to the runner
module.exports = api;