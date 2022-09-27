#![no_std]
#![no_main]
#![feature(alloc_error_handler)]

extern crate alloc;

use alloc::borrow::ToOwned;
use alloc::ffi::CString;
use alloc::string::String;
use core::alloc::GlobalAlloc;
use core::ffi::{c_char, CStr};
use core::panic::PanicInfo;

extern "C" {
    fn clock_ms() -> i32;
    fn _debug(ptr: *const c_char, len: i32) -> i32;
    fn log_print_i32(num: i32);
}


#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

#[alloc_error_handler]
unsafe fn foo(_: core::alloc::Layout) -> ! {
    let s = "ALLOCATE FAILED";
    // _debug(s.as_ptr(), s.len() as i32);
    loop {}
}

use buddy_system_allocator::*;

#[global_allocator]
static HEAP_ALLOCATOR: LockedHeap<1024> = LockedHeap::<1024>::empty();

#[no_mangle]
unsafe fn fuck() -> i32 {
    let a: i32 = 4321;
    log_print_i32(a);
    log_print_i32(777);

    let mut s = "remembrance";
    // let s2 = "kuc";

    // let s = s.to_owned() + &s2;
    let mut hello = String::from("Hello World!");
    let c_str_to_print = CString::new(hello).unwrap();

    log_print_i32("114514".parse().expect("nothing"));

    _debug(c_str_to_print.as_ptr(), 14);
    666
}

#[no_mangle]
fn init(_addr: usize) {
    unsafe {
        HEAP_ALLOCATOR.lock().init(0, 100);
    }
}
