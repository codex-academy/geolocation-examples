# Geo location examples

Experiments with geolocation

Using:

* [geolib](https://www.npmjs.com/package/geolib)
* HTML5 geolocation support
* Google Maps

Supporting technology:

* API
* Ajax using jQuery
* Client Side Handlebars

## Setup

### Create a database

```sql
CREATE DATABASE geolocation;
CREATE USER geo@localhost IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON geolocation.* TO geo@localhost;
FLUSH PRIVILEGES;
```

### Create tables

```sql
USE geolocation;

CREATE TABLE locations(
    id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(100),
    latitude CHAR(30),
    longitude CHAR(30),
    TIME BIGINT
    );
```

### Install the dependencies

`npm install`

### Run the application

`node index.js`

## Tools for break points

  [Node Inspector](https://github.com/node-inspector/node-inspector)

  [Using MS Visual Code](http://stackoverflow.com/questions/30023736/mocha-breakpoints-using-visual-studio-code)
