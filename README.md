#R U Close?

Experiments with geolocation

#Setup

## Create a database

```sql
CREATE DATABASE locations;
CREATE USER geo@localhost IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON locations.* TO geo@localhost;
FLUSH PRIVILEGES;
```

## Create tables

```sql

create table locations(
    id int primary key auto_increment,
    description varchar(100),
    latitude char(30),
    longitude char(30));

create table watchers (
    id int primary auto_increment,
    location_id int,
    latitude char(30),
    longitude char(30),
    foreign key (location_id) references locations(id)
);

```

## Install the dependencies

Using: `npm install`

## Tools for break points

  [Node Inspector](https://github.com/node-inspector/node-inspector)

  [Using MS Visual Code](http://stackoverflow.com/questions/30023736/mocha-breakpoints-using-visual-studio-code)
