'use strict'

const ethUtil = require('ethereumjs-util')
const ethashjs = require('ethashjs')
const ethHashUtil = require('ethashjs/util')
const ethashcpp = require('bindings')('ethash')

var messages = require('./messages')

// TODO: cacheDB support

var Ethash = module.exports = function (cacheDB) {
  this.dbOpts = {
    valueEncoding: 'json'
  }
  this.cacheDB = cacheDB
  this.cache = false
  this.light = false
}

// ethash_light_new(block_number)
// returns: { block_number: Number, cache: Buffer }
Ethash.prototype.ethash_light_new = ethashcpp.ethash_light_new

// ethash_light_compute(light, header_hash, nonce)
// returns: { mix_hash: Buffer, result: Buffer }
Ethash.prototype.ethash_light_compute = function (light, header_hash, nonce) {
  if (!light || !light.hasOwnProperty('block_number') || !light.hasOwnProperty('cache')) {
    throw new TypeError(messages.LIGHT_OBJ_INVALID)
  }
  return ethashcpp.ethash_light_compute(light.block_number, light.cache, header_hash, nonce)
}

// mkcache(cacheSize, seed)
// returns: arrays of cache lines
Ethash.prototype.mkcache = function (cacheSize, seed) {
  // get new cache from cpp
  this.cache = ethashcpp.ethash_light_new_internal(cacheSize, seed)

  return this.cache
}

// run(val, nonce, fullSize)
// returns: { mix: Buffer, hash: buffer }
Ethash.prototype.run = function (val, nonce, fullSize) {
  // get new cache from cpp
  var ret = ethashcpp.ethash_light_compute_internal(this.cache, fullSize, val, nonce)

  return {
    mix: ret.mix_hash,
    hash: ret.result
  }
}

Ethash.prototype.headerHash = ethashjs.prototype.headerHash

Ethash.prototype.cacheHash = function () {
  return ethUtil.sha3(this.cache)
}

/**
 * Loads the seed and the cache given a block nnumber
 * @method loadEpoc
 * @param number Number
 * @param cm function
 */
Ethash.prototype.loadEpoc = function (number, cb) {
  var self = this
  const epoc = ethHashUtil.getEpoc(number)

  if (this.epoc === epoc) {
    return cb()
  }

  this.epoc = epoc

  // gives the seed the first epoc found
  function findLastSeed (epoc, cb2) {
    if (epoc === 0) {
      return cb2(ethUtil.zeros(32), 0)
    }

    self.cacheDB.get(epoc, self.dbOpts, function (err, data) {
      if (!err) {
        cb2(data.seed, epoc)
      } else {
        findLastSeed(epoc - 1, cb2)
      }
    })
  }

  /* eslint-disable handle-callback-err */
  self.cacheDB.get(epoc, self.dbOpts, function (err, data) {
    if (!data) {
      self.cacheSize = ethHashUtil.getCacheSize(epoc)
      self.fullSize = ethHashUtil.getFullSize(epoc)

      findLastSeed(epoc, function (seed, foundEpoc) {
        self.seed = ethHashUtil.getSeed(seed, foundEpoc, epoc)
        var cache = self.mkcache(self.cacheSize, self.seed)
        // store the generated cache
        self.cacheDB.put(epoc, {
          cacheSize: self.cacheSize,
          fullSize: self.fullSize,
          seed: self.seed,
          cache: cache
        }, self.dbOpts, cb)
      })
    } else {
      // Object.assign(self, data)
      self.cache = data.cache
      self.cacheSize = data.cacheSize
      self.fullSize = data.fullSize
      self.seed = new Buffer(data.seed)
      cb()
    }
  })
  /* eslint-enable handle-callback-err */
}

Ethash.prototype._verifyPOW = ethashjs.prototype._verifyPOW

Ethash.prototype.verifyPOW = ethashjs.prototype.verifyPOW
