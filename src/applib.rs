use core::panic::PanicInfo;

#[global_allocator]
pub static ALLOC: wasm_allocator::Heap = wasm_allocator::Heap;

extern "C" {
    pub fn clock_ms() -> i32;
    pub fn log_print(ptr: *const u8, len: usize);
    pub fn _debug(ptr: *const u8, len: usize) -> i32;
    pub fn log_print_i32(num: i32);
}

pub mod xwu {
    #[link(wasm_import_module = "xwu")]
    extern "C" {
        #[link_name = "wu_obj_create"]
        pub fn obj_create(oid: i32, par: u64) -> u64;

        #[link_name = "wu_obj_destroy"]
        pub fn obj_destroy(oid: i32, obj: u64) -> u64;

        #[link_name = "wu_obj_get_attr"] // ErrorCode wu_obj_get_attr(void *obj, id_type_t type, void *res, ...);
        pub fn obj_get_attr(obj: u64, tid: i32, res: *mut u8, par: ...) -> i32;

        #[link_name = "wu_obj_set_attr"] // ErrorCode wu_obj_set_attr(void *obj, id_type_t type, void *res, ...);
        pub fn obj_set_attr(obj: u64, tid: i32, res: *mut u8, par: ...) -> i32;
    }
}


pub mod log {
    #[macro_export]
    macro_rules! print {
        ($arg:tt) => {{
            unsafe { _debug($arg.as_ptr(), $arg.len()) }
        }};
        ($($arg:tt)+) => {{
            let s = format!($($arg)+);
            unsafe { _debug(s.as_ptr(), s.len()) }
        }}
    }

    #[macro_export]
    macro_rules! println {
        ($($arg:tt)*) => {{
            print!($($arg)*);
            unsafe { _debug("\n".as_ptr(), 1) }
        }}
    }

    #[macro_export]
    macro_rules! log {
        ($arg:tt) => {{
            unsafe { log_print($arg.as_ptr(), $arg.len()) }
        }};
        ($($arg:tt)+) => {{
            let s = format!($($arg)+);
            unsafe { log_print(s.as_ptr(), s.len()) }
        }}
    }
}


#[panic_handler]
#[no_mangle]
pub fn panic(_info: &PanicInfo) -> ! {
    ::core::intrinsics::abort();
}

#[alloc_error_handler]
#[no_mangle]
pub fn oom(_: core::alloc::Layout) -> ! {
    // let s = "ALLOCATE FAILED";
    // _debug(s.as_ptr(), s.len() as i32);
    ::core::intrinsics::abort();
}
