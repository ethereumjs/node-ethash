#include <stdint.h>
#include <node.h>
#include <nan.h>

#include "util.h"
#include "messages.h"
#include "libethash/ethash.h"

// ethash_light_compute(block_number, header_hash, nonce)
NAN_METHOD(ethash_light_compute) {
	Nan::HandleScope scope;

	// get block number argument
	v8::Local<v8::Object> block_number_v8 = info[0].As<v8::Object>();
	CHECK_TYPE_NUMBER(block_number_v8, BLOCKNUM_TYPE_INVALID);
	// node -> C
	const uint64_t block_number = block_number_v8->IntegerValue();

	// get header hash
	v8::Local<v8::Object> header_hash_v8 = info[1].As<v8::Object>();
	CHECK_TYPE_BUFFER(header_hash_v8, HEADERASH_TYPE_INVALID);
	CHECK_BUFFER_LENGTH_IN_INTERVAL(header_hash_v8, 1, 66, HEADERASH_LENGTH_INVALID);
	// node -> C
	ethash_h256_t *header_hash = (ethash_h256_t *) node::Buffer::Data(header_hash_v8);

	// get nonce argument
	v8::Local<v8::Object> nonce_v8 = info[2].As<v8::Object>();
	CHECK_TYPE_NUMBER(nonce_v8, NONCE_TYPE_INVALID);
	// node -> C
	const uint64_t nonce = nonce_v8->IntegerValue();

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
	// convert result bytes to strings
	std::string mixhashstr = blockhashToHexString(&ret.mix_hash);
	std::string resultstr = blockhashToHexString(&ret.result);

	// free ethash_light handler
	ethash_light_delete(ethlight);
	// C -> node
	v8::Local<v8::Object> obj = Nan::New<v8::Object>();
	obj->Set(Nan::New<v8::String>("mix_hash").ToLocalChecked(),
		COPY_BUFFER(mixhashstr.data(), mixhashstr.size()));
    obj->Set(Nan::New<v8::String>("result").ToLocalChecked(),
		COPY_BUFFER(resultstr.data(), mixhashstr.size()));
	info.GetReturnValue().Set(obj);
}

NAN_MODULE_INIT(Init) {
  Nan::Export(target, "ethash_light_compute", ethash_light_compute);
}

NODE_MODULE(ethash, Init);
