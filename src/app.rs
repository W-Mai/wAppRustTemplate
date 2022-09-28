#![no_std]
#![no_main]
#![feature(alloc_error_handler, core_intrinsics)]

mod applib;

extern crate alloc;

use alloc::{format, vec};
use alloc::boxed::Box;
use alloc::string::String;

use crate::applib::*;

static mut GNUM: i32 = 3;

#[no_mangle]
unsafe fn test() -> i32 {
    let a: i32 = 4321;
    println!("{}", a);
    println!("{}", 777);

    let vec = vec!["I\0", "am\0", "your\0", "father\0"];
    for s in vec {
        log!(s);
    }

    let nums = format!("{} {} {}", 1, 2, 3);
    println!(nums);

    log_print_i32("114514".parse().expect("nothing"));
    log_print_i32(GNUM.clone());
    GNUM += 1;

    clock_ms()
}

#[no_mangle]
unsafe fn xalloc(len: usize) -> *mut usize {
    Box::into_raw(Box::new(len))
}

#[no_mangle]
unsafe fn init(_addr: *mut usize, len: usize) {
    let s = format!("pass from host : {}", _addr as u64);
    println!(s);
    println!("converted: {}", s.as_ptr() as u64);

    let s = String::from_raw_parts(_addr as *mut u8, len, 0);
    log!(s);
}
