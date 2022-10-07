#!/usr/bin/env bash

target_path=target/wasm32-wasi/release
target_name=app.wasm
target=${target_path}/$target_name

# Simulator Compiled binary path
cp_target_path="path/to/bin"

cargo build --release --target wasm32-wasi
wasm-opt $target -Os --vacuum -o ${target}.opt
cp ${target}.opt ${target}.opt.old
wasm-strip ${target}.opt

ls -alh ${target_path}/*.wasm*

cp ${target}.opt ${cp_target_path}/test.wasm

pushd ${cp_target_path} || exit

./Simulator

popd || exit
