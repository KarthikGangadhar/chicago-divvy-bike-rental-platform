/*
 * Primary file for API
 *
 */

// Dependencies
const server = require('./lib/server');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Declare the app
const app = {};

// Init function
app.init = function () {

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });

  } else {

    // Start the server
    server.init();
    let message = `worker ${process.pid}...`;
    console.log(message);

  }

};

if (typeof (process.env.NODE_ENV) == 'string' && process.env.NODE_ENV.toLowerCase() == 'testing') {
  server.init();
} else {
  // Self executing
  app.init();
}

// Export the app
module.exports = app;