# Raddish-DB

[![Raddish Logo](http://getraddish.com/assets/img/logos/raddish-db.svg)](https://github.com/getraddished/raddish-db)

[![Build Status](https://img.shields.io/travis/getraddished/raddish-db.svg?style=flat-square)](https://travis-ci.org/getraddished/raddish-db)
[![Code Climate](https://img.shields.io/codeclimate/github/getraddished/raddish-db.svg?style=flat-square)](https://codeclimate.com/github/getraddished/raddish-db)
[![Coverage Status](https://img.shields.io/codeclimate/coverage/github/getraddished/raddish-db.svg?style=flat-square)](https://coveralls.io/r/JaspervRijbroek/raddish?branch=develop)
[![Author](https://img.shields.io/badge/author-%40jaspervrijbro-brightgreen.svg?style=flat-square)](https://twitter.com/JaspervanRijbro)

Raddish-DB is the database layer of raddish, also to be used standalone in other projects.  
Feel free to fork and submit a pull request when deemed necessary.

This module is a evolution of the universal-query module, this module will completely replace that module.

## What can you expect from this module?
This module is an evolution of universal-query and thus a query builder is bound to be included,
next to this a complete database layer is included as well following the same principles!

The same API for all the adapters, no exception there!

### Features

- Out of the box support for mysql, sqlite, mongo and postgresql.
- Optional ssh layer.
- Super fast performance
- Promise based API.
- Option to add custom adapters.

## A little road map
At this moment it is planned to move this to a C++ language, just for performance matters,
and of course to learn a new language, but mostly the performance.

Although the first version will be build in node and later converted to C++ for first the API must be there.
Then the rest will follow just as easy.

## Contributing
So you want to contribute, we love you!

Please create a fork and update/ patch the required files and send us a pull request.
