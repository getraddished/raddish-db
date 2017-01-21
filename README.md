# Raddish-DB

[![Raddish Logo](http://getraddish.com/assets/img/logos/raddish-db.svg)](https://github.com/getraddished/raddish-db)

[![Build Status](https://img.shields.io/travis/getraddished/raddish-db.svg?style=flat-square)](https://travis-ci.org/getraddished/raddish-db)
[![Code Climate](https://img.shields.io/codeclimate/github/getraddished/raddish-db.svg?style=flat-square)](https://codeclimate.com/github/getraddished/raddish-db)
[![Coverage Status](https://img.shields.io/codeclimate/coverage/github/getraddished/raddish-db.svg?style=flat-square)](https://coveralls.io/r/JaspervRijbroek/raddish?branch=develop)
[![Author](https://img.shields.io/badge/author-%40jaspervrijbro-brightgreen.svg?style=flat-square)](https://twitter.com/JaspervanRijbro)

Raddish-DB is the database layer of raddish, also to be used standalone in other projects.  
Feel free to fork and submit a pull request when deemed necessary.

This module is a evolution of the universal-query module, this module will completely replace that module.

## About
Raddish-DB continues on the mindset of Raddish, give a generic API no matter wich database you use.  
For the currently supported databases you will get one single API without any differences.

Currently supprted are:
- Mysql
- MongoDB
- SQLite
- More to be announced.

## Generic API
There is one single API that is used to get database instances and set the config.  
This API is described below (examples below):

**setConfig(object)**:  
This sets the config of the database layer.

**getInstance(name)**:  
This will return an instance.

## Database Layer API
The database layer also has a few methods.

**getConnection()**:  
This makes the actual connection and return it.  
Whenever there is already a connection made this will be returned.

**getBuilder()**:  
This method will return the query builder instance.  
After calling this method you can start builing your query.

**execute(query)**:  
This method will execute a query.  
This can accept a string or an object from the query builder.  
When an object is passed it will try run the ```toQuery``` method on it.
 
## Querybuilder API
The query builder has one and the same API no matter the layer you choose.
Below the methods are descibed. A difference is made between the query methods (insert, update, select and delete).

Although a few method can be called directly on the builder object.

### InsertQuery API

**into(table)**:  
Specify the table/ collection to insert the object into.

**set(key, value)**:  
Set the key and the value to insert.

### UpdateQuery API

**table(table)**:  
The table which to set the update on.

**set(key, value)**:
Set the new value on the given key.

**where(column, constraint, value, next)**:  
Add a where clause to the query.
The next value can be (AND, OR) for multiple where clauses, when no value is given ```AND``` will be assumed.

### SelectQuery API

### DeleteQuery API

**from(table)**:  
The table which to delete from.

**where(column, constraint, value, next)**:  
Add a where clause to the query.
The next value can be (AND, OR) for multiple where clauses, when no value is given ```AND``` will be assumed.