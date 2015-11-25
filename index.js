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
    geolib = require('geolib'),
    Promise = require('bluebird'),
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
      user: 'root',
      password: 'passw0rd',
      port: 3306,
      database: 'ruclose'
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

app.get('/api/distance/:from/:to', function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.isIn([req.params.from, req.params.to])
        })
        .then(function(locations){

            var from = locations[0];
            var to = locations[1];

            var distance = geolib.getDistance(
                {latitude: Number(from.latitude), longitude: Number(from.longitude)},
                {latitude: Number(to.latitude), longitude: Number(to.longitude)}
            );

            res.send({
                from : from.description,
                to : to.description,
                distance : distance
            });
        });
});


app.get('/api/center', function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.getLocations()
        })
        .then(function(locations){
            var center = geolib.getCenter(locations);
            res.send({center : center});
        });
});


app.get('/api/in_circle/:from/:to/:distance', function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.isIn([req.params.from, req.params.to]);
        })
        .then(function(locations){

            var from = locations[0];
            var to = locations[1];
            var distance = req.params.distance;

            var inCircle = geolib.isPointInCircle(
                {latitude: Number(from.latitude), longitude: Number(from.longitude)},
                {latitude: Number(to.latitude), longitude: Number(to.longitude)},
                distance
            );

            res.send({
                from : from.description,
                to : to.description,
                distance : distance,
                inCircle : inCircle
            });
        });
});


app.get('/api/nearest/:from', function(req, res, next){
    req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return Promise.join(dataService.isIn([req.params.from]), dataService.notIn([req.params.from]));
        })
        .then(function(results){

            var fromList = results[0];
            var locations = results[1];

            var from = fromList[0];
            var distance = req.params.distance;

            var locationsMap = {};
            locations.forEach(function(loc){
                locationsMap[loc.description] = {latitude : loc.latitude, longitude : loc.longitude};
            });

            var nearest = geolib.findNearest(
                from,
                locationsMap
            );

            nearest.nearest_to = from;

            res.send(nearest);
        });
});

//this should be a post but this is only an illustration of CRUD - not on good practices
//app.delete('/issues/:id', issues.delete);

app.use(errorHandler);

//configure the port number using and environment number
var portNumber = process.env.CRUD_PORT_NR || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('ruclose app running at port # :', portNumber);
});
