/*
 * Helpers for various tasks
 *
 */

// Dependencies

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

    let comparison = 0;
    if (a && a["01 - Rental Details Local End Time"] && b && b["01 - Rental Details Local End Time"]) {
        const dateA = new Date(a["01 - Rental Details Local End Time"]);
        const dateB = new Date(b["01 - Rental Details Local End Time"]);

        if (dateA > dateB) {
            comparison = -1;
        } else if (dateA < dateB) {
            comparison = 1;
        }
    }
    return comparison;
}

// Export the module
module.exports = helpers;