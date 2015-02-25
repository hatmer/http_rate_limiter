var http = require('http');

http.get("http://127.0.0.1:8000/?user=adam", function(res) {
  console.log("A got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("A got error: " + e.message);
});
http.get("http://127.0.0.1:8000/?user=brad", function(res) {                              
  console.log("B got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("B got error: " + e.message);
});
http.get("http://127.0.0.1:8000/?user=carl", function(res) {                              
  console.log("C got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("C got error: " + e.message);
});
