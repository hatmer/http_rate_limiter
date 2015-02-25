var url = require('url');
var http = require('http');

var HOST = '127.0.0.1';
var PORT = 8000;

var DEBUG = false;

function start(id) {
  if (DEBUG) {console.log("worker " + id + " has started");}
  var server = http.createServer();

  server.on('request', function(req,res) {  
    
    var pending_request = true;

    // request go-ahead from master
    userID = url.parse(req.url, true).query['user'];
    process.send({ worker_id: id, user_id: userID });

    process.on('message', function(msg) {
      // if accepted:
      if (msg === 'accepted' && pending_request) {
        pending_request = false;
        res.statusCode = 202;

        if (DEBUG) {console.log("worker " + id + " got accept");}
      }
      // if rejected:
      else if (msg === 'rejected' && pending_request) {
        pending_request = false;
        res.statusCode = 403; 

        if (DEBUG) {console.log("worker " + id + " got reject");}
      }
      res.end();
    });
  });
  server.listen(PORT, HOST)
}
exports.start = start;
