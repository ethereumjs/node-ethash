# node-ethash

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Native node bindings for [Ethash cpp implementation](https://github.com/ethereum/ethash).
This library is experimental. **Use at your own risk**.
Currently working on **Linux only**. Tested on node v5.10.1.

For details on this project, please see the Ethereum wiki (https://github.com/ethereum/wiki/wiki/Ethash)
and ethereumjs/ethashjs (https://github.com/ethereumjs/ethashjs).

## Installation

```
$ git clone https://github.com/bolaum/node-ethash
$ cd node-ethash/
$ git submodule init
$ git submodule update
$ npm install
```

## API

- [`new Ethash()`](#newethash)
- [`ethash.mkcache(cacheSize, seed)`](#ethashmkcachecachesize-seed)
- [`ethash.run(val, nonce, fullsize)`](#ethashrunval-nonce-fullsize)

### `new Ethash()`
Creates a new instance of `Ethash`. No support for cacheDB yet!

### `ethash.mkcache(cacheSize, seed)`
Creates a cache.

**Parameters**
- `cacheSize` - the size of the cache
- `seed` - the seed as a `Buffer`

### `ethash.run(val, nonce, fullsize)`
Runs ethash on a give val/nonce pair.

NOTE: you need to run [`ethash.mkcache(cacheSize, seed)`](#ethashmkcachecachesize-seed)
first before using this function.

**Parameters**
- `val` - header hash as `Buffer`
- `seed` - the seed as a `Buffer`
- `fullsize` - the fullsize of the cache.

**Return**
and `Object` containing
- `hash`  - the hash of the value
- `mix` - the mix result

## Test
`$ npm test`

## Performance (node-ethash vs ethashjs):
```
$ node benchmark/benchmark.js
Create 1 fixtures
++++++++++++++++++++++++++++++++++++++++++++++++++
Benchmarking: mkcache
--------------------------------------------------
bindings x 1.47 ops/sec ±2.31% (8 runs sampled)
ethashjs x 0.17 ops/sec ±13.59% (5 runs sampled)
==================================================
Benchmarking: run
--------------------------------------------------
bindings x 571 ops/sec ±3.52% (79 runs sampled)
ethashjs x 17.82 ops/sec ±1.58% (48 runs sampled)
==================================================
```

## TODO:
- Support `cacheDB`
- Implement `verifyPOW()`

## LICENSE

This library is free and open-source software released under the MIT license.
