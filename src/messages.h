#ifndef _ETHASH_NODE_MESSAGES_
# define _ETHASH_NODE_MESSAGES_

#define BLOCKNUM_TYPE_INVALID "block_number should be a number"

#define HEADERASH_TYPE_INVALID "header_hash should be a String"
#define HEADERASH_LENGTH_INVALID 	"header_hash must be between [1, 66] bytes long"

#define NONCE_TYPE_INVALID "nonce should be a number"

#define LIGHTNEW_NOMEM "not enough memory for ethash_light_new()"
#define LIGHTNEW_ERROR "error processing ethash_light_compute()"

#endif
