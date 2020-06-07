/*
 * Request Handlers
 *
 */

// Dependencies
const request_helpers = require('./request_helpers');
const helpers = require('./helpers');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

// Define all the handlers
const handlers = {};

// Not-Found
handlers.notFound = function (data, callback) {
  callback(404, {
    'message': 'endpoint doesnt exist'
  });
};

// Stations
handlers.stations = function (data, callback) {
  let acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._stations[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the stations methods
handlers._stations = {};

// stations - get
// Required data: station_id
handlers._stations.get = function (data, callback) {

  // Get token from headers
  let authorization = typeof (data.headers.authorization) == 'string' ? data.headers.authorization : false;
  // Check that station_id number is valid
  let station_id = typeof (data.queryStringObject.station_id) == 'string' && data.queryStringObject.station_id.trim().length >= 1 ? data.queryStringObject.station_id.trim() : false;

  if (authorization && station_id) {

    // Verify that the given token is valid
    handlers._tokens.verifyToken(authorization, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the stations
        request_helpers.getResponse(config.divvybikes_url, (err, response) => {
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

// Riders
handlers.riders = function (data, callback) {
  let acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._riders[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the riders methods
handlers._riders = {};

// riders - get
// Required data: stations,date
handlers._riders.get = function (data, callback) {

  // Get token from headers
  let authorization = typeof (data.headers.authorization) == 'string' ? data.headers.authorization : false;
  // Check that stations is a string and valid
  let stations = typeof (data.queryStringObject.stations) == 'string' && data.queryStringObject.stations.trim().length >= 1 ? data.queryStringObject.stations.trim().split(',') : false;
  // Check that date is valid
  let date = typeof (data.queryStringObject.date) == 'string' && data.queryStringObject.date.trim().length >= 1 ? data.queryStringObject.date.trim() : false;

  if (authorization && stations && date) {

    // Verify that the given token is valid
    handlers._tokens.verifyToken(authorization, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the Riders
        handlers._riders.getAgeGroups(stations, date, (err, response) => {
          if (!err && response) {
            callback(200, { 'statusCode': 200, 'records': response });
          } else {
            callback(404, { 'statusCode': 404, 'error': err });
          }
        });
      } else {
        callback(403, { 'statusCode': 403, "Error": "Missing required token in header, or token is invalid." })
      }
    });
  } else {
    callback(400, { 'statusCode': 400, 'Error': 'Missing required field' })
  }
};

// riders - get
// Required data: stations,date
handlers._riders.getAgeGroups = function (stations, date, callback) {

  const response = {
    "0-20": 0,
    "21-30": 0,
    "31-40": 0,
    "41-50": 0,
    "51+": 0,
    "unknown": 0,
  }

  if (stations && date) {
    fs.createReadStream(path.resolve(__dirname, 'data', 'trips', config.data_file))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => {
        callback(error, null);
      })
      .on('data', row => {
        let query_date = new Date(date);
        let rental_date = new Date(row["01 - Rental Details Local End Time"]);
        if ((query_date.getDay() == rental_date.getDay()) && (query_date.getFullYear() == rental_date.getFullYear()) && (query_date.getMonth() == rental_date.getMonth())) {
          let station_id = row['02 - Rental End Station ID'] ? row['02 - Rental End Station ID'] : "0";
          if (stations.indexOf(station_id.toString()) > -1) {
            let birth_year = row['05 - Member Details Member Birthday Year'] ? parseInt(row['05 - Member Details Member Birthday Year']) : 0;
            let age = query_date.getFullYear() - birth_year;
            if (age > 0 && age <= 20) {
              response["0-20"] += 1;
            } else if (age > 20 && age <= 30) {
              response["21-30"] += 1;
            } else if (age > 30 && age <= 40) {
              response["31-40"] += 1;
            } else if (age > 40 && age <= 50) {
              response["41-50"] += 1;
            } else if (age > 50) {
              response["51+"] += 1;
            } else {
              response["undefined"] += 1;
            }
          }
        }
      })
      .on('end', (rowCount) => {
        callback(null, response);
      });
  } else {
    callback(400, { 'Error': 'Missing required field' })
  }
}

// Trips
handlers.trips = function (data, callback) {
  let acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._trips[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the trips methods
handlers._trips = {};

// riders - get
// Required data: stations,date
handlers._trips.get = function (data, callback) {

  // Get token from headers
  let authorization = typeof (data.headers.authorization) == 'string' ? data.headers.authorization : false;
  // Check that stations is valid
  let stations = typeof (data.queryStringObject.stations) == 'string' && data.queryStringObject.stations.trim().length >= 1 ? data.queryStringObject.stations.trim().split(',') : false;
  // Check that date is valid
  let date = typeof (data.queryStringObject.date) == 'string' && data.queryStringObject.date.trim().length >= 1 ? data.queryStringObject.date.trim() : false;

  if (authorization && stations && date) {

    // Verify that the given token is valid
    handlers._tokens.verifyToken(authorization, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the Trips
        handlers._trips.getlastTwentyTrips(stations, date, (err, response) => {
          if (!err && response) {
            callback(200, { 'statusCode': 200, 'records': response });
          } else {
            callback(404, { 'statusCode': 404, 'error': err });
          }
        });
      } else {
        callback(403, { 'statusCode': 403, "Error": "Missing required token in header, or token is invalid." })
      }
    });
  } else {
    callback(400, { 'statusCode': 400, 'Error': 'Missing required field' })
  }
};

// riders - get
// Required data: stations, date
handlers._trips.getlastTwentyTrips = function (stations, date, callback) {

  const response = {};

  // singers.sort(compare);
  if (stations && date) {
    fs.createReadStream(path.resolve(__dirname, 'data', 'trips', config.data_file))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => {
        callback(error, null);
      })
      .on('data', row => {
        let query_date = new Date(date);
        let rental_date = new Date(row["01 - Rental Details Local End Time"]);
        if ((query_date.getDay() == rental_date.getDay()) && (query_date.getFullYear() == rental_date.getFullYear()) && (query_date.getMonth() == rental_date.getMonth())) {
          let station_id = row['02 - Rental End Station ID'] ? row['02 - Rental End Station ID'] : "0";
          if (stations.indexOf(station_id.toString()) > -1) {
            response[station_id] = typeof (response[station_id]) == 'object' && response[station_id] instanceof Array ? response[station_id] : [];
            if (response[station_id].length < 20) {
              response[station_id] = [...response[station_id], row];
            } else {
              response[station_id] = response[station_id].sort(helpers.compare);
              let last_update = response[station_id][response[station_id].length - 1];

              if (helpers.compare(last_update, row)) {
                response[station_id].pop();
                response[station_id].push(row);
                response[station_id] = response[station_id].sort(helpers.compare);
              }
            }
            response[station_id] = response[station_id].sort(helpers.compare);
          }
        }
      })
      .on('end', (rowCount) => {
        callback(null, response);
      });
  } else {
    callback(400, { 'Error': 'Missing required field' })
  }
}

// Tokens
handlers.tokens = function (data, callback) {
  let acceptableMethods = ['post', 'get', 'put', 'delete'];
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
  token = typeof (token) == 'string' && token.trim().length == 20 ? token.trim() : false;
  if (token) {
    // Lookup the token
    if (token == config.apikey) {
      callback(true, {});
    } else {
      callback(false, { 'statusCode': 404, 'Error': 'field invalid' });
    }
  } else {
    callback(false, { 'statusCode': 400, 'Error': 'Missing required field, or field invalid' });
  }
};

// Export the handlers
module.exports = handlers;
