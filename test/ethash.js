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
module.exports = function (ethash) {
  describe('ethash_light_compute', function () {
    var test = powTests['first']
    var header = new Header(new Buffer(test.header, 'hex'))
    var block_number = ethUtil.bufferToInt(header.number)
    var header_hash = new Buffer(test.header_hash, 'hex')
    var nonce = ethUtil.bufferToInt(new Buffer(test.nonce, 'hex'))

    it('block_number should be a Number', function () {
      expect(function () {
        ethash.ethash_light_compute(null, header_hash, nonce)
      }).to.throw(TypeError, messages.BLOCKNUM_TYPE_INVALID)

      expect(function () {
        ethash.ethash_light_compute('DoTheySpeakEnglishInWhat?', header_hash, nonce)
      }).to.throw(TypeError, messages.BLOCKNUM_TYPE_INVALID)

      expect(function () {
        ethash.ethash_light_compute(block_number, header_hash, nonce)
      }).to.not.throw(Error)
    })
  })
}
