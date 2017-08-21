#ifndef _ETHASH_NODE_
#define _ETHASH_NODE_

#include <node.h>
#include <nan.h>

NAN_METHOD(ethash_light_new);
NAN_METHOD(ethash_light_compute);
NAN_METHOD(ethash_light_new_internal);
NAN_METHOD(ethash_light_compute_internal);

#endif
