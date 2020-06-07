/*
 * Helpers for various tasks
 *
 */

// Dependencies
// const config = require('./config');

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

helpers.compare = function (a, b) {
    const dateA = new Date(a["01 - Rental Details Local End Time"]); //a.band.toUpperCase();
    const dateB = new Date(b["01 - Rental Details Local End Time"]);//b.band.toUpperCase();

    let comparison = 0;
    if (dateA > dateB) {
        comparison = -1;
    } else if (dateA < dateB) {
        comparison = 1;
    }
    return comparison;
}

// Export the module
module.exports = helpers;