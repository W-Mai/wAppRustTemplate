#![no_std]
#![no_main]
#![feature(alloc_error_handler, core_intrinsics)]

extern crate alloc;

use alloc::{format, vec};
use alloc::boxed::Box;
use alloc::string::String;
use core::panic::PanicInfo;


extern "C" {
    fn clock_ms() -> i32;
    fn log_print(ptr: *const u8, len: usize);
    fn log_print_i32(num: i32);
}

mod log {
    #[macro_export]
    macro_rules! print {
        ($arg:tt) => {{
            log_print($arg.as_ptr(), $arg.len())
        }};
        ($($arg:tt)+) => {{
            let s = format!($($arg)+);
            log_print(s.as_ptr(), s.len())
        }}
    }
}


#[panic_handler]
#[no_mangle]
fn panic(_info: &PanicInfo) -> ! {
    ::core::intrinsics::abort();
}

#[alloc_error_handler]
#[no_mangle]
fn oom(_: core::alloc::Layout) -> ! {
    // let s = "ALLOCATE FAILED";
    // _debug(s.as_ptr(), s.len() as i32);
    ::core::intrinsics::abort();
}


// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static mut GNUM: i32 = 3;

#[no_mangle]
unsafe fn test() -> i32 {
    let a: i32 = 4321;
    log_print_i32(a);
    log_print_i32(777);

    let vec = vec!["I", "am", "your", "father"];

    let nums = format!("{} {} {}", 1, 2, 3);
    log_print_i32("114514".parse().expect("nothing"));
    for s in vec {
        print!(s);
    }

    print!(nums);

    log_print_i32(GNUM);
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
    print!(s);
    print!("converted: {}", s.as_ptr() as u64);

    let s = String::from_raw_parts(_addr as *mut u8, len, 0);
    print!(s);
}
