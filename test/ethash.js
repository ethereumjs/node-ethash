'use strict'
/* global describe, it */

var expect = require('chai').expect
const Header = require('ethereumjs-block/header.js')
const ethUtil = require('ethereumjs-util')
const powTests = require('ethereumjs-testing').tests.powTests.ethash_tests

var messages = require('../js/messages')

// ethash_light_compute(block_number, header_hash, nonce)

/**
 * @param {Object} ethash
 */
module.exports = function (Ethash) {
  var ethash = new Ethash()

  describe('ethash_light_compute', function () {
    var test = powTests['first']
    var header = new Header(new Buffer(test.header, 'hex'))
    var block_number = ethUtil.bufferToInt(header.number)
    var header_hash = new Buffer(test.header_hash, 'hex')
    var nonce = new Buffer(test.nonce, 'hex')

    it('block_number should be a Number', function () {
      expect(function () {
        ethash.ethash_light_compute(null, header_hash, nonce)
      }).to.throw(TypeError, messages.BLOCKNUM_TYPE_INVALID)

      expect(function () {
        ethash.ethash_light_compute('DoTheySpeakEnglishInWhat?', header_hash, nonce)
      }).to.throw(TypeError, messages.BLOCKNUM_TYPE_INVALID)
    })

    it('header_hash should be a Buffer', function () {
      expect(function () {
        ethash.ethash_light_compute(block_number, null, nonce)
      }).to.throw(TypeError, messages.HEADERHASH_TYPE_INVALID)

      expect(function () {
        ethash.ethash_light_compute(block_number, 'SayHelloToMyLittleFriend', nonce)
      }).to.throw(TypeError, messages.HEADERHASH_TYPE_INVALID)
    })

    it('header_hash invalid length', function () {
      var hash = new Buffer(test.header_hash.slice(0, -6), 'hex')

      expect(function () {
        ethash.ethash_light_compute(block_number, hash, nonce)
      }).to.throw(RangeError, messages.HEADERHASH_LENGTH_INVALID)
    })

    it('nonce should be a Buffer', function () {
      expect(function () {
        ethash.ethash_light_compute(block_number, header_hash, null)
      }).to.throw(TypeError, messages.NONCE_TYPE_INVALID)

      expect(function () {
        ethash.ethash_light_compute(block_number, header_hash, 'AreYouTalkingToMe?')
      }).to.throw(TypeError, messages.NONCE_TYPE_INVALID)
    })

    var tests = Object.keys(powTests)
    tests.forEach(function (key) {
      var test = powTests[key]
      var header = new Header(new Buffer(test.header, 'hex'))
      var block_number = ethUtil.bufferToInt(header.number)
      var header_hash = new Buffer(test.header_hash, 'hex')
      var nonce = new Buffer(test.nonce, 'hex')
      var result = new Buffer(test.result, 'hex')
      var mixhash = new Buffer(test.mixhash, 'hex')

      it('checking ethash_light_compute results (powTests[\'' + key + '\'])', function () {
        var ret = ethash.ethash_light_compute(block_number, header_hash, nonce)
        expect(
          {mix_hash: ret.mix_hash.toString('hex'), result: ret.result.toString('hex')}
        ).to.eql(
          {mix_hash: mixhash.toString('hex'), result: result.toString('hex')}
        )
      })
    })
  })

  describe('mkcache', function () {
    // TODO: test returned errors

    var tests = Object.keys(powTests)

    tests.forEach(function (key) {
      var test = powTests[key]

      it('checking mkcache results (powTests[\'' + key + '\'])', function () {
        ethash.mkcache(test.cache_size, new Buffer(test.seed, 'hex'))
        expect(ethash.cacheHash().toString('hex')).to.equal(test.cache_hash)
      })
    })
  })
}
