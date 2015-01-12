var events = require( 'events' ),
	util = require( 'util' ),
	Memcached = require( 'memcached' ),
	pckg = require( '../package.json' );

/**
 * This class connects deepstream.io to a memcached cache, using the
 * memcached library (https://www.npmjs.com/package/memcached).
 * 
 * Please consult https://www.npmjs.com/package/memcached for details
 * on the serverLocation and memcachedOptions setting
 * 
 * lifetime is the default lifetime for objects in seconds (defaults to 1000)
 * 
 * @author Wolfram Hempel
 * @copyright 2015 Hoxton One Ltd.
 * 
 * @param {Object} options { serverLocation: <mixed>, [lifetime]: <Number>, [memcachedOptions]: <Object> }
 *
 * @constructor
 */
var Connector = function( options ) {
	this.isReady = false;
	this.name = pckg.name;
	this.version = pckg.version;
	this._options = options;
	this._options.lifetime = options.lifetime || 1000;
	
	if( !this._options.serverLocation ) {
		throw new Error( 'Missing parameter \'serverLocation\' for memcached connector' );
	}
	
	this._client = new Memcached( this._options.serverLocation, this._options.memcachedOptions || {} );
	this._client.on( 'failure', this.emit.bind( this, 'error' ) );
	
	process.nextTick( this._ready.bind( this ) );
};

util.inherits( Connector, events.EventEmitter );

/**
 * Writes a value to the cache.
 *
 * @param {String}   key
 * @param {Object}   value
 * @param {Function} callback Should be called with null for successful set operations or with an error message string
 *
 * @private
 * @returns {void}
 */
Connector.prototype.set = function( key, value, callback ) {
	this._client.set( key, value, this._options.lifetime, this._onResponse.bind( this, callback ) );
};

/**
 * Retrieves a value from the cache
 *
 * @param {String}   key
 * @param {Function} callback Will be called with null and the stored object
 *                            for successful operations or with an error message string
 *
 * @private
 * @returns {void}
 */
Connector.prototype.get = function( key, callback ) {
	this._client.get( key, function( err, value ){
		if( err ) {
			callback( err );
			return;
		}
		
		if( value === undefined ) {
			callback( null, null );
			return;
		}
		
		callback( null, value );
	});
};

/**
 * Deletes an entry from the cache.
 *
 * @param   {String}   key
 * @param   {Function} callback Will be called with null for successful deletions or with
 *                     an error message string
 *
 * @private
 * @returns {void}
 */
Connector.prototype.delete = function( key, callback ) {
	this._client.del( key, this._onResponse.bind( this, callback ) );
};

Connector.prototype._ready = function() {
	this.isReady = true;
	this.emit( 'ready' );
};

Connector.prototype._onResponse = function( callback, error ) {
	if( error ) {
		callback( error );
	} else {
		callback( null );
	}
};

module.exports = Connector;