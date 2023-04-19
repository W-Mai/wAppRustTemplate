#!/usr/bin/python3
import functools
import os
import shutil
import subprocess
from pathlib import Path

PROMPT = "--> "
run = functools.partial(subprocess.run, encoding='utf-8')
log = functools.partial(print, PROMPT)

target_path = "target/wasm32-unknown-unknown/release"
target_name = "app.wasm"
target = Path(target_path, target_name)
local_build_path = Path("./build")

sim_name = "Simulator"
sim_path = Path(os.environ.get("SIM_PATH", "../../../Vendor/Simulator/build"))


def check_env():
    # Check RUST
    try:
        run(["cargo", "--version"], stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    except FileNotFoundError:
        log("😭😭😭", "You should install the latest version of RUST toolchain according to the following")
        log("🐧🐧🐧", "Linux:", "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh")
        log("🪟🪟🪟", "Windows:", "https://www.rust-lang.org/learn/get-started")
        exit()

    # Check Toolchain
    res = run(["rustup", "toolchain", "list"], stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    if res.returncode:
        log("😭😭😭", "I don't know why")
        exit()
    else:
        if not any(map(lambda x: "nightly" in x and "override" in x, res.stdout.split('\n'))):
            log("😭😂😢", "Please change toolchain to NIGHTLY")
            log("🦀🦀🦀", "exec:", "rustup override set nightly")
            exit()

    # Check Target
    res = run(["rustup", "target", "list"], stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    if res.returncode:
        log("😭😭😭", "I don't know why")
        exit()
    else:
        if "wasm32-wasi (installed)" not in res.stdout.split('\n'):
            log("😭😂😢", "Please install wasm32-wasi target")
            log("🦀🦀🦀", "exec:", "rustup target add wasm32-wasi")
            exit()


def build_and_optimize():
    default = ".wasm"
    w_optim = ".wasm.opt"
    w_strip = ".wasm.strip"

    log("⌚️", "Start Build")
    if run(["cargo", "build", "--release", "--target", "wasm32-unknown-unknown"]).returncode:
        log("😭😭😭", "Build Failed")
        exit()
    log("🙆", "End Build")
    log("⌚️", "Start Optimize && Strip")
    try:
        if run(["wasm-opt", target, "-Os", "-o", target.with_suffix(w_optim)]).returncode:
            log("😭😭😭", "Optimize Failed")
            exit()
        shutil.copy(target.with_suffix(w_optim), target.with_suffix(w_strip))
        if run(["wasm-strip", target.with_suffix(w_strip)]).returncode:
            log("😭😭😭", "Strip Failed")
            exit()
    except FileNotFoundError:
        log("😭😭😭", "Maybe you need install wabt and binaryen")
        log("👋🤌👀", "Please follow this README.md")
        exit()

    log(f'{target.with_suffix(default).stat().st_size:8d} Byte\t', target.with_suffix(default).name)
    log(f'{target.with_suffix(w_optim).stat().st_size:8d} Byte\t', target.with_suffix(w_optim).name)
    log(f'{target.with_suffix(w_strip).stat().st_size:8d} Byte\t', target.with_suffix(w_strip).name)
    log("🙆", "End Optimize && Strip")

    log("😄", 'Copy Binary to', f"`{local_build_path / target_name}`")
    local_build_path.mkdir(exist_ok=True)
    shutil.copy(target.with_suffix(w_strip), local_build_path / target_name)


def run_sim():
    sim_bin_path = sim_path / sim_name
    if not Path(sim_bin_path).exists():
        log("😭😢😿", "Start Simulator Failed")
        exit(114514)
    test_wasm_path = sim_path / target_name
    log("😁", 'Copy Binary to', f"`{test_wasm_path}`")
    shutil.copy(local_build_path / target_name, test_wasm_path)
    log("⌚️", "Run Simulator Start")
    run(sim_bin_path, cwd=sim_path)
    log("🙆", "Run Simulator End")


if __name__ == '__main__':
    check_env()
    build_and_optimize()
    run_sim()
