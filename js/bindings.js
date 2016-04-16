'use strict'

const ethUtil = require('ethereumjs-util')
const ethashjs = require('ethashjs')
const ethHashUtil = require('ethashjs/util')
const ethashcpp = require('bindings')('ethash')

// TODO: cacheDB support

var Ethash = module.exports = function (cacheDB) {
  this.dbOpts = {
    valueEncoding: 'json'
  }
  this.cacheDB = cacheDB
  this.cache = false
  this.light = false
}

Ethash.prototype.ethash_light_compute = ethashcpp.ethash_light_compute

Ethash.prototype.mkcache = function (cacheSize, seed) {
  // get new cache from cpp
  // ethashcpp.ethash_light_new_internal returns { cache: Buffer, cache_size: int }
  var ret = ethashcpp.ethash_light_new_internal(cacheSize, seed)
  // hash size
  var hsize = ethHashUtil.params.HASH_BYTES
  // get number of cache lines
  const n = Math.floor(cacheSize / hsize)
  // split cache (one array per line)
  var cache = []
  for (var i = 0; i < n; i++) {
    cache.push(ret.cache.slice(i * hsize, (i * hsize) + hsize))
  }

  // set local cache
  this.light = ret
  this.cache = cache

  return this.cache
}

Ethash.prototype.run = function (val, nonce, fullSize) {
  // get new cache from cpp
  // ethashcpp.ethash_light_new_internal returns { mix_hash: Buffer, result: Buffer }
  var ret = ethashcpp.ethash_light_compute_internal(
    this.light.cache, this.light.cache_size, fullSize, val, nonce)

  return {
    mix: ret.mix_hash,
    hash: ret.result
  }
}

Ethash.prototype.headerHash = ethashjs.prototype.headerHash

Ethash.prototype.cacheHash = function () {
  return ethUtil.sha3(this.light.cache)
}
