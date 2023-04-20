use core::panic::PanicInfo;

#[global_allocator]
pub static ALLOC: wasm_allocator::Heap = wasm_allocator::Heap;

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
