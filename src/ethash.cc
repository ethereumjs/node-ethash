#include <stdint.h>
#include <node.h>
#include <nan.h>

#include "util.h"
#include "libethash/ethash.h"

// ethash_light_compute(block_number, header_hash, nonce)
// ethash_h256_t is 32 bytes
NAN_METHOD(ethash_light_compute) {
	Nan::HandleScope scope;

	// get block number argument
	v8::Local<v8::Object> block_number = info[0].As<v8::Object>();
	CHECK_TYPE_NUMBER(block_number, "argument must be a number");
	// node -> C
	const uint64_t bn = block_number->IntegerValue();
	// get header hash
	v8::Local<v8::Object> header_hash = info[1].As<v8::Object>();
	CHECK_TYPE_BUFFER(header_hash, "argument must be a buffer");
	CHECK_BUFFER_LENGTH(header_hash, 64, "argument must be 64 bytes long");
	std::string hdrhash = (std::string) node::Buffer::Data(header_hash);

	// get new ethash_light handler
	ethash_light_t ethlight = ethash_light_new(bn);
	if (ethlight == NULL) {
		return Nan::ThrowError("not enough memory");
	}


}
