'use strict';

var express = require('express'),
    exphbs  = require('express-handlebars'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    locations = require('./locations'),
    join = require('./join'),
    http = require('http'),
    socket_io = require('socket.io'),
    DataService = require('./data-service'),
    api = require('./api'),
    connectionProvider = require('connection-provider');

var app = express();
var httpServer = http.Server(app);
var io = socket_io(http);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

var dbOptions = {
      host: 'localhost',
      user: 'geo',
      password: 'password',
      port: 3306,
      database: 'geolocation'
};

//setup template handlebars as the template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(connectionProvider(dbOptions, function(connection){
    return {
        dataService : new DataService(connection)
    }
}));

//setup middleware
//app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

//setup the handlers

app.get('/', locations.home)
app.get('/locations/add', locations.showAdd);
app.get('/locations/delete/:locationId', locations.delete);
app.post('/locations/add', locations.add);
app.get('/join/<location_id>', join.home);

app.get('/api/distance/:from/:to', api.distance_from);
app.get('/api/center', api.center);
app.get('/api/in_circle/:from/:to/:distance', api.distance);
app.get('/api/nearest/:from', api.nearest);
app.get('/api/selected/:id', api.get_all);
app.get('/api/locations', api.locations);

//this should be a post but this is only an illustration of CRUD - not on good practices
//app.delete('/issues/:id', issues.delete);

app.use(errorHandler);

//configure the port number using and environment number
var portNumber = process.env.CRUD_PORT_NR || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('ruclose app running at port # :', portNumber);
});
