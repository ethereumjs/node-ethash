#include <stdint.h>
#include <endian.h>
#include <node.h>
#include <nan.h>

#include "util.h"
#include "messages.h"
#include "libethash/ethash.h"
// hack to avoid conflict with node namespace
#define node node_eth
#include "libethash/internal.h"
#undef node


// ethash_light_compute(block_number, header_hash, nonce)
// returns: { mix_hash: Buffer, result: Buffer }
NAN_METHOD(ethash_light_compute) {
	Nan::HandleScope scope;

	// get block number argument
	v8::Local<v8::Object> block_number_v8 = info[0].As<v8::Object>();
	CHECK_TYPE_NUMBER(block_number_v8, BLOCKNUM_TYPE_INVALID);
	// node -> C
	const uint64_t block_number = block_number_v8->IntegerValue();

	// get header hash
	v8::Local<v8::Object> header_hash_v8 = info[1].As<v8::Object>();
	CHECK_TYPE_BUFFER(header_hash_v8, HEADERHASH_TYPE_INVALID);
	CHECK_BUFFER_LENGTH(header_hash_v8, 32, HEADERHASH_LENGTH_INVALID);
	// node -> C
	ethash_h256_t *header_hash = (ethash_h256_t *) node::Buffer::Data(header_hash_v8);

	// get nonce argument
	v8::Local<v8::Object> nonce_v8 = info[2].As<v8::Object>();
	CHECK_TYPE_BUFFER(nonce_v8, NONCE_TYPE_INVALID);
	CHECK_BUFFER_LENGTH(nonce_v8, 8, NONCE_LENGTH_INVALID);
	// node -> C
	const uint64_t nonce = be64toh(*((uint64_t *) node::Buffer::Data(nonce_v8)));

	// get new ethash_light handler
	ethash_light_t ethlight = ethash_light_new(block_number);
	if (ethlight == NULL) {
		return Nan::ThrowError(LIGHTNEW_NOMEM);
	}
	// calculate light client data
	ethash_return_value_t ret = ethash_light_compute(ethlight, *header_hash, nonce);
	if (!ret.success) {
		return Nan::ThrowError(LIGHTNEW_ERROR);
	}

	// free ethash_light handler
	ethash_light_delete(ethlight);
	// C -> node
	v8::Local<v8::Object> obj = Nan::New<v8::Object>();
	obj->Set(Nan::New<v8::String>("mix_hash").ToLocalChecked(),
		COPY_BUFFER((const char *)&ret.mix_hash, sizeof(ethash_h256_t)));
	obj->Set(Nan::New<v8::String>("result").ToLocalChecked(),
		COPY_BUFFER((const char *)&ret.result, sizeof(ethash_h256_t)));
	info.GetReturnValue().Set(obj);
}

// ethash_light_new_internal(cache_size, seed)
// returns: { cache: Buffer, cache_size: int }
NAN_METHOD(ethash_light_new_internal) {
	Nan::HandleScope scope;

	// get cache size
	v8::Local<v8::Object> cache_size_v8 = info[0].As<v8::Object>();
	CHECK_TYPE_NUMBER(cache_size_v8, CACHESIZE_TYPE_INVALID);
	// node -> C
	const uint64_t cache_size = cache_size_v8->IntegerValue();

	// get seed
	v8::Local<v8::Object> seed_v8 = info[1].As<v8::Object>();
	CHECK_TYPE_BUFFER(seed_v8, SEED_TYPE_INVALID);
	CHECK_BUFFER_LENGTH(seed_v8, 32, SEED_LENGTH_INVALID);
	// node -> C
	ethash_h256_t *seed = (ethash_h256_t *) node::Buffer::Data(seed_v8);

	// get new cache
	ethash_light_t light = ethash_light_new_internal(cache_size, seed);

	// C -> node
	v8::Local<v8::Object> obj = Nan::New<v8::Object>();
	obj->Set(Nan::New<v8::String>("cache").ToLocalChecked(),
		COPY_BUFFER((const char *)light->cache, cache_size));
	obj->Set(Nan::New<v8::String>("cache_size").ToLocalChecked(),
		Nan::New<v8::Number>(cache_size));
	info.GetReturnValue().Set(obj);

	// free ethash_light handler
	ethash_light_delete(light);
}

// ethash_light_compute_internal(cache, cache_size, fullSize, val, nonce)
// returns: { mix_hash: Buffer, result: Buffer }
NAN_METHOD(ethash_light_compute_internal) {
	// TODO: Implement this!
	Nan::HandleScope scope;
}

NAN_MODULE_INIT(Init) {
  Nan::Export(target, "ethash_light_compute", ethash_light_compute);
	Nan::Export(target, "ethash_light_new_internal", ethash_light_new_internal);
	Nan::Export(target, "ethash_light_compute_internal", ethash_light_compute_internal);
}

NODE_MODULE(ethash, Init);
