/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messages = [];
var counter = 1;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var fs = require('fs');
var requestHandler = function(request, response) {

  var statusCode = 200;
  console.log('request method ----------------------', request.method);
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'application/json';
  
  if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end();
  }
  if (request.method === 'GET') {
    if (request.url.match('/classes/messages')) {
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: messages}));  
    }
    if (request.url === '/' || request.url.match('/?username')) {
      var data = fs.readFileSync('/Users/student/hrsf96-chatterbox-server/client/index.html', 'utf8');
      headers['Content-Type'] = 'text/html';
      response.writeHead(200, headers);
      response.write(data);
      response.end();
    } else if (request.url.match('/styles.css')) {
      var data = fs.readFileSync('/Users/student/hrsf96-chatterbox-server/client/styles/styles.css', 'utf8');
      headers['Content-Type'] = 'text/css';
      response.writeHead(200, headers);
      response.write(data);
      response.end();
    } else if (request.url.match('scripts')) {
      var data = fs.readFileSync('/Users/student/hrsf96-chatterbox-server/client/scripts/app.js', 'utf8');
      headers['Content-Type'] = 'application/javascript';
      response.writeHead(200, headers);
      response.write(data);
      response.end();      
    }
  }
  let body = [];
  if (request.method === 'POST') {
    statusCode = 201; 
    headers['Content-Type'] = 'application/jsonp';
    response.writeHead(statusCode, headers);
    request.on('data', (chunk) => {
      body.push(chunk);
    });
    request.on('end', () => {
      body = Buffer.concat(body).toString();
      trueBody = JSON.parse(body);
      trueBody.objectId = counter;
      messages.push(trueBody);
      counter++;
      response.end();
    });
  }
  
};

exports.requestHandler = requestHandler;