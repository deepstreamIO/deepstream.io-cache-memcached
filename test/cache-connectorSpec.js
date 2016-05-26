/* global describe, it, beforeEach */
'use strict'

const expect = require('chai').expect
const CacheConnector = require('../src/connector')
const EventEmitter = require('events').EventEmitter
const settings = { serverLocation: process.env.MEMCACHED_URL || 'localhost:11211' }

describe('the message connector has the correct structure', () => {
  let cacheConnector

  beforeEach(() => {
    cacheConnector = new CacheConnector(settings)
  })

  it('throws an error if required connection parameters are missing', () => {
    expect(() => { new CacheConnector('gibberish') }).to.throw()
  })

  it('creates the cacheConnector', done => {
    expect(cacheConnector.isReady).to.equal(false)
    cacheConnector.on('ready', done)
  })

  it('implements the cache/storage connector interface', () => {
    expect(cacheConnector.name).be.a('string')
    expect(cacheConnector.version).be.a('string')
    expect(cacheConnector.get).be.a('function')
    expect(cacheConnector.set).be.a('function')
    expect(cacheConnector.delete).be.a('function')
    expect(cacheConnector instanceof EventEmitter).equal(true)
  })

  it('retrieves a non existing value', done => {
    cacheConnector.get('someValue', (error, value) => {
      expect(error).to.equal(null)
      expect(value).to.equal(null)
      done()
    })
  })

  it('sets a value', done => {
    cacheConnector.set('someValue', { firstname: 'Wolfram' }, error => {
      expect(error).to.equal(null)
      done()
    })
  })

  it('retrieves an existing value', done => {
    cacheConnector.get('someValue', (error, value) => {
      expect(error).to.equal(null)
      expect(value).to.eql({ firstname: 'Wolfram' })
      done()
    })
  })

  it('deletes a value', done => {
    cacheConnector.delete('someValue', error => {
      expect(error).to.equal(null)
      done()
    })
  })

  it('Can\'t retrieve a deleted value', done => {
    cacheConnector.get('someValue', (error, value) => {
      expect(error).to.equal(null)
      expect(value).to.equal(null)
      done()
    })
  })
})
