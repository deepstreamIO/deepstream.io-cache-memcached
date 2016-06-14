# deepstream.io-cache-memcached

[![Build Status](https://travis-ci.org/deepstreamIO/deepstream.io-cache-memcached.svg?branch=master)](https://travis-ci.org/deepstreamIO/deepstream.io-cache-memcached)
[![Coverage Status](https://coveralls.io/repos/github/deepstreamIO/deepstream.io-cache-memcached/badge.svg?branch=master)](https://coveralls.io/github/deepstreamIO/deepstream.io-cache-memcached?branch=master)
[![npm](https://img.shields.io/npm/v/deepstream.io-cache-memcached.svg)](https://www.npmjs.com/package/deepstream.io-cache-memcached)
[![Dependency Status](https://david-dm.org/deepstreamIO/deepstream.io-cache-memcached.svg)](https://david-dm.org/deepstreamIO/deepstream.io-cache-memcached)
[![devDependency Status](https://david-dm.org/deepstreamIO/deepstream.io-cache-memcached/dev-status.svg)](https://david-dm.org/deepstreamIO/deepstream.io-cache-memcached#info=devDependencies) 

A [deepstream.io](http://deepstream.io/) cache connector for [memcached](http://memcached.org/)

This connector uses [the npm memcached package](https://www.npmjs.com/package/memcached). Please have a look there for detailed options.

##Basic Setup
```yaml
plugins:
  cache:
    name: memcached
    options:
      serverLocation: ${MEMCACHED_URL}
```

```javascript
var Deepstream = require( 'deepstream.io' ),
    MemcachedConnector = require( 'deepstream.io-cache-memcached' ),
    server = new Deepstream();

server.set( 'cache', new MemcachedConnector({
  serverLocation: 'localhost:11211'
}));

server.start();
```
