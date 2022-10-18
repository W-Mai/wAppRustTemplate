#!/usr/bin/python3
import functools
import os
import shutil
import subprocess
import pathlib

PROMPT = "--> "
run = functools.partial(subprocess.run, encoding='utf-8')
log = functools.partial(print, PROMPT)
opj = os.path.join

target_path = "target/wasm32-wasi/release"
target_name = "app.wasm"
target = opj(target_path, target_name)
sim_path = os.environ.get("SIM_PATH", "../../../Vendor/Simulator/build")


def build_and_optimize():
    log("Start Build")
    if run(["cargo", "build", "--release", "--target", "wasm32-wasi"]).returncode:
        log("😭😭😭", "Build Failed")
        exit()
    log("🙆", "End Build")
    log("⌚️", "Start Optimize && Strip")
    if run(["wasm-opt", target, "-Os", "-o", f"{target}.opt"]).returncode:
        log("😭😭😭", "Optimize Failed")
        exit()
    shutil.copy(f"{target}.opt", f"{target}.opt.old")
    if run(["wasm-strip", f"{target}.opt"]).returncode:
        log("😭😭😭", "Strip Failed")
        exit()

    log(f'{os.path.getsize(target):8d} Byte\t', target_name)
    log(f'{os.path.getsize(f"{target}.opt.old"):8d} Byte\t', f"{target_name}.opt.old")
    log(f'{os.path.getsize(f"{target}.opt"):8d} Byte\t', f"{target_name}.opt")
    log("🙆", "End Optimize && Strip")

    log("😄", 'Copy Binary to ./build/', target_name)
    pathlib.Path("./build").mkdir(exist_ok=True)
    shutil.copy(f"{target}.opt", opj("./build/", target_name))


def run_sim():
    sim_bin_path = opj(sim_path, "Simulator")
    if not pathlib.Path(sim_bin_path).exists():
        log("😭😢😿", "Start Simulator Failed")
        exit(114514)
    test_wasm_path = opj(sim_path, 'test.wasm')
    log("😁", 'Copy Binary to', f"`{test_wasm_path}`")
    shutil.copy(opj("./build/", target_name), test_wasm_path)
    log("⌚️", "Run Simulator Start")
    run(sim_bin_path, cwd=sim_path)
    log("🙆", "Run Simulator End")


if __name__ == '__main__':
    build_and_optimize()
    run_sim()
