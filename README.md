# App Rust Template

To build this project:

- change `cp_target_path` in `build.sh` file first.

```shell
export SIM_PATH=path/to/Simulator/build; ./build.py
```

or if this project is in `App/wApps/some_app`

```shell
./build.py
```

### Note

Nightly Rust needed:

```shell
rustup override set nightly 
```

And require `wabt` `binaryen` tools

#### For macOS

```shell
brew install wabt binaryen
```
