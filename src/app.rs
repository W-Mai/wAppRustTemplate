#![no_std]
#![no_main]
#![feature(alloc_error_handler, core_intrinsics)]

extern crate alloc;

use alloc::{format, vec};
use alloc::boxed::Box;
use alloc::string::String;
use wasm_allocator::Heap;

mod utils;

use xwrapup_rs::*;
use xwrapup_rs::xwu::Obj;


// Global Num
static mut GNUM: i32 = 3;

#[macro_use]
mod tests {
    use crate::*;

    pub fn test_directly_println() {
        let a: i32 = 4321;
        println!("{}", a);
        println!("{}", 777);
    }

    pub fn test_vec_log() {
        let vec = vec!["Welcome\0", "to\0", "the\0", "X-TRACK\0", "plug-in\0", "system\0"];
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
        obj1.set_width(100);
        obj1.set_height(50);
        obj2.set_width(200);
        obj2.set_height(200);
        obj2.set_scroll_left(50);
        let coords = obj2.get_ori_coords();

        println!("Width: {}", obj1.get_width());
        println!("Coords: {:?}", obj1.get_scroll_right());
        println!("Coords: {:?}", coords);
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

    Heap::get_heap_top() as i32
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
