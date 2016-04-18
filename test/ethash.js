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

  describe('ethash_light_new', function () {
    var tests = Object.keys(powTests)

    it('block_number should be a Number', function () {
      expect(function () {
        ethash.ethash_light_new(null)
      }).to.throw(TypeError, messages.BLOCKNUM_TYPE_INVALID)

      expect(function () {
        ethash.ethash_light_new('ViddyWellLittleBrotherViddyWell')
      }).to.throw(TypeError, messages.BLOCKNUM_TYPE_INVALID)
    })

    tests.forEach(function (key) {
      var test = powTests[key]
      var header = new Header(new Buffer(test.header, 'hex'))
      var block_number = ethUtil.bufferToInt(header.number)

      it('checking ethash_light_new results (powTests[\'' + key + '\'])', function () {
        var light = ethash.ethash_light_new(block_number)
        expect(ethUtil.sha3(light.cache).toString('hex')).to.equal(test.cache_hash)
      })
    })
  })

  describe('ethash_light_compute', function () {
    var test = powTests['first']
    var header = new Header(new Buffer(test.header, 'hex'))
    var block_number = ethUtil.bufferToInt(header.number)
    var header_hash = new Buffer(test.header_hash, 'hex')
    var nonce = new Buffer(test.nonce, 'hex')
    var light = ethash.ethash_light_new(block_number)

    it('light object invalid', function () {
      expect(function () {
        ethash.ethash_light_compute(null, header_hash, nonce)
      }).to.throw(TypeError, messages.LIGHT_OBJ_INVALID)

      expect(function () {
        var l = {}
        l.block_number = light.block_number
        ethash.ethash_light_compute(l, header_hash, nonce)
      }).to.throw(TypeError, messages.LIGHT_OBJ_INVALID)

      expect(function () {
        var l = {}
        l.cache = light.cache
        ethash.ethash_light_compute(l, header_hash, nonce)
      }).to.throw(TypeError, messages.LIGHT_OBJ_INVALID)
    })

    it('light.block_number should be a Number', function () {
      expect(function () {
        var l = {}
        l.block_number = null
        l.cache = light.cache
        ethash.ethash_light_compute(l, header_hash, nonce)
      }).to.throw(TypeError, messages.BLOCKNUM_TYPE_INVALID)

      expect(function () {
        var l = {}
        l.block_number = 'DoTheySpeakEnglishInWhat?'
        l.cache = light.cache
        ethash.ethash_light_compute(l, header_hash, nonce)
      }).to.throw(TypeError, messages.BLOCKNUM_TYPE_INVALID)
    })

    it('light.cache should be a Buffer', function () {
      expect(function () {
        var l = {}
        l.block_number = light.block_number
        l.cache = null
        ethash.ethash_light_compute(l, header_hash, nonce)
      }).to.throw(TypeError, messages.CACHE_TYPE_INVALID)

      expect(function () {
        var l = {}
        l.block_number = light.block_number
        l.cache = 'ILoveTheSmellOfNapalmInTheMorning'
        ethash.ethash_light_compute(l, header_hash, nonce)
      }).to.throw(TypeError, messages.CACHE_TYPE_INVALID)
    })

    it('header_hash should be a Buffer', function () {
      expect(function () {
        ethash.ethash_light_compute(light, null, nonce)
      }).to.throw(TypeError, messages.HEADERHASH_TYPE_INVALID)

      expect(function () {
        ethash.ethash_light_compute(light, 'SayHelloToMyLittleFriend', nonce)
      }).to.throw(TypeError, messages.HEADERHASH_TYPE_INVALID)
    })

    it('header_hash invalid length', function () {
      var hash = new Buffer(test.header_hash.slice(0, -6), 'hex')

      expect(function () {
        ethash.ethash_light_compute(light, hash, nonce)
      }).to.throw(RangeError, messages.HEADERHASH_LENGTH_INVALID)
    })

    it('nonce should be a Buffer', function () {
      expect(function () {
        ethash.ethash_light_compute(light, header_hash, null)
      }).to.throw(TypeError, messages.NONCE_TYPE_INVALID)

      expect(function () {
        ethash.ethash_light_compute(light, header_hash, 'AreYouTalkingToMe?')
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
      var light = ethash.ethash_light_new(block_number)

      it('checking ethash_light_compute results (powTests[\'' + key + '\'])', function () {
        var ret = ethash.ethash_light_compute(light, header_hash, nonce)
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

  describe('run', function () {
    // TODO: test returned errors

    var tests = Object.keys(powTests)

    tests.forEach(function (key) {
      var test = powTests[key]
      var header_hash = new Buffer(test.header_hash, 'hex')
      var fullSize = test.full_size
      var nonce = new Buffer(test.nonce, 'hex')
      var result = new Buffer(test.result, 'hex')
      var mixhash = new Buffer(test.mixhash, 'hex')

      ethash.mkcache(test.cache_size, new Buffer(test.seed, 'hex'))

      it('checking run results (powTests[\'' + key + '\'])', function () {
        var ret = ethash.run(header_hash, nonce, fullSize)
        expect(
          {mix_hash: ret.mix.toString('hex'), result: ret.hash.toString('hex')}
        ).to.eql(
          {mix_hash: mixhash.toString('hex'), result: result.toString('hex')}
        )
      })
    })
  })
}
