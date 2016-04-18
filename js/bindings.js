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
  var rcache = ethashcpp.ethash_light_new_internal(cacheSize, seed)
  // hash size
  var hsize = ethHashUtil.params.HASH_BYTES
  // get number of cache lines
  const n = Math.floor(cacheSize / hsize)
  // split cache (one array per line)
  var cache = []
  for (var i = 0; i < n; i++) {
    cache.push(rcache.slice(i * hsize, (i * hsize) + hsize))
  }

  // set local cache
  this.rcache = rcache
  this.cache = cache

  return this.cache
}

// run(val, nonce, fullSize)
// returns: { mix: Buffer, hash: buffer }
Ethash.prototype.run = function (val, nonce, fullSize) {
  // get new cache from cpp
  var ret = ethashcpp.ethash_light_compute_internal(this.rcache, fullSize, val, nonce)

  return {
    mix: ret.mix_hash,
    hash: ret.result
  }
}

Ethash.prototype.headerHash = ethashjs.prototype.headerHash

Ethash.prototype.cacheHash = function () {
  return ethUtil.sha3(this.rcache)
}
