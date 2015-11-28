#R U Close?

Experiments with geolocation

#Setup

## Create a database

```sql
CREATE DATABASE geolocation;
CREATE USER geo@localhost IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON geolocation.* TO geo@localhost;
FLUSH PRIVILEGES;
```

## Create tables

```sql

create table locations(
    id int primary key auto_increment,
    description varchar(100),
    latitude char(30),
    longitude char(30),
    time bigint
    );


```

## Install the dependencies

Using: `npm install`

## Tools for break points

  [Node Inspector](https://github.com/node-inspector/node-inspector)

  [Using MS Visual Code](http://stackoverflow.com/questions/30023736/mocha-breakpoints-using-visual-studio-code)
