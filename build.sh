source ~/.zshrc

target_path=target/wasm32-wasi/release
target_name=app.wasm
target=${target_path}/$target_name
cp_target_path=/Users/w-mai/Documents/Projects/X-TRACK-EVO/Firmware/X-TRACK-EVO/Vendor/Simulator/cmake-build-debug/bin

cargo build --release --target wasm32-wasi
wasm-opt $target -Os --vacuum -o ${target}.opt
cp ${target}.opt ${target}.opt.old
wasm-strip ${target}.opt

l $target_path | grep ".*wasm"

#wasm3 --func fuck ${target}.opt

cp ${target}.opt ${cp_target_path}/test.wasm

pushd ${cp_target_path} || exit

./Simulator

popd || exit
