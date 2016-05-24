# deepstream.io-cache-memcached [![Build Status](https://travis-ci.org/deepstreamIO/deepstream.io-cache-memcached.svg?branch=master)](https://travis-ci.org/deepstreamIO/deepstream.io-cache-memcached) [![npm version](https://badge.fury.io/js/deepstream.io-cache-memcached.svg)](http://badge.fury.io/js/deepstream.io-cache-memcached) [![Coverage Status](https://coveralls.io/repos/github/deepstreamIO/deepstream.io-cache-memcached/badge.svg?branch=master)](https://coveralls.io/github/deepstreamIO/deepstream.io-cache-memcached?branch=master)

A [deepstream.io](http://deepstream.io/) cache connector for [memcached](http://memcached.org/)

This connector uses [the npm memcached package](https://www.npmjs.com/package/memcached). Please have a look there for detailed options.

##Basic Setup
```javascript
var Deepstream = require( 'deepstream.io' ),
    MemcachedConnector = require( 'deepstream.io-cache-memcached' ),
    server = new Deepstream();

server.set( 'cache', new MemcachedConnector({
  serverLocation: 'localhost:11211'
}));

server.start();
```
