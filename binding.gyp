{
  "targets": [{
    "target_name": "ethash",
    "sources": [
      "./src/ethash.cc",
      "./src/ethash-src/src/libethash/io.c",
      "./src/ethash-src/src/libethash/internal.c",
      "./src/ethash-src/src/libethash/sha3.c"
    ],
    "cflags_c": [
      "-std=gnu99",
      "-Wall",
      "-Wno-maybe-uninitialized",
      "-Wno-uninitialized",
      "-Wno-unused-function",
      "-Wextra"
    ],
    "cflags_cc+": [
      "-fexceptions",
      "-std=c++11"
    ],
    "cflags_cc!": [
      "-fno-exceptions"
    ],
    "include_dirs": [
      "./src/ethash-src/src",
      "<!(node -e \"require('nan')\")"
    ]
  }]
}
