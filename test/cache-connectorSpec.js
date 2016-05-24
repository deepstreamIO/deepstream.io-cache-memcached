/* global describe, it */
var expect = require('chai').expect
var CacheConnector = require( '../src/connector' ),
	EventEmitter = require( 'events' ).EventEmitter,
	settings = { serverLocation: process.env.MEMCACHED_URL || 'localhost:11211' },
	MESSAGE_TIME = 20;

describe( 'the message connector has the correct structure', function(){
	var cacheConnector;

	it( 'throws an error if required connection parameters are missing', function(){
		expect(function(){ new CacheConnector( 'gibberish' ); }).to.throw();
	});

	it( 'creates the cacheConnector', function( done ){
		cacheConnector = new CacheConnector( settings );
		expect( cacheConnector.isReady ).to.equal( false );
		cacheConnector.on( 'ready', done );
	});

	it( 'implements the cache/storage connector interface', function() {
	    expect( typeof cacheConnector.name ).to.equal( 'string' );
	    expect( typeof cacheConnector.version ).to.equal( 'string' );
	    expect( typeof cacheConnector.get ).to.equal( 'function' );
	    expect( typeof cacheConnector.set ).to.equal( 'function' );
	    expect( typeof cacheConnector.delete ).to.equal( 'function' );
	    expect( cacheConnector instanceof EventEmitter ).to.equal( true );
	});

	it( 'retrieves a non existing value', function( done ){
		cacheConnector.get( 'someValue', function( error, value ){
			expect( error ).to.equal( null );
			expect( value ).to.equal( null );
			done();
		});
	});

	it( 'sets a value', function( done ){
		cacheConnector.set( 'someValue', { firstname: 'Wolfram' }, function( error ){
			expect( error ).to.equal( null );
			done();
		});
	});

	it( 'retrieves an existing value', function( done ){
		cacheConnector.get( 'someValue', function( error, value ){
			expect( error ).to.equal( null );
			expect( value ).to.eql( { firstname: 'Wolfram' } );
			done();
		});
	});

	it( 'deletes a value', function( done ){
		cacheConnector.delete( 'someValue', function( error ){
			expect( error ).to.equal( null );
			done();
		});
	});

	it( 'Can\'t retrieve a deleted value', function( done ){
		cacheConnector.get( 'someValue', function( error, value ){
			expect( error ).to.equal( null );
			expect( value ).to.equal( null );
			done();
		});
	});
});
