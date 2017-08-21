#ifndef _ETHASH_NODE_MESSAGES_
#define _ETHASH_NODE_MESSAGES_

#define BLOCKNUM_TYPE_INVALID "block_number should be a number"

#define HEADERHASH_TYPE_INVALID "header_hash should be a Buffer"
#define HEADERHASH_LENGTH_INVALID "header_hash should be 32 bytes long"

#define NONCE_TYPE_INVALID "nonce should be a Buffer"
#define NONCE_LENGTH_INVALID "nonce should be 8 bytes long"

#define CACHE_TYPE_INVALID "cache should be a Buffer"
#define CACHESIZE_TYPE_INVALID "cache_size should be a Number"

#define SEED_TYPE_INVALID "seed should be a Buffer"
#define SEED_LENGTH_INVALID "seed should be 32 bytes long"

#define FULLSIZE_TYPE_INVALID "full_size should be a number"

#define LIGHTNEW_NOMEM "not enough memory for ethash_light_new()"
#define LIGHTCOMPUTE_ERROR "error processing ethash_light_compute()"

#endif
