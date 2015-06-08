# deepstream.io-cache-memcached [![npm version](https://badge.fury.io/js/deepstream.io-cache-memcached.svg)](http://badge.fury.io/js/deepstream.io-cache-memcached)
A [deepstream.io](http://deepstream.io/) cache connector for [memcached](http://memcached.org/)

This connector uses [the npm memcached package]. Please have a look there for detailed options.

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

