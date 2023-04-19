#![no_std]
#![no_main]
#![feature(alloc_error_handler, core_intrinsics)]

extern crate alloc;

use alloc::{format, vec};
use alloc::boxed::Box;
use alloc::string::String;
use wasm_allocator::Heap;

mod applib;

use crate::applib::*;


// Global Num
static mut GNUM: i32 = 3;

#[macro_use]
mod tests {
    use crate::*;
    use crate::applib::xwu::Obj;

    pub fn test_directly_println() {
        let a: i32 = 4321;
        println!("{}", a);
        println!("{}", 777);
    }

    pub fn test_vec_log() {
        let vec = vec!["I\0", "am\0", "your\0", "father\0"];
        for s in vec {
            log!(s);
        }
    }

    pub fn test_format_then_println() {
        let nums = format!("{} {} {}", 1, 2, 3);
        println!(nums);
    }

    pub fn test_parse_str_to_num_println() {
        unsafe {
            log_print_i32("114514".parse().expect("nothing"));
        }
    }

    pub fn test_global_add() {
        unsafe {
            log_print_i32(GNUM.clone());
            GNUM += 1;
        }
    }

    pub fn test_gui_wrapper(par: u64) {
        let screen = Obj::from(par);

        let obj1 = Obj::new(&screen);
        let obj2 = Obj::new(&obj1);

        obj2.set_x(50);
        obj2.set_y(20);
        obj1.set_width(300);

        println!("Width: {}", obj1.get_width());
    }
}

#[no_mangle]
fn test(par: u64) -> i32 {
    tests::test_vec_log();
    tests::test_global_add();
    tests::test_directly_println();
    tests::test_format_then_println();
    tests::test_parse_str_to_num_println();
    tests::test_gui_wrapper(par);

    unsafe { Heap::getHeapTop() as i32 }
}


#[no_mangle]
fn xalloc(len: usize) -> *mut usize {
    Box::into_raw(Box::new(len))
}


#[no_mangle]
fn init(_addr: *mut u8, len: usize) {
    let s = format!("pass from host : {}", _addr as u64);
    println!(s);
    println!("converted: {}", s.as_ptr() as u64);


    let s = unsafe { String::from_raw_parts(_addr, len, 0) };
    log!(s);
}
