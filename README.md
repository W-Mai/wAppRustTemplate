# App Rust Template

To `build` and `run` this project in `Simulator`:

```shell
export SIM_PATH=path/to/Simulator/build; ./build.py
```

or if this project is in `App/wApps/some_app`

```shell
./build.py
```

### Note

#### 1. You need install rust-toolchain first

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### 2. Nightly Rust needed:

```shell
rustup override set nightly 
```

#### 3. and add `wasm32-wasi` target to toolchain

```shell
rustup target add wasm32-wasi
```

#### 4. And require `wabt` `binaryen` tools

##### For macOS

```shell
brew install wabt binaryen
```

##### For Linux

```shell
sudo apt install wabt binaryen
```

#### For Windows

Download the latest binaries from [wabt](https://github.com/WebAssembly/wabt/releases)
and [binaryen](https://github.com/WebAssembly/binaryen/releases)
