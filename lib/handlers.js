/*
 * Request Handlers
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');

// Define all the handlers
var handlers = {};

// Not-Found
handlers.notFound = function (data, callback) {
  callback(404, {
    'message': 'endpoint doesnt exist'
  });
};

// Users
handlers.stations = function (data, callback) {
  var acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._stations[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._stations = {};

// stations - get
// Required data: station_id
handlers._stations.get = function (data, callback) {

  // Get token from headers
  var authorization = typeof (data.headers.authorization) == 'string' ? data.headers.authorization : false;
  // Check that station_id number is valid
  var station_id = typeof (data.queryStringObject.station_id) == 'string' && data.queryStringObject.station_id.trim().length >= 1 ? data.queryStringObject.station_id.trim() : false;

  if (authorization && station_id) {

    // Verify that the given token is valid
    handlers._tokens.verifyToken(authorization, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the stations
        helpers.getResponse(config.divvybikes_url, (err, response) => {
          if (!err && response) {
            // parse the response
            response = JSON.parse(response);
            let station = response.data.stations.filter(station => station.station_id == station_id);
            callback(200, station);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, { "Error": "Missing required token in header, or token is invalid." })
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' })
  }
};

// Tokens
handlers.tokens = function (data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - verification
// Verify if a given token id is currently valid for the given user
handlers._tokens.verifyToken = function (token, callback) {

  // Check that token is valid
  var token = typeof (token) == 'string' && token.trim().length == 20 ? token.trim() : false;
  if (token) {
    // Lookup the token
    if (token == config.apikey) {
      // callback(200, tokenData);
      callback(true, "");
    } else {
      callback(false, { 'statusCode': 404, 'Error': 'field invalid' });
      // callback(404, { 'Error': 'field invalid' });
    }
  } else {
    callback(false, { 'statusCode': 400, 'Error': 'Missing required field, or field invalid' });
    // callback(400, { 'Error': 'Missing required field, or field invalid' })
  }
};

// Export the handlers
module.exports = handlers;
