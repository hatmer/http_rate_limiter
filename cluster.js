var cluster = require('cluster');
var net = require('net');
var numCPUs = require('os').cpus().length;

var HOST = '127.0.0.1';
var PORT = '8000';

var DEBUG = false;

function runCluster (config) {
  
  if (cluster.isMaster) {

    // Initialize limiter
    var limits = require('./rate_timer.js');
    var limiter = new limits.limiter(config);
    
    // Fork workers.  
    if (DEBUG) { console.log('# CPUs: ' + numCPUs); }

    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
      if (DEBUG) {console.log('worker ' + worker.process.pid + ' died');}
    });

    // Handle worker messages
    function messageHandler(msg) {
      
      if (msg.worker_id && msg.user_id && msg.user_id !== '') {
        var worker_id = parseInt(msg.worker_id);

        // check limits     
        var allowed = limiter.checkLimits(msg.user_id);
        if (allowed) {
          cluster.workers[worker_id].send('accepted');
          if (DEBUG) {
            console.log("worker "+msg.worker_id+" accepting req. from "+msg.user_id);
          } 
          return;
        }
      }
      cluster.workers[worker_id].send('rejected');
      if (DEBUG) {                                                                    
        console.log("worker "+msg.worker_id+" rejecting req. from "+msg.user_id);      
      }
    }

    Object.keys(cluster.workers).forEach(function(id) {
      cluster.workers[id].on('message', messageHandler);
    });

  } else {
    var server = require('./worker_server.js');
    var worker = server.start(cluster.worker.id);
  }
}
exports.runCluster = runCluster;
