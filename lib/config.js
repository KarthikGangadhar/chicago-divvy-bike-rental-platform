/*
 * Create and export configuration variables
 *
 */

// Container for all environments
const environments = {};

// Staging (default) environment
environments.staging = {
  'httpPort': 3000,
  'apikey': 'jjn1qwgxgca3mwr839nx',
  'divvybikes_url': 'https://gbfs.divvybikes.com/gbfs/en/station_information.json',
  'data_file': 'Divvy_Trips_2019.csv'
};

// Testing (default) environment
environments.staging = {
  'httpPort': 3000,
  'apikey': 'jjn1qwgxgca3mwr839nx',
  'divvybikes_url': 'https://gbfs.divvybikes.com/gbfs/en/station_information.json',
  'data_file': 'Divvy_Trips_2019.csv'
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
