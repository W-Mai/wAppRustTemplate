import { fd_write } from 'wasi_snapshot_preview1';
import { args_get } from 'wasi_snapshot_preview1';
import { args_sizes_get } from 'wasi_snapshot_preview1';
import { environ_get } from 'wasi_snapshot_preview1';
import { environ_sizes_get } from 'wasi_snapshot_preview1';
import { proc_exit } from 'wasi_snapshot_preview1';
import { main } from 'env';

  var bufferView;
  var base64ReverseLookup = new Uint8Array(123/*'z'+1*/);
  for (var i = 25; i >= 0; --i) {
    base64ReverseLookup[48+i] = 52+i; // '0-9'
    base64ReverseLookup[65+i] = i; // 'A-Z'
    base64ReverseLookup[97+i] = 26+i; // 'a-z'
  }
  base64ReverseLookup[43] = 62; // '+'
  base64ReverseLookup[47] = 63; // '/'
  /** @noinline Inlining this function would mean expanding the base64 string 4x times in the source code, which Closure seems to be happy to do. */
  function base64DecodeToExistingUint8Array(uint8Array, offset, b64) {
    var b1, b2, i = 0, j = offset, bLength = b64.length, end = offset + (bLength*3>>2) - (b64[bLength-2] == '=') - (b64[bLength-1] == '=');
    for (; i < bLength; i += 4) {
      b1 = base64ReverseLookup[b64.charCodeAt(i+1)];
      b2 = base64ReverseLookup[b64.charCodeAt(i+2)];
      uint8Array[j++] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
      if (j < end) uint8Array[j++] = b1 << 4 | b2 >> 2;
      if (j < end) uint8Array[j++] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i+3)];
    }
  }
function initActiveSegments(imports) {
  base64DecodeToExistingUint8Array(bufferView, 1048576, "ZnVjayBtZTY2CgAAAAAQAAoAAAALAAAABAAAAAQAAAAMAAAADQAAAA4AAAALAAAABAAAAAQAAAAPAAAAEAAAABEAAAALAAAABAAAAAQAAAASAAAAEwAAABQAAAALAAAABAAAAAQAAAAVAAAAFgAAABcAAABhbHJlYWR5IGJvcnJvd2VkCwAAAAAAAAABAAAAGAAAAGFzc2VydGlvbiBmYWlsZWQ6IG1pZCA8PSBzZWxmLmxlbigpY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZQAACwAAAAAAAAABAAAAGQAAAGNhbGxlZCBgUmVzdWx0Ojp1bndyYXAoKWAgb24gYW4gYEVycmAgdmFsdWUACwAAAAgAAAAEAAAAGgAAABsAAAAIAAAABAAAABwAAAALAAAABAAAAAQAAAAdAAAACwAAAAQAAAAEAAAAHgAAAGludGVybmFsIGVycm9yOiBlbnRlcmVkIHVucmVhY2hhYmxlIGNvZGUvcnVzdGMvYTU1ZGQ3MWQ1ZmIwZWM1YTZhM2E5ZThjMjdiMjEyN2JhNDkxY2U1Mi9saWJyYXJ5L2FsbG9jL3NyYy92ZWMvbW9kLnJziAEQAEwAAABeBwAAJAAAAGZhdGFsIHJ1bnRpbWUgZXJyb3I6IAoAAOQBEAAVAAAA+QEQAAEAAAB1c2Ugb2Ygc3RkOjp0aHJlYWQ6OmN1cnJlbnQoKSBpcyBub3QgcG9zc2libGUgYWZ0ZXIgdGhlIHRocmVhZCdzIGxvY2FsIGRhdGEgaGFzIGJlZW4gZGVzdHJveWVkbGlicmFyeS9zdGQvc3JjL3RocmVhZC9tb2QucnMAagIQAB0AAACpAgAAIwAAAGZhaWxlZCB0byBnZW5lcmF0ZSB1bmlxdWUgdGhyZWFkIElEOiBiaXRzcGFjZSBleGhhdXN0ZWQAmAIQADcAAABqAhAAHQAAABcEAAARAAAAagIQAB0AAAAdBAAAKgAAAFJVU1RfQkFDS1RSQUNFAAB0ABAAAAAAADogAGZhaWxlZCB0byB3cml0ZSB0aGUgYnVmZmVyZWQgZGF0YRMDEAAhAAAAFwAAAGxpYnJhcnkvc3RkL3NyYy9pby9idWZmZXJlZC9idWZ3cml0ZXIucnNAAxAAKAAAAI0AAAASAAAAbGlicmFyeS9zdGQvc3JjL2lvL2J1ZmZlcmVkL2xpbmV3cml0ZXJzaGltLnJzAAAAeAMQAC0AAAABAQAAKQAAAHVuY2F0ZWdvcml6ZWQgZXJyb3JvdGhlciBlcnJvcm91dCBvZiBtZW1vcnl1bmV4cGVjdGVkIGVuZCBvZiBmaWxldW5zdXBwb3J0ZWRvcGVyYXRpb24gaW50ZXJydXB0ZWRhcmd1bWVudCBsaXN0IHRvbyBsb25naW52YWxpZCBmaWxlbmFtZXRvbyBtYW55IGxpbmtzY3Jvc3MtZGV2aWNlIGxpbmsgb3IgcmVuYW1lZGVhZGxvY2tleGVjdXRhYmxlIGZpbGUgYnVzeXJlc291cmNlIGJ1c3lmaWxlIHRvbyBsYXJnZWZpbGVzeXN0ZW0gcXVvdGEgZXhjZWVkZWRzZWVrIG9uIHVuc2Vla2FibGUgZmlsZW5vIHN0b3JhZ2Ugc3BhY2V3cml0ZSB6ZXJvdGltZWQgb3V0aW52YWxpZCBkYXRhaW52YWxpZCBpbnB1dCBwYXJhbWV0ZXJzdGFsZSBuZXR3b3JrIGZpbGUgaGFuZGxlZmlsZXN5c3RlbSBsb29wIG9yIGluZGlyZWN0aW9uIGxpbWl0IChlLmcuIHN5bWxpbmsgbG9vcClyZWFkLW9ubHkgZmlsZXN5c3RlbSBvciBzdG9yYWdlIG1lZGl1bWRpcmVjdG9yeSBub3QgZW1wdHlpcyBhIGRpcmVjdG9yeW5vdCBhIGRpcmVjdG9yeW9wZXJhdGlvbiB3b3VsZCBibG9ja2VudGl0eSBhbHJlYWR5IGV4aXN0c2Jyb2tlbiBwaXBlbmV0d29yayBkb3duYWRkcmVzcyBub3QgYXZhaWxhYmxlYWRkcmVzcyBpbiB1c2Vub3QgY29ubmVjdGVkY29ubmVjdGlvbiBhYm9ydGVkbmV0d29yayB1bnJlYWNoYWJsZWhvc3QgdW5yZWFjaGFibGVjb25uZWN0aW9uIHJlc2V0Y29ubmVjdGlvbiByZWZ1c2VkcGVybWlzc2lvbiBkZW5pZWRlbnRpdHkgbm90IGZvdW5kIChvcyBlcnJvciApAAAAdAAQAAAAAAClBhAACwAAALAGEAABAAAAZmFpbGVkIHRvIHdyaXRlIHdob2xlIGJ1ZmZlcswGEAAcAAAAFwAAAGxpYnJhcnkvc3RkL3NyYy9pby9zdGRpby5ycwD0BhAAGwAAANsCAAAUAAAAZmFpbGVkIHByaW50aW5nIHRvIAAgBxAAEwAAABADEAACAAAA9AYQABsAAAD3AwAACQAAAHN0ZG91dGxpYnJhcnkvc3RkL3NyYy9pby9tb2QucnMAWgcQABkAAAAaBQAAFgAAAGFkdmFuY2luZyBpbyBzbGljZXMgYmV5b25kIHRoZWlyIGxlbmd0aACEBxAAJwAAAFoHEAAZAAAAHAUAAA0AAABaBxAAGQAAAAMGAAAhAAAAZm9ybWF0dGVyIGVycm9yANQHEAAPAAAAKAAAAB8AAAAMAAAABAAAACAAAAAhAAAAIgAAAB8AAAAMAAAABAAAACMAAAAkAAAAJQAAAB8AAAAMAAAABAAAACYAAAAnAAAAKAAAAGxpYnJhcnkvc3RkL3NyYy9wYW5pYy5yczgIEAAYAAAA8AAAABIAAABsaWJyYXJ5L3N0ZC9zcmMvc3luYy9vbmNlLnJzYAgQABwAAABOAQAADgAAAAsAAAAEAAAABAAAACkAAAAqAAAAYAgQABwAAABOAQAAMQAAAGFzc2VydGlvbiBmYWlsZWQ6IHN0YXRlX2FuZF9xdWV1ZS5hZGRyKCkgJiBTVEFURV9NQVNLID09IFJVTk5JTkdPbmNlIGluc3RhbmNlIGhhcyBwcmV2aW91c2x5IGJlZW4gcG9pc29uZWQAAPAIEAAqAAAAAgAAAGAIEAAcAAAA/wEAAAkAAABgCBAAHAAAAAwCAAA1AAAAUG9pc29uRXJyb3JzdGFjayBiYWNrdHJhY2U6ClMJEAARAAAAbm90ZTogU29tZSBkZXRhaWxzIGFyZSBvbWl0dGVkLCBydW4gd2l0aCBgUlVTVF9CQUNLVFJBQ0U9ZnVsbGAgZm9yIGEgdmVyYm9zZSBiYWNrdHJhY2UuCmwJEABYAAAAbG9jayBjb3VudCBvdmVyZmxvdyBpbiByZWVudHJhbnQgbXV0ZXhsaWJyYXJ5L3N0ZC9zcmMvc3lzX2NvbW1vbi9yZW11dGV4LnJzAPIJEAAlAAAApwAAAA4AAABsaWJyYXJ5L3N0ZC9zcmMvc3lzX2NvbW1vbi90aHJlYWRfaW5mby5ycwAAACgKEAApAAAAFgAAADMAAABtZW1vcnkgYWxsb2NhdGlvbiBvZiAgYnl0ZXMgZmFpbGVkCgBkChAAFQAAAHkKEAAOAAAAbGlicmFyeS9zdGQvc3JjL2FsbG9jLnJzmAoQABgAAABSAQAACQAAAGxpYnJhcnkvc3RkL3NyYy9wYW5pY2tpbmcucnPAChAAHAAAABEBAAAkAAAAQm94PGR5biBBbnk+PHVubmFtZWQ+AAAACwAAAAAAAAABAAAAKwAAACwAAAAtAAAALgAAAC8AAAAwAAAAMQAAADIAAAAMAAAABAAAADMAAAA0AAAANQAAADYAAAA3AAAAOAAAADkAAAB0aHJlYWQgJycgcGFuaWNrZWQgYXQgJycsIAAAVAsQAAgAAABcCxAADwAAAGsLEAADAAAA+QEQAAEAAABub3RlOiBydW4gd2l0aCBgUlVTVF9CQUNLVFJBQ0U9MWAgZW52aXJvbm1lbnQgdmFyaWFibGUgdG8gZGlzcGxheSBhIGJhY2t0cmFjZQoAAJALEABOAAAAwAoQABwAAABGAgAAHwAAAMAKEAAcAAAARwIAAB4AAAAyAAAADAAAAAQAAAA6AAAACwAAAAgAAAAEAAAAOwAAADwAAAAQAAAABAAAAD0AAAA+AAAACwAAAAgAAAAEAAAAPwAAAEAAAAB0aHJlYWQgcGFuaWNrZWQgd2hpbGUgcHJvY2Vzc2luZyBwYW5pYy4gYWJvcnRpbmcuCgAAUAwQADIAAAAKcGFuaWNrZWQgYWZ0ZXIgcGFuaWM6OmFsd2F5c19hYm9ydCgpLCBhYm9ydGluZy4KAAAAdAAQAAAAAACMDBAAMQAAAHRocmVhZCBwYW5pY2tlZCB3aGlsZSBwYW5pY2tpbmcuIGFib3J0aW5nLgoA0AwQACsAAABmYWlsZWQgdG8gaW5pdGlhdGUgcGFuaWMsIGVycm9yIAQNEAAgAAAAYWR2YW5jaW5nIElvU2xpY2UgYmV5b25kIGl0cyBsZW5ndGgALA0QACMAAABsaWJyYXJ5L3N0ZC9zcmMvc3lzL3dhc2kvaW8ucnMAAFgNEAAeAAAAFgAAAA0AAABjb25kdmFyIHdhaXQgbm90IHN1cHBvcnRlZAAAiA0QABoAAABsaWJyYXJ5L3N0ZC9zcmMvc3lzL3dhc2kvLi4vdW5zdXBwb3J0ZWQvbG9ja3MvY29uZHZhci5yc6wNEAA4AAAAFQAAAAkAAABjYW5ub3QgcmVjdXJzaXZlbHkgYWNxdWlyZSBtdXRlePQNEAAgAAAAbGlicmFyeS9zdGQvc3JjL3N5cy93YXNpLy4uL3Vuc3VwcG9ydGVkL2xvY2tzL211dGV4LnJzAAAcDhAANgAAABgAAAAJAAAAcndsb2NrIGxvY2tlZCBmb3Igd3JpdGluZwAAAGQOEAAZAAAAc3RyZXJyb3JfciBmYWlsdXJlAACIDhAAEgAAAGxpYnJhcnkvc3RkL3NyYy9zeXMvd2FzaS9vcy5ycwAApA4QAB4AAAAvAAAADQAAAKQOEAAeAAAAMQAAADYAAAAIAA4ADwA/AAIAQAA1AA0ABAADACwAGwAcAEkAFAAGADQAMABsaWJyYXJ5L3N0ZC9zcmMvc3lzX2NvbW1vbi90aHJlYWRfcGFya2VyL2dlbmVyaWMucnMACA8QADMAAAAnAAAAJgAAAGluY29uc2lzdGVudCBwYXJrIHN0YXRlAEwPEAAXAAAACA8QADMAAAA1AAAAFwAAAHBhcmsgc3RhdGUgY2hhbmdlZCB1bmV4cGVjdGVkbHkAfA8QAB8AAAAIDxAAMwAAADIAAAARAAAAaW5jb25zaXN0ZW50IHN0YXRlIGluIHVucGFya7QPEAAcAAAACA8QADMAAABsAAAAEgAAAAgPEAAzAAAAegAAAB8AAAAOAAAAEAAAABYAAAAVAAAACwAAABYAAAANAAAACwAAABMAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAARAAAAEgAAABAAAAAQAAAAEwAAABIAAAANAAAADgAAABUAAAAMAAAACwAAABUAAAAVAAAADwAAAA4AAAATAAAAJgAAADgAAAAZAAAAFwAAAAwAAAAJAAAACgAAABAAAAAXAAAAGQAAAA4AAAANAAAAFAAAAAgAAAAbAAAAPwQQAC8EEAAZBBAABAQQAPkDEADjAxAA1gMQAMsDEAC4AxAAlQYQAJUGEACVBhAAlQYQAJUGEACVBhAAlQYQAJUGEACVBhAAlQYQAJUGEACVBhAAlQYQAJUGEACVBhAAlQYQAJUGEACVBhAAlQYQAJUGEACVBhAAlQYQAJUGEACVBhAAhAYQAHIGEABiBhAAUgYQAD8GEAAtBhAAIAYQABIGEAD9BRAA8QUQAOYFEADRBRAAvAUQAK0FEACfBRAAjAUQAGYFEAAuBRAAFQUQAP4EEADyBBAA6QQQAN8EEADPBBAAuAQQAJ8EEACRBBAAhAQQAHAEEABoBBAATQQQAC8AU3VjY2VzcwBJbGxlZ2FsIGJ5dGUgc2VxdWVuY2UARG9tYWluIGVycm9yAFJlc3VsdCBub3QgcmVwcmVzZW50YWJsZQBOb3QgYSB0dHkAUGVybWlzc2lvbiBkZW5pZWQAT3BlcmF0aW9uIG5vdCBwZXJtaXR0ZWQATm8gc3VjaCBmaWxlIG9yIGRpcmVjdG9yeQBObyBzdWNoIHByb2Nlc3MARmlsZSBleGlzdHMAVmFsdWUgdG9vIGxhcmdlIGZvciBkYXRhIHR5cGUATm8gc3BhY2UgbGVmdCBvbiBkZXZpY2UAT3V0IG9mIG1lbW9yeQBSZXNvdXJjZSBidXN5AEludGVycnVwdGVkIHN5c3RlbSBjYWxsAFJlc291cmNlIHRlbXBvcmFyaWx5IHVuYXZhaWxhYmxlAEludmFsaWQgc2VlawBDcm9zcy1kZXZpY2UgbGluawBSZWFkLW9ubHkgZmlsZSBzeXN0ZW0ARGlyZWN0b3J5IG5vdCBlbXB0eQBDb25uZWN0aW9uIHJlc2V0IGJ5IHBlZXIAT3BlcmF0aW9uIHRpbWVkIG91dABDb25uZWN0aW9uIHJlZnVzZWQASG9zdCBpcyB1bnJlYWNoYWJsZQBBZGRyZXNzIGluIHVzZQBCcm9rZW4gcGlwZQBJL08gZXJyb3IATm8gc3VjaCBkZXZpY2Ugb3IgYWRkcmVzcwBObyBzdWNoIGRldmljZQBOb3QgYSBkaXJlY3RvcnkASXMgYSBkaXJlY3RvcnkAVGV4dCBmaWxlIGJ1c3kARXhlYyBmb3JtYXQgZXJyb3IASW52YWxpZCBhcmd1bWVudABBcmd1bWVudCBsaXN0IHRvbyBsb25nAFN5bWJvbGljIGxpbmsgbG9vcABGaWxlbmFtZSB0b28gbG9uZwBUb28gbWFueSBvcGVuIGZpbGVzIGluIHN5c3RlbQBObyBmaWxlIGRlc2NyaXB0b3JzIGF2YWlsYWJsZQBCYWQgZmlsZSBkZXNjcmlwdG9yAE5vIGNoaWxkIHByb2Nlc3MAQmFkIGFkZHJlc3MARmlsZSB0b28gbGFyZ2UAVG9vIG1hbnkgbGlua3MATm8gbG9ja3MgYXZhaWxhYmxlAFJlc291cmNlIGRlYWRsb2NrIHdvdWxkIG9jY3VyAFN0YXRlIG5vdCByZWNvdmVyYWJsZQBQcmV2aW91cyBvd25lciBkaWVkAE9wZXJhdGlvbiBjYW5jZWxlZABGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQATm8gbWVzc2FnZSBvZiBkZXNpcmVkIHR5cGUASWRlbnRpZmllciByZW1vdmVkAExpbmsgaGFzIGJlZW4gc2V2ZXJlZABQcm90b2NvbCBlcnJvcgBCYWQgbWVzc2FnZQBOb3QgYSBzb2NrZXQARGVzdGluYXRpb24gYWRkcmVzcyByZXF1aXJlZABNZXNzYWdlIHRvbyBsYXJnZQBQcm90b2NvbCB3cm9uZyB0eXBlIGZvciBzb2NrZXQAUHJvdG9jb2wgbm90IGF2YWlsYWJsZQBQcm90b2NvbCBub3Qgc3VwcG9ydGVkAE5vdCBzdXBwb3J0ZWQAQWRkcmVzcyBmYW1pbHkgbm90IHN1cHBvcnRlZCBieSBwcm90b2NvbABBZGRyZXNzIG5vdCBhdmFpbGFibGUATmV0d29yayBpcyBkb3duAE5ldHdvcmsgdW5yZWFjaGFibGUAQ29ubmVjdGlvbiByZXNldCBieSBuZXR3b3JrAENvbm5lY3Rpb24gYWJvcnRlZABObyBidWZmZXIgc3BhY2UgYXZhaWxhYmxlAFNvY2tldCBpcyBjb25uZWN0ZWQAU29ja2V0IG5vdCBjb25uZWN0ZWQAT3BlcmF0aW9uIGFscmVhZHkgaW4gcHJvZ3Jlc3MAT3BlcmF0aW9uIGluIHByb2dyZXNzAFN0YWxlIGZpbGUgaGFuZGxlAFF1b3RhIGV4Y2VlZGVkAE11bHRpaG9wIGF0dGVtcHRlZABDYXBhYmlsaXRpZXMgaW5zdWZmaWNpZW50AAAAAAAAAAAAdQJOANYB4gS5BBgBjgXtAhYE8gCXAwEDOAWvAYIBTwMvBB4A1AWiABIDHgPCAd4DCACsBQABZALxAWUFNAKMAs8CLQNMBOMFnwL4BBwFCAWxAksFFQJ4AFICPAPxA+QAwwN9BMwAqgN5BSQCbgFtAyIEqwREAPsBrgCDA2AA5QEHBJQEXgQrAFgBOQGSAMIFmwFDAkYB9gUAAGNhbGxlZCBgT3B0aW9uOjp1bndyYXAoKWAgb24gYSBgTm9uZWAgdmFsdWVsaWJyYXJ5L2FsbG9jL3NyYy9yYXdfdmVjLnJzY2FwYWNpdHkgb3ZlcmZsb3fzGBAAEQAAANcYEAAcAAAABgIAAAUAAABsaWJyYXJ5L2FsbG9jL3NyYy9mZmkvY19zdHIucnMAABwZEAAeAAAAGwEAADcAAAApLi4ATRkQAAIAAABCb3Jyb3dNdXRFcnJvcmluZGV4IG91dCBvZiBib3VuZHM6IHRoZSBsZW4gaXMgIGJ1dCB0aGUgaW5kZXggaXMgZhkQACAAAACGGRAAEgAAAGNhbGxlZCBgT3B0aW9uOjp1bndyYXAoKWAgb24gYSBgTm9uZWAgdmFsdWU6TBkQAAAAAADTGRAAAQAAANMZEAABAAAASAAAAAAAAAABAAAASQAAAHBhbmlja2VkIGF0ICcnLCAIGhAAAQAAAAkaEAADAAAATBkQAAAAAABtYXRjaGVzIT09PWFzc2VydGlvbiBmYWlsZWQ6IGAobGVmdCAgcmlnaHQpYAogIGxlZnQ6IGBgLAogcmlnaHQ6IGBgOiAAAAAvGhAAGQAAAEgaEAASAAAAWhoQAAwAAABmGhAAAwAAAGAAAAAvGhAAGQAAAEgaEAASAAAAWhoQAAwAAACMGhAAAQAAADogAABMGRAAAAAAALAaEAACAAAASAAAAAwAAAAEAAAASgAAAEsAAABMAAAAICAgICB7CiwKLCAgeyAuLgp9LCAuLiB9IHsgLi4gfSB9KAooLAAAAEgAAAAEAAAABAAAAE0AAAAweDAwMDEwMjAzMDQwNTA2MDcwODA5MTAxMTEyMTMxNDE1MTYxNzE4MTkyMDIxMjIyMzI0MjUyNjI3MjgyOTMwMzEzMjMzMzQzNTM2MzczODM5NDA0MTQyNDM0NDQ1NDY0NzQ4NDk1MDUxNTI1MzU0NTU1NjU3NTg1OTYwNjE2MjYzNjQ2NTY2Njc2ODY5NzA3MTcyNzM3NDc1NzY3Nzc4Nzk4MDgxODI4Mzg0ODU4Njg3ODg4OTkwOTE5MjkzOTQ5NTk2OTc5ODk5AABIAAAABAAAAAQAAABOAAAATwAAAFAAAAB0cnVlZmFsc2VyYW5nZSBzdGFydCBpbmRleCAgb3V0IG9mIHJhbmdlIGZvciBzbGljZSBvZiBsZW5ndGggAAAAARwQABIAAAATHBAAIgAAAGxpYnJhcnkvY29yZS9zcmMvc2xpY2UvaW5kZXgucnMASBwQAB8AAAA0AAAABQAAAHJhbmdlIGVuZCBpbmRleCB4HBAAEAAAABMcEAAiAAAASBwQAB8AAABJAAAABQAAAHNsaWNlIGluZGV4IHN0YXJ0cyBhdCAgYnV0IGVuZHMgYXQgAKgcEAAWAAAAvhwQAA0AAABIHBAAHwAAAFwAAAAFAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDBAQEBAQAAAAAAAAAAAAAAGxpYnJhcnkvY29yZS9zcmMvc3RyL21vZC5yc1suLi5dYnl0ZSBpbmRleCAgaXMgb3V0IG9mIGJvdW5kcyBvZiBgAAAADB4QAAsAAAAXHhAAFgAAAIwaEAABAAAA7B0QABsAAABrAAAACQAAAGJlZ2luIDw9IGVuZCAoIDw9ICkgd2hlbiBzbGljaW5nIGAAAFgeEAAOAAAAZh4QAAQAAABqHhAAEAAAAIwaEAABAAAA7B0QABsAAABvAAAABQAAAOwdEAAbAAAAfQAAAC0AAAAgaXMgbm90IGEgY2hhciBib3VuZGFyeTsgaXQgaXMgaW5zaWRlICAoYnl0ZXMgKSBvZiBgDB4QAAsAAAC8HhAAJgAAAOIeEAAIAAAA6h4QAAYAAACMGhAAAQAAAOwdEAAbAAAAfwAAAAUAAABsaWJyYXJ5L2NvcmUvc3JjL3VuaWNvZGUvcHJpbnRhYmxlLnJzAAAAKB8QACUAAAAaAAAANgAAAAABAwUFBgYCBwYIBwkRChwLGQwaDRAODQ8EEAMSEhMJFgEXBBgBGQMaBxsBHAIfFiADKwMtCy4BMAMxAjIBpwKpAqoEqwj6AvsF/QL+A/8JrXh5i42iMFdYi4yQHN0OD0tM+/wuLz9cXV/ihI2OkZKpsbq7xcbJyt7k5f8ABBESKTE0Nzo7PUlKXYSOkqmxtLq7xsrOz+TlAAQNDhESKTE0OjtFRklKXmRlhJGbncnOzw0RKTo7RUlXW1xeX2RljZGptLq7xcnf5OXwDRFFSWRlgISyvL6/1dfw8YOFi6Smvr/Fx87P2ttImL3Nxs7PSU5PV1leX4mOj7G2t7/BxsfXERYXW1z29/7/gG1x3t8OH25vHB1ffX6ur3+7vBYXHh9GR05PWFpcXn5/tcXU1dzw8fVyc490dZYmLi+nr7e/x8/X35pAl5gwjx/S1M7/Tk9aWwcIDxAnL+7vbm83PT9CRZCRU2d1yMnQ0djZ5/7/ACBfIoLfBIJECBsEBhGBrA6AqwUfCYEbAxkIAQQvBDQEBwMBBwYHEQpQDxIHVQcDBBwKCQMIAwcDAgMDAwwEBQMLBgEOFQVOBxsHVwcCBhYNUARDAy0DAQQRBg8MOgQdJV8gbQRqJYDIBYKwAxoGgv0DWQcWCRgJFAwUDGoGCgYaBlkHKwVGCiwEDAQBAzELLAQaBgsDgKwGCgYvMU0DgKQIPAMPAzwHOAgrBYL/ERgILxEtAyEPIQ+AjASClxkLFYiUBS8FOwcCDhgJgL4idAyA1hoMBYD/BYDfDPKdAzcJgVwUgLgIgMsFChg7AwoGOAhGCAwGdAseA1oEWQmAgxgcChYJTASAigarpAwXBDGhBIHaJgcMBQWAphCB9QcBICoGTASAjQSAvgMbAw8NAAYBAQMBBAIFBwcCCAgJAgoFCwIOBBABEQISBRMRFAEVAhcCGQ0cBR0IJAFqBGsCrwO8As8C0QLUDNUJ1gLXAtoB4AXhAucE6ALuIPAE+AL6AvsBDCc7Pk5Pj56en3uLk5aisrqGsQYHCTY9Plbz0NEEFBg2N1ZXf6qur7014BKHiY6eBA0OERIpMTQ6RUZJSk5PZGVctrcbHAcICgsUFzY5Oqip2NkJN5CRqAcKOz5maY+Sb1+/7u9aYvT8/5qbLi8nKFWdoKGjpKeorbq8xAYLDBUdOj9FUaanzM2gBxkaIiU+P+fs7//FxgQgIyUmKDM4OkhKTFBTVVZYWlxeYGNlZmtzeH1/iqSqr7DA0K6vbm+TXiJ7BQMELQNmAwEvLoCCHQMxDxwEJAkeBSsFRAQOKoCqBiQEJAQoCDQLTkOBNwkWCggYO0U5A2MICTAWBSEDGwUBQDgESwUvBAoHCQdAICcEDAk2AzoFGgcEDAdQSTczDTMHLggKgSZSTigIKhYaJhwUFwlOBCQJRA0ZBwoGSAgnCXULP0EqBjsFCgZRBgEFEAMFgItiHkgICoCmXiJFCwoGDRM6Bgo2LAQXgLk8ZFMMSAkKRkUbSAhTDUmBB0YKHQNHSTcDDggKBjkHCoE2GYC3AQ8yDYObZnULgMSKTGMNhC+P0YJHobmCOQcqBFwGJgpGCigFE4KwW2VLBDkHEUAFCwIOl/gIhNYqCaLngTMtAxEECIGMiQRrBQ0DCQcQkmBHCXQ8gPYKcwhwFUaAmhQMVwkZgIeBRwOFQg8VhFAfgOErgNUtAxoEAoFAHxE6BQGE4ID3KUwECgQCgxFETD2AwjwGAQRVBRs0AoEOLARkDFYKgK44HQ0sBAkHAg4GgJqD2AUQAw0DdAxZBwwEAQ8MBDgICgYoCCJOgVQMFQMFAwcJHQMLBQYKCgYICAcJgMslCoQGbGlicmFyeS9jb3JlL3NyYy91bmljb2RlL3VuaWNvZGVfZGF0YS5ycwAAAMkkEAAoAAAASwAAACgAAADJJBAAKAAAAFcAAAAWAAAAySQQACgAAABSAAAAPgAAAFNvbWVOb25lSAAAAAQAAAAEAAAAUQAAAFV0ZjhFcnJvcnZhbGlkX3VwX3RvZXJyb3JfbGVuAAAASAAAAAQAAAAEAAAAUgAAAAADAACDBCAAkQVgAF0ToAASFyAfDCBgH+8soCsqMCAsb6bgLAKoYC0e+2AuAP4gNp7/YDb9AeE2AQohNyQN4TerDmE5LxihOTAc4UfzHiFM8GrhT09vIVCdvKFQAM9hUWXRoVEA2iFSAODhUzDhYVWu4qFW0OjhViAAblfwAf9XAHAABwAtAQEBAgECAQFICzAVEAFlBwIGAgIBBCMBHhtbCzoJCQEYBAEJAQMBBSsDPAgqGAEgNwEBAQQIBAEDBwoCHQE6AQEBAgQIAQkBCgIaAQICOQEEAgQCAgMDAR4CAwELAjkBBAUBAgQBFAIWBgEBOgEBAgEECAEHAwoCHgE7AQEBDAEJASgBAwE3AQEDBQMBBAcCCwIdAToBAgECAQMBBQIHAgsCHAI5AgEBAgQIAQkBCgIdAUgBBAECAwEBCAFRAQIHDAhiAQIJCwZKAhsBAQEBATcOAQUBAgULASQJAWYEAQYBAgICGQIEAxAEDQECAgYBDwEAAwADHQIeAh4CQAIBBwgBAgsJAS0DAQF1AiIBdgMEAgkBBgPbAgIBOgEBBwEBAQECCAYKAgEwHzEEMAcBAQUBKAkMAiAEAgIBAzgBAQIDAQEDOggCApgDAQ0BBwQBBgEDAsZAAAHDIQADjQFgIAAGaQIABAEKIAJQAgABAwEEARkCBQGXAhoSDQEmCBkLLgMwAQIEAgInAUMGAgICAgwBCAEvATMBAQMCAgUCAQEqAggB7gECAQQBAAEAEBAQAAIAAeIBlQUAAwECBQQoAwQBpQIABAACmQsxBHsBNg8pAQICCgMxBAICBwE9AyQFAQg+AQwCNAkKBAIBXwMCAQECBgGgAQMIFQI5AgEBAQEWAQ4HAwXDCAIDAQEXAVEBAgYBAQIBAQIBAusBAgQGAgECGwJVCAIBAQJqAQEBAgYBAWUDAgQBBQAJAQL1AQoCAQEEAZAEAgIEASAKKAYCBAgBCQYCAy4NAQIABwEGAQFSFgIHAQIBAnoGAwEBAgEHAQFIAgMBAQEAAgAFOwcAAT8EUQEAAgAuAhcAAQEDBAUICAIHHgSUAwA3BDIIAQ4BFgUBDwAHARECBwECAQUABwABPQQAB20HAGCA8AA=");
  base64DecodeToExistingUint8Array(bufferView, 1058992, "AQAAAAAAAAABAAAA+BEQAA==");
}
function asmFunc(env) {
 var buffer = new ArrayBuffer(1114112);
 var HEAP8 = new Int8Array(buffer);
 var HEAP16 = new Int16Array(buffer);
 var HEAP32 = new Int32Array(buffer);
 var HEAPU8 = new Uint8Array(buffer);
 var HEAPU16 = new Uint16Array(buffer);
 var HEAPU32 = new Uint32Array(buffer);
 var HEAPF32 = new Float32Array(buffer);
 var HEAPF64 = new Float64Array(buffer);
 var Math_imul = Math.imul;
 var Math_fround = Math.fround;
 var Math_abs = Math.abs;
 var Math_clz32 = Math.clz32;
 var Math_min = Math.min;
 var Math_max = Math.max;
 var Math_floor = Math.floor;
 var Math_ceil = Math.ceil;
 var Math_trunc = Math.trunc;
 var Math_sqrt = Math.sqrt;
 var abort = env.abort;
 var nan = NaN;
 var infinity = Infinity;
 var _ZN4wasi13lib_generated22wasi_snapshot_preview18fd_write17h1ddc5ed58010b6c1E = env.fd_write;
 var __imported_wasi_snapshot_preview1_args_get = env.args_get;
 var __imported_wasi_snapshot_preview1_args_sizes_get = env.args_sizes_get;
 var __imported_wasi_snapshot_preview1_environ_get = env.environ_get;
 var __imported_wasi_snapshot_preview1_environ_sizes_get = env.environ_sizes_get;
 var __imported_wasi_snapshot_preview1_proc_exit = env.proc_exit;
 var main = env.main;
 var __stack_pointer = 1048576;
 var global$1 = 1059648;
 var global$2 = 1059636;
 var __wasm_intrinsics_temp_i64 = 0;
 var __wasm_intrinsics_temp_i64$hi = 0;
 var i64toi32_i32$HIGH_BITS = 0;
 function __wasm_call_ctors() {
  __wasilibc_initialize_environ_eagerly();
 }
 
 function _start() {
  var $0 = 0;
  label$1 : {
   $0 = __original_main() | 0;
   if (!$0) {
    break label$1
   }
   exit($0 | 0);
   abort();
  }
 }
 
 function fuck() {
  var $0 = 0;
  $0 = __stack_pointer - 32 | 0;
  __stack_pointer = $0;
  HEAP32[($0 + 28 | 0) >> 2] = 0;
  HEAP32[($0 + 24 | 0) >> 2] = 1048576;
  HEAP32[($0 + 12 | 0) >> 2] = 1;
  HEAP32[($0 + 16 | 0) >> 2] = 0;
  HEAP32[($0 + 8 | 0) >> 2] = 1048588;
  _ZN3std2io5stdio6_print17ha3352b664519162eE($0 + 8 | 0 | 0);
  __stack_pointer = $0 + 32 | 0;
  return 666 | 0;
 }
 
 function __rust_alloc($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return __rdl_alloc($0 | 0, $1 | 0) | 0 | 0;
 }
 
 function __rust_dealloc($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  __rdl_dealloc($0 | 0, $1 | 0, $2 | 0);
  return;
 }
 
 function __rust_realloc($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  return __rdl_realloc($0 | 0, $1 | 0, $2 | 0, $3 | 0) | 0 | 0;
 }
 
 function __rust_alloc_error_handler($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  __rg_oom($0 | 0, $1 | 0);
  return;
 }
 
 function _ZN36_$LT$T$u20$as$u20$core__any__Any$GT$7type_id17h2b5c69dbfb8a5fceE($0) {
  $0 = $0 | 0;
  i64toi32_i32$HIGH_BITS = -1196540473;
  return 582611467 | 0;
 }
 
 function _ZN36_$LT$T$u20$as$u20$core__any__Any$GT$7type_id17h707f34e71e2c316dE($0) {
  $0 = $0 | 0;
  i64toi32_i32$HIGH_BITS = -79280728;
  return 250261600 | 0;
 }
 
 function _ZN36_$LT$T$u20$as$u20$core__any__Any$GT$7type_id17he16982ceb64b952fE($0) {
  $0 = $0 | 0;
  i64toi32_i32$HIGH_BITS = 1102437544;
  return -1946858438 | 0;
 }
 
 function _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h93eff3232b7c94b8E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN43_$LT$bool$u20$as$u20$core__fmt__Display$GT$3fmt17h17a585dfee3be824E(HEAP32[$0 >> 2] | 0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17hf01d05f8ffc6998aE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $0 = HEAP32[$0 >> 2] | 0;
  label$1 : {
   if (_ZN4core3fmt9Formatter15debug_lower_hex17h0aa615ed79f38ab7E($1 | 0) | 0) {
    break label$1
   }
   label$2 : {
    if (_ZN4core3fmt9Formatter15debug_upper_hex17h4a32746d7a339cc5E($1 | 0) | 0) {
     break label$2
    }
    return _ZN4core3fmt3num3imp52_$LT$impl$u20$core__fmt__Display$u20$for$u20$u32$GT$3fmt17hd8b7165cf120cb31E($0 | 0, $1 | 0) | 0 | 0;
   }
   return _ZN4core3fmt3num53_$LT$impl$u20$core__fmt__UpperHex$u20$for$u20$i32$GT$3fmt17hc87220efb89991c9E($0 | 0, $1 | 0) | 0 | 0;
  }
  return _ZN4core3fmt3num53_$LT$impl$u20$core__fmt__LowerHex$u20$for$u20$i32$GT$3fmt17hf201c6e79ac3d9a7E($0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17h9d406cf23c11b6bfE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN42_$LT$str$u20$as$u20$core__fmt__Display$GT$3fmt17had6f7bdb177482f0E(HEAP32[$0 >> 2] | 0 | 0, HEAP32[($0 + 4 | 0) >> 2] | 0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17ha457960167401a4cE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN70_$LT$core__panic__location__Location$u20$as$u20$core__fmt__Display$GT$3fmt17ha8020e17e3352036E(HEAP32[$0 >> 2] | 0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN4core3fmt5Write10write_char17h21c4ea041e584ffeE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 12 | 0) >> 2] = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if ($1 >>> 0 < 128 >>> 0) {
       break label$4
      }
      if ($1 >>> 0 < 2048 >>> 0) {
       break label$3
      }
      if ($1 >>> 0 >= 65536 >>> 0) {
       break label$2
      }
      HEAP8[($2 + 14 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
      HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 12 | 0 | 224 | 0;
      HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      $1 = 3;
      break label$1;
     }
     HEAP8[($2 + 12 | 0) >> 0] = $1;
     $1 = 1;
     break label$1;
    }
    HEAP8[($2 + 13 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
    HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 6 | 0 | 192 | 0;
    $1 = 2;
    break label$1;
   }
   HEAP8[($2 + 15 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
   HEAP8[($2 + 14 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 12 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 12 | 0) >> 0] = ($1 >>> 18 | 0) & 7 | 0 | 240 | 0;
   $1 = 4;
  }
  $1 = _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17h7a67e08803b4d09fE($0 | 0, $2 + 12 | 0 | 0, $1 | 0) | 0;
  __stack_pointer = $2 + 16 | 0;
  return $1 | 0;
 }
 
 function _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17h7a67e08803b4d09fE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $5 = 0, $3 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $6$hi = 0, i64toi32_i32$4 = 0, $6 = 0, i64toi32_i32$3 = 0, $4 = 0, $14 = 0, $50$hi = 0;
  $3 = __stack_pointer - 32 | 0;
  __stack_pointer = $3;
  $4 = 0;
  label$1 : {
   if (!$2) {
    break label$1
   }
   label$2 : {
    label$3 : {
     label$4 : while (1) {
      HEAP32[($3 + 12 | 0) >> 2] = $2;
      HEAP32[($3 + 8 | 0) >> 2] = $1;
      _ZN4wasi13lib_generated8fd_write17h5efa9dd89fd18687E($3 + 16 | 0 | 0, 2 | 0, $3 + 8 | 0 | 0, 1 | 0);
      label$5 : {
       label$6 : {
        label$7 : {
         if (HEAPU16[($3 + 16 | 0) >> 1] | 0) {
          break label$7
         }
         $5 = HEAP32[($3 + 20 | 0) >> 2] | 0;
         if ($5) {
          break label$6
         }
         $5 = 1050344;
         i64toi32_i32$0 = 0;
         $6 = 2;
         $6$hi = i64toi32_i32$0;
         break label$2;
        }
        HEAP16[($3 + 30 | 0) >> 1] = HEAPU16[($3 + 18 | 0) >> 1] | 0;
        $5 = (_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E($3 + 30 | 0 | 0) | 0) & 65535 | 0;
        if (((_ZN3std3sys4wasi17decode_error_kind17h3d93ab073700757fE($5 | 0) | 0) & 255 | 0 | 0) == (35 | 0)) {
         break label$5
        }
        i64toi32_i32$0 = 0;
        $6 = 0;
        $6$hi = i64toi32_i32$0;
        break label$2;
       }
       if ($2 >>> 0 < $5 >>> 0) {
        break label$3
       }
       $1 = $1 + $5 | 0;
       $2 = $2 - $5 | 0;
      }
      if ($2) {
       continue label$4
      }
      break label$1;
     };
    }
    _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($5 | 0, $2 | 0, 1050564 | 0);
    abort();
   }
   i64toi32_i32$0 = 0;
   i64toi32_i32$2 = $5;
   i64toi32_i32$1 = 0;
   i64toi32_i32$3 = 32;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
    $14 = 0;
   } else {
    i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
    $14 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   }
   $50$hi = i64toi32_i32$1;
   i64toi32_i32$1 = $6$hi;
   i64toi32_i32$1 = $50$hi;
   i64toi32_i32$0 = $14;
   i64toi32_i32$2 = $6$hi;
   i64toi32_i32$3 = $6;
   i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
   $6 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
   $6$hi = i64toi32_i32$2;
   label$8 : {
    if ((HEAPU8[($0 + 4 | 0) >> 0] | 0 | 0) != (3 | 0)) {
     break label$8
    }
    $2 = HEAP32[($0 + 8 | 0) >> 2] | 0;
    FUNCTION_TABLE[HEAP32[(HEAP32[($2 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$2 >> 2] | 0);
    label$9 : {
     $1 = HEAP32[($2 + 4 | 0) >> 2] | 0;
     $5 = HEAP32[($1 + 4 | 0) >> 2] | 0;
     if (!$5) {
      break label$9
     }
     __rust_dealloc(HEAP32[$2 >> 2] | 0 | 0, $5 | 0, HEAP32[($1 + 8 | 0) >> 2] | 0 | 0);
    }
    __rust_dealloc($2 | 0, 12 | 0, 4 | 0);
   }
   i64toi32_i32$2 = $6$hi;
   i64toi32_i32$0 = $0;
   HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = $6;
   HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = i64toi32_i32$2;
   $4 = 1;
  }
  __stack_pointer = $3 + 32 | 0;
  return $4 | 0;
 }
 
 function _ZN4core3fmt5Write10write_char17hbc66407203c004dcE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 12 | 0) >> 2] = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if ($1 >>> 0 < 128 >>> 0) {
       break label$4
      }
      if ($1 >>> 0 < 2048 >>> 0) {
       break label$3
      }
      if ($1 >>> 0 >= 65536 >>> 0) {
       break label$2
      }
      HEAP8[($2 + 14 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
      HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 12 | 0 | 224 | 0;
      HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      $1 = 3;
      break label$1;
     }
     HEAP8[($2 + 12 | 0) >> 0] = $1;
     $1 = 1;
     break label$1;
    }
    HEAP8[($2 + 13 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
    HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 6 | 0 | 192 | 0;
    $1 = 2;
    break label$1;
   }
   HEAP8[($2 + 15 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
   HEAP8[($2 + 14 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 12 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 12 | 0) >> 0] = ($1 >>> 18 | 0) & 7 | 0 | 240 | 0;
   $1 = 4;
  }
  label$5 : {
   $3 = HEAP32[$0 >> 2] | 0;
   $4 = $3 + 8 | 0;
   $0 = HEAP32[$4 >> 2] | 0;
   if (((HEAP32[($3 + 4 | 0) >> 2] | 0) - $0 | 0) >>> 0 >= $1 >>> 0) {
    break label$5
   }
   _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($3 | 0, $0 | 0, $1 | 0);
   $0 = HEAP32[$4 >> 2] | 0;
  }
  memcpy((HEAP32[$3 >> 2] | 0) + $0 | 0 | 0, $2 + 12 | 0 | 0, $1 | 0) | 0;
  HEAP32[$4 >> 2] = $0 + $1 | 0;
  __stack_pointer = $2 + 16 | 0;
  return 0 | 0;
 }
 
 function _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $4 = 0;
  $3 = __stack_pointer - 32 | 0;
  __stack_pointer = $3;
  label$1 : {
   $2 = $1 + $2 | 0;
   if ($2 >>> 0 < $1 >>> 0) {
    break label$1
   }
   $4 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   $1 = $4 << 1 | 0;
   $1 = $1 >>> 0 > $2 >>> 0 ? $1 : $2;
   $1 = $1 >>> 0 > 8 >>> 0 ? $1 : 8;
   label$2 : {
    label$3 : {
     if ($4) {
      break label$3
     }
     $2 = 0;
     break label$2;
    }
    HEAP32[($3 + 20 | 0) >> 2] = $4;
    HEAP32[($3 + 16 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
    $2 = 1;
   }
   HEAP32[($3 + 24 | 0) >> 2] = $2;
   _ZN5alloc7raw_vec11finish_grow17h9dddb2dce33dd0adE($3 | 0, $1 | 0, 1 | 0, $3 + 16 | 0 | 0);
   label$4 : {
    if (!(HEAP32[$3 >> 2] | 0)) {
     break label$4
    }
    $0 = HEAP32[($3 + 8 | 0) >> 2] | 0;
    if (!$0) {
     break label$1
    }
    _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(HEAP32[($3 + 4 | 0) >> 2] | 0 | 0, $0 | 0);
    abort();
   }
   $2 = HEAP32[($3 + 4 | 0) >> 2] | 0;
   HEAP32[($0 + 4 | 0) >> 2] = $1;
   HEAP32[$0 >> 2] = $2;
   __stack_pointer = $3 + 32 | 0;
   return;
  }
  _ZN5alloc7raw_vec17capacity_overflow17h1271517144c3fe0fE();
  abort();
 }
 
 function _ZN4core3fmt5Write10write_char17hc020ba426170fec3E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $4 = 0, i64toi32_i32$1 = 0, $5 = 0, $6 = 0, $3 = 0, $3$hi = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if ($1 >>> 0 < 128 >>> 0) {
       break label$4
      }
      if ($1 >>> 0 < 2048 >>> 0) {
       break label$3
      }
      if ($1 >>> 0 >= 65536 >>> 0) {
       break label$2
      }
      HEAP8[($2 + 6 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
      HEAP8[($2 + 4 | 0) >> 0] = $1 >>> 12 | 0 | 224 | 0;
      HEAP8[($2 + 5 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      $1 = 3;
      break label$1;
     }
     HEAP8[($2 + 4 | 0) >> 0] = $1;
     $1 = 1;
     break label$1;
    }
    HEAP8[($2 + 5 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
    HEAP8[($2 + 4 | 0) >> 0] = $1 >>> 6 | 0 | 192 | 0;
    $1 = 2;
    break label$1;
   }
   HEAP8[($2 + 7 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
   HEAP8[($2 + 6 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 5 | 0) >> 0] = ($1 >>> 12 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 4 | 0) >> 0] = ($1 >>> 18 | 0) & 7 | 0 | 240 | 0;
   $1 = 4;
  }
  _ZN61_$LT$std__io__stdio__StdoutLock$u20$as$u20$std__io__Write$GT$9write_all17h6c125576457c7d8dE($2 + 8 | 0 | 0, HEAP32[$0 >> 2] | 0 | 0, $2 + 4 | 0 | 0, $1 | 0);
  label$5 : {
   $1 = HEAPU8[($2 + 8 | 0) >> 0] | 0;
   if (($1 | 0) == (4 | 0)) {
    break label$5
   }
   i64toi32_i32$1 = HEAP32[($2 + 12 | 0) >> 2] | 0;
   $3 = HEAP32[($2 + 8 | 0) >> 2] | 0;
   $3$hi = i64toi32_i32$1;
   label$6 : {
    if ((HEAPU8[($0 + 4 | 0) >> 0] | 0 | 0) != (3 | 0)) {
     break label$6
    }
    $4 = HEAP32[($0 + 8 | 0) >> 2] | 0;
    FUNCTION_TABLE[HEAP32[(HEAP32[($4 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$4 >> 2] | 0);
    label$7 : {
     $5 = HEAP32[($4 + 4 | 0) >> 2] | 0;
     $6 = HEAP32[($5 + 4 | 0) >> 2] | 0;
     if (!$6) {
      break label$7
     }
     __rust_dealloc(HEAP32[$4 >> 2] | 0 | 0, $6 | 0, HEAP32[($5 + 8 | 0) >> 2] | 0 | 0);
    }
    __rust_dealloc($4 | 0, 12 | 0, 4 | 0);
   }
   i64toi32_i32$1 = $3$hi;
   HEAP32[($0 + 4 | 0) >> 2] = $3;
   HEAP32[($0 + 8 | 0) >> 2] = i64toi32_i32$1;
  }
  __stack_pointer = $2 + 16 | 0;
  return ($1 | 0) != (4 | 0) | 0;
 }
 
 function _ZN61_$LT$std__io__stdio__StdoutLock$u20$as$u20$std__io__Write$GT$9write_all17h6c125576457c7d8dE($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $6 = 0, $7 = 0, $8 = 0, $8$hi = 0, $5 = 0, $9 = 0;
  $4 = __stack_pointer - 16 | 0;
  __stack_pointer = $4;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       $1 = HEAP32[$1 >> 2] | 0;
       if (HEAP32[($1 + 8 | 0) >> 2] | 0) {
        break label$5
       }
       HEAP32[($1 + 8 | 0) >> 2] = -1;
       _ZN4core5slice6memchr7memrchr17h81dd29bac10486f7E($4 | 0, 10 | 0, $2 | 0, $3 | 0);
       $5 = $1 + 12 | 0;
       label$6 : {
        label$7 : {
         if (HEAP32[$4 >> 2] | 0) {
          break label$7
         }
         $6 = HEAP32[($1 + 20 | 0) >> 2] | 0;
         if (!$6) {
          break label$6
         }
         $7 = HEAP32[($1 + 12 | 0) >> 2] | 0;
         if (!$7) {
          break label$6
         }
         if ((HEAPU8[(($6 + $7 | 0) + -1 | 0) >> 0] | 0 | 0) != (10 | 0)) {
          break label$6
         }
         _ZN3std2io8buffered9bufwriter18BufWriter$LT$W$GT$9flush_buf17h466876de6c17a96cE($4 + 8 | 0 | 0, $5 | 0);
         if ((HEAPU8[($4 + 8 | 0) >> 0] | 0 | 0) == (4 | 0)) {
          break label$6
         }
         i64toi32_i32$0 = HEAP32[($4 + 8 | 0) >> 2] | 0;
         i64toi32_i32$1 = HEAP32[($4 + 12 | 0) >> 2] | 0;
         $8 = i64toi32_i32$0;
         $8$hi = i64toi32_i32$1;
         if ((i64toi32_i32$0 & 255 | 0 | 0) == (4 | 0)) {
          break label$6
         }
         i64toi32_i32$1 = $8$hi;
         i64toi32_i32$0 = $0;
         HEAP32[i64toi32_i32$0 >> 2] = $8;
         HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
         break label$1;
        }
        $6 = (HEAP32[($4 + 4 | 0) >> 2] | 0) + 1 | 0;
        if ($6 >>> 0 > $3 >>> 0) {
         break label$4
        }
        label$8 : {
         $7 = HEAP32[($1 + 20 | 0) >> 2] | 0;
         if (!$7) {
          break label$8
         }
         label$9 : {
          if (((HEAP32[($1 + 16 | 0) >> 2] | 0) - $7 | 0) >>> 0 <= $6 >>> 0) {
           break label$9
          }
          memcpy((HEAP32[($1 + 12 | 0) >> 2] | 0) + $7 | 0 | 0, $2 | 0, $6 | 0) | 0;
          HEAP32[($1 + 20 | 0) >> 2] = $7 + $6 | 0;
          break label$3;
         }
         _ZN3std2io8buffered9bufwriter18BufWriter$LT$W$GT$14write_all_cold17ha85053bb707b554aE($4 + 8 | 0 | 0, $5 | 0, $2 | 0, $6 | 0);
         if ((HEAPU8[($4 + 8 | 0) >> 0] | 0 | 0) == (4 | 0)) {
          break label$3
         }
         i64toi32_i32$1 = HEAP32[($4 + 8 | 0) >> 2] | 0;
         i64toi32_i32$0 = HEAP32[($4 + 12 | 0) >> 2] | 0;
         $8 = i64toi32_i32$1;
         $8$hi = i64toi32_i32$0;
         if ((i64toi32_i32$1 & 255 | 0 | 0) == (4 | 0)) {
          break label$3
         }
         i64toi32_i32$0 = $8$hi;
         i64toi32_i32$1 = $0;
         HEAP32[i64toi32_i32$1 >> 2] = $8;
         HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
         break label$1;
        }
        _ZN60_$LT$std__io__stdio__StdoutRaw$u20$as$u20$std__io__Write$GT$9write_all17h3c58ff14f607126aE($4 + 8 | 0 | 0, $5 | 0, $2 | 0, $6 | 0);
        if ((HEAPU8[($4 + 8 | 0) >> 0] | 0 | 0) == (4 | 0)) {
         break label$2
        }
        i64toi32_i32$0 = HEAP32[($4 + 8 | 0) >> 2] | 0;
        i64toi32_i32$1 = HEAP32[($4 + 12 | 0) >> 2] | 0;
        $8 = i64toi32_i32$0;
        $8$hi = i64toi32_i32$1;
        if ((i64toi32_i32$0 & 255 | 0 | 0) == (4 | 0)) {
         break label$2
        }
        i64toi32_i32$1 = $8$hi;
        i64toi32_i32$0 = $0;
        HEAP32[i64toi32_i32$0 >> 2] = $8;
        HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
        break label$1;
       }
       label$10 : {
        $7 = $1 + 20 | 0;
        $6 = HEAP32[$7 >> 2] | 0;
        if (((HEAP32[($1 + 16 | 0) >> 2] | 0) - $6 | 0) >>> 0 > $3 >>> 0) {
         break label$10
        }
        _ZN3std2io8buffered9bufwriter18BufWriter$LT$W$GT$14write_all_cold17ha85053bb707b554aE($0 | 0, $5 | 0, $2 | 0, $3 | 0);
        break label$1;
       }
       memcpy((HEAP32[($1 + 12 | 0) >> 2] | 0) + $6 | 0 | 0, $2 | 0, $3 | 0) | 0;
       HEAP8[$0 >> 0] = 4;
       HEAP32[$7 >> 2] = $6 + $3 | 0;
       break label$1;
      }
      _ZN4core6result13unwrap_failed17hcf4dc3db6a31deeeE(1048692 | 0, 16 | 0, $4 + 8 | 0 | 0, 1048804 | 0, 1050384 | 0);
      abort();
     }
     _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048724 | 0, 35 | 0, 1049512 | 0);
     abort();
    }
    _ZN3std2io8buffered9bufwriter18BufWriter$LT$W$GT$9flush_buf17h466876de6c17a96cE($4 + 8 | 0 | 0, $5 | 0);
    if ((HEAPU8[($4 + 8 | 0) >> 0] | 0 | 0) == (4 | 0)) {
     break label$2
    }
    i64toi32_i32$1 = HEAP32[($4 + 8 | 0) >> 2] | 0;
    i64toi32_i32$0 = HEAP32[($4 + 12 | 0) >> 2] | 0;
    $8 = i64toi32_i32$1;
    $8$hi = i64toi32_i32$0;
    if ((i64toi32_i32$1 & 255 | 0 | 0) == (4 | 0)) {
     break label$2
    }
    i64toi32_i32$0 = $8$hi;
    i64toi32_i32$1 = $0;
    HEAP32[i64toi32_i32$1 >> 2] = $8;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    break label$1;
   }
   $7 = $2 + $6 | 0;
   label$11 : {
    $9 = $1 + 20 | 0;
    $2 = HEAP32[$9 >> 2] | 0;
    $3 = $3 - $6 | 0;
    if (((HEAP32[($1 + 16 | 0) >> 2] | 0) - $2 | 0) >>> 0 > $3 >>> 0) {
     break label$11
    }
    _ZN3std2io8buffered9bufwriter18BufWriter$LT$W$GT$14write_all_cold17ha85053bb707b554aE($0 | 0, $5 | 0, $7 | 0, $3 | 0);
    break label$1;
   }
   memcpy((HEAP32[($1 + 12 | 0) >> 2] | 0) + $2 | 0 | 0, $7 | 0, $3 | 0) | 0;
   HEAP8[$0 >> 0] = 4;
   HEAP32[$9 >> 2] = $2 + $3 | 0;
  }
  HEAP32[($1 + 8 | 0) >> 2] = (HEAP32[($1 + 8 | 0) >> 2] | 0) + 1 | 0;
  __stack_pointer = $4 + 16 | 0;
 }
 
 function _ZN4core3fmt5Write9write_fmt17h6605f4d4890c4c04E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $13 = 0, $19 = 0, $22 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = $0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $13 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $13;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $19 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $19;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $22 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $22;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1048596 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN4core3fmt5Write9write_fmt17h6a629a61cefccbadE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $13 = 0, $19 = 0, $22 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = $0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $13 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $13;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $19 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $19;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $22 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $22;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1048644 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN4core3fmt5Write9write_fmt17h9cbf845483dea04eE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $13 = 0, $19 = 0, $22 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = $0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $13 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $13;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $19 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $19;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $22 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $22;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1048668 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN3std9panicking12default_hook17hd71c2b290711a70bE($0) {
  $0 = $0 | 0;
  var $2 = 0, $1 = 0, $4 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $5 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, $3 = 0, $3$hi = 0, $6 = 0;
  $1 = __stack_pointer - 96 | 0;
  __stack_pointer = $1;
  $2 = 1;
  label$1 : {
   if ((HEAP32[(0 + 1059096 | 0) >> 2] | 0) >>> 0 > 1 >>> 0) {
    break label$1
   }
   $2 = (_ZN3std5panic19get_backtrace_style17hd62cc808c95497adE() | 0) & 255 | 0;
  }
  HEAP8[($1 + 27 | 0) >> 0] = $2;
  label$2 : {
   label$3 : {
    label$4 : {
     label$5 : {
      label$6 : {
       label$7 : {
        $2 = _ZN4core5panic10panic_info9PanicInfo8location17h07198a946bdf74c0E($0 | 0) | 0;
        if (!$2) {
         break label$7
        }
        HEAP32[($1 + 28 | 0) >> 2] = $2;
        _ZN4core5panic10panic_info9PanicInfo7payload17hf32a31e780cf45f5E($1 + 16 | 0 | 0, $0 | 0);
        $2 = HEAP32[($1 + 16 | 0) >> 2] | 0;
        i64toi32_i32$0 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 20 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0]($2) | 0;
        i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
        $3 = i64toi32_i32$0;
        $3$hi = i64toi32_i32$1;
        label$8 : {
         label$9 : {
          label$10 : {
           if (!$2) {
            break label$10
           }
           i64toi32_i32$1 = $3$hi;
           i64toi32_i32$2 = $3;
           i64toi32_i32$0 = -1196540473;
           i64toi32_i32$3 = 582611467;
           if ((i64toi32_i32$2 | 0) == (i64toi32_i32$3 | 0) & (i64toi32_i32$1 | 0) == (i64toi32_i32$0 | 0) | 0) {
            break label$9
           }
          }
          _ZN4core5panic10panic_info9PanicInfo7payload17hf32a31e780cf45f5E($1 + 8 | 0 | 0, $0 | 0);
          $4 = 1051372;
          $0 = 12;
          $2 = HEAP32[($1 + 8 | 0) >> 2] | 0;
          i64toi32_i32$2 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0]($2) | 0;
          i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
          $3 = i64toi32_i32$2;
          $3$hi = i64toi32_i32$1;
          label$11 : {
           if (!$2) {
            break label$11
           }
           i64toi32_i32$1 = $3$hi;
           i64toi32_i32$3 = $3;
           i64toi32_i32$2 = 1102437544;
           i64toi32_i32$0 = -1946858438;
           if ((i64toi32_i32$3 | 0) != (i64toi32_i32$0 | 0) | (i64toi32_i32$1 | 0) != (i64toi32_i32$2 | 0) | 0) {
            break label$11
           }
           $0 = HEAP32[($2 + 8 | 0) >> 2] | 0;
           $4 = HEAP32[$2 >> 2] | 0;
          }
          HEAP32[($1 + 32 | 0) >> 2] = $4;
          break label$8;
         }
         HEAP32[($1 + 32 | 0) >> 2] = HEAP32[$2 >> 2] | 0;
         $0 = HEAP32[($2 + 4 | 0) >> 2] | 0;
        }
        HEAP32[($1 + 36 | 0) >> 2] = $0;
        if (HEAP32[(0 + 1059088 | 0) >> 2] | 0) {
         break label$6
        }
        HEAP32[(0 + 1059088 | 0) >> 2] = -1;
        label$12 : {
         $0 = HEAP32[(0 + 1059092 | 0) >> 2] | 0;
         if ($0) {
          break label$12
         }
         $0 = _ZN3std6thread6Thread3new17h0bfc28a566f6af69E(0 | 0, $1 | 0) | 0;
         HEAP32[(0 + 1059092 | 0) >> 2] = $0;
        }
        $2 = HEAP32[$0 >> 2] | 0;
        HEAP32[$0 >> 2] = $2 + 1 | 0;
        if (($2 | 0) <= (-1 | 0)) {
         break label$5
        }
        HEAP32[(0 + 1059088 | 0) >> 2] = (HEAP32[(0 + 1059088 | 0) >> 2] | 0) + 1 | 0;
        label$13 : {
         label$14 : {
          if ($0) {
           break label$14
          }
          $2 = 0;
          break label$13;
         }
         label$15 : {
          $2 = HEAP32[($0 + 16 | 0) >> 2] | 0;
          if ($2) {
           break label$15
          }
          $2 = 0;
          break label$13;
         }
         _ZN4core3ffi5c_str4CStr29from_bytes_with_nul_unchecked7rt_impl17hf4dd9bf93c6afe10E($1 | 0, $2 | 0, HEAP32[($0 + 20 | 0) >> 2] | 0 | 0);
         $4 = (HEAP32[($1 + 4 | 0) >> 2] | 0) + -1 | 0;
         $2 = HEAP32[$1 >> 2] | 0;
        }
        HEAP32[($1 + 44 | 0) >> 2] = $2 ? $4 : 9;
        HEAP32[($1 + 40 | 0) >> 2] = $2 ? $2 : 1051384;
        HEAP32[($1 + 60 | 0) >> 2] = $1 + 27 | 0;
        HEAP32[($1 + 56 | 0) >> 2] = $1 + 28 | 0;
        HEAP32[($1 + 52 | 0) >> 2] = $1 + 32 | 0;
        HEAP32[($1 + 48 | 0) >> 2] = $1 + 40 | 0;
        label$16 : {
         if (!(HEAPU8[(0 + 1059010 | 0) >> 0] | 0)) {
          break label$16
         }
         HEAP8[(0 + 1059010 | 0) >> 0] = 1;
         label$17 : {
          if (HEAP32[(0 + 1059076 | 0) >> 2] | 0) {
           break label$17
          }
          i64toi32_i32$1 = 0;
          i64toi32_i32$3 = 0;
          HEAP32[(i64toi32_i32$1 + 1059076 | 0) >> 2] = 1;
          HEAP32[(i64toi32_i32$1 + 1059080 | 0) >> 2] = i64toi32_i32$3;
          break label$16;
         }
         $2 = HEAP32[(0 + 1059080 | 0) >> 2] | 0;
         HEAP32[(0 + 1059080 | 0) >> 2] = 0;
         if ($2) {
          break label$4
         }
        }
        _ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h088b9b7f9133fce0E($1 + 48 | 0 | 0, $1 + 72 | 0 | 0, 1051396 | 0);
        $4 = 0;
        $2 = 0;
        break label$3;
       }
       _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048759 | 0, 43 | 0, 1051356 | 0);
       abort();
      }
      _ZN4core6result13unwrap_failed17hcf4dc3db6a31deeeE(1048692 | 0, 16 | 0, $1 + 72 | 0 | 0, 1048804 | 0, 1051220 | 0);
      abort();
     }
     abort();
    }
    $4 = HEAPU8[($2 + 8 | 0) >> 0] | 0;
    HEAP8[($2 + 8 | 0) >> 0] = 1;
    $4 = $4 & 1 | 0;
    HEAP8[($1 + 71 | 0) >> 0] = $4;
    if ($4) {
     break label$2
    }
    label$18 : {
     label$19 : {
      label$20 : {
       if ((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0) {
        break label$20
       }
       _ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h088b9b7f9133fce0E($1 + 48 | 0 | 0, $2 + 12 | 0 | 0, 1051436 | 0);
       break label$19;
      }
      $4 = _ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0;
      _ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h088b9b7f9133fce0E($1 + 48 | 0 | 0, $2 + 12 | 0 | 0, 1051436 | 0);
      if (!$4) {
       break label$18
      }
     }
     if (!((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0)) {
      break label$18
     }
     if (_ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0) {
      break label$18
     }
     HEAP8[($2 + 9 | 0) >> 0] = 1;
    }
    $4 = 1;
    HEAP8[(0 + 1059010 | 0) >> 0] = 1;
    HEAP8[($2 + 8 | 0) >> 0] = 0;
    label$21 : {
     if (HEAP32[(0 + 1059076 | 0) >> 2] | 0) {
      break label$21
     }
     HEAP32[(0 + 1059080 | 0) >> 2] = $2;
     $4 = 1;
     HEAP32[(0 + 1059076 | 0) >> 2] = 1;
     break label$3;
    }
    $5 = HEAP32[(0 + 1059080 | 0) >> 2] | 0;
    HEAP32[(0 + 1059080 | 0) >> 2] = $2;
    if (!$5) {
     break label$3
    }
    $6 = HEAP32[$5 >> 2] | 0;
    HEAP32[$5 >> 2] = $6 + -1 | 0;
    $4 = 1;
    if (($6 | 0) != (1 | 0)) {
     break label$3
    }
    _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h347b97f7aa31dec8E($5 | 0);
   }
   label$22 : {
    if (!$0) {
     break label$22
    }
    $5 = HEAP32[$0 >> 2] | 0;
    HEAP32[$0 >> 2] = $5 + -1 | 0;
    if (($5 | 0) != (1 | 0)) {
     break label$22
    }
    _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h66f7782f21192ee0E($0 | 0);
   }
   label$23 : {
    if (!(($4 ^ -1 | 0) & ($2 | 0) != (0 | 0) | 0)) {
     break label$23
    }
    $0 = HEAP32[$2 >> 2] | 0;
    HEAP32[$2 >> 2] = $0 + -1 | 0;
    if (($0 | 0) != (1 | 0)) {
     break label$23
    }
    _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h347b97f7aa31dec8E($2 | 0);
   }
   __stack_pointer = $1 + 96 | 0;
   return;
  }
  HEAP32[($1 + 92 | 0) >> 2] = 0;
  HEAP32[($1 + 88 | 0) >> 2] = 1048692;
  i64toi32_i32$1 = $1;
  i64toi32_i32$3 = 0;
  HEAP32[($1 + 76 | 0) >> 2] = 1;
  HEAP32[($1 + 80 | 0) >> 2] = i64toi32_i32$3;
  HEAP32[($1 + 72 | 0) >> 2] = 1052180;
  _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($1 + 71 | 0 | 0, $1 + 72 | 0 | 0);
  abort();
 }
 
 function _ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable_shim$u7d$$u7d$17h1221fd053cf9becaE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0;
  $2 = HEAP32[$0 >> 2] | 0;
  $0 = HEAP32[$2 >> 2] | 0;
  HEAP32[$2 >> 2] = 0;
  label$1 : {
   label$2 : {
    if (!$0) {
     break label$2
    }
    $2 = __rust_alloc(1024 | 0, 1 | 0) | 0;
    if (!$2) {
     break label$1
    }
    HEAP8[($0 + 28 | 0) >> 0] = 0;
    HEAP8[($0 + 24 | 0) >> 0] = 0;
    i64toi32_i32$0 = 0;
    HEAP32[($0 + 16 | 0) >> 2] = 1024;
    HEAP32[($0 + 20 | 0) >> 2] = i64toi32_i32$0;
    HEAP32[($0 + 12 | 0) >> 2] = $2;
    HEAP32[($0 + 8 | 0) >> 2] = 0;
    i64toi32_i32$0 = 0;
    HEAP32[$0 >> 2] = 0;
    HEAP32[($0 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   }
   _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048759 | 0, 43 | 0, 1050784 | 0);
   abort();
  }
  _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(1024 | 0, 1 | 0);
  abort();
 }
 
 function _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $14 = 0, $20 = 0, $23 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = 1049362;
  HEAP32[$2 >> 2] = $0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $14 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $14;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $20 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $20;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $23;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  _ZN4core9panicking19assert_failed_inner17h73546127ae8f600bE(0 | 0, $2 | 0, 1048896 | 0, $2 + 4 | 0 | 0, 1048896 | 0, $2 + 8 | 0 | 0, 1052244 | 0);
  abort();
 }
 
 function _ZN4core3ptr100drop_in_place$LT$$RF$mut$u20$std__io__Write__write_fmt__Adapter$LT$alloc__vec__Vec$LT$u8$GT$$GT$$GT$17hdf29bfed925752abE($0) {
  $0 = $0 | 0;
 }
 
 function _ZN4core3ptr103drop_in_place$LT$std__sync__poison__PoisonError$LT$std__sync__mutex__MutexGuard$LT$$LP$$RP$$GT$$GT$$GT$17h90716e2bc96dce67E($0) {
  $0 = $0 | 0;
  var $1 = 0;
  $1 = HEAP32[$0 >> 2] | 0;
  label$1 : {
   if (HEAPU8[($0 + 4 | 0) >> 0] | 0) {
    break label$1
   }
   if (!((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0)) {
    break label$1
   }
   if (_ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0) {
    break label$1
   }
   HEAP8[($1 + 1 | 0) >> 0] = 1;
  }
  HEAP8[$1 >> 0] = 0;
 }
 
 function _ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() {
  return !(HEAP32[(0 + 1059096 | 0) >> 2] | 0) | 0;
 }
 
 function _ZN4core3ptr226drop_in_place$LT$std__error__$LT$impl$u20$core__convert__From$LT$alloc__string__String$GT$$u20$for$u20$alloc__boxed__Box$LT$dyn$u20$std__error__Error$u2b$core__marker__Sync$u2b$core__marker__Send$GT$$GT$__from__StringError$GT$17h93379087c8f60e89E($0) {
  $0 = $0 | 0;
  var $1 = 0;
  label$1 : {
   $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   if (!$1) {
    break label$1
   }
   __rust_dealloc(HEAP32[$0 >> 2] | 0 | 0, $1 | 0, 1 | 0);
  }
 }
 
 function _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h66f7782f21192ee0E($0) {
  $0 = $0 | 0;
  var $1 = 0;
  label$1 : {
   $1 = HEAP32[($0 + 16 | 0) >> 2] | 0;
   if (!$1) {
    break label$1
   }
   HEAP8[$1 >> 0] = 0;
   $1 = HEAP32[($0 + 20 | 0) >> 2] | 0;
   if (!$1) {
    break label$1
   }
   __rust_dealloc(HEAP32[($0 + 16 | 0) >> 2] | 0 | 0, $1 | 0, 1 | 0);
  }
  label$2 : {
   if (($0 | 0) == (-1 | 0)) {
    break label$2
   }
   $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   HEAP32[($0 + 4 | 0) >> 2] = $1 + -1 | 0;
   if (($1 | 0) != (1 | 0)) {
    break label$2
   }
   __rust_dealloc($0 | 0, 32 | 0, 8 | 0);
  }
 }
 
 function _ZN4core3ptr70drop_in_place$LT$std__panicking__begin_panic_handler__PanicPayload$GT$17hf1e08952d4df757dE($0) {
  $0 = $0 | 0;
  var $1 = 0;
  label$1 : {
   $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   if (!$1) {
    break label$1
   }
   $0 = HEAP32[($0 + 8 | 0) >> 2] | 0;
   if (!$0) {
    break label$1
   }
   __rust_dealloc($1 | 0, $0 | 0, 1 | 0);
  }
 }
 
 function _ZN4core3ptr81drop_in_place$LT$core__result__Result$LT$$LP$$RP$$C$std__io__error__Error$GT$$GT$17hdba6b10571868369E($0) {
  $0 = $0 | 0;
  var $1 = 0, $2 = 0, $3 = 0;
  label$1 : {
   if ((HEAPU8[$0 >> 0] | 0 | 0) != (3 | 0)) {
    break label$1
   }
   $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   FUNCTION_TABLE[HEAP32[(HEAP32[($1 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$1 >> 2] | 0);
   label$2 : {
    $2 = HEAP32[($1 + 4 | 0) >> 2] | 0;
    $3 = HEAP32[($2 + 4 | 0) >> 2] | 0;
    if (!$3) {
     break label$2
    }
    __rust_dealloc(HEAP32[$1 >> 2] | 0 | 0, $3 | 0, HEAP32[($2 + 8 | 0) >> 2] | 0 | 0);
   }
   __rust_dealloc(HEAP32[($0 + 4 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
  }
 }
 
 function _ZN4core3ptr87drop_in_place$LT$std__io__Write__write_fmt__Adapter$LT$$RF$mut$u20$$u5b$u8$u5d$$GT$$GT$17h7201544e6914916eE($0) {
  $0 = $0 | 0;
  var $1 = 0, $2 = 0, $3 = 0;
  label$1 : {
   if ((HEAPU8[($0 + 4 | 0) >> 0] | 0 | 0) != (3 | 0)) {
    break label$1
   }
   $1 = HEAP32[($0 + 8 | 0) >> 2] | 0;
   FUNCTION_TABLE[HEAP32[(HEAP32[($1 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$1 >> 2] | 0);
   label$2 : {
    $2 = HEAP32[($1 + 4 | 0) >> 2] | 0;
    $3 = HEAP32[($2 + 4 | 0) >> 2] | 0;
    if (!$3) {
     break label$2
    }
    __rust_dealloc(HEAP32[$1 >> 2] | 0 | 0, $3 | 0, HEAP32[($2 + 8 | 0) >> 2] | 0 | 0);
   }
   __rust_dealloc(HEAP32[($0 + 8 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
  }
 }
 
 function _ZN4core6option15Option$LT$T$GT$6unwrap17h3c1dc1c9e80b23ceE($0) {
  $0 = $0 | 0;
  label$1 : {
   if ($0) {
    break label$1
   }
   _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048759 | 0, 43 | 0, 1051640 | 0);
   abort();
  }
  return $0 | 0;
 }
 
 function _ZN4core6option15Option$LT$T$GT$6unwrap17hd1aea567a48242ffE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  label$1 : {
   if ($0) {
    break label$1
   }
   _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048759 | 0, 43 | 0, $1 | 0);
   abort();
  }
  return $0 | 0;
 }
 
 function _ZN4core9panicking13assert_failed17h7f523d0a6f15dc08E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $15 = 0, $21 = 0, $24 = 0;
  $3 = __stack_pointer - 32 | 0;
  __stack_pointer = $3;
  HEAP32[($3 + 4 | 0) >> 2] = 1050916;
  HEAP32[$3 >> 2] = $0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $15 = i64toi32_i32$0;
  i64toi32_i32$0 = ($3 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $15;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $21 = i64toi32_i32$1;
  i64toi32_i32$1 = ($3 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $21;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $24 = i64toi32_i32$0;
  i64toi32_i32$0 = $3;
  HEAP32[($3 + 8 | 0) >> 2] = $24;
  HEAP32[($3 + 12 | 0) >> 2] = i64toi32_i32$1;
  _ZN4core9panicking19assert_failed_inner17h73546127ae8f600bE(0 | 0, $3 | 0, 1048912 | 0, $3 + 4 | 0 | 0, 1048912 | 0, $3 + 8 | 0 | 0, $2 | 0);
  abort();
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17h156f652561e18dc0E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN58_$LT$alloc__string__String$u20$as$u20$core__fmt__Write$GT$10write_char17hc17837a43d1f17f9E(HEAP32[$0 >> 2] | 0 | 0, $1 | 0) | 0;
  return 0 | 0;
 }
 
 function _ZN58_$LT$alloc__string__String$u20$as$u20$core__fmt__Write$GT$10write_char17hc17837a43d1f17f9E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       if ($1 >>> 0 < 128 >>> 0) {
        break label$5
       }
       HEAP32[($2 + 12 | 0) >> 2] = 0;
       if ($1 >>> 0 < 2048 >>> 0) {
        break label$4
       }
       if ($1 >>> 0 >= 65536 >>> 0) {
        break label$3
       }
       HEAP8[($2 + 14 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
       HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 12 | 0 | 224 | 0;
       HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
       $1 = 3;
       break label$2;
      }
      label$6 : {
       $3 = HEAP32[($0 + 8 | 0) >> 2] | 0;
       if (($3 | 0) != (HEAP32[($0 + 4 | 0) >> 2] | 0 | 0)) {
        break label$6
       }
       _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17hf973c321f35703c9E($0 | 0, $3 | 0);
       $3 = HEAP32[($0 + 8 | 0) >> 2] | 0;
      }
      HEAP32[($0 + 8 | 0) >> 2] = $3 + 1 | 0;
      HEAP8[((HEAP32[$0 >> 2] | 0) + $3 | 0) >> 0] = $1;
      break label$1;
     }
     HEAP8[($2 + 13 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
     HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 6 | 0 | 192 | 0;
     $1 = 2;
     break label$2;
    }
    HEAP8[($2 + 15 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
    HEAP8[($2 + 14 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
    HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 12 | 0) & 63 | 0 | 128 | 0;
    HEAP8[($2 + 12 | 0) >> 0] = ($1 >>> 18 | 0) & 7 | 0 | 240 | 0;
    $1 = 4;
   }
   label$7 : {
    $4 = $0 + 8 | 0;
    $3 = HEAP32[$4 >> 2] | 0;
    if (((HEAP32[($0 + 4 | 0) >> 2] | 0) - $3 | 0) >>> 0 >= $1 >>> 0) {
     break label$7
    }
    _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($0 | 0, $3 | 0, $1 | 0);
    $3 = HEAP32[$4 >> 2] | 0;
   }
   memcpy((HEAP32[$0 >> 2] | 0) + $3 | 0 | 0, $2 + 12 | 0 | 0, $1 | 0) | 0;
   HEAP32[$4 >> 2] = $3 + $1 | 0;
  }
  __stack_pointer = $2 + 16 | 0;
  return 0 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17h7041ae904ed91c36E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN4core3fmt5Write10write_char17hc020ba426170fec3E(HEAP32[$0 >> 2] | 0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17hb8a44e47634e1102E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  $0 = HEAP32[$0 >> 2] | 0;
  HEAP32[($2 + 12 | 0) >> 2] = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if ($1 >>> 0 < 128 >>> 0) {
       break label$4
      }
      if ($1 >>> 0 < 2048 >>> 0) {
       break label$3
      }
      if ($1 >>> 0 >= 65536 >>> 0) {
       break label$2
      }
      HEAP8[($2 + 14 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
      HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 12 | 0 | 224 | 0;
      HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      $1 = 3;
      break label$1;
     }
     HEAP8[($2 + 12 | 0) >> 0] = $1;
     $1 = 1;
     break label$1;
    }
    HEAP8[($2 + 13 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
    HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 6 | 0 | 192 | 0;
    $1 = 2;
    break label$1;
   }
   HEAP8[($2 + 15 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
   HEAP8[($2 + 14 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 12 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 12 | 0) >> 0] = ($1 >>> 18 | 0) & 7 | 0 | 240 | 0;
   $1 = 4;
  }
  $1 = _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17h7a67e08803b4d09fE($0 | 0, $2 + 12 | 0 | 0, $1 | 0) | 0;
  __stack_pointer = $2 + 16 | 0;
  return $1 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17hf204ea9f008f8b6fE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN4core3fmt5Write10write_char17hbc66407203c004dcE(HEAP32[$0 >> 2] | 0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17h020a2471d8556426E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $14 = 0, $20 = 0, $23 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $14 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $14;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $20 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $20;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $23;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1048596 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17h02725885f278630bE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $14 = 0, $20 = 0, $23 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $14 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $14;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $20 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $20;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $23;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1048644 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17h67110dcf2b263466E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $14 = 0, $20 = 0, $23 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $14 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $14;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $20 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $20;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $23;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1048668 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17h8586c245f6d0e523E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $14 = 0, $20 = 0, $23 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $14 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $14;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $20 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $20;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $23;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1048620 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h21cada01fb43270aE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, i64toi32_i32$1 = 0, $5 = 0, $6 = 0, $4 = 0, $4$hi = 0;
  $3 = __stack_pointer - 16 | 0;
  __stack_pointer = $3;
  $0 = HEAP32[$0 >> 2] | 0;
  _ZN61_$LT$std__io__stdio__StdoutLock$u20$as$u20$std__io__Write$GT$9write_all17h6c125576457c7d8dE($3 + 8 | 0 | 0, HEAP32[$0 >> 2] | 0 | 0, $1 | 0, $2 | 0);
  label$1 : {
   $1 = HEAPU8[($3 + 8 | 0) >> 0] | 0;
   if (($1 | 0) == (4 | 0)) {
    break label$1
   }
   i64toi32_i32$1 = HEAP32[($3 + 12 | 0) >> 2] | 0;
   $4 = HEAP32[($3 + 8 | 0) >> 2] | 0;
   $4$hi = i64toi32_i32$1;
   label$2 : {
    if ((HEAPU8[($0 + 4 | 0) >> 0] | 0 | 0) != (3 | 0)) {
     break label$2
    }
    $2 = HEAP32[($0 + 8 | 0) >> 2] | 0;
    FUNCTION_TABLE[HEAP32[(HEAP32[($2 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$2 >> 2] | 0);
    label$3 : {
     $5 = HEAP32[($2 + 4 | 0) >> 2] | 0;
     $6 = HEAP32[($5 + 4 | 0) >> 2] | 0;
     if (!$6) {
      break label$3
     }
     __rust_dealloc(HEAP32[$2 >> 2] | 0 | 0, $6 | 0, HEAP32[($5 + 8 | 0) >> 2] | 0 | 0);
    }
    __rust_dealloc($2 | 0, 12 | 0, 4 | 0);
   }
   i64toi32_i32$1 = $4$hi;
   HEAP32[($0 + 4 | 0) >> 2] = $4;
   HEAP32[($0 + 8 | 0) >> 2] = i64toi32_i32$1;
  }
  __stack_pointer = $3 + 16 | 0;
  return ($1 | 0) != (4 | 0) | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h310bd2a462dd1dbbE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $4 = 0;
  label$1 : {
   $3 = HEAP32[$0 >> 2] | 0;
   $4 = $3 + 8 | 0;
   $0 = HEAP32[$4 >> 2] | 0;
   if (((HEAP32[($3 + 4 | 0) >> 2] | 0) - $0 | 0) >>> 0 >= $2 >>> 0) {
    break label$1
   }
   _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($3 | 0, $0 | 0, $2 | 0);
   $0 = HEAP32[$4 >> 2] | 0;
  }
  memcpy((HEAP32[$3 >> 2] | 0) + $0 | 0 | 0, $1 | 0, $2 | 0) | 0;
  HEAP32[$4 >> 2] = $0 + $2 | 0;
  return 0 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h53af1920c9c57bf6E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  return _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17h7a67e08803b4d09fE(HEAP32[$0 >> 2] | 0 | 0, $1 | 0, $2 | 0) | 0 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h62a8da3e2c64ef6bE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $4 = 0;
  label$1 : {
   $3 = HEAP32[(HEAP32[$0 >> 2] | 0) >> 2] | 0;
   $4 = $3 + 8 | 0;
   $0 = HEAP32[$4 >> 2] | 0;
   if (((HEAP32[($3 + 4 | 0) >> 2] | 0) - $0 | 0) >>> 0 >= $2 >>> 0) {
    break label$1
   }
   _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($3 | 0, $0 | 0, $2 | 0);
   $0 = HEAP32[$4 >> 2] | 0;
  }
  memcpy((HEAP32[$3 >> 2] | 0) + $0 | 0 | 0, $1 | 0, $2 | 0) | 0;
  HEAP32[$4 >> 2] = $0 + $2 | 0;
  return 0 | 0;
 }
 
 function _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17hf973c321f35703c9E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  label$1 : {
   $3 = $1 + 1 | 0;
   if ($3 >>> 0 < $1 >>> 0) {
    break label$1
   }
   $4 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   $1 = $4 << 1 | 0;
   $1 = $1 >>> 0 > $3 >>> 0 ? $1 : $3;
   $1 = $1 >>> 0 > 8 >>> 0 ? $1 : 8;
   label$2 : {
    label$3 : {
     if ($4) {
      break label$3
     }
     $3 = 0;
     break label$2;
    }
    HEAP32[($2 + 20 | 0) >> 2] = $4;
    HEAP32[($2 + 16 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
    $3 = 1;
   }
   HEAP32[($2 + 24 | 0) >> 2] = $3;
   _ZN5alloc7raw_vec11finish_grow17h9dddb2dce33dd0adE($2 | 0, $1 | 0, 1 | 0, $2 + 16 | 0 | 0);
   label$4 : {
    if (!(HEAP32[$2 >> 2] | 0)) {
     break label$4
    }
    $0 = HEAP32[($2 + 8 | 0) >> 2] | 0;
    if (!$0) {
     break label$1
    }
    _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(HEAP32[($2 + 4 | 0) >> 2] | 0 | 0, $0 | 0);
    abort();
   }
   $3 = HEAP32[($2 + 4 | 0) >> 2] | 0;
   HEAP32[($0 + 4 | 0) >> 2] = $1;
   HEAP32[$0 >> 2] = $3;
   __stack_pointer = $2 + 32 | 0;
   return;
  }
  _ZN5alloc7raw_vec17capacity_overflow17h1271517144c3fe0fE();
  abort();
 }
 
 function _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h347b97f7aa31dec8E($0) {
  $0 = $0 | 0;
  var $1 = 0;
  label$1 : {
   $1 = HEAP32[($0 + 16 | 0) >> 2] | 0;
   if (!$1) {
    break label$1
   }
   __rust_dealloc(HEAP32[($0 + 12 | 0) >> 2] | 0 | 0, $1 | 0, 1 | 0);
  }
  label$2 : {
   if (($0 | 0) == (-1 | 0)) {
    break label$2
   }
   $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   HEAP32[($0 + 4 | 0) >> 2] = $1 + -1 | 0;
   if (($1 | 0) != (1 | 0)) {
    break label$2
   }
   __rust_dealloc($0 | 0, 24 | 0, 4 | 0);
  }
 }
 
 function _ZN5alloc7raw_vec11finish_grow17h9dddb2dce33dd0adE($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, $5 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         if (!$2) {
          break label$7
         }
         $4 = 1;
         if (($1 | 0) < (0 | 0)) {
          break label$6
         }
         if (!(HEAP32[($3 + 8 | 0) >> 2] | 0)) {
          break label$4
         }
         $5 = HEAP32[($3 + 4 | 0) >> 2] | 0;
         if ($5) {
          break label$5
         }
         if ($1) {
          break label$3
         }
         $3 = $2;
         break label$2;
        }
        HEAP32[($0 + 4 | 0) >> 2] = $1;
        $4 = 1;
       }
       $1 = 0;
       break label$1;
      }
      $3 = __rust_realloc(HEAP32[$3 >> 2] | 0 | 0, $5 | 0, $2 | 0, $1 | 0) | 0;
      break label$2;
     }
     if ($1) {
      break label$3
     }
     $3 = $2;
     break label$2;
    }
    $3 = __rust_alloc($1 | 0, $2 | 0) | 0;
   }
   label$8 : {
    if (!$3) {
     break label$8
    }
    HEAP32[($0 + 4 | 0) >> 2] = $3;
    $4 = 0;
    break label$1;
   }
   HEAP32[($0 + 4 | 0) >> 2] = $1;
   $1 = $2;
  }
  HEAP32[$0 >> 2] = $4;
  HEAP32[($0 + 8 | 0) >> 2] = $1;
 }
 
 function _ZN60_$LT$alloc__string__String$u20$as$u20$core__fmt__Display$GT$3fmt17h47f5ab120110a9dbE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN42_$LT$str$u20$as$u20$core__fmt__Display$GT$3fmt17had6f7bdb177482f0E(HEAP32[$0 >> 2] | 0 | 0, HEAP32[($0 + 8 | 0) >> 2] | 0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN3std4sync4once4Once10call_inner17hc4ff5b7e565c20dfE($0, $1, $2, $3, $4) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  var $8 = 0, $7 = 0, $5 = 0, $9 = 0, $6 = 0;
  $5 = __stack_pointer - 32 | 0;
  __stack_pointer = $5;
  $6 = $5 + 8 | 0 | 2 | 0;
  $7 = HEAP32[$0 >> 2] | 0;
  label$1 : while (1) {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$8 : {
          label$9 : {
           label$10 : {
            label$11 : {
             label$12 : {
              label$13 : {
               switch ($7 | 0) {
               case 1:
                if (!$1) {
                 break label$12
                }
               case 0:
                $8 = HEAP32[$0 >> 2] | 0;
                $9 = ($8 | 0) == ($7 | 0);
                HEAP32[$0 >> 2] = $9 ? 2 : $8;
                if ($9) {
                 break label$11
                }
                $7 = $8;
                continue label$1;
               case 3:
                break label$10;
               default:
                break label$13;
               };
              }
              label$16 : {
               if (($7 & 3 | 0 | 0) != (2 | 0)) {
                break label$16
               }
               label$17 : while (1) {
                $9 = $7;
                if (HEAP32[(0 + 1059088 | 0) >> 2] | 0) {
                 break label$9
                }
                HEAP32[(0 + 1059088 | 0) >> 2] = -1;
                label$18 : {
                 $8 = HEAP32[(0 + 1059092 | 0) >> 2] | 0;
                 if ($8) {
                  break label$18
                 }
                 $8 = _ZN3std6thread6Thread3new17h0bfc28a566f6af69E(0 | 0, $7 | 0) | 0;
                 HEAP32[(0 + 1059092 | 0) >> 2] = $8;
                }
                $7 = HEAP32[$8 >> 2] | 0;
                HEAP32[$8 >> 2] = $7 + 1 | 0;
                if (($7 | 0) <= (-1 | 0)) {
                 break label$8
                }
                HEAP32[(0 + 1059088 | 0) >> 2] = (HEAP32[(0 + 1059088 | 0) >> 2] | 0) + 1 | 0;
                if (!$8) {
                 break label$7
                }
                $7 = HEAP32[$0 >> 2] | 0;
                HEAP32[$0 >> 2] = ($7 | 0) == ($9 | 0) ? $6 : $7;
                HEAP8[($5 + 16 | 0) >> 0] = 0;
                HEAP32[($5 + 8 | 0) >> 2] = $8;
                HEAP32[($5 + 12 | 0) >> 2] = $9 & -4 | 0;
                label$19 : {
                 if (($7 | 0) != ($9 | 0)) {
                  break label$19
                 }
                 if (!(HEAPU8[($5 + 16 | 0) >> 0] | 0)) {
                  break label$6
                 }
                 break label$3;
                }
                label$20 : {
                 $8 = HEAP32[($5 + 8 | 0) >> 2] | 0;
                 if (!$8) {
                  break label$20
                 }
                 $9 = HEAP32[$8 >> 2] | 0;
                 HEAP32[$8 >> 2] = $9 + -1 | 0;
                 if (($9 | 0) != (1 | 0)) {
                  break label$20
                 }
                 _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h66f7782f21192ee0E(HEAP32[($5 + 8 | 0) >> 2] | 0 | 0);
                }
                if (($7 & 3 | 0 | 0) == (2 | 0)) {
                 continue label$17
                }
                break label$2;
               };
              }
              _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1050800 | 0, 64 | 0, $4 | 0);
              abort();
             }
             HEAP32[($5 + 28 | 0) >> 2] = 0;
             HEAP32[($5 + 24 | 0) >> 2] = 1048692;
             HEAP32[($5 + 12 | 0) >> 2] = 1;
             HEAP32[($5 + 16 | 0) >> 2] = 0;
             HEAP32[($5 + 8 | 0) >> 2] = 1050908;
             _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($5 + 8 | 0 | 0, $4 | 0);
             abort();
            }
            HEAP8[($5 + 12 | 0) >> 0] = ($7 | 0) == (1 | 0);
            HEAP32[($5 + 8 | 0) >> 2] = 3;
            FUNCTION_TABLE[HEAP32[($3 + 16 | 0) >> 2] | 0 | 0]($2, $5 + 8 | 0);
            $7 = HEAP32[$0 >> 2] | 0;
            HEAP32[$0 >> 2] = HEAP32[($5 + 8 | 0) >> 2] | 0;
            $8 = $7 & 3 | 0;
            HEAP32[$5 >> 2] = $8;
            if (($8 | 0) != (2 | 0)) {
             break label$5
            }
            $8 = $7 + -2 | 0;
            if (!$8) {
             break label$10
            }
            label$21 : while (1) {
             $7 = HEAP32[$8 >> 2] | 0;
             HEAP32[$8 >> 2] = 0;
             if (!$7) {
              break label$4
             }
             $9 = HEAP32[($8 + 4 | 0) >> 2] | 0;
             HEAP8[($8 + 8 | 0) >> 0] = 1;
             _ZN3std10sys_common13thread_parker7generic6Parker6unpark17h855a23f912b8d417E($7 + 24 | 0 | 0);
             $8 = HEAP32[$7 >> 2] | 0;
             HEAP32[$7 >> 2] = $8 + -1 | 0;
             label$22 : {
              if (($8 | 0) != (1 | 0)) {
               break label$22
              }
              _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h66f7782f21192ee0E($7 | 0);
             }
             $8 = $9;
             if ($8) {
              continue label$21
             }
             break label$21;
            };
           }
           __stack_pointer = $5 + 32 | 0;
           return;
          }
          _ZN4core6result13unwrap_failed17hcf4dc3db6a31deeeE(1048692 | 0, 16 | 0, $5 | 0, 1048804 | 0, 1051220 | 0);
          abort();
         }
         abort();
        }
        _ZN4core6option13expect_failed17he17117bab9f5843eE(1049100 | 0, 94 | 0, 1049224 | 0);
        abort();
       }
       label$23 : while (1) {
        _ZN3std6thread4park17h22856e9a5e1abadbE();
        if (!(HEAPU8[($5 + 16 | 0) >> 0] | 0)) {
         continue label$23
        }
        break label$3;
       };
      }
      HEAP32[($5 + 8 | 0) >> 2] = 0;
      _ZN4core9panicking13assert_failed17h7f523d0a6f15dc08E($5 | 0, $5 + 8 | 0 | 0, 1050920 | 0);
      abort();
     }
     _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048759 | 0, 43 | 0, 1050936 | 0);
     abort();
    }
    $7 = HEAP32[($5 + 8 | 0) >> 2] | 0;
    if (!$7) {
     break label$2
    }
    $8 = HEAP32[$7 >> 2] | 0;
    HEAP32[$7 >> 2] = $8 + -1 | 0;
    if (($8 | 0) != (1 | 0)) {
     break label$2
    }
    _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h66f7782f21192ee0E(HEAP32[($5 + 8 | 0) >> 2] | 0 | 0);
    $7 = HEAP32[$0 >> 2] | 0;
    continue label$1;
   }
   $7 = HEAP32[$0 >> 2] | 0;
   continue label$1;
  };
 }
 
 function _ZN3std6thread6Thread3new17h0bfc28a566f6af69E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$2 = 0, i64toi32_i32$5 = 0, i64toi32_i32$0 = 0, i64toi32_i32$3 = 0, $3 = 0, i64toi32_i32$1 = 0, $4 = 0, $4$hi = 0, i64toi32_i32$4 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  label$1 : {
   label$2 : {
    $3 = __rust_alloc(32 | 0, 8 | 0) | 0;
    if (!$3) {
     break label$2
    }
    HEAP32[($3 + 16 | 0) >> 2] = $0;
    i64toi32_i32$1 = $3;
    i64toi32_i32$0 = 1;
    HEAP32[$3 >> 2] = 1;
    HEAP32[($3 + 4 | 0) >> 2] = i64toi32_i32$0;
    HEAP32[($3 + 20 | 0) >> 2] = $1;
    $0 = HEAPU8[(0 + 1059009 | 0) >> 0] | 0;
    HEAP8[(0 + 1059009 | 0) >> 0] = 1;
    HEAP8[($2 + 7 | 0) >> 0] = $0;
    if ($0) {
     break label$1
    }
    label$3 : {
     label$4 : {
      i64toi32_i32$2 = 0;
      i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 1058992 | 0) >> 2] | 0;
      i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 1058996 | 0) >> 2] | 0;
      $4 = i64toi32_i32$0;
      $4$hi = i64toi32_i32$1;
      i64toi32_i32$2 = i64toi32_i32$0;
      i64toi32_i32$0 = -1;
      i64toi32_i32$3 = -1;
      if ((i64toi32_i32$2 | 0) == (i64toi32_i32$3 | 0) & (i64toi32_i32$1 | 0) == (i64toi32_i32$0 | 0) | 0) {
       break label$4
      }
      i64toi32_i32$2 = $4$hi;
      i64toi32_i32$3 = $4;
      i64toi32_i32$1 = 0;
      i64toi32_i32$0 = 1;
      i64toi32_i32$4 = i64toi32_i32$3 + i64toi32_i32$0 | 0;
      i64toi32_i32$5 = i64toi32_i32$2 + i64toi32_i32$1 | 0;
      if (i64toi32_i32$4 >>> 0 < i64toi32_i32$0 >>> 0) {
       i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
      }
      i64toi32_i32$3 = 0;
      HEAP32[(i64toi32_i32$3 + 1058992 | 0) >> 2] = i64toi32_i32$4;
      HEAP32[(i64toi32_i32$3 + 1058996 | 0) >> 2] = i64toi32_i32$5;
      i64toi32_i32$5 = $4$hi;
      i64toi32_i32$2 = $4;
      i64toi32_i32$3 = 0;
      i64toi32_i32$0 = 0;
      if ((i64toi32_i32$2 | 0) != (i64toi32_i32$0 | 0) | (i64toi32_i32$5 | 0) != (i64toi32_i32$3 | 0) | 0) {
       break label$3
      }
      _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048759 | 0, 43 | 0, 1049320 | 0);
      abort();
     }
     HEAP8[(0 + 1059009 | 0) >> 0] = 0;
     HEAP32[($2 + 28 | 0) >> 2] = 0;
     HEAP32[($2 + 24 | 0) >> 2] = 1048692;
     i64toi32_i32$5 = $2;
     i64toi32_i32$2 = 0;
     HEAP32[($2 + 12 | 0) >> 2] = 1;
     HEAP32[($2 + 16 | 0) >> 2] = i64toi32_i32$2;
     HEAP32[($2 + 8 | 0) >> 2] = 1049296;
     _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($2 + 8 | 0 | 0, 1049304 | 0);
     abort();
    }
    i64toi32_i32$5 = $3;
    i64toi32_i32$2 = 0;
    HEAP32[(i64toi32_i32$5 + 24 | 0) >> 2] = 0;
    HEAP32[(i64toi32_i32$5 + 28 | 0) >> 2] = i64toi32_i32$2;
    i64toi32_i32$2 = $4$hi;
    HEAP32[(i64toi32_i32$5 + 8 | 0) >> 2] = $4;
    HEAP32[(i64toi32_i32$5 + 12 | 0) >> 2] = i64toi32_i32$2;
    HEAP8[(0 + 1059009 | 0) >> 0] = 0;
    __stack_pointer = $2 + 32 | 0;
    return i64toi32_i32$5 | 0;
   }
   _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(32 | 0, 8 | 0);
   abort();
  }
  HEAP32[(($2 + 8 | 0) + 20 | 0) >> 2] = 0;
  HEAP32[($2 + 24 | 0) >> 2] = 1048692;
  i64toi32_i32$5 = $2;
  i64toi32_i32$2 = 0;
  HEAP32[($2 + 12 | 0) >> 2] = 1;
  HEAP32[($2 + 16 | 0) >> 2] = i64toi32_i32$2;
  HEAP32[($2 + 8 | 0) >> 2] = 1052180;
  _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($2 + 7 | 0 | 0, $2 + 8 | 0 | 0);
  abort();
 }
 
 function _ZN3std2io5Write9write_fmt17hdb49789eaf08346bE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var i64toi32_i32$2 = 0, $3 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $16 = 0, $15 = 0, $21 = 0, $24 = 0, $34 = 0, $37 = 0, $40 = 0;
  $3 = __stack_pointer - 48 | 0;
  __stack_pointer = $3;
  HEAP8[($3 + 12 | 0) >> 0] = 4;
  HEAP32[($3 + 8 | 0) >> 2] = $1;
  i64toi32_i32$2 = $2 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $15 = i64toi32_i32$0;
  i64toi32_i32$0 = ($3 + 24 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $15;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $2 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $21 = i64toi32_i32$1;
  i64toi32_i32$1 = ($3 + 24 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $21;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $2;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $24 = i64toi32_i32$0;
  i64toi32_i32$0 = $3;
  HEAP32[($3 + 24 | 0) >> 2] = $24;
  HEAP32[($3 + 28 | 0) >> 2] = i64toi32_i32$1;
  label$1 : {
   label$2 : {
    if (!(_ZN4core3fmt5write17h6461900980c16fcdE($3 + 8 | 0 | 0, 1050656 | 0, $3 + 24 | 0 | 0) | 0)) {
     break label$2
    }
    label$3 : {
     if ((HEAPU8[($3 + 12 | 0) >> 0] | 0 | 0) != (4 | 0)) {
      break label$3
     }
     $34 = $0;
     i64toi32_i32$1 = 0;
     i64toi32_i32$2 = 1050596;
     i64toi32_i32$0 = 0;
     i64toi32_i32$3 = 32;
     i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
     if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
      i64toi32_i32$0 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
      $16 = 0;
     } else {
      i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
      $16 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
     }
     i64toi32_i32$1 = $16;
     i64toi32_i32$2 = 0;
     i64toi32_i32$3 = 2;
     i64toi32_i32$2 = i64toi32_i32$0 | i64toi32_i32$2 | 0;
     $37 = i64toi32_i32$1 | i64toi32_i32$3 | 0;
     i64toi32_i32$1 = $34;
     HEAP32[i64toi32_i32$1 >> 2] = $37;
     HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$2;
     break label$1;
    }
    i64toi32_i32$0 = $3;
    i64toi32_i32$2 = HEAP32[($3 + 12 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($3 + 16 | 0) >> 2] | 0;
    $40 = i64toi32_i32$2;
    i64toi32_i32$2 = $0;
    HEAP32[i64toi32_i32$2 >> 2] = $40;
    HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] = i64toi32_i32$1;
    break label$1;
   }
   HEAP8[$0 >> 0] = 4;
   if ((HEAPU8[($3 + 12 | 0) >> 0] | 0 | 0) != (3 | 0)) {
    break label$1
   }
   $2 = HEAP32[($3 + 16 | 0) >> 2] | 0;
   FUNCTION_TABLE[HEAP32[(HEAP32[($2 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$2 >> 2] | 0);
   label$4 : {
    $1 = HEAP32[($2 + 4 | 0) >> 2] | 0;
    $0 = HEAP32[($1 + 4 | 0) >> 2] | 0;
    if (!$0) {
     break label$4
    }
    __rust_dealloc(HEAP32[$2 >> 2] | 0 | 0, $0 | 0, HEAP32[($1 + 8 | 0) >> 2] | 0 | 0);
   }
   __rust_dealloc(HEAP32[($3 + 16 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
  }
  __stack_pointer = $3 + 48 | 0;
 }
 
 function _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE() {
  abort();
  abort();
 }
 
 function _ZN3std10sys_common13thread_parker7generic6Parker6unpark17h855a23f912b8d417E($0) {
  $0 = $0 | 0;
  var $1 = 0, $2 = 0, i64toi32_i32$0 = 0;
  $1 = __stack_pointer - 32 | 0;
  __stack_pointer = $1;
  $2 = HEAP32[$0 >> 2] | 0;
  HEAP32[$0 >> 2] = 2;
  label$1 : {
   label$2 : {
    switch ($2 | 0) {
    default:
     HEAP32[($1 + 28 | 0) >> 2] = 0;
     HEAP32[($1 + 24 | 0) >> 2] = 1048692;
     i64toi32_i32$0 = 0;
     HEAP32[($1 + 12 | 0) >> 2] = 1;
     HEAP32[($1 + 16 | 0) >> 2] = i64toi32_i32$0;
     HEAP32[($1 + 8 | 0) >> 2] = 1052624;
     _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($1 + 8 | 0 | 0, 1052632 | 0);
     abort();
    case 1:
     $2 = HEAPU8[($0 + 4 | 0) >> 0] | 0;
     HEAP8[($0 + 4 | 0) >> 0] = 1;
     $2 = $2 & 1 | 0;
     HEAP8[($1 + 7 | 0) >> 0] = $2;
     if ($2) {
      break label$1
     }
     $0 = $0 + 4 | 0;
     $2 = 0;
     label$5 : {
      label$6 : {
       label$7 : {
        label$8 : {
         label$9 : {
          if (!((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0)) {
           break label$9
          }
          $2 = _ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0;
          if (!(HEAPU8[($0 + 1 | 0) >> 0] | 0)) {
           break label$7
          }
          $2 = $2 ^ 1 | 0;
          break label$8;
         }
         if (!(HEAPU8[($0 + 1 | 0) >> 0] | 0)) {
          break label$6
         }
        }
        HEAP8[($1 + 12 | 0) >> 0] = $2;
        HEAP32[($1 + 8 | 0) >> 2] = $0;
        _ZN4core6result13unwrap_failed17hcf4dc3db6a31deeeE(1048820 | 0, 43 | 0, $1 + 8 | 0 | 0, 1048880 | 0, 1052648 | 0);
        abort();
       }
       if (!$2) {
        break label$5
       }
      }
      if (!((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0)) {
       break label$5
      }
      if (_ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0) {
       break label$5
      }
      HEAP8[($0 + 1 | 0) >> 0] = 1;
     }
     HEAP8[$0 >> 0] = 0;
     break;
    case 0:
    case 2:
     break label$2;
    };
   }
   __stack_pointer = $1 + 32 | 0;
   return;
  }
  HEAP32[($1 + 28 | 0) >> 2] = 0;
  HEAP32[($1 + 24 | 0) >> 2] = 1048692;
  i64toi32_i32$0 = 0;
  HEAP32[($1 + 12 | 0) >> 2] = 1;
  HEAP32[($1 + 16 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($1 + 8 | 0) >> 2] = 1052180;
  _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($1 + 7 | 0 | 0, $1 + 8 | 0 | 0);
  abort();
 }
 
 function _ZN3std6thread4park17h22856e9a5e1abadbE() {
  var $0 = 0, $2 = 0, $1 = 0, $3 = 0, i64toi32_i32$0 = 0, $4 = 0, $5 = 0, $29 = 0;
  $0 = __stack_pointer - 32 | 0;
  __stack_pointer = $0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$8 : {
          if (HEAP32[(0 + 1059088 | 0) >> 2] | 0) {
           break label$8
          }
          HEAP32[(0 + 1059088 | 0) >> 2] = -1;
          label$9 : {
           $1 = HEAP32[(0 + 1059092 | 0) >> 2] | 0;
           if ($1) {
            break label$9
           }
           $1 = _ZN3std6thread6Thread3new17h0bfc28a566f6af69E(0 | 0, $1 | 0) | 0;
           HEAP32[(0 + 1059092 | 0) >> 2] = $1;
          }
          $2 = HEAP32[$1 >> 2] | 0;
          HEAP32[$1 >> 2] = $2 + 1 | 0;
          if (($2 | 0) <= (-1 | 0)) {
           break label$7
          }
          HEAP32[(0 + 1059088 | 0) >> 2] = (HEAP32[(0 + 1059088 | 0) >> 2] | 0) + 1 | 0;
          if (!$1) {
           break label$6
          }
          $2 = HEAP32[($1 + 24 | 0) >> 2] | 0;
          $29 = $2;
          $2 = ($2 | 0) == (2 | 0);
          HEAP32[($1 + 24 | 0) >> 2] = $2 ? 0 : $29;
          label$10 : {
           if ($2) {
            break label$10
           }
           $2 = $1 + 24 | 0;
           $3 = HEAPU8[($2 + 4 | 0) >> 0] | 0;
           HEAP8[($2 + 4 | 0) >> 0] = 1;
           $3 = $3 & 1 | 0;
           HEAP8[($0 + 4 | 0) >> 0] = $3;
           if ($3) {
            break label$5
           }
           $4 = $2 + 4 | 0;
           $5 = 0;
           label$11 : {
            if (!((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0)) {
             break label$11
            }
            $5 = (_ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0) ^ 1 | 0;
           }
           if (HEAPU8[($4 + 1 | 0) >> 0] | 0) {
            break label$4
           }
           $3 = HEAP32[$2 >> 2] | 0;
           HEAP32[$2 >> 2] = $3 ? $3 : 1;
           if (!$3) {
            break label$1
           }
           if (($3 | 0) != (2 | 0)) {
            break label$3
           }
           $3 = HEAP32[$2 >> 2] | 0;
           HEAP32[$2 >> 2] = 0;
           HEAP32[($0 + 4 | 0) >> 2] = $3;
           if (($3 | 0) != (2 | 0)) {
            break label$2
           }
           label$12 : {
            if ($5) {
             break label$12
            }
            if (!((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0)) {
             break label$12
            }
            if (_ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0) {
             break label$12
            }
            HEAP8[($4 + 1 | 0) >> 0] = 1;
           }
           HEAP8[$4 >> 0] = 0;
          }
          $2 = HEAP32[$1 >> 2] | 0;
          HEAP32[$1 >> 2] = $2 + -1 | 0;
          label$13 : {
           if (($2 | 0) != (1 | 0)) {
            break label$13
           }
           _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h66f7782f21192ee0E($1 | 0);
          }
          __stack_pointer = $0 + 32 | 0;
          return;
         }
         _ZN4core6result13unwrap_failed17hcf4dc3db6a31deeeE(1048692 | 0, 16 | 0, $0 + 8 | 0 | 0, 1048804 | 0, 1051220 | 0);
         abort();
        }
        abort();
       }
       _ZN4core6option13expect_failed17he17117bab9f5843eE(1049100 | 0, 94 | 0, 1049224 | 0);
       abort();
      }
      HEAP32[($0 + 28 | 0) >> 2] = 0;
      HEAP32[($0 + 24 | 0) >> 2] = 1048692;
      i64toi32_i32$0 = 0;
      HEAP32[($0 + 12 | 0) >> 2] = 1;
      HEAP32[($0 + 16 | 0) >> 2] = i64toi32_i32$0;
      HEAP32[($0 + 8 | 0) >> 2] = 1052180;
      _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($0 + 4 | 0 | 0, $0 + 8 | 0 | 0);
      abort();
     }
     HEAP8[($0 + 12 | 0) >> 0] = $5;
     HEAP32[($0 + 8 | 0) >> 2] = $4;
     _ZN4core6result13unwrap_failed17hcf4dc3db6a31deeeE(1048820 | 0, 43 | 0, $0 + 8 | 0 | 0, 1048880 | 0, 1052476 | 0);
     abort();
    }
    HEAP32[($0 + 28 | 0) >> 2] = 0;
    HEAP32[($0 + 24 | 0) >> 2] = 1048692;
    i64toi32_i32$0 = 0;
    HEAP32[($0 + 12 | 0) >> 2] = 1;
    HEAP32[($0 + 16 | 0) >> 2] = i64toi32_i32$0;
    HEAP32[($0 + 8 | 0) >> 2] = 1052516;
    _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($0 + 8 | 0 | 0, 1052524 | 0);
    abort();
   }
   HEAP32[($0 + 28 | 0) >> 2] = 0;
   HEAP32[($0 + 24 | 0) >> 2] = 1048692;
   i64toi32_i32$0 = 0;
   HEAP32[($0 + 12 | 0) >> 2] = 1;
   HEAP32[($0 + 16 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($0 + 8 | 0) >> 2] = 1052572;
   _ZN4core9panicking13assert_failed17h7f523d0a6f15dc08E($0 + 4 | 0 | 0, $0 + 8 | 0 | 0, 1052580 | 0);
   abort();
  }
  HEAP32[($0 + 28 | 0) >> 2] = 0;
  HEAP32[($0 + 24 | 0) >> 2] = 1048692;
  i64toi32_i32$0 = 0;
  HEAP32[($0 + 12 | 0) >> 2] = 1;
  HEAP32[($0 + 16 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($0 + 8 | 0) >> 2] = 1052068;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($0 + 8 | 0 | 0, 1052132 | 0);
  abort();
 }
 
 function _ZN3std3env11current_dir17h34aa826b63dc649bE($0) {
  $0 = $0 | 0;
  var $1 = 0, $2 = 0, $3 = 0, $4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $5 = 0, $76 = 0;
  $1 = __stack_pointer - 32 | 0;
  __stack_pointer = $1;
  $2 = 512;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      $3 = __rust_alloc(512 | 0, 1 | 0) | 0;
      if (!$3) {
       break label$4
      }
      HEAP32[($1 + 20 | 0) >> 2] = 512;
      HEAP32[($1 + 16 | 0) >> 2] = $3;
      if (getcwd($3 | 0, 512 | 0) | 0) {
       break label$3
      }
      label$5 : {
       label$6 : {
        label$7 : {
         $2 = HEAP32[(0 + 1059596 | 0) >> 2] | 0;
         if (($2 | 0) != (68 | 0)) {
          break label$7
         }
         $2 = 512;
         break label$6;
        }
        i64toi32_i32$1 = $0;
        i64toi32_i32$0 = 0;
        HEAP32[$0 >> 2] = 1;
        HEAP32[($0 + 4 | 0) >> 2] = i64toi32_i32$0;
        HEAP32[($0 + 8 | 0) >> 2] = $2;
        $2 = 512;
        break label$5;
       }
       label$8 : while (1) {
        HEAP32[($1 + 24 | 0) >> 2] = $2;
        _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($1 + 16 | 0 | 0, $2 | 0, 1 | 0);
        $3 = HEAP32[($1 + 16 | 0) >> 2] | 0;
        $2 = HEAP32[($1 + 20 | 0) >> 2] | 0;
        if (getcwd($3 | 0, $2 | 0) | 0) {
         break label$3
        }
        $4 = HEAP32[(0 + 1059596 | 0) >> 2] | 0;
        if (($4 | 0) == (68 | 0)) {
         continue label$8
        }
        break label$8;
       };
       i64toi32_i32$1 = $0;
       i64toi32_i32$0 = 0;
       HEAP32[$0 >> 2] = 1;
       HEAP32[($0 + 4 | 0) >> 2] = i64toi32_i32$0;
       HEAP32[($0 + 8 | 0) >> 2] = $4;
       if (!$2) {
        break label$2
       }
      }
      __rust_dealloc($3 | 0, $2 | 0, 1 | 0);
      break label$2;
     }
     _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(512 | 0, 1 | 0);
     abort();
    }
    _ZN4core3ffi5c_str4CStr29from_bytes_with_nul_unchecked7rt_impl17hf4dd9bf93c6afe10E($1 + 8 | 0 | 0, $3 | 0, (strlen($3 | 0) | 0) + 1 | 0 | 0);
    $4 = (HEAP32[($1 + 12 | 0) >> 2] | 0) + -1 | 0;
    HEAP32[($1 + 24 | 0) >> 2] = $4;
    label$9 : {
     if ($2 >>> 0 <= $4 >>> 0) {
      break label$9
     }
     label$10 : {
      label$11 : {
       if ($4) {
        break label$11
       }
       $5 = 1;
       __rust_dealloc($3 | 0, $2 | 0, 1 | 0);
       break label$10;
      }
      $5 = __rust_realloc($3 | 0, $2 | 0, 1 | 0, $4 | 0) | 0;
      if (!$5) {
       break label$1
      }
     }
     HEAP32[($1 + 20 | 0) >> 2] = $4;
     HEAP32[($1 + 16 | 0) >> 2] = $5;
    }
    i64toi32_i32$0 = HEAP32[($1 + 16 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($1 + 20 | 0) >> 2] | 0;
    $76 = i64toi32_i32$0;
    i64toi32_i32$0 = $0;
    HEAP32[($0 + 4 | 0) >> 2] = $76;
    HEAP32[($0 + 8 | 0) >> 2] = i64toi32_i32$1;
    HEAP32[$0 >> 2] = 0;
    HEAP32[($0 + 12 | 0) >> 2] = HEAP32[($1 + 24 | 0) >> 2] | 0;
   }
   __stack_pointer = $1 + 32 | 0;
   return;
  }
  _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E($4 | 0, 1 | 0);
  abort();
 }
 
 function _ZN3std3env7_var_os17h3ba0d27289ea0b86E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $5 = 0, $4 = 0, $6 = 0;
  $3 = __stack_pointer - 48 | 0;
  __stack_pointer = $3;
  _ZN72_$LT$$RF$str$u20$as$u20$alloc__ffi__c_str__CString__new__SpecNewImpl$GT$13spec_new_impl17hffaa9687d9263c37E($3 + 24 | 0 | 0, $1 | 0, $2 | 0);
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if (!(HEAP32[($3 + 24 | 0) >> 2] | 0)) {
       break label$4
      }
      label$5 : {
       $1 = HEAP32[($3 + 36 | 0) >> 2] | 0;
       if (!$1) {
        break label$5
       }
       __rust_dealloc(HEAP32[($3 + 32 | 0) >> 2] | 0 | 0, $1 | 0, 1 | 0);
      }
      HEAP32[$0 >> 2] = 0;
      break label$3;
     }
     $2 = HEAP32[($3 + 28 | 0) >> 2] | 0;
     $4 = HEAP32[($3 + 32 | 0) >> 2] | 0;
     _ZN4core3ffi5c_str4CStr29from_bytes_with_nul_unchecked7rt_impl17hf4dd9bf93c6afe10E($3 + 16 | 0 | 0, $2 | 0, $4 | 0);
     label$6 : {
      label$7 : {
       $1 = getenv(HEAP32[($3 + 16 | 0) >> 2] | 0 | 0) | 0;
       if (!$1) {
        break label$7
       }
       $5 = 1;
       _ZN4core3ffi5c_str4CStr29from_bytes_with_nul_unchecked7rt_impl17hf4dd9bf93c6afe10E($3 + 8 | 0 | 0, $1 | 0, (strlen($1 | 0) | 0) + 1 | 0 | 0);
       $6 = HEAP32[($3 + 8 | 0) >> 2] | 0;
       label$8 : {
        $1 = (HEAP32[($3 + 12 | 0) >> 2] | 0) + -1 | 0;
        if (!$1) {
         break label$8
        }
        if (($1 | 0) < (0 | 0)) {
         break label$2
        }
        $5 = __rust_alloc($1 | 0, 1 | 0) | 0;
        if (!$5) {
         break label$1
        }
       }
       $5 = memcpy($5 | 0, $6 | 0, $1 | 0) | 0;
       HEAP32[($0 + 8 | 0) >> 2] = $1;
       HEAP32[($0 + 4 | 0) >> 2] = $1;
       HEAP32[$0 >> 2] = $5;
       break label$6;
      }
      HEAP32[$0 >> 2] = 0;
     }
     HEAP8[$2 >> 0] = 0;
     if (!$4) {
      break label$3
     }
     __rust_dealloc($2 | 0, $4 | 0, 1 | 0);
    }
    __stack_pointer = $3 + 48 | 0;
    return;
   }
   _ZN5alloc7raw_vec17capacity_overflow17h1271517144c3fe0fE();
   abort();
  }
  _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E($1 | 0, 1 | 0);
  abort();
 }
 
 function _ZN60_$LT$std__io__error__Error$u20$as$u20$core__fmt__Display$GT$3fmt17h35fdc6f9e4be55a0E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0;
  $2 = __stack_pointer - 64 | 0;
  __stack_pointer = $2;
  label$1 : {
   label$2 : {
    switch (HEAPU8[$0 >> 0] | 0 | 0) {
    default:
     $0 = HEAP32[($0 + 4 | 0) >> 2] | 0;
     HEAP32[($2 + 4 | 0) >> 2] = $0;
     _ZN3std3sys4wasi2os12error_string17h35f8ed3ff8367537E($2 + 8 | 0 | 0, $0 | 0);
     HEAP32[($2 + 60 | 0) >> 2] = 2;
     HEAP32[($2 + 36 | 0) >> 2] = 1;
     i64toi32_i32$0 = 0;
     HEAP32[($2 + 44 | 0) >> 2] = 3;
     HEAP32[($2 + 48 | 0) >> 2] = i64toi32_i32$0;
     HEAP32[($2 + 40 | 0) >> 2] = 1050292;
     HEAP32[($2 + 28 | 0) >> 2] = 2;
     HEAP32[($2 + 56 | 0) >> 2] = $2 + 24 | 0;
     HEAP32[($2 + 32 | 0) >> 2] = $2 + 4 | 0;
     HEAP32[($2 + 24 | 0) >> 2] = $2 + 8 | 0;
     $0 = _ZN4core3fmt9Formatter9write_fmt17h32544406667db88aE($1 | 0, $2 + 40 | 0 | 0) | 0;
     $1 = HEAP32[($2 + 12 | 0) >> 2] | 0;
     if (!$1) {
      break label$1
     }
     __rust_dealloc(HEAP32[($2 + 8 | 0) >> 2] | 0 | 0, $1 | 0, 1 | 0);
     break label$1;
    case 1:
     $0 = HEAPU8[($0 + 1 | 0) >> 0] | 0;
     HEAP32[($2 + 60 | 0) >> 2] = 1;
     i64toi32_i32$0 = 0;
     HEAP32[($2 + 44 | 0) >> 2] = 1;
     HEAP32[($2 + 48 | 0) >> 2] = i64toi32_i32$0;
     HEAP32[($2 + 40 | 0) >> 2] = 1049352;
     HEAP32[($2 + 12 | 0) >> 2] = 3;
     $0 = (($0 ^ 32 | 0) & 63 | 0) << 2 | 0;
     HEAP32[($2 + 28 | 0) >> 2] = HEAP32[($0 + 1052664 | 0) >> 2] | 0;
     HEAP32[($2 + 24 | 0) >> 2] = HEAP32[($0 + 1052920 | 0) >> 2] | 0;
     HEAP32[($2 + 56 | 0) >> 2] = $2 + 8 | 0;
     HEAP32[($2 + 8 | 0) >> 2] = $2 + 24 | 0;
     $0 = _ZN4core3fmt9Formatter9write_fmt17h32544406667db88aE($1 | 0, $2 + 40 | 0 | 0) | 0;
     break label$1;
    case 2:
     $0 = HEAP32[($0 + 4 | 0) >> 2] | 0;
     $0 = _ZN42_$LT$str$u20$as$u20$core__fmt__Display$GT$3fmt17had6f7bdb177482f0E(HEAP32[$0 >> 2] | 0 | 0, HEAP32[($0 + 4 | 0) >> 2] | 0 | 0, $1 | 0) | 0;
     break label$1;
    case 3:
     break label$2;
    };
   }
   $0 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   $0 = FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 4 | 0) >> 2] | 0) + 16 | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0, $1) | 0;
  }
  __stack_pointer = $2 + 64 | 0;
  return $0 | 0;
 }
 
 function _ZN3std3sys4wasi17decode_error_kind17h3d93ab073700757fE($0) {
  $0 = $0 | 0;
  var $1 = 0;
  $1 = 40;
  label$1 : {
   if ($0 >>> 0 > 65535 >>> 0) {
    break label$1
   }
   $1 = 2;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052390 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 3;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052392 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 1;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052394 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052396 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 11;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052398 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 7;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052400 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 6;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052402 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 9;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052404 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 8;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052406 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 0;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052408 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 35;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052410 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 20;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052412 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 22;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052414 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 12;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052416 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 13;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052418 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = 36;
   if (((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052420 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0)) {
    break label$1
   }
   $1 = ((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052422 | 0) | 0) & 65535 | 0 | 0) == ($0 | 0) ? 38 : 40;
  }
  return $1 | 0;
 }
 
 function _ZN3std2io8buffered9bufwriter18BufWriter$LT$W$GT$9flush_buf17h466876de6c17a96cE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $5 = 0, $3 = 0, $2 = 0, $6 = 0, i64toi32_i32$2 = 0, $8 = 0, i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $9 = 0, i64toi32_i32$1 = 0, $4 = 0, $7 = 0, $17 = 0, $68 = 0, $71 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  label$1 : {
   label$2 : {
    label$3 : {
     $3 = HEAP32[($1 + 8 | 0) >> 2] | 0;
     if ($3) {
      break label$3
     }
     HEAP8[$0 >> 0] = 4;
     break label$2;
    }
    $4 = HEAP32[$1 >> 2] | 0;
    $5 = 0;
    label$4 : while (1) {
     label$5 : {
      label$6 : {
       label$7 : {
        if ($3 >>> 0 < $5 >>> 0) {
         break label$7
        }
        $6 = $3 - $5 | 0;
        HEAP32[($2 + 12 | 0) >> 2] = $6;
        $7 = $4 + $5 | 0;
        HEAP32[($2 + 8 | 0) >> 2] = $7;
        _ZN4wasi13lib_generated8fd_write17h5efa9dd89fd18687E($2 + 16 | 0 | 0, 1 | 0, $2 + 8 | 0 | 0, 1 | 0);
        label$8 : {
         label$9 : {
          label$10 : {
           label$11 : {
            if (HEAPU16[($2 + 16 | 0) >> 1] | 0) {
             break label$11
            }
            $8 = HEAP32[($2 + 20 | 0) >> 2] | 0;
            break label$10;
           }
           HEAP16[($2 + 30 | 0) >> 1] = HEAPU16[($2 + 18 | 0) >> 1] | 0;
           $8 = $6;
           $9 = (_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E($2 + 30 | 0 | 0) | 0) & 65535 | 0;
           if (($9 | 0) != ((_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052388 | 0) | 0) & 65535 | 0 | 0)) {
            break label$9
           }
          }
          HEAP8[($1 + 12 | 0) >> 0] = 0;
          if (!$8) {
           break label$8
          }
          $5 = $8 + $5 | 0;
          break label$5;
         }
         HEAP8[($1 + 12 | 0) >> 0] = 0;
         if (((_ZN3std3sys4wasi17decode_error_kind17h3d93ab073700757fE($9 | 0) | 0) & 255 | 0 | 0) == (35 | 0)) {
          break label$5
         }
         HEAP32[$0 >> 2] = 0;
         HEAP32[($0 + 4 | 0) >> 2] = $9;
         break label$6;
        }
        $68 = $0;
        i64toi32_i32$0 = 0;
        i64toi32_i32$2 = 1049396;
        i64toi32_i32$1 = 0;
        i64toi32_i32$3 = 32;
        i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
         i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
         $17 = 0;
        } else {
         i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
         $17 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
        }
        i64toi32_i32$0 = $17;
        i64toi32_i32$2 = 0;
        i64toi32_i32$3 = 2;
        i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
        $71 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
        i64toi32_i32$0 = $68;
        HEAP32[i64toi32_i32$0 >> 2] = $71;
        HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$2;
        break label$6;
       }
       _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($5 | 0, $3 | 0, 1049448 | 0);
       abort();
      }
      if (!$5) {
       break label$2
      }
      $5 = $1 + 8 | 0;
      HEAP32[$5 >> 2] = 0;
      if (!$6) {
       break label$2
      }
      memmove($4 | 0, $7 | 0, $6 | 0) | 0;
      HEAP32[$5 >> 2] = $6;
      break label$2;
     }
     if ($3 >>> 0 > $5 >>> 0) {
      continue label$4
     }
     break label$4;
    };
    HEAP8[$0 >> 0] = 4;
    if (!$5) {
     break label$2
    }
    if ($3 >>> 0 < $5 >>> 0) {
     break label$1
    }
    $8 = $1 + 8 | 0;
    HEAP32[$8 >> 2] = 0;
    $3 = $3 - $5 | 0;
    if (!$3) {
     break label$2
    }
    $6 = HEAP32[$1 >> 2] | 0;
    memmove($6 | 0, $6 + $5 | 0 | 0, $3 | 0) | 0;
    HEAP32[$8 >> 2] = $3;
   }
   __stack_pointer = $2 + 32 | 0;
   return;
  }
  _ZN4core5slice5index24slice_end_index_len_fail17h27705fedb298ed88E($5 | 0, $3 | 0, 1049044 | 0);
  abort();
 }
 
 function _ZN3std2io8buffered9bufwriter18BufWriter$LT$W$GT$14write_all_cold17ha85053bb707b554aE($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $5 = 0, $6 = 0, $6$hi = 0, $39 = 0, $63 = 0;
  $4 = __stack_pointer - 16 | 0;
  __stack_pointer = $4;
  label$1 : {
   label$2 : {
    $5 = $1 + 4 | 0;
    if (((HEAP32[$5 >> 2] | 0) - (HEAP32[($1 + 8 | 0) >> 2] | 0) | 0) >>> 0 >= $3 >>> 0) {
     break label$2
    }
    _ZN3std2io8buffered9bufwriter18BufWriter$LT$W$GT$9flush_buf17h466876de6c17a96cE($4 + 8 | 0 | 0, $1 | 0);
    if ((HEAPU8[($4 + 8 | 0) >> 0] | 0 | 0) == (4 | 0)) {
     break label$2
    }
    i64toi32_i32$0 = HEAP32[($4 + 8 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($4 + 12 | 0) >> 2] | 0;
    $6 = i64toi32_i32$0;
    $6$hi = i64toi32_i32$1;
    if ((i64toi32_i32$0 & 255 | 0 | 0) == (4 | 0)) {
     break label$2
    }
    i64toi32_i32$1 = $6$hi;
    i64toi32_i32$0 = $0;
    HEAP32[i64toi32_i32$0 >> 2] = $6;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    break label$1;
   }
   label$3 : {
    if ((HEAP32[$5 >> 2] | 0) >>> 0 <= $3 >>> 0) {
     break label$3
    }
    $39 = HEAP32[$1 >> 2] | 0;
    $1 = $1 + 8 | 0;
    $5 = HEAP32[$1 >> 2] | 0;
    memcpy($39 + $5 | 0 | 0, $2 | 0, $3 | 0) | 0;
    HEAP8[$0 >> 0] = 4;
    HEAP32[$1 >> 2] = $5 + $3 | 0;
    break label$1;
   }
   HEAP8[($1 + 12 | 0) >> 0] = 1;
   _ZN60_$LT$std__io__stdio__StdoutRaw$u20$as$u20$std__io__Write$GT$9write_all17h3c58ff14f607126aE($4 + 8 | 0 | 0, $1 | 0, $2 | 0, $3 | 0);
   HEAP8[($1 + 12 | 0) >> 0] = 0;
   i64toi32_i32$1 = HEAP32[($4 + 8 | 0) >> 2] | 0;
   i64toi32_i32$0 = HEAP32[($4 + 12 | 0) >> 2] | 0;
   $63 = i64toi32_i32$1;
   i64toi32_i32$1 = $0;
   HEAP32[i64toi32_i32$1 >> 2] = $63;
   HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  }
  __stack_pointer = $4 + 16 | 0;
 }
 
 function _ZN60_$LT$std__io__stdio__StdoutRaw$u20$as$u20$std__io__Write$GT$9write_all17h3c58ff14f607126aE($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var i64toi32_i32$0 = 0, $4 = 0, $7 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$4 = 0, $5$hi = 0, i64toi32_i32$3 = 0, $5 = 0, $6 = 0, $17 = 0, $58 = 0, $61$hi = 0, $63 = 0;
  $4 = __stack_pointer - 32 | 0;
  __stack_pointer = $4;
  i64toi32_i32$0 = 0;
  $5 = 4;
  $5$hi = i64toi32_i32$0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       if (!$3) {
        break label$5
       }
       label$6 : while (1) {
        HEAP32[($4 + 12 | 0) >> 2] = $3;
        HEAP32[($4 + 8 | 0) >> 2] = $2;
        _ZN4wasi13lib_generated8fd_write17h5efa9dd89fd18687E($4 + 16 | 0 | 0, 1 | 0, $4 + 8 | 0 | 0, 1 | 0);
        label$7 : {
         label$8 : {
          label$9 : {
           $6 = HEAPU16[($4 + 16 | 0) >> 1] | 0;
           if ($6) {
            break label$9
           }
           $7 = HEAP32[($4 + 20 | 0) >> 2] | 0;
           if ($7) {
            break label$8
           }
           $7 = 1050344;
           i64toi32_i32$0 = 0;
           $5 = 2;
           $5$hi = i64toi32_i32$0;
           break label$3;
          }
          HEAP16[($4 + 30 | 0) >> 1] = HEAPU16[($4 + 18 | 0) >> 1] | 0;
          $7 = (_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E($4 + 30 | 0 | 0) | 0) & 65535 | 0;
          if (((_ZN3std3sys4wasi17decode_error_kind17h3d93ab073700757fE($7 | 0) | 0) & 255 | 0 | 0) == (35 | 0)) {
           break label$7
          }
          i64toi32_i32$0 = 0;
          $5 = 0;
          $5$hi = i64toi32_i32$0;
          break label$3;
         }
         if ($3 >>> 0 < $7 >>> 0) {
          break label$4
         }
         $2 = $2 + $7 | 0;
         $3 = $3 - $7 | 0;
        }
        if ($3) {
         continue label$6
        }
        break label$6;
       };
      }
      break label$2;
     }
     _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($7 | 0, $3 | 0, 1050564 | 0);
     abort();
    }
    $3 = _ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E(1052388 | 0) | 0;
    if (!$6) {
     break label$2
    }
    if (($7 | 0) != ($3 & 65535 | 0 | 0)) {
     break label$2
    }
    HEAP8[$0 >> 0] = 4;
    break label$1;
   }
   $58 = $0;
   i64toi32_i32$0 = 0;
   i64toi32_i32$2 = $7;
   i64toi32_i32$1 = 0;
   i64toi32_i32$3 = 32;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
    $17 = 0;
   } else {
    i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
    $17 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   }
   $61$hi = i64toi32_i32$1;
   i64toi32_i32$1 = $5$hi;
   i64toi32_i32$1 = $61$hi;
   i64toi32_i32$0 = $17;
   i64toi32_i32$2 = $5$hi;
   i64toi32_i32$3 = $5;
   i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
   $63 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
   i64toi32_i32$0 = $58;
   HEAP32[i64toi32_i32$0 >> 2] = $63;
   HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$2;
  }
  __stack_pointer = $4 + 32 | 0;
 }
 
 function _ZN3std3sys4wasi2os12error_string17h35f8ed3ff8367537E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $4 = 0, $67 = 0;
  $2 = __stack_pointer - 1072 | 0;
  __stack_pointer = $2;
  memset($2 + 16 | 0 | 0, 0 | 0, 1024 | 0) | 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if ((strerror_r($1 | 0, $2 + 16 | 0 | 0, 1024 | 0) | 0 | 0) < (0 | 0)) {
       break label$4
      }
      $3 = 1;
      _ZN4core3ffi5c_str4CStr29from_bytes_with_nul_unchecked7rt_impl17hf4dd9bf93c6afe10E($2 + 8 | 0 | 0, $2 + 16 | 0 | 0, (strlen($2 + 16 | 0 | 0) | 0) + 1 | 0 | 0);
      _ZN4core3str8converts9from_utf817h3503debc4f1e2f4bE($2 + 1040 | 0 | 0, HEAP32[($2 + 8 | 0) >> 2] | 0 | 0, (HEAP32[($2 + 12 | 0) >> 2] | 0) + -1 | 0 | 0);
      if (HEAP32[($2 + 1040 | 0) >> 2] | 0) {
       break label$3
      }
      $4 = HEAP32[($2 + 1044 | 0) >> 2] | 0;
      label$5 : {
       $1 = HEAP32[($2 + 1048 | 0) >> 2] | 0;
       if (!$1) {
        break label$5
       }
       if (($1 | 0) < (0 | 0)) {
        break label$2
       }
       $3 = __rust_alloc($1 | 0, 1 | 0) | 0;
       if (!$3) {
        break label$1
       }
      }
      $3 = memcpy($3 | 0, $4 | 0, $1 | 0) | 0;
      HEAP32[($0 + 8 | 0) >> 2] = $1;
      HEAP32[($0 + 4 | 0) >> 2] = $1;
      HEAP32[$0 >> 2] = $3;
      __stack_pointer = $2 + 1072 | 0;
      return;
     }
     HEAP32[($2 + 1060 | 0) >> 2] = 0;
     HEAP32[($2 + 1056 | 0) >> 2] = 1048692;
     i64toi32_i32$1 = $2;
     i64toi32_i32$0 = 0;
     HEAP32[($2 + 1044 | 0) >> 2] = 1;
     HEAP32[($2 + 1048 | 0) >> 2] = i64toi32_i32$0;
     HEAP32[($2 + 1040 | 0) >> 2] = 1052316;
     _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($2 + 1040 | 0 | 0, 1052356 | 0);
     abort();
    }
    i64toi32_i32$0 = HEAP32[($2 + 1044 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($2 + 1048 | 0) >> 2] | 0;
    $67 = i64toi32_i32$0;
    i64toi32_i32$0 = $2;
    HEAP32[($2 + 1064 | 0) >> 2] = $67;
    HEAP32[($2 + 1068 | 0) >> 2] = i64toi32_i32$1;
    _ZN4core6result13unwrap_failed17hcf4dc3db6a31deeeE(1048820 | 0, 43 | 0, $2 + 1064 | 0 | 0, 1048864 | 0, 1052372 | 0);
    abort();
   }
   _ZN5alloc7raw_vec17capacity_overflow17h1271517144c3fe0fE();
   abort();
  }
  _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E($1 | 0, 1 | 0);
  abort();
 }
 
 function _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$5write17hf178d7b0fc5657deE($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $5 = 0, $4 = 0;
  label$1 : {
   $4 = $1 + 8 | 0;
   $5 = HEAP32[$4 >> 2] | 0;
   if (((HEAP32[($1 + 4 | 0) >> 2] | 0) - $5 | 0) >>> 0 >= $3 >>> 0) {
    break label$1
   }
   _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($1 | 0, $5 | 0, $3 | 0);
   $5 = HEAP32[$4 >> 2] | 0;
  }
  memcpy((HEAP32[$1 >> 2] | 0) + $5 | 0 | 0, $2 | 0, $3 | 0) | 0;
  HEAP32[($0 + 4 | 0) >> 2] = $3;
  HEAP32[$4 >> 2] = $5 + $3 | 0;
  HEAP32[$0 >> 2] = 0;
 }
 
 function _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$14write_vectored17h90777f8bc74c3235E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $5 = 0, $6 = 0, $7 = 0, $9 = 0, $8 = 0, $4 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      $4 = $3 << 3 | 0;
      if (!$4) {
       break label$4
      }
      $5 = ($3 + -1 | 0) & 536870911 | 0;
      $6 = $5 + 1 | 0;
      $7 = $6 & 7 | 0;
      if ($5 >>> 0 >= 7 >>> 0) {
       break label$3
      }
      $6 = 0;
      $5 = $2;
      break label$2;
     }
     $8 = $1 + 4 | 0;
     $5 = $1 + 8 | 0;
     $6 = 0;
     break label$1;
    }
    $5 = $2 + 60 | 0;
    $9 = $6 & 1073741816 | 0;
    $6 = 0;
    label$5 : while (1) {
     $6 = (HEAP32[$5 >> 2] | 0) + ((HEAP32[($5 + -8 | 0) >> 2] | 0) + ((HEAP32[($5 + -16 | 0) >> 2] | 0) + ((HEAP32[($5 + -24 | 0) >> 2] | 0) + ((HEAP32[($5 + -32 | 0) >> 2] | 0) + ((HEAP32[($5 + -40 | 0) >> 2] | 0) + ((HEAP32[($5 + -48 | 0) >> 2] | 0) + ((HEAP32[($5 + -56 | 0) >> 2] | 0) + $6 | 0) | 0) | 0) | 0) | 0) | 0) | 0) | 0;
     $5 = $5 + 64 | 0;
     $9 = $9 + -8 | 0;
     if ($9) {
      continue label$5
     }
     break label$5;
    };
    $5 = $5 + -60 | 0;
   }
   label$6 : {
    if (!$7) {
     break label$6
    }
    $5 = $5 + 4 | 0;
    label$7 : while (1) {
     $6 = (HEAP32[$5 >> 2] | 0) + $6 | 0;
     $5 = $5 + 8 | 0;
     $7 = $7 + -1 | 0;
     if ($7) {
      continue label$7
     }
     break label$7;
    };
   }
   $5 = $1 + 8 | 0;
   $8 = $1 + 4 | 0;
   $7 = HEAP32[($1 + 8 | 0) >> 2] | 0;
   if (((HEAP32[$8 >> 2] | 0) - $7 | 0) >>> 0 >= $6 >>> 0) {
    break label$1
   }
   _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($1 | 0, $7 | 0, $6 | 0);
  }
  label$8 : {
   if (!$3) {
    break label$8
   }
   $3 = $2 + $4 | 0;
   $5 = HEAP32[$5 >> 2] | 0;
   label$9 : while (1) {
    $9 = HEAP32[$2 >> 2] | 0;
    label$10 : {
     $7 = HEAP32[($2 + 4 | 0) >> 2] | 0;
     if (((HEAP32[$8 >> 2] | 0) - $5 | 0) >>> 0 >= $7 >>> 0) {
      break label$10
     }
     _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($1 | 0, $5 | 0, $7 | 0);
     $5 = HEAP32[($1 + 8 | 0) >> 2] | 0;
    }
    memcpy((HEAP32[$1 >> 2] | 0) + $5 | 0 | 0, $9 | 0, $7 | 0) | 0;
    $5 = $5 + $7 | 0;
    HEAP32[($1 + 8 | 0) >> 2] = $5;
    $2 = $2 + 8 | 0;
    if (($3 | 0) != ($2 | 0)) {
     continue label$9
    }
    break label$9;
   };
  }
  HEAP32[$0 >> 2] = 0;
  HEAP32[($0 + 4 | 0) >> 2] = $6;
 }
 
 function _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$17is_write_vectored17h944873638e458a23E($0) {
  $0 = $0 | 0;
  return 1 | 0;
 }
 
 function _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$9write_all17ha958032f4557b936E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $5 = 0, $4 = 0;
  label$1 : {
   $4 = $1 + 8 | 0;
   $5 = HEAP32[$4 >> 2] | 0;
   if (((HEAP32[($1 + 4 | 0) >> 2] | 0) - $5 | 0) >>> 0 >= $3 >>> 0) {
    break label$1
   }
   _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($1 | 0, $5 | 0, $3 | 0);
   $5 = HEAP32[$4 >> 2] | 0;
  }
  memcpy((HEAP32[$1 >> 2] | 0) + $5 | 0 | 0, $2 | 0, $3 | 0) | 0;
  HEAP8[$0 >> 0] = 4;
  HEAP32[$4 >> 2] = $5 + $3 | 0;
 }
 
 function _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$5flush17h750191f711542006E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  HEAP8[$0 >> 0] = 4;
 }
 
 function _ZN3std2io5Write18write_all_vectored17h9996a76fa2734775E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, $5 = 0, $6 = 0, $7 = 0, i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, $8 = 0, i64toi32_i32$3 = 0, i64toi32_i32$1 = 0, $10 = 0, $18 = 0, $9 = 0, $52 = 0, $55 = 0;
  $4 = __stack_pointer - 32 | 0;
  __stack_pointer = $4;
  label$1 : {
   label$2 : {
    label$3 : {
     if ($3) {
      break label$3
     }
     $5 = 0;
     break label$2;
    }
    $6 = $2 + 4 | 0;
    $7 = (($3 + -1 | 0) & 536870911 | 0) + 1 | 0;
    $5 = 0;
    label$4 : {
     label$5 : while (1) {
      if (HEAP32[$6 >> 2] | 0) {
       break label$4
      }
      $6 = $6 + 8 | 0;
      $5 = $5 + 1 | 0;
      if (($7 | 0) != ($5 | 0)) {
       continue label$5
      }
      break label$5;
     };
     $5 = $7;
    }
    if ($5 >>> 0 > $3 >>> 0) {
     break label$1
    }
   }
   label$6 : {
    label$7 : {
     label$8 : {
      label$9 : {
       $7 = $3 - $5 | 0;
       if (!$7) {
        break label$9
       }
       $5 = $2 + ($5 << 3 | 0) | 0;
       label$10 : while (1) {
        _ZN4wasi13lib_generated8fd_write17h5efa9dd89fd18687E($4 + 8 | 0 | 0, 2 | 0, $5 | 0, $7 | 0);
        label$11 : {
         label$12 : {
          if (HEAPU16[($4 + 8 | 0) >> 1] | 0) {
           break label$12
          }
          $8 = HEAP32[($4 + 12 | 0) >> 2] | 0;
          if ($8) {
           break label$11
          }
          $52 = $0;
          i64toi32_i32$0 = 0;
          i64toi32_i32$2 = 1050344;
          i64toi32_i32$1 = 0;
          i64toi32_i32$3 = 32;
          i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
          if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
           i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
           $18 = 0;
          } else {
           i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
           $18 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
          }
          i64toi32_i32$0 = $18;
          i64toi32_i32$2 = 0;
          i64toi32_i32$3 = 2;
          i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
          $55 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
          i64toi32_i32$0 = $52;
          HEAP32[i64toi32_i32$0 >> 2] = $55;
          HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$2;
          break label$8;
         }
         HEAP16[($4 + 6 | 0) >> 1] = HEAPU16[($4 + 10 | 0) >> 1] | 0;
         $6 = (_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E($4 + 6 | 0 | 0) | 0) & 65535 | 0;
         if (((_ZN3std3sys4wasi17decode_error_kind17h3d93ab073700757fE($6 | 0) | 0) & 255 | 0 | 0) == (35 | 0)) {
          continue label$10
         }
         HEAP32[$0 >> 2] = 0;
         HEAP32[($0 + 4 | 0) >> 2] = $6;
         break label$8;
        }
        $6 = $5 + 4 | 0;
        $9 = (($7 + -1 | 0) & 536870911 | 0) + 1 | 0;
        $3 = 0;
        $2 = 0;
        label$13 : {
         label$14 : while (1) {
          $10 = (HEAP32[$6 >> 2] | 0) + $2 | 0;
          if ($10 >>> 0 > $8 >>> 0) {
           break label$13
          }
          $6 = $6 + 8 | 0;
          $2 = $10;
          $3 = $3 + 1 | 0;
          if (($9 | 0) != ($3 | 0)) {
           continue label$14
          }
          break label$14;
         };
         $2 = $10;
         $3 = $9;
        }
        if ($7 >>> 0 < $3 >>> 0) {
         break label$7
        }
        label$15 : {
         $7 = $7 - $3 | 0;
         if ($7) {
          break label$15
         }
         if (($8 | 0) == ($2 | 0)) {
          break label$9
         }
         HEAP32[($4 + 28 | 0) >> 2] = 0;
         HEAP32[($4 + 24 | 0) >> 2] = 1048692;
         i64toi32_i32$0 = $4;
         i64toi32_i32$2 = 0;
         HEAP32[($4 + 12 | 0) >> 2] = 1;
         HEAP32[($4 + 16 | 0) >> 2] = i64toi32_i32$2;
         HEAP32[($4 + 8 | 0) >> 2] = 1050540;
         _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($4 + 8 | 0 | 0, 1050548 | 0);
         abort();
        }
        $5 = $5 + ($3 << 3 | 0) | 0;
        $3 = HEAP32[($5 + 4 | 0) >> 2] | 0;
        $6 = $8 - $2 | 0;
        if ($3 >>> 0 < $6 >>> 0) {
         break label$6
        }
        HEAP32[($5 + 4 | 0) >> 2] = $3 - $6 | 0;
        HEAP32[$5 >> 2] = (HEAP32[$5 >> 2] | 0) + $6 | 0;
        continue label$10;
       };
      }
      HEAP8[$0 >> 0] = 4;
     }
     __stack_pointer = $4 + 32 | 0;
     return;
    }
    _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($3 | 0, $7 | 0, 1050484 | 0);
    abort();
   }
   HEAP32[($4 + 28 | 0) >> 2] = 0;
   HEAP32[($4 + 24 | 0) >> 2] = 1048692;
   i64toi32_i32$0 = $4;
   i64toi32_i32$2 = 0;
   HEAP32[($4 + 12 | 0) >> 2] = 1;
   HEAP32[($4 + 16 | 0) >> 2] = i64toi32_i32$2;
   HEAP32[($4 + 8 | 0) >> 2] = 1051984;
   _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($4 + 8 | 0 | 0, 1052024 | 0);
   abort();
  }
  _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($5 | 0, $3 | 0, 1050484 | 0);
  abort();
 }
 
 function _ZN61_$LT$$RF$std__io__stdio__Stdout$u20$as$u20$std__io__Write$GT$9write_fmt17h8212fcd68a07430aE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $4 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $5 = 0, $17 = 0, $45 = 0, $51 = 0, $54 = 0, $64 = 0, $67 = 0, $70 = 0;
  $3 = __stack_pointer - 48 | 0;
  __stack_pointer = $3;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      $1 = HEAP32[(HEAP32[$1 >> 2] | 0) >> 2] | 0;
      if ((HEAP32[$1 >> 2] | 0 | 0) == (1059084 | 0)) {
       break label$4
      }
      $4 = HEAPU8[($1 + 28 | 0) >> 0] | 0;
      HEAP8[($1 + 28 | 0) >> 0] = 1;
      $4 = $4 & 1 | 0;
      HEAP8[($3 + 8 | 0) >> 0] = $4;
      if ($4) {
       break label$2
      }
      HEAP32[($1 + 4 | 0) >> 2] = 1;
      HEAP32[$1 >> 2] = 1059084;
      break label$3;
     }
     $4 = HEAP32[($1 + 4 | 0) >> 2] | 0;
     $5 = $4 + 1 | 0;
     if ($5 >>> 0 < $4 >>> 0) {
      break label$1
     }
     HEAP32[($1 + 4 | 0) >> 2] = $5;
    }
    HEAP32[($3 + 4 | 0) >> 2] = $1;
    HEAP8[($3 + 12 | 0) >> 0] = 4;
    HEAP32[($3 + 8 | 0) >> 2] = $3 + 4 | 0;
    i64toi32_i32$2 = $2 + 16 | 0;
    i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
    i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
    $45 = i64toi32_i32$0;
    i64toi32_i32$0 = ($3 + 24 | 0) + 16 | 0;
    HEAP32[i64toi32_i32$0 >> 2] = $45;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    i64toi32_i32$2 = $2 + 8 | 0;
    i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
    i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
    $51 = i64toi32_i32$1;
    i64toi32_i32$1 = ($3 + 24 | 0) + 8 | 0;
    HEAP32[i64toi32_i32$1 >> 2] = $51;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$2 = $2;
    i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
    i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
    $54 = i64toi32_i32$0;
    i64toi32_i32$0 = $3;
    HEAP32[($3 + 24 | 0) >> 2] = $54;
    HEAP32[($3 + 28 | 0) >> 2] = i64toi32_i32$1;
    label$5 : {
     label$6 : {
      if (!(_ZN4core3fmt5write17h6461900980c16fcdE($3 + 8 | 0 | 0, 1050608 | 0, $3 + 24 | 0 | 0) | 0)) {
       break label$6
      }
      label$7 : {
       if ((HEAPU8[($3 + 12 | 0) >> 0] | 0 | 0) != (4 | 0)) {
        break label$7
       }
       $64 = $0;
       i64toi32_i32$1 = 0;
       i64toi32_i32$2 = 1050596;
       i64toi32_i32$0 = 0;
       i64toi32_i32$3 = 32;
       i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
       if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
        i64toi32_i32$0 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
        $17 = 0;
       } else {
        i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
        $17 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
       }
       i64toi32_i32$1 = $17;
       i64toi32_i32$2 = 0;
       i64toi32_i32$3 = 2;
       i64toi32_i32$2 = i64toi32_i32$0 | i64toi32_i32$2 | 0;
       $67 = i64toi32_i32$1 | i64toi32_i32$3 | 0;
       i64toi32_i32$1 = $64;
       HEAP32[i64toi32_i32$1 >> 2] = $67;
       HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$2;
       break label$5;
      }
      i64toi32_i32$0 = $3;
      i64toi32_i32$2 = HEAP32[($3 + 12 | 0) >> 2] | 0;
      i64toi32_i32$1 = HEAP32[($3 + 16 | 0) >> 2] | 0;
      $70 = i64toi32_i32$2;
      i64toi32_i32$2 = $0;
      HEAP32[i64toi32_i32$2 >> 2] = $70;
      HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] = i64toi32_i32$1;
      break label$5;
     }
     HEAP8[$0 >> 0] = 4;
     if ((HEAPU8[($3 + 12 | 0) >> 0] | 0 | 0) != (3 | 0)) {
      break label$5
     }
     $1 = HEAP32[($3 + 16 | 0) >> 2] | 0;
     FUNCTION_TABLE[HEAP32[(HEAP32[($1 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$1 >> 2] | 0);
     label$8 : {
      $2 = HEAP32[($1 + 4 | 0) >> 2] | 0;
      $0 = HEAP32[($2 + 4 | 0) >> 2] | 0;
      if (!$0) {
       break label$8
      }
      __rust_dealloc(HEAP32[$1 >> 2] | 0 | 0, $0 | 0, HEAP32[($2 + 8 | 0) >> 2] | 0 | 0);
     }
     __rust_dealloc(HEAP32[($3 + 16 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
    }
    $1 = HEAP32[($3 + 4 | 0) >> 2] | 0;
    $2 = (HEAP32[($1 + 4 | 0) >> 2] | 0) + -1 | 0;
    HEAP32[($1 + 4 | 0) >> 2] = $2;
    label$9 : {
     if ($2) {
      break label$9
     }
     HEAP8[($1 + 28 | 0) >> 0] = 0;
     HEAP32[$1 >> 2] = 0;
    }
    __stack_pointer = $3 + 48 | 0;
    return;
   }
   HEAP32[($3 + 44 | 0) >> 2] = 0;
   HEAP32[($3 + 40 | 0) >> 2] = 1048692;
   i64toi32_i32$2 = $3;
   i64toi32_i32$1 = 0;
   HEAP32[($3 + 28 | 0) >> 2] = 1;
   HEAP32[($3 + 32 | 0) >> 2] = i64toi32_i32$1;
   HEAP32[($3 + 24 | 0) >> 2] = 1052180;
   _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($3 + 8 | 0 | 0, $3 + 24 | 0 | 0);
   abort();
  }
  _ZN4core6option13expect_failed17he17117bab9f5843eE(1051084 | 0, 38 | 0, 1051160 | 0);
  abort();
 }
 
 function _ZN3std2io5stdio6_print17ha3352b664519162eE($0) {
  $0 = $0 | 0;
  var $1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $13 = 0, $18 = 0, $21 = 0, $51 = 0, $57 = 0, $60 = 0, $166 = 0, $172 = 0, $175 = 0, $187 = 0;
  $1 = __stack_pointer - 96 | 0;
  __stack_pointer = $1;
  i64toi32_i32$2 = $0 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $13 = i64toi32_i32$0;
  i64toi32_i32$0 = $1 + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $13;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $0 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $18 = i64toi32_i32$1;
  i64toi32_i32$1 = $1 + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $18;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $21 = i64toi32_i32$0;
  i64toi32_i32$0 = $1;
  HEAP32[$1 >> 2] = $21;
  HEAP32[($1 + 4 | 0) >> 2] = i64toi32_i32$1;
  HEAP32[($1 + 28 | 0) >> 2] = 6;
  HEAP32[($1 + 24 | 0) >> 2] = 1050452;
  label$1 : {
   label$2 : {
    if (!(HEAPU8[(0 + 1059010 | 0) >> 0] | 0)) {
     break label$2
    }
    label$3 : {
     if (HEAP32[(0 + 1059076 | 0) >> 2] | 0) {
      break label$3
     }
     i64toi32_i32$0 = 0;
     i64toi32_i32$1 = 0;
     HEAP32[(i64toi32_i32$0 + 1059076 | 0) >> 2] = 1;
     HEAP32[(i64toi32_i32$0 + 1059080 | 0) >> 2] = i64toi32_i32$1;
     break label$2;
    }
    $0 = HEAP32[(0 + 1059080 | 0) >> 2] | 0;
    HEAP32[(0 + 1059080 | 0) >> 2] = 0;
    if (!$0) {
     break label$2
    }
    $2 = HEAPU8[($0 + 8 | 0) >> 0] | 0;
    $3 = 1;
    HEAP8[($0 + 8 | 0) >> 0] = 1;
    $2 = $2 & 1 | 0;
    HEAP8[($1 + 56 | 0) >> 0] = $2;
    label$4 : {
     if ($2) {
      break label$4
     }
     label$5 : {
      if (!((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0)) {
       break label$5
      }
      $3 = _ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0;
     }
     HEAP8[($1 + 60 | 0) >> 0] = 4;
     HEAP32[($1 + 56 | 0) >> 2] = $0 + 12 | 0;
     i64toi32_i32$2 = $1 + 16 | 0;
     i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
     i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
     $51 = i64toi32_i32$1;
     i64toi32_i32$1 = ($1 + 72 | 0) + 16 | 0;
     HEAP32[i64toi32_i32$1 >> 2] = $51;
     HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
     i64toi32_i32$2 = $1 + 8 | 0;
     i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
     i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
     $57 = i64toi32_i32$0;
     i64toi32_i32$0 = ($1 + 72 | 0) + 8 | 0;
     HEAP32[i64toi32_i32$0 >> 2] = $57;
     HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
     i64toi32_i32$2 = $1;
     i64toi32_i32$1 = HEAP32[$1 >> 2] | 0;
     i64toi32_i32$0 = HEAP32[($1 + 4 | 0) >> 2] | 0;
     $60 = i64toi32_i32$1;
     i64toi32_i32$1 = $1;
     HEAP32[($1 + 72 | 0) >> 2] = $60;
     HEAP32[($1 + 76 | 0) >> 2] = i64toi32_i32$0;
     label$6 : {
      label$7 : {
       if (!(_ZN4core3fmt5write17h6461900980c16fcdE($1 + 56 | 0 | 0, 1050632 | 0, $1 + 72 | 0 | 0) | 0)) {
        break label$7
       }
       if ((HEAPU8[($1 + 60 | 0) >> 0] | 0 | 0) == (4 | 0)) {
        break label$6
       }
       if ((HEAPU8[($1 + 60 | 0) >> 0] | 0 | 0) != (3 | 0)) {
        break label$6
       }
       $2 = HEAP32[($1 + 64 | 0) >> 2] | 0;
       FUNCTION_TABLE[HEAP32[(HEAP32[($2 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$2 >> 2] | 0);
       label$8 : {
        $4 = HEAP32[($2 + 4 | 0) >> 2] | 0;
        $5 = HEAP32[($4 + 4 | 0) >> 2] | 0;
        if (!$5) {
         break label$8
        }
        __rust_dealloc(HEAP32[$2 >> 2] | 0 | 0, $5 | 0, HEAP32[($4 + 8 | 0) >> 2] | 0 | 0);
       }
       __rust_dealloc($2 | 0, 12 | 0, 4 | 0);
       break label$6;
      }
      if ((HEAPU8[($1 + 60 | 0) >> 0] | 0 | 0) != (3 | 0)) {
       break label$6
      }
      $2 = HEAP32[($1 + 64 | 0) >> 2] | 0;
      FUNCTION_TABLE[HEAP32[(HEAP32[($2 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$2 >> 2] | 0);
      label$9 : {
       $4 = HEAP32[($2 + 4 | 0) >> 2] | 0;
       $5 = HEAP32[($4 + 4 | 0) >> 2] | 0;
       if (!$5) {
        break label$9
       }
       __rust_dealloc(HEAP32[$2 >> 2] | 0 | 0, $5 | 0, HEAP32[($4 + 8 | 0) >> 2] | 0 | 0);
      }
      __rust_dealloc(HEAP32[($1 + 64 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
     }
     label$10 : {
      if (!$3) {
       break label$10
      }
      if (!((HEAP32[(0 + 1059072 | 0) >> 2] | 0) & 2147483647 | 0)) {
       break label$10
      }
      if (_ZN3std9panicking11panic_count17is_zero_slow_path17hc88d2253c9fcd985E() | 0) {
       break label$10
      }
      HEAP8[($0 + 9 | 0) >> 0] = 1;
     }
     HEAP8[($0 + 8 | 0) >> 0] = 0;
     $3 = HEAP32[(0 + 1059080 | 0) >> 2] | 0;
     HEAP32[(0 + 1059080 | 0) >> 2] = $0;
     if (!$3) {
      break label$1
     }
     $0 = HEAP32[$3 >> 2] | 0;
     HEAP32[$3 >> 2] = $0 + -1 | 0;
     if (($0 | 0) != (1 | 0)) {
      break label$1
     }
     _ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h347b97f7aa31dec8E($3 | 0);
     break label$1;
    }
    HEAP32[($1 + 92 | 0) >> 2] = 0;
    HEAP32[($1 + 88 | 0) >> 2] = 1048692;
    i64toi32_i32$1 = $1;
    i64toi32_i32$0 = 0;
    HEAP32[($1 + 76 | 0) >> 2] = 1;
    HEAP32[($1 + 80 | 0) >> 2] = i64toi32_i32$0;
    HEAP32[($1 + 72 | 0) >> 2] = 1052180;
    _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($1 + 56 | 0 | 0, $1 + 72 | 0 | 0);
    abort();
   }
   label$11 : {
    if ((HEAP32[(0 + 1059012 | 0) >> 2] | 0 | 0) == (3 | 0)) {
     break label$11
    }
    if ((HEAP32[(0 + 1059012 | 0) >> 2] | 0 | 0) == (3 | 0)) {
     break label$11
    }
    HEAP32[($1 + 56 | 0) >> 2] = 1059016;
    HEAP32[($1 + 72 | 0) >> 2] = $1 + 56 | 0;
    _ZN3std4sync4once4Once10call_inner17hc4ff5b7e565c20dfE(1059012 | 0, 1 | 0, $1 + 72 | 0 | 0, 1050764 | 0, 1050748 | 0);
   }
   HEAP32[($1 + 44 | 0) >> 2] = 1059016;
   HEAP32[($1 + 56 | 0) >> 2] = $1 + 44 | 0;
   i64toi32_i32$2 = $1 + 16 | 0;
   i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   $166 = i64toi32_i32$0;
   i64toi32_i32$0 = ($1 + 72 | 0) + 16 | 0;
   HEAP32[i64toi32_i32$0 >> 2] = $166;
   HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
   i64toi32_i32$2 = $1 + 8 | 0;
   i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   $172 = i64toi32_i32$1;
   i64toi32_i32$1 = ($1 + 72 | 0) + 8 | 0;
   HEAP32[i64toi32_i32$1 >> 2] = $172;
   HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
   i64toi32_i32$2 = $1;
   i64toi32_i32$0 = HEAP32[$1 >> 2] | 0;
   i64toi32_i32$1 = HEAP32[($1 + 4 | 0) >> 2] | 0;
   $175 = i64toi32_i32$0;
   i64toi32_i32$0 = $1;
   HEAP32[($1 + 72 | 0) >> 2] = $175;
   HEAP32[($1 + 76 | 0) >> 2] = i64toi32_i32$1;
   _ZN61_$LT$$RF$std__io__stdio__Stdout$u20$as$u20$std__io__Write$GT$9write_fmt17h8212fcd68a07430aE($1 + 32 | 0 | 0, $1 + 56 | 0 | 0, $1 + 72 | 0 | 0);
   if ((HEAPU8[($1 + 32 | 0) >> 0] | 0 | 0) == (4 | 0)) {
    break label$1
   }
   i64toi32_i32$2 = $1;
   i64toi32_i32$1 = HEAP32[($1 + 32 | 0) >> 2] | 0;
   i64toi32_i32$0 = HEAP32[($1 + 36 | 0) >> 2] | 0;
   $187 = i64toi32_i32$1;
   i64toi32_i32$1 = $1;
   HEAP32[($1 + 48 | 0) >> 2] = $187;
   HEAP32[($1 + 52 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($1 + 92 | 0) >> 2] = 2;
   HEAP32[($1 + 68 | 0) >> 2] = 4;
   i64toi32_i32$1 = $1;
   i64toi32_i32$0 = 0;
   HEAP32[($1 + 76 | 0) >> 2] = 2;
   HEAP32[($1 + 80 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($1 + 72 | 0) >> 2] = 1050420;
   HEAP32[($1 + 60 | 0) >> 2] = 3;
   HEAP32[($1 + 88 | 0) >> 2] = $1 + 56 | 0;
   HEAP32[($1 + 64 | 0) >> 2] = $1 + 48 | 0;
   HEAP32[($1 + 56 | 0) >> 2] = $1 + 24 | 0;
   _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($1 + 72 | 0 | 0, 1050436 | 0);
   abort();
  }
  __stack_pointer = $1 + 96 | 0;
 }
 
 function _ZN3std2io5Write9write_all17h04ef04d2aefe2a00E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, $5 = 0, i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, i64toi32_i32$1 = 0, $13 = 0, $24 = 0, $27 = 0;
  $4 = __stack_pointer - 32 | 0;
  __stack_pointer = $4;
  label$1 : {
   label$2 : {
    label$3 : {
     if (!$3) {
      break label$3
     }
     label$4 : while (1) {
      HEAP32[($4 + 12 | 0) >> 2] = $3;
      HEAP32[($4 + 8 | 0) >> 2] = $2;
      _ZN4wasi13lib_generated8fd_write17h5efa9dd89fd18687E($4 + 16 | 0 | 0, 2 | 0, $4 + 8 | 0 | 0, 1 | 0);
      label$5 : {
       label$6 : {
        label$7 : {
         if (HEAPU16[($4 + 16 | 0) >> 1] | 0) {
          break label$7
         }
         $5 = HEAP32[($4 + 20 | 0) >> 2] | 0;
         if ($5) {
          break label$6
         }
         $24 = $0;
         i64toi32_i32$0 = 0;
         i64toi32_i32$2 = 1050344;
         i64toi32_i32$1 = 0;
         i64toi32_i32$3 = 32;
         i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
         if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
          i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
          $13 = 0;
         } else {
          i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
          $13 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
         }
         i64toi32_i32$0 = $13;
         i64toi32_i32$2 = 0;
         i64toi32_i32$3 = 2;
         i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
         $27 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
         i64toi32_i32$0 = $24;
         HEAP32[i64toi32_i32$0 >> 2] = $27;
         HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$2;
         break label$2;
        }
        HEAP16[($4 + 30 | 0) >> 1] = HEAPU16[($4 + 18 | 0) >> 1] | 0;
        $5 = (_ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E($4 + 30 | 0 | 0) | 0) & 65535 | 0;
        if (((_ZN3std3sys4wasi17decode_error_kind17h3d93ab073700757fE($5 | 0) | 0) & 255 | 0 | 0) == (35 | 0)) {
         break label$5
        }
        HEAP32[$0 >> 2] = 0;
        HEAP32[($0 + 4 | 0) >> 2] = $5;
        break label$2;
       }
       if ($3 >>> 0 < $5 >>> 0) {
        break label$1
       }
       $2 = $2 + $5 | 0;
       $3 = $3 - $5 | 0;
      }
      if ($3) {
       continue label$4
      }
      break label$4;
     };
    }
    HEAP8[$0 >> 0] = 4;
   }
   __stack_pointer = $4 + 32 | 0;
   return;
  }
  _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($5 | 0, $3 | 0, 1050564 | 0);
  abort();
 }
 
 function _ZN3std2io5Write18write_all_vectored17hd2fe6324cf3f60e6E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $6 = 0, $5 = 0, $7 = 0, $4 = 0, i64toi32_i32$2 = 0, $9 = 0, $8 = 0, i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, $11 = 0, $12 = 0, i64toi32_i32$3 = 0, i64toi32_i32$1 = 0, $10 = 0, $20 = 0, $166 = 0, $169 = 0;
  $4 = __stack_pointer - 32 | 0;
  __stack_pointer = $4;
  label$1 : {
   label$2 : {
    label$3 : {
     if ($3) {
      break label$3
     }
     $5 = 0;
     break label$2;
    }
    $6 = $2 + 4 | 0;
    $7 = (($3 + -1 | 0) & 536870911 | 0) + 1 | 0;
    $5 = 0;
    label$4 : {
     label$5 : while (1) {
      if (HEAP32[$6 >> 2] | 0) {
       break label$4
      }
      $6 = $6 + 8 | 0;
      $5 = $5 + 1 | 0;
      if (($7 | 0) != ($5 | 0)) {
       continue label$5
      }
      break label$5;
     };
     $5 = $7;
    }
    if ($5 >>> 0 > $3 >>> 0) {
     break label$1
    }
   }
   label$6 : {
    label$7 : {
     label$8 : {
      label$9 : {
       $8 = $3 - $5 | 0;
       if (!$8) {
        break label$9
       }
       $9 = $2 + ($5 << 3 | 0) | 0;
       $10 = $1 + 4 | 0;
       label$10 : while (1) {
        $6 = ($8 + -1 | 0) & 536870911 | 0;
        $11 = $6 + 1 | 0;
        $5 = $11 & 7 | 0;
        label$11 : {
         label$12 : {
          if ($6 >>> 0 >= 7 >>> 0) {
           break label$12
          }
          $3 = 0;
          $6 = $9;
          break label$11;
         }
         $6 = $9 + 60 | 0;
         $7 = $11 & 1073741816 | 0;
         $3 = 0;
         label$13 : while (1) {
          $3 = (HEAP32[$6 >> 2] | 0) + ((HEAP32[($6 + -8 | 0) >> 2] | 0) + ((HEAP32[($6 + -16 | 0) >> 2] | 0) + ((HEAP32[($6 + -24 | 0) >> 2] | 0) + ((HEAP32[($6 + -32 | 0) >> 2] | 0) + ((HEAP32[($6 + -40 | 0) >> 2] | 0) + ((HEAP32[($6 + -48 | 0) >> 2] | 0) + ((HEAP32[($6 + -56 | 0) >> 2] | 0) + $3 | 0) | 0) | 0) | 0) | 0) | 0) | 0) | 0;
          $6 = $6 + 64 | 0;
          $7 = $7 + -8 | 0;
          if ($7) {
           continue label$13
          }
          break label$13;
         };
         $6 = $6 + -60 | 0;
        }
        label$14 : {
         if (!$5) {
          break label$14
         }
         $6 = $6 + 4 | 0;
         label$15 : while (1) {
          $3 = (HEAP32[$6 >> 2] | 0) + $3 | 0;
          $6 = $6 + 8 | 0;
          $5 = $5 + -1 | 0;
          if ($5) {
           continue label$15
          }
          break label$15;
         };
        }
        $5 = $8 << 3 | 0;
        label$16 : {
         $6 = HEAP32[($1 + 8 | 0) >> 2] | 0;
         if (((HEAP32[$10 >> 2] | 0) - $6 | 0) >>> 0 >= $3 >>> 0) {
          break label$16
         }
         _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($1 | 0, $6 | 0, $3 | 0);
         $6 = HEAP32[($1 + 8 | 0) >> 2] | 0;
        }
        $12 = $9 + $5 | 0;
        $5 = $9;
        label$17 : while (1) {
         $2 = HEAP32[$5 >> 2] | 0;
         label$18 : {
          $7 = HEAP32[($5 + 4 | 0) >> 2] | 0;
          if (((HEAP32[$10 >> 2] | 0) - $6 | 0) >>> 0 >= $7 >>> 0) {
           break label$18
          }
          _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($1 | 0, $6 | 0, $7 | 0);
          $6 = HEAP32[($1 + 8 | 0) >> 2] | 0;
         }
         memcpy((HEAP32[$1 >> 2] | 0) + $6 | 0 | 0, $2 | 0, $7 | 0) | 0;
         $6 = $6 + $7 | 0;
         HEAP32[($1 + 8 | 0) >> 2] = $6;
         $5 = $5 + 8 | 0;
         if (($12 | 0) != ($5 | 0)) {
          continue label$17
         }
         break label$17;
        };
        label$19 : {
         if ($3) {
          break label$19
         }
         $166 = $0;
         i64toi32_i32$0 = 0;
         i64toi32_i32$2 = 1050344;
         i64toi32_i32$1 = 0;
         i64toi32_i32$3 = 32;
         i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
         if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
          i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
          $20 = 0;
         } else {
          i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
          $20 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
         }
         i64toi32_i32$0 = $20;
         i64toi32_i32$2 = 0;
         i64toi32_i32$3 = 2;
         i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
         $169 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
         i64toi32_i32$0 = $166;
         HEAP32[i64toi32_i32$0 >> 2] = $169;
         HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$2;
         break label$8;
        }
        $6 = $9 + 4 | 0;
        $5 = 0;
        $7 = 0;
        label$20 : {
         label$21 : while (1) {
          $2 = (HEAP32[$6 >> 2] | 0) + $7 | 0;
          if ($2 >>> 0 > $3 >>> 0) {
           break label$20
          }
          $6 = $6 + 8 | 0;
          $7 = $2;
          $5 = $5 + 1 | 0;
          if (($11 | 0) != ($5 | 0)) {
           continue label$21
          }
          break label$21;
         };
         $7 = $2;
         $5 = $11;
        }
        if ($8 >>> 0 < $5 >>> 0) {
         break label$7
        }
        label$22 : {
         $8 = $8 - $5 | 0;
         if ($8) {
          break label$22
         }
         if (($3 | 0) == ($7 | 0)) {
          break label$9
         }
         HEAP32[($4 + 28 | 0) >> 2] = 0;
         HEAP32[($4 + 24 | 0) >> 2] = 1048692;
         i64toi32_i32$0 = $4;
         i64toi32_i32$2 = 0;
         HEAP32[($4 + 12 | 0) >> 2] = 1;
         HEAP32[($4 + 16 | 0) >> 2] = i64toi32_i32$2;
         HEAP32[($4 + 8 | 0) >> 2] = 1050540;
         _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($4 + 8 | 0 | 0, 1050548 | 0);
         abort();
        }
        $5 = $5 << 3 | 0;
        $2 = $9 + $5 | 0;
        $12 = HEAP32[($2 + 4 | 0) >> 2] | 0;
        $6 = $3 - $7 | 0;
        if ($12 >>> 0 < $6 >>> 0) {
         break label$6
        }
        HEAP32[($2 + 4 | 0) >> 2] = $12 - $6 | 0;
        $9 = $9 + $5 | 0;
        HEAP32[$9 >> 2] = (HEAP32[$9 >> 2] | 0) + $6 | 0;
        continue label$10;
       };
      }
      HEAP8[$0 >> 0] = 4;
     }
     __stack_pointer = $4 + 32 | 0;
     return;
    }
    _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($5 | 0, $8 | 0, 1050484 | 0);
    abort();
   }
   HEAP32[($4 + 28 | 0) >> 2] = 0;
   HEAP32[($4 + 24 | 0) >> 2] = 1048692;
   i64toi32_i32$0 = $4;
   i64toi32_i32$2 = 0;
   HEAP32[($4 + 12 | 0) >> 2] = 1;
   HEAP32[($4 + 16 | 0) >> 2] = i64toi32_i32$2;
   HEAP32[($4 + 8 | 0) >> 2] = 1051984;
   _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($4 + 8 | 0 | 0, 1052024 | 0);
   abort();
  }
  _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($5 | 0, $3 | 0, 1050484 | 0);
  abort();
 }
 
 function _ZN3std2io5Write9write_fmt17hd94531ad878fb413E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var i64toi32_i32$2 = 0, $3 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $16 = 0, $15 = 0, $21 = 0, $24 = 0, $34 = 0, $37 = 0, $40 = 0;
  $3 = __stack_pointer - 48 | 0;
  __stack_pointer = $3;
  HEAP8[($3 + 12 | 0) >> 0] = 4;
  HEAP32[($3 + 8 | 0) >> 2] = $1;
  i64toi32_i32$2 = $2 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $15 = i64toi32_i32$0;
  i64toi32_i32$0 = ($3 + 24 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $15;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $2 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $21 = i64toi32_i32$1;
  i64toi32_i32$1 = ($3 + 24 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $21;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $2;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $24 = i64toi32_i32$0;
  i64toi32_i32$0 = $3;
  HEAP32[($3 + 24 | 0) >> 2] = $24;
  HEAP32[($3 + 28 | 0) >> 2] = i64toi32_i32$1;
  label$1 : {
   label$2 : {
    if (!(_ZN4core3fmt5write17h6461900980c16fcdE($3 + 8 | 0 | 0, 1050632 | 0, $3 + 24 | 0 | 0) | 0)) {
     break label$2
    }
    label$3 : {
     if ((HEAPU8[($3 + 12 | 0) >> 0] | 0 | 0) != (4 | 0)) {
      break label$3
     }
     $34 = $0;
     i64toi32_i32$1 = 0;
     i64toi32_i32$2 = 1050596;
     i64toi32_i32$0 = 0;
     i64toi32_i32$3 = 32;
     i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
     if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
      i64toi32_i32$0 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
      $16 = 0;
     } else {
      i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
      $16 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
     }
     i64toi32_i32$1 = $16;
     i64toi32_i32$2 = 0;
     i64toi32_i32$3 = 2;
     i64toi32_i32$2 = i64toi32_i32$0 | i64toi32_i32$2 | 0;
     $37 = i64toi32_i32$1 | i64toi32_i32$3 | 0;
     i64toi32_i32$1 = $34;
     HEAP32[i64toi32_i32$1 >> 2] = $37;
     HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$2;
     break label$1;
    }
    i64toi32_i32$0 = $3;
    i64toi32_i32$2 = HEAP32[($3 + 12 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($3 + 16 | 0) >> 2] | 0;
    $40 = i64toi32_i32$2;
    i64toi32_i32$2 = $0;
    HEAP32[i64toi32_i32$2 >> 2] = $40;
    HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] = i64toi32_i32$1;
    break label$1;
   }
   HEAP8[$0 >> 0] = 4;
   if ((HEAPU8[($3 + 12 | 0) >> 0] | 0 | 0) != (3 | 0)) {
    break label$1
   }
   $2 = HEAP32[($3 + 16 | 0) >> 2] | 0;
   FUNCTION_TABLE[HEAP32[(HEAP32[($2 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$2 >> 2] | 0);
   label$4 : {
    $1 = HEAP32[($2 + 4 | 0) >> 2] | 0;
    $0 = HEAP32[($1 + 4 | 0) >> 2] | 0;
    if (!$0) {
     break label$4
    }
    __rust_dealloc(HEAP32[$2 >> 2] | 0 | 0, $0 | 0, HEAP32[($1 + 8 | 0) >> 2] | 0 | 0);
   }
   __rust_dealloc(HEAP32[($3 + 16 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
  }
  __stack_pointer = $3 + 48 | 0;
 }
 
 function _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17h2c8585733a944f10E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $4 = 0;
  label$1 : {
   $3 = HEAP32[$0 >> 2] | 0;
   $4 = $3 + 8 | 0;
   $0 = HEAP32[$4 >> 2] | 0;
   if (((HEAP32[($3 + 4 | 0) >> 2] | 0) - $0 | 0) >>> 0 >= $2 >>> 0) {
    break label$1
   }
   _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38b8f4b8aa0f81b8E($3 | 0, $0 | 0, $2 | 0);
   $0 = HEAP32[$4 >> 2] | 0;
  }
  memcpy((HEAP32[$3 >> 2] | 0) + $0 | 0 | 0, $1 | 0, $2 | 0) | 0;
  HEAP32[$4 >> 2] = $0 + $2 | 0;
  return 0 | 0;
 }
 
 function _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17hc4fcd3d79836fae3E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, i64toi32_i32$1 = 0, $5 = 0, $6 = 0, $4 = 0, $4$hi = 0;
  $3 = __stack_pointer - 16 | 0;
  __stack_pointer = $3;
  _ZN61_$LT$std__io__stdio__StdoutLock$u20$as$u20$std__io__Write$GT$9write_all17h6c125576457c7d8dE($3 + 8 | 0 | 0, HEAP32[$0 >> 2] | 0 | 0, $1 | 0, $2 | 0);
  label$1 : {
   $1 = HEAPU8[($3 + 8 | 0) >> 0] | 0;
   if (($1 | 0) == (4 | 0)) {
    break label$1
   }
   i64toi32_i32$1 = HEAP32[($3 + 12 | 0) >> 2] | 0;
   $4 = HEAP32[($3 + 8 | 0) >> 2] | 0;
   $4$hi = i64toi32_i32$1;
   label$2 : {
    if ((HEAPU8[($0 + 4 | 0) >> 0] | 0 | 0) != (3 | 0)) {
     break label$2
    }
    $2 = HEAP32[($0 + 8 | 0) >> 2] | 0;
    FUNCTION_TABLE[HEAP32[(HEAP32[($2 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$2 >> 2] | 0);
    label$3 : {
     $5 = HEAP32[($2 + 4 | 0) >> 2] | 0;
     $6 = HEAP32[($5 + 4 | 0) >> 2] | 0;
     if (!$6) {
      break label$3
     }
     __rust_dealloc(HEAP32[$2 >> 2] | 0 | 0, $6 | 0, HEAP32[($5 + 8 | 0) >> 2] | 0 | 0);
    }
    __rust_dealloc($2 | 0, 12 | 0, 4 | 0);
   }
   i64toi32_i32$1 = $4$hi;
   HEAP32[($0 + 4 | 0) >> 2] = $4;
   HEAP32[($0 + 8 | 0) >> 2] = i64toi32_i32$1;
  }
  __stack_pointer = $3 + 16 | 0;
  return ($1 | 0) != (4 | 0) | 0;
 }
 
 function _ZN3std5panic19get_backtrace_style17hd62cc808c95497adE() {
  var $1 = 0, $0 = 0, $3 = 0, $2 = 0;
  $0 = __stack_pointer - 16 | 0;
  __stack_pointer = $0;
  $1 = 0;
  label$1 : {
   label$2 : {
    switch (HEAP32[(0 + 1059048 | 0) >> 2] | 0 | 0) {
    default:
     _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048928 | 0, 40 | 0, 1050704 | 0);
     abort();
    case 2:
     $1 = 1;
     break label$1;
    case 3:
     $1 = 2;
     break label$1;
    case 1:
     break label$1;
    case 0:
     break label$2;
    };
   }
   _ZN3std3env7_var_os17h3ba0d27289ea0b86E($0 | 0, 1049336 | 0, 14 | 0);
   label$6 : {
    label$7 : {
     $1 = HEAP32[$0 >> 2] | 0;
     if (!$1) {
      break label$7
     }
     $2 = 0;
     $3 = HEAP32[($0 + 4 | 0) >> 2] | 0;
     label$8 : {
      label$9 : {
       switch ((HEAP32[($0 + 8 | 0) >> 2] | 0) + -1 | 0 | 0) {
       case 0:
        $2 = (HEAPU8[$1 >> 0] | 0 | 0) == (48 | 0) ? -2 : 0;
        break label$8;
       case 3:
        break label$9;
       default:
        break label$8;
       };
      }
      $2 = (HEAPU8[$1 >> 0] | 0 | ((HEAPU8[($1 + 1 | 0) >> 0] | 0) << 8 | 0) | 0 | ((HEAPU8[($1 + 2 | 0) >> 0] | 0) << 16 | 0 | ((HEAPU8[($1 + 3 | 0) >> 0] | 0) << 24 | 0) | 0) | 0 | 0) == (1819047270 | 0);
     }
     label$11 : {
      if (!$3) {
       break label$11
      }
      __rust_dealloc($1 | 0, $3 | 0, 1 | 0);
     }
     $3 = 1;
     $1 = 0;
     label$12 : {
      switch ($2 & 3 | 0 | 0) {
      case 1:
       break label$12;
      case 2:
       break label$7;
      default:
       break label$6;
      };
     }
     $3 = 2;
     $1 = 1;
     break label$6;
    }
    $3 = 3;
    $1 = 2;
   }
   HEAP32[(0 + 1059048 | 0) >> 2] = $3;
  }
  __stack_pointer = $0 + 16 | 0;
  return $1 | 0;
 }
 
 function _ZN3std7process5abort17h74127d44f02b51e4E() {
  _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE();
  abort();
 }
 
 function _ZN3std4sync4once4Once15call_once_force28_$u7b$$u7b$closure$u7d$$u7d$17hf1f7ef6a532be73fE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0;
  $2 = HEAP32[$0 >> 2] | 0;
  $0 = HEAP32[$2 >> 2] | 0;
  HEAP32[$2 >> 2] = 0;
  label$1 : {
   label$2 : {
    if (!$0) {
     break label$2
    }
    $2 = __rust_alloc(1024 | 0, 1 | 0) | 0;
    if (!$2) {
     break label$1
    }
    HEAP8[($0 + 28 | 0) >> 0] = 0;
    HEAP8[($0 + 24 | 0) >> 0] = 0;
    i64toi32_i32$0 = 0;
    HEAP32[($0 + 16 | 0) >> 2] = 1024;
    HEAP32[($0 + 20 | 0) >> 2] = i64toi32_i32$0;
    HEAP32[($0 + 12 | 0) >> 2] = $2;
    HEAP32[($0 + 8 | 0) >> 2] = 0;
    i64toi32_i32$0 = 0;
    HEAP32[$0 >> 2] = 0;
    HEAP32[($0 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   }
   _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1048759 | 0, 43 | 0, 1050784 | 0);
   abort();
  }
  _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(1024 | 0, 1 | 0);
  abort();
 }
 
 function _ZN76_$LT$std__sync__poison__PoisonError$LT$T$GT$$u20$as$u20$core__fmt__Debug$GT$3fmt17h57b616b64dbb7c21E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  _ZN4core3fmt9Formatter12debug_struct17h4e73711e0f9f87d6E($2 + 8 | 0 | 0, $1 | 0, 1050952 | 0, 11 | 0);
  $1 = _ZN4core3fmt8builders11DebugStruct21finish_non_exhaustive17h6db77858e25e5c86E($2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 16 | 0;
  return $1 | 0;
 }
 
 function _ZN91_$LT$std__sys_common__backtrace___print__DisplayBacktrace$u20$as$u20$core__fmt__Display$GT$3fmt17h72bede60375d7d67E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $4 = 0, i64toi32_i32$0 = 0, $5 = 0, $6 = 0, $3 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  $3 = HEAPU8[$0 >> 0] | 0;
  _ZN3std3env11current_dir17h34aa826b63dc649bE($2 + 8 | 0 | 0);
  label$1 : {
   label$2 : {
    if (HEAP32[($2 + 8 | 0) >> 2] | 0) {
     break label$2
    }
    $4 = HEAP32[($2 + 16 | 0) >> 2] | 0;
    $0 = HEAP32[($2 + 12 | 0) >> 2] | 0;
    break label$1;
   }
   $0 = 0;
   label$3 : {
    if ((HEAPU8[($2 + 12 | 0) >> 0] | 0 | 0) != (3 | 0)) {
     break label$3
    }
    $4 = HEAP32[($2 + 16 | 0) >> 2] | 0;
    FUNCTION_TABLE[HEAP32[(HEAP32[($4 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$4 >> 2] | 0);
    label$4 : {
     $5 = HEAP32[($4 + 4 | 0) >> 2] | 0;
     $6 = HEAP32[($5 + 4 | 0) >> 2] | 0;
     if (!$6) {
      break label$4
     }
     __rust_dealloc(HEAP32[$4 >> 2] | 0 | 0, $6 | 0, HEAP32[($5 + 8 | 0) >> 2] | 0 | 0);
    }
    __rust_dealloc($4 | 0, 12 | 0, 4 | 0);
   }
  }
  HEAP32[($2 + 28 | 0) >> 2] = 0;
  HEAP32[($2 + 24 | 0) >> 2] = 1048692;
  i64toi32_i32$0 = 0;
  HEAP32[($2 + 12 | 0) >> 2] = 1;
  HEAP32[($2 + 16 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($2 + 8 | 0) >> 2] = 1050980;
  label$5 : {
   label$6 : {
    label$7 : {
     if (_ZN4core3fmt9Formatter9write_fmt17h32544406667db88aE($1 | 0, $2 + 8 | 0 | 0) | 0) {
      break label$7
     }
     label$8 : {
      if ($3 & 255 | 0) {
       break label$8
      }
      HEAP32[($2 + 28 | 0) >> 2] = 0;
      HEAP32[($2 + 24 | 0) >> 2] = 1048692;
      i64toi32_i32$0 = 0;
      HEAP32[($2 + 12 | 0) >> 2] = 1;
      HEAP32[($2 + 16 | 0) >> 2] = i64toi32_i32$0;
      HEAP32[($2 + 8 | 0) >> 2] = 1051076;
      if (_ZN4core3fmt9Formatter9write_fmt17h32544406667db88aE($1 | 0, $2 + 8 | 0 | 0) | 0) {
       break label$7
      }
     }
     $1 = 0;
     if (!$0) {
      break label$5
     }
     if (!$4) {
      break label$5
     }
     break label$6;
    }
    $1 = 1;
    if (!$0) {
     break label$5
    }
    if (!$4) {
     break label$5
    }
   }
   __rust_dealloc($0 | 0, $4 | 0, 1 | 0);
  }
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN3std10sys_common9backtrace26__rust_end_short_backtrace17hbfd28f296b351783E($0) {
  $0 = $0 | 0;
  _ZN3std9panicking19begin_panic_handler28_$u7b$$u7b$closure$u7d$$u7d$17h12a46dd1ec9ad9efE(HEAP32[$0 >> 2] | 0 | 0, HEAP32[($0 + 4 | 0) >> 2] | 0 | 0, HEAP32[($0 + 8 | 0) >> 2] | 0 | 0);
  abort();
 }
 
 function _ZN3std9panicking19begin_panic_handler28_$u7b$$u7b$closure$u7d$$u7d$17h12a46dd1ec9ad9efE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $4 = 0;
  $3 = __stack_pointer - 16 | 0;
  __stack_pointer = $3;
  $4 = HEAP32[($0 + 20 | 0) >> 2] | 0;
  label$1 : {
   label$2 : {
    label$3 : {
     switch (HEAP32[($0 + 4 | 0) >> 2] | 0 | 0) {
     case 0:
      if ($4) {
       break label$1
      }
      $0 = 1048692;
      $4 = 0;
      break label$2;
     case 1:
      break label$3;
     default:
      break label$1;
     };
    }
    if ($4) {
     break label$1
    }
    $0 = HEAP32[$0 >> 2] | 0;
    $4 = HEAP32[($0 + 4 | 0) >> 2] | 0;
    $0 = HEAP32[$0 >> 2] | 0;
   }
   HEAP32[($3 + 4 | 0) >> 2] = $4;
   HEAP32[$3 >> 2] = $0;
   _ZN3std9panicking20rust_panic_with_hook17h34503c79e5f975a0E($3 | 0, 1051708 | 0, _ZN4core5panic10panic_info9PanicInfo7message17ha3f77d3d16253e49E($1 | 0) | 0 | 0, $2 | 0, _ZN4core5panic10panic_info9PanicInfo10can_unwind17h6aa0afbb95410b80E($1 | 0) | 0 | 0);
   abort();
  }
  HEAP32[($3 + 4 | 0) >> 2] = 0;
  HEAP32[$3 >> 2] = $0;
  _ZN3std9panicking20rust_panic_with_hook17h34503c79e5f975a0E($3 | 0, 1051688 | 0, _ZN4core5panic10panic_info9PanicInfo7message17ha3f77d3d16253e49E($1 | 0) | 0 | 0, $2 | 0, _ZN4core5panic10panic_info9PanicInfo10can_unwind17h6aa0afbb95410b80E($1 | 0) | 0 | 0);
  abort();
 }
 
 function _ZN3std5alloc24default_alloc_error_hook17h9f962deb47fde5d6E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, i64toi32_i32$0 = 0;
  $2 = __stack_pointer - 64 | 0;
  __stack_pointer = $2;
  label$1 : {
   if (HEAPU8[(0 + 1059008 | 0) >> 0] | 0) {
    break label$1
   }
   HEAP32[($2 + 4 | 0) >> 2] = 5;
   HEAP32[($2 + 12 | 0) >> 2] = $0;
   HEAP32[$2 >> 2] = $2 + 12 | 0;
   HEAP8[($2 + 20 | 0) >> 0] = 4;
   HEAP32[($2 + 16 | 0) >> 2] = $2 + 56 | 0;
   HEAP32[($2 + 52 | 0) >> 2] = 1;
   i64toi32_i32$0 = 0;
   HEAP32[($2 + 36 | 0) >> 2] = 2;
   HEAP32[($2 + 40 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($2 + 32 | 0) >> 2] = 1051272;
   HEAP32[($2 + 48 | 0) >> 2] = $2;
   label$2 : {
    label$3 : {
     if (!(_ZN4core3fmt5write17h6461900980c16fcdE($2 + 16 | 0 | 0, 1050656 | 0, $2 + 32 | 0 | 0) | 0)) {
      break label$3
     }
     if ((HEAPU8[($2 + 20 | 0) >> 0] | 0 | 0) == (4 | 0)) {
      break label$2
     }
     if ((HEAPU8[($2 + 20 | 0) >> 0] | 0 | 0) != (3 | 0)) {
      break label$2
     }
     $0 = HEAP32[($2 + 24 | 0) >> 2] | 0;
     FUNCTION_TABLE[HEAP32[(HEAP32[($0 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0);
     label$4 : {
      $3 = HEAP32[($0 + 4 | 0) >> 2] | 0;
      $4 = HEAP32[($3 + 4 | 0) >> 2] | 0;
      if (!$4) {
       break label$4
      }
      __rust_dealloc(HEAP32[$0 >> 2] | 0 | 0, $4 | 0, HEAP32[($3 + 8 | 0) >> 2] | 0 | 0);
     }
     __rust_dealloc($0 | 0, 12 | 0, 4 | 0);
     break label$2;
    }
    if ((HEAPU8[($2 + 20 | 0) >> 0] | 0 | 0) != (3 | 0)) {
     break label$2
    }
    $0 = HEAP32[($2 + 24 | 0) >> 2] | 0;
    FUNCTION_TABLE[HEAP32[(HEAP32[($0 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0);
    label$5 : {
     $3 = HEAP32[($0 + 4 | 0) >> 2] | 0;
     $4 = HEAP32[($3 + 4 | 0) >> 2] | 0;
     if (!$4) {
      break label$5
     }
     __rust_dealloc(HEAP32[$0 >> 2] | 0 | 0, $4 | 0, HEAP32[($3 + 8 | 0) >> 2] | 0 | 0);
    }
    __rust_dealloc(HEAP32[($2 + 24 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
   }
   __stack_pointer = $2 + 64 | 0;
   return;
  }
  HEAP32[($2 + 52 | 0) >> 2] = 1;
  i64toi32_i32$0 = 0;
  HEAP32[($2 + 36 | 0) >> 2] = 2;
  HEAP32[($2 + 40 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($2 + 32 | 0) >> 2] = 1051272;
  HEAP32[($2 + 20 | 0) >> 2] = 5;
  HEAP32[$2 >> 2] = $0;
  HEAP32[($2 + 48 | 0) >> 2] = $2 + 16 | 0;
  HEAP32[($2 + 16 | 0) >> 2] = $2;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($2 + 32 | 0 | 0, 1051312 | 0);
  abort();
 }
 
 function rust_oom($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = HEAP32[(0 + 1059056 | 0) >> 2] | 0;
  FUNCTION_TABLE[($2 ? $2 : 6) | 0]($0, $1);
  _ZN3std7process5abort17h74127d44f02b51e4E();
  abort();
 }
 
 function __rdl_alloc($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  label$1 : {
   label$2 : {
    if ($1 >>> 0 > 8 >>> 0) {
     break label$2
    }
    if ($1 >>> 0 <= $0 >>> 0) {
     break label$1
    }
   }
   return aligned_alloc($1 | 0, $0 | 0) | 0 | 0;
  }
  return malloc($0 | 0) | 0 | 0;
 }
 
 function __rdl_dealloc($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  free($0 | 0);
 }
 
 function __rdl_realloc($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  label$1 : {
   label$2 : {
    if ($2 >>> 0 > 8 >>> 0) {
     break label$2
    }
    if ($2 >>> 0 <= $3 >>> 0) {
     break label$1
    }
   }
   label$3 : {
    $2 = aligned_alloc($2 | 0, $3 | 0) | 0;
    if ($2) {
     break label$3
    }
    return 0 | 0;
   }
   $3 = memcpy($2 | 0, $0 | 0, ($1 >>> 0 > $3 >>> 0 ? $3 : $1) | 0) | 0;
   free($0 | 0);
   return $3 | 0;
  }
  return realloc($0 | 0, $3 | 0) | 0 | 0;
 }
 
 function _ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h088b9b7f9133fce0E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, i64toi32_i32$0 = 0, $4 = 0, $5 = 0, $6 = 0;
  $3 = __stack_pointer - 64 | 0;
  __stack_pointer = $3;
  HEAP32[($3 + 20 | 0) >> 2] = 3;
  HEAP32[(($3 + 32 | 0) + 20 | 0) >> 2] = 7;
  HEAP32[($3 + 44 | 0) >> 2] = 3;
  i64toi32_i32$0 = 0;
  HEAP32[($3 + 4 | 0) >> 2] = 4;
  HEAP32[($3 + 8 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[$3 >> 2] = 1051504;
  HEAP32[($3 + 36 | 0) >> 2] = 3;
  HEAP32[($3 + 48 | 0) >> 2] = HEAP32[($0 + 8 | 0) >> 2] | 0;
  HEAP32[($3 + 40 | 0) >> 2] = HEAP32[($0 + 4 | 0) >> 2] | 0;
  HEAP32[($3 + 32 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
  HEAP32[($3 + 16 | 0) >> 2] = $3 + 32 | 0;
  $4 = HEAP32[($2 + 36 | 0) >> 2] | 0;
  FUNCTION_TABLE[$4 | 0]($3 + 24 | 0, $1, $3);
  label$1 : {
   if ((HEAPU8[($3 + 24 | 0) >> 0] | 0 | 0) != (3 | 0)) {
    break label$1
   }
   $2 = HEAP32[($3 + 28 | 0) >> 2] | 0;
   FUNCTION_TABLE[HEAP32[(HEAP32[($2 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$2 >> 2] | 0);
   label$2 : {
    $5 = HEAP32[($2 + 4 | 0) >> 2] | 0;
    $6 = HEAP32[($5 + 4 | 0) >> 2] | 0;
    if (!$6) {
     break label$2
    }
    __rust_dealloc(HEAP32[$2 >> 2] | 0 | 0, $6 | 0, HEAP32[($5 + 8 | 0) >> 2] | 0 | 0);
   }
   __rust_dealloc($2 | 0, 12 | 0, 4 | 0);
  }
  label$3 : {
   label$4 : {
    label$5 : {
     $0 = HEAPU8[(HEAP32[($0 + 12 | 0) >> 2] | 0) >> 0] | 0;
     if (($0 | 0) == (3 | 0)) {
      break label$5
     }
     label$6 : {
      switch ($0 | 0) {
      default:
       $0 = HEAPU8[(0 + 1059052 | 0) >> 0] | 0;
       HEAP8[(0 + 1059052 | 0) >> 0] = 1;
       HEAP8[$3 >> 0] = $0;
       if ($0) {
        break label$4
       }
       HEAP32[($3 + 52 | 0) >> 2] = 1;
       i64toi32_i32$0 = 0;
       HEAP32[($3 + 36 | 0) >> 2] = 1;
       HEAP32[($3 + 40 | 0) >> 2] = i64toi32_i32$0;
       HEAP32[($3 + 32 | 0) >> 2] = 1049352;
       HEAP32[($3 + 4 | 0) >> 2] = 8;
       HEAP8[($3 + 63 | 0) >> 0] = 0;
       HEAP32[($3 + 48 | 0) >> 2] = $3;
       HEAP32[$3 >> 2] = $3 + 63 | 0;
       FUNCTION_TABLE[$4 | 0]($3 + 24 | 0, $1, $3 + 32 | 0);
       HEAP8[(0 + 1059052 | 0) >> 0] = 0;
       if ((HEAPU8[($3 + 24 | 0) >> 0] | 0 | 0) != (3 | 0)) {
        break label$5
       }
       $0 = HEAP32[($3 + 28 | 0) >> 2] | 0;
       FUNCTION_TABLE[HEAP32[(HEAP32[($0 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0);
       label$9 : {
        $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
        $2 = HEAP32[($1 + 4 | 0) >> 2] | 0;
        if (!$2) {
         break label$9
        }
        __rust_dealloc(HEAP32[$0 >> 2] | 0 | 0, $2 | 0, HEAP32[($1 + 8 | 0) >> 2] | 0 | 0);
       }
       __rust_dealloc($0 | 0, 12 | 0, 4 | 0);
       break label$5;
      case 1:
       $0 = HEAPU8[(0 + 1059052 | 0) >> 0] | 0;
       HEAP8[(0 + 1059052 | 0) >> 0] = 1;
       HEAP8[$3 >> 0] = $0;
       if ($0) {
        break label$3
       }
       HEAP32[($3 + 52 | 0) >> 2] = 1;
       i64toi32_i32$0 = 0;
       HEAP32[($3 + 36 | 0) >> 2] = 1;
       HEAP32[($3 + 40 | 0) >> 2] = i64toi32_i32$0;
       HEAP32[($3 + 32 | 0) >> 2] = 1049352;
       HEAP32[($3 + 4 | 0) >> 2] = 8;
       HEAP8[($3 + 63 | 0) >> 0] = 1;
       HEAP32[($3 + 48 | 0) >> 2] = $3;
       HEAP32[$3 >> 2] = $3 + 63 | 0;
       FUNCTION_TABLE[$4 | 0]($3 + 24 | 0, $1, $3 + 32 | 0);
       HEAP8[(0 + 1059052 | 0) >> 0] = 0;
       if ((HEAPU8[($3 + 24 | 0) >> 0] | 0 | 0) != (3 | 0)) {
        break label$5
       }
       $0 = HEAP32[($3 + 28 | 0) >> 2] | 0;
       FUNCTION_TABLE[HEAP32[(HEAP32[($0 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0);
       label$10 : {
        $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
        $2 = HEAP32[($1 + 4 | 0) >> 2] | 0;
        if (!$2) {
         break label$10
        }
        __rust_dealloc(HEAP32[$0 >> 2] | 0 | 0, $2 | 0, HEAP32[($1 + 8 | 0) >> 2] | 0 | 0);
       }
       __rust_dealloc($0 | 0, 12 | 0, 4 | 0);
       break label$5;
      case 2:
       break label$6;
      };
     }
     $0 = HEAPU8[(0 + 1059e3 | 0) >> 0] | 0;
     HEAP8[(0 + 1059e3 | 0) >> 0] = 0;
     if (!$0) {
      break label$5
     }
     HEAP32[($3 + 52 | 0) >> 2] = 0;
     HEAP32[($3 + 48 | 0) >> 2] = 1048692;
     i64toi32_i32$0 = 0;
     HEAP32[($3 + 36 | 0) >> 2] = 1;
     HEAP32[($3 + 40 | 0) >> 2] = i64toi32_i32$0;
     HEAP32[($3 + 32 | 0) >> 2] = 1051616;
     FUNCTION_TABLE[$4 | 0]($3, $1, $3 + 32 | 0);
     if ((HEAPU8[$3 >> 0] | 0 | 0) != (3 | 0)) {
      break label$5
     }
     $0 = HEAP32[($3 + 4 | 0) >> 2] | 0;
     FUNCTION_TABLE[HEAP32[(HEAP32[($0 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0);
     label$11 : {
      $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
      $2 = HEAP32[($1 + 4 | 0) >> 2] | 0;
      if (!$2) {
       break label$11
      }
      __rust_dealloc(HEAP32[$0 >> 2] | 0 | 0, $2 | 0, HEAP32[($1 + 8 | 0) >> 2] | 0 | 0);
     }
     __rust_dealloc($0 | 0, 12 | 0, 4 | 0);
    }
    __stack_pointer = $3 + 64 | 0;
    return;
   }
   HEAP32[($3 + 52 | 0) >> 2] = 0;
   HEAP32[($3 + 48 | 0) >> 2] = 1048692;
   i64toi32_i32$0 = 0;
   HEAP32[($3 + 36 | 0) >> 2] = 1;
   HEAP32[($3 + 40 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($3 + 32 | 0) >> 2] = 1052180;
   _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($3 | 0, $3 + 32 | 0 | 0);
   abort();
  }
  HEAP32[($3 + 52 | 0) >> 2] = 0;
  HEAP32[($3 + 48 | 0) >> 2] = 1048692;
  i64toi32_i32$0 = 0;
  HEAP32[($3 + 36 | 0) >> 2] = 1;
  HEAP32[($3 + 40 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($3 + 32 | 0) >> 2] = 1052180;
  _ZN4core9panicking13assert_failed17h0255cd94585a9a55E($3 | 0, $3 + 32 | 0 | 0);
  abort();
 }
 
 function rust_begin_unwind($0) {
  $0 = $0 | 0;
  var $1 = 0, $2 = 0, $3 = 0;
  $1 = __stack_pointer - 16 | 0;
  __stack_pointer = $1;
  $2 = _ZN4core6option15Option$LT$T$GT$6unwrap17hd1aea567a48242ffE(_ZN4core5panic10panic_info9PanicInfo8location17h07198a946bdf74c0E($0 | 0) | 0 | 0, 1051624 | 0) | 0;
  $3 = _ZN4core6option15Option$LT$T$GT$6unwrap17h3c1dc1c9e80b23ceE(_ZN4core5panic10panic_info9PanicInfo7message17ha3f77d3d16253e49E($0 | 0) | 0 | 0) | 0;
  HEAP32[($1 + 8 | 0) >> 2] = $2;
  HEAP32[($1 + 4 | 0) >> 2] = $0;
  HEAP32[$1 >> 2] = $3;
  _ZN3std10sys_common9backtrace26__rust_end_short_backtrace17hbfd28f296b351783E($1 | 0);
  abort();
 }
 
 function _ZN90_$LT$std__panicking__begin_panic_handler__PanicPayload$u20$as$u20$core__panic__BoxMeUp$GT$8take_box17h2139a21a98a2a540E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, $2 = 0, $4 = 0, $3 = 0, $5 = 0, $29 = 0, $35 = 0, $38 = 0, $50 = 0, $6 = 0, $6$hi = 0, $69 = 0;
  $2 = __stack_pointer - 48 | 0;
  __stack_pointer = $2;
  $3 = $1 + 4 | 0;
  label$1 : {
   if (HEAP32[($1 + 4 | 0) >> 2] | 0) {
    break label$1
   }
   $4 = HEAP32[$1 >> 2] | 0;
   $5 = ($2 + 8 | 0) + 8 | 0;
   HEAP32[$5 >> 2] = 0;
   i64toi32_i32$1 = $2;
   i64toi32_i32$0 = 0;
   HEAP32[(i64toi32_i32$1 + 8 | 0) >> 2] = 1;
   HEAP32[(i64toi32_i32$1 + 12 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[(i64toi32_i32$1 + 20 | 0) >> 2] = i64toi32_i32$1 + 8 | 0;
   i64toi32_i32$2 = $4 + 16 | 0;
   i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   $29 = i64toi32_i32$0;
   i64toi32_i32$0 = ($2 + 24 | 0) + 16 | 0;
   HEAP32[i64toi32_i32$0 >> 2] = $29;
   HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
   i64toi32_i32$2 = $4 + 8 | 0;
   i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   $35 = i64toi32_i32$1;
   i64toi32_i32$1 = ($2 + 24 | 0) + 8 | 0;
   HEAP32[i64toi32_i32$1 >> 2] = $35;
   HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
   i64toi32_i32$2 = $4;
   i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   $38 = i64toi32_i32$0;
   i64toi32_i32$0 = $2;
   HEAP32[(i64toi32_i32$0 + 24 | 0) >> 2] = $38;
   HEAP32[(i64toi32_i32$0 + 28 | 0) >> 2] = i64toi32_i32$1;
   _ZN4core3fmt5write17h6461900980c16fcdE(i64toi32_i32$0 + 20 | 0 | 0, 1048620 | 0, i64toi32_i32$0 + 24 | 0 | 0) | 0;
   HEAP32[($3 + 8 | 0) >> 2] = HEAP32[$5 >> 2] | 0;
   i64toi32_i32$2 = i64toi32_i32$0;
   i64toi32_i32$1 = HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] | 0;
   i64toi32_i32$0 = HEAP32[(i64toi32_i32$0 + 12 | 0) >> 2] | 0;
   $50 = i64toi32_i32$1;
   i64toi32_i32$1 = $3;
   HEAP32[i64toi32_i32$1 >> 2] = $50;
   HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  }
  $4 = ($2 + 24 | 0) + 8 | 0;
  HEAP32[$4 >> 2] = HEAP32[($3 + 8 | 0) >> 2] | 0;
  HEAP32[($1 + 12 | 0) >> 2] = 0;
  i64toi32_i32$2 = $3;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $6 = i64toi32_i32$0;
  $6$hi = i64toi32_i32$1;
  i64toi32_i32$0 = $1;
  i64toi32_i32$1 = 0;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = 1;
  HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$1 = $6$hi;
  i64toi32_i32$0 = $2;
  HEAP32[(i64toi32_i32$0 + 24 | 0) >> 2] = $6;
  HEAP32[(i64toi32_i32$0 + 28 | 0) >> 2] = i64toi32_i32$1;
  label$2 : {
   $1 = __rust_alloc(12 | 0, 4 | 0) | 0;
   if ($1) {
    break label$2
   }
   _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(12 | 0, 4 | 0);
   abort();
  }
  i64toi32_i32$2 = $2;
  i64toi32_i32$1 = HEAP32[($2 + 24 | 0) >> 2] | 0;
  i64toi32_i32$0 = HEAP32[($2 + 28 | 0) >> 2] | 0;
  $69 = i64toi32_i32$1;
  i64toi32_i32$1 = $1;
  HEAP32[i64toi32_i32$1 >> 2] = $69;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[(i64toi32_i32$1 + 8 | 0) >> 2] = HEAP32[$4 >> 2] | 0;
  HEAP32[($0 + 4 | 0) >> 2] = 1051656;
  HEAP32[$0 >> 2] = i64toi32_i32$1;
  __stack_pointer = $2 + 48 | 0;
 }
 
 function _ZN90_$LT$std__panicking__begin_panic_handler__PanicPayload$u20$as$u20$core__panic__BoxMeUp$GT$3get17h123aa22be66f3217E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, $3 = 0, $4 = 0, $27 = 0, $33 = 0, $36 = 0, $48 = 0;
  $2 = __stack_pointer - 48 | 0;
  __stack_pointer = $2;
  $3 = $1 + 4 | 0;
  label$1 : {
   if (HEAP32[($1 + 4 | 0) >> 2] | 0) {
    break label$1
   }
   $1 = HEAP32[$1 >> 2] | 0;
   $4 = ($2 + 8 | 0) + 8 | 0;
   HEAP32[$4 >> 2] = 0;
   i64toi32_i32$1 = $2;
   i64toi32_i32$0 = 0;
   HEAP32[($2 + 8 | 0) >> 2] = 1;
   HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($2 + 20 | 0) >> 2] = $2 + 8 | 0;
   i64toi32_i32$2 = $1 + 16 | 0;
   i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   $27 = i64toi32_i32$0;
   i64toi32_i32$0 = ($2 + 24 | 0) + 16 | 0;
   HEAP32[i64toi32_i32$0 >> 2] = $27;
   HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
   i64toi32_i32$2 = $1 + 8 | 0;
   i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   $33 = i64toi32_i32$1;
   i64toi32_i32$1 = ($2 + 24 | 0) + 8 | 0;
   HEAP32[i64toi32_i32$1 >> 2] = $33;
   HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
   i64toi32_i32$2 = $1;
   i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   $36 = i64toi32_i32$0;
   i64toi32_i32$0 = $2;
   HEAP32[($2 + 24 | 0) >> 2] = $36;
   HEAP32[($2 + 28 | 0) >> 2] = i64toi32_i32$1;
   _ZN4core3fmt5write17h6461900980c16fcdE($2 + 20 | 0 | 0, 1048620 | 0, $2 + 24 | 0 | 0) | 0;
   HEAP32[($3 + 8 | 0) >> 2] = HEAP32[$4 >> 2] | 0;
   i64toi32_i32$2 = $2;
   i64toi32_i32$1 = HEAP32[($2 + 8 | 0) >> 2] | 0;
   i64toi32_i32$0 = HEAP32[($2 + 12 | 0) >> 2] | 0;
   $48 = i64toi32_i32$1;
   i64toi32_i32$1 = $3;
   HEAP32[i64toi32_i32$1 >> 2] = $48;
   HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  }
  HEAP32[($0 + 4 | 0) >> 2] = 1051656;
  HEAP32[$0 >> 2] = $3;
  __stack_pointer = $2 + 48 | 0;
 }
 
 function _ZN93_$LT$std__panicking__begin_panic_handler__StrPanicPayload$u20$as$u20$core__panic__BoxMeUp$GT$8take_box17h85a56aa9f7c333a7E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0;
  $2 = HEAP32[($1 + 4 | 0) >> 2] | 0;
  $3 = HEAP32[$1 >> 2] | 0;
  label$1 : {
   $1 = __rust_alloc(8 | 0, 4 | 0) | 0;
   if ($1) {
    break label$1
   }
   _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(8 | 0, 4 | 0);
   abort();
  }
  HEAP32[($1 + 4 | 0) >> 2] = $2;
  HEAP32[$1 >> 2] = $3;
  HEAP32[($0 + 4 | 0) >> 2] = 1051672;
  HEAP32[$0 >> 2] = $1;
 }
 
 function _ZN93_$LT$std__panicking__begin_panic_handler__StrPanicPayload$u20$as$u20$core__panic__BoxMeUp$GT$3get17hb34e8b1f5c511f2fE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  HEAP32[($0 + 4 | 0) >> 2] = 1051672;
  HEAP32[$0 >> 2] = $1;
 }
 
 function _ZN3std9panicking20rust_panic_with_hook17h34503c79e5f975a0E($0, $1, $2, $3, $4) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  var $5 = 0, $6 = 0, $7 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $43 = 0, $201 = 0;
  $5 = __stack_pointer - 112 | 0;
  __stack_pointer = $5;
  $6 = HEAP32[(0 + 1059072 | 0) >> 2] | 0;
  HEAP32[(0 + 1059072 | 0) >> 2] = $6 + 1 | 0;
  $7 = (HEAP32[(0 + 1059096 | 0) >> 2] | 0) + 1 | 0;
  HEAP32[(0 + 1059096 | 0) >> 2] = $7;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if (($6 | 0) < (0 | 0)) {
       break label$4
      }
      if ($7 >>> 0 > 2 >>> 0) {
       break label$4
      }
      HEAP8[($5 + 32 | 0) >> 0] = $4;
      HEAP32[($5 + 28 | 0) >> 2] = $3;
      HEAP32[($5 + 24 | 0) >> 2] = $2;
      $6 = HEAP32[(0 + 1059060 | 0) >> 2] | 0;
      if (($6 | 0) <= (-1 | 0)) {
       break label$2
      }
      HEAP32[(0 + 1059060 | 0) >> 2] = $6 + 1 | 0;
      $6 = HEAP32[(0 + 1059068 | 0) >> 2] | 0;
      if (!$6) {
       break label$3
      }
      $2 = HEAP32[(0 + 1059064 | 0) >> 2] | 0;
      FUNCTION_TABLE[HEAP32[($1 + 16 | 0) >> 2] | 0 | 0]($5 + 8 | 0, $0);
      i64toi32_i32$0 = HEAP32[($5 + 8 | 0) >> 2] | 0;
      i64toi32_i32$1 = HEAP32[($5 + 12 | 0) >> 2] | 0;
      $43 = i64toi32_i32$0;
      i64toi32_i32$0 = $5;
      HEAP32[($5 + 16 | 0) >> 2] = $43;
      HEAP32[($5 + 20 | 0) >> 2] = i64toi32_i32$1;
      FUNCTION_TABLE[HEAP32[($6 + 20 | 0) >> 2] | 0 | 0]($2, $5 + 16 | 0);
      break label$1;
     }
     label$5 : {
      label$6 : {
       if ($7 >>> 0 > 2 >>> 0) {
        break label$6
       }
       HEAP8[($5 + 64 | 0) >> 0] = $4;
       HEAP32[($5 + 60 | 0) >> 2] = $3;
       HEAP32[($5 + 56 | 0) >> 2] = $2;
       HEAP32[($5 + 52 | 0) >> 2] = 1048708;
       HEAP32[($5 + 48 | 0) >> 2] = 1048692;
       HEAP32[($5 + 76 | 0) >> 2] = 9;
       HEAP32[($5 + 72 | 0) >> 2] = $5 + 48 | 0;
       HEAP8[($5 + 20 | 0) >> 0] = 4;
       HEAP32[($5 + 16 | 0) >> 2] = $5 + 104 | 0;
       HEAP32[($5 + 100 | 0) >> 2] = 1;
       i64toi32_i32$0 = $5;
       i64toi32_i32$1 = 0;
       HEAP32[($5 + 84 | 0) >> 2] = 2;
       HEAP32[($5 + 88 | 0) >> 2] = i64toi32_i32$1;
       HEAP32[($5 + 80 | 0) >> 2] = 1051840;
       HEAP32[($5 + 96 | 0) >> 2] = $5 + 72 | 0;
       label$7 : {
        if (!(_ZN4core3fmt5write17h6461900980c16fcdE($5 + 16 | 0 | 0, 1050656 | 0, $5 + 80 | 0 | 0) | 0)) {
         break label$7
        }
        if ((HEAPU8[($5 + 20 | 0) >> 0] | 0 | 0) == (4 | 0)) {
         break label$5
        }
        if ((HEAPU8[($5 + 20 | 0) >> 0] | 0 | 0) != (3 | 0)) {
         break label$5
        }
        $5 = HEAP32[($5 + 24 | 0) >> 2] | 0;
        FUNCTION_TABLE[HEAP32[(HEAP32[($5 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$5 >> 2] | 0);
        label$8 : {
         $7 = HEAP32[($5 + 4 | 0) >> 2] | 0;
         $6 = HEAP32[($7 + 4 | 0) >> 2] | 0;
         if (!$6) {
          break label$8
         }
         __rust_dealloc(HEAP32[$5 >> 2] | 0 | 0, $6 | 0, HEAP32[($7 + 8 | 0) >> 2] | 0 | 0);
        }
        __rust_dealloc($5 | 0, 12 | 0, 4 | 0);
        _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE();
        abort();
       }
       if ((HEAPU8[($5 + 20 | 0) >> 0] | 0 | 0) != (3 | 0)) {
        break label$5
       }
       $7 = HEAP32[($5 + 24 | 0) >> 2] | 0;
       FUNCTION_TABLE[HEAP32[(HEAP32[($7 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$7 >> 2] | 0);
       label$9 : {
        $6 = HEAP32[($7 + 4 | 0) >> 2] | 0;
        $4 = HEAP32[($6 + 4 | 0) >> 2] | 0;
        if (!$4) {
         break label$9
        }
        __rust_dealloc(HEAP32[$7 >> 2] | 0 | 0, $4 | 0, HEAP32[($6 + 8 | 0) >> 2] | 0 | 0);
       }
       __rust_dealloc(HEAP32[($5 + 24 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
       _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE();
       abort();
      }
      HEAP8[($5 + 52 | 0) >> 0] = 4;
      HEAP32[($5 + 48 | 0) >> 2] = $5 + 104 | 0;
      HEAP32[($5 + 100 | 0) >> 2] = 0;
      HEAP32[($5 + 96 | 0) >> 2] = 1048692;
      i64toi32_i32$0 = $5;
      i64toi32_i32$1 = 0;
      HEAP32[($5 + 84 | 0) >> 2] = 1;
      HEAP32[($5 + 88 | 0) >> 2] = i64toi32_i32$1;
      HEAP32[($5 + 80 | 0) >> 2] = 1051780;
      label$10 : {
       if (!(_ZN4core3fmt5write17h6461900980c16fcdE($5 + 48 | 0 | 0, 1050656 | 0, $5 + 80 | 0 | 0) | 0)) {
        break label$10
       }
       if ((HEAPU8[($5 + 52 | 0) >> 0] | 0 | 0) == (4 | 0)) {
        break label$5
       }
       if ((HEAPU8[($5 + 52 | 0) >> 0] | 0 | 0) != (3 | 0)) {
        break label$5
       }
       $5 = HEAP32[($5 + 56 | 0) >> 2] | 0;
       FUNCTION_TABLE[HEAP32[(HEAP32[($5 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$5 >> 2] | 0);
       label$11 : {
        $7 = HEAP32[($5 + 4 | 0) >> 2] | 0;
        $6 = HEAP32[($7 + 4 | 0) >> 2] | 0;
        if (!$6) {
         break label$11
        }
        __rust_dealloc(HEAP32[$5 >> 2] | 0 | 0, $6 | 0, HEAP32[($7 + 8 | 0) >> 2] | 0 | 0);
       }
       __rust_dealloc($5 | 0, 12 | 0, 4 | 0);
       _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE();
       abort();
      }
      if ((HEAPU8[($5 + 52 | 0) >> 0] | 0 | 0) != (3 | 0)) {
       break label$5
      }
      $7 = HEAP32[($5 + 56 | 0) >> 2] | 0;
      FUNCTION_TABLE[HEAP32[(HEAP32[($7 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0](HEAP32[$7 >> 2] | 0);
      label$12 : {
       $6 = HEAP32[($7 + 4 | 0) >> 2] | 0;
       $4 = HEAP32[($6 + 4 | 0) >> 2] | 0;
       if (!$4) {
        break label$12
       }
       __rust_dealloc(HEAP32[$7 >> 2] | 0 | 0, $4 | 0, HEAP32[($6 + 8 | 0) >> 2] | 0 | 0);
      }
      __rust_dealloc(HEAP32[($5 + 56 | 0) >> 2] | 0 | 0, 12 | 0, 4 | 0);
     }
     _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE();
     abort();
    }
    FUNCTION_TABLE[HEAP32[($1 + 16 | 0) >> 2] | 0 | 0]($5, $0);
    i64toi32_i32$1 = HEAP32[$5 >> 2] | 0;
    i64toi32_i32$0 = HEAP32[($5 + 4 | 0) >> 2] | 0;
    $201 = i64toi32_i32$1;
    i64toi32_i32$1 = $5;
    HEAP32[($5 + 16 | 0) >> 2] = $201;
    HEAP32[($5 + 20 | 0) >> 2] = i64toi32_i32$0;
    _ZN3std9panicking12default_hook17hd71c2b290711a70bE($5 + 16 | 0 | 0);
    break label$1;
   }
   HEAP32[(($5 + 48 | 0) + 20 | 0) >> 2] = 1;
   HEAP32[(($5 + 80 | 0) + 20 | 0) >> 2] = 0;
   i64toi32_i32$1 = $5;
   i64toi32_i32$0 = 0;
   HEAP32[($5 + 52 | 0) >> 2] = 2;
   HEAP32[($5 + 56 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($5 + 48 | 0) >> 2] = 1049084;
   HEAP32[($5 + 76 | 0) >> 2] = 10;
   HEAP32[($5 + 96 | 0) >> 2] = 1048692;
   i64toi32_i32$1 = $5;
   i64toi32_i32$0 = 0;
   HEAP32[($5 + 84 | 0) >> 2] = 1;
   HEAP32[($5 + 88 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($5 + 80 | 0) >> 2] = 1052288;
   HEAP32[($5 + 64 | 0) >> 2] = $5 + 72 | 0;
   HEAP32[($5 + 72 | 0) >> 2] = $5 + 80 | 0;
   _ZN3std2io5Write9write_fmt17hdb49789eaf08346bE($5 + 40 | 0 | 0, $5 + 104 | 0 | 0, $5 + 48 | 0 | 0);
   _ZN4core3ptr81drop_in_place$LT$core__result__Result$LT$$LP$$RP$$C$std__io__error__Error$GT$$GT$17hdba6b10571868369E($5 + 40 | 0 | 0);
   _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE();
   abort();
  }
  HEAP32[(0 + 1059060 | 0) >> 2] = (HEAP32[(0 + 1059060 | 0) >> 2] | 0) + -1 | 0;
  label$13 : {
   if ($7 >>> 0 > 1 >>> 0) {
    break label$13
   }
   if (!$4) {
    break label$13
   }
   rust_panic($0 | 0, $1 | 0);
   abort();
  }
  HEAP32[($5 + 100 | 0) >> 2] = 0;
  HEAP32[($5 + 96 | 0) >> 2] = 1048692;
  i64toi32_i32$1 = $5;
  i64toi32_i32$0 = 0;
  HEAP32[($5 + 84 | 0) >> 2] = 1;
  HEAP32[($5 + 88 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($5 + 80 | 0) >> 2] = 1051900;
  _ZN3std2io5Write9write_fmt17hdb49789eaf08346bE($5 + 48 | 0 | 0, $5 + 104 | 0 | 0, $5 + 80 | 0 | 0);
  _ZN4core3ptr81drop_in_place$LT$core__result__Result$LT$$LP$$RP$$C$std__io__error__Error$GT$$GT$17hdba6b10571868369E($5 + 48 | 0 | 0);
  _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE();
  abort();
 }
 
 function rust_panic($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $2 = __stack_pointer - 96 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = $1;
  HEAP32[$2 >> 2] = $0;
  (wasm2js_i32$0 = $2, wasm2js_i32$1 = __rust_start_panic($2 | 0) | 0), HEAP32[(wasm2js_i32$0 + 12 | 0) >> 2] = wasm2js_i32$1;
  HEAP32[(($2 + 24 | 0) + 20 | 0) >> 2] = 1;
  HEAP32[(($2 + 56 | 0) + 20 | 0) >> 2] = 1;
  i64toi32_i32$0 = 0;
  HEAP32[($2 + 28 | 0) >> 2] = 2;
  HEAP32[($2 + 32 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($2 + 24 | 0) >> 2] = 1049084;
  HEAP32[($2 + 52 | 0) >> 2] = 10;
  i64toi32_i32$0 = 0;
  HEAP32[($2 + 60 | 0) >> 2] = 1;
  HEAP32[($2 + 64 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($2 + 56 | 0) >> 2] = 1051940;
  HEAP32[($2 + 84 | 0) >> 2] = 5;
  HEAP32[($2 + 40 | 0) >> 2] = $2 + 48 | 0;
  HEAP32[($2 + 48 | 0) >> 2] = $2 + 56 | 0;
  HEAP32[($2 + 72 | 0) >> 2] = $2 + 80 | 0;
  HEAP32[($2 + 80 | 0) >> 2] = $2 + 12 | 0;
  _ZN3std2io5Write9write_fmt17hdb49789eaf08346bE($2 + 16 | 0 | 0, $2 + 88 | 0 | 0, $2 + 24 | 0 | 0);
  _ZN4core3ptr81drop_in_place$LT$core__result__Result$LT$$LP$$RP$$C$std__io__error__Error$GT$$GT$17hdba6b10571868369E($2 + 16 | 0 | 0);
  _ZN3std3sys4wasi14abort_internal17h58865237df468a7dE();
  abort();
 }
 
 function _ZN64_$LT$std__sys__wasi__stdio__Stderr$u20$as$u20$std__io__Write$GT$5write17hdf75dff9e853891eE($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, i64toi32_i32$1 = 0, $11 = 0, $24 = 0;
  $4 = __stack_pointer - 32 | 0;
  __stack_pointer = $4;
  HEAP32[($4 + 12 | 0) >> 2] = $3;
  HEAP32[($4 + 8 | 0) >> 2] = $2;
  $2 = 1;
  _ZN4wasi13lib_generated8fd_write17h5efa9dd89fd18687E($4 + 16 | 0 | 0, 2 | 0, $4 + 8 | 0 | 0, 1 | 0);
  label$1 : {
   label$2 : {
    if (HEAPU16[($4 + 16 | 0) >> 1] | 0) {
     break label$2
    }
    HEAP32[($0 + 4 | 0) >> 2] = HEAP32[($4 + 20 | 0) >> 2] | 0;
    $2 = 0;
    break label$1;
   }
   HEAP16[($4 + 30 | 0) >> 1] = HEAPU16[($4 + 18 | 0) >> 1] | 0;
   $24 = $0;
   i64toi32_i32$0 = 0;
   i64toi32_i32$2 = _ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E($4 + 30 | 0 | 0) | 0;
   i64toi32_i32$1 = 0;
   i64toi32_i32$3 = 65535;
   i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
   i64toi32_i32$0 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
   i64toi32_i32$2 = 0;
   i64toi32_i32$3 = 32;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$2 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
    $11 = 0;
   } else {
    i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
    $11 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
   }
   i64toi32_i32$0 = $24;
   HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = $11;
   HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = i64toi32_i32$2;
  }
  HEAP32[$0 >> 2] = $2;
  __stack_pointer = $4 + 32 | 0;
 }
 
 function _ZN64_$LT$std__sys__wasi__stdio__Stderr$u20$as$u20$std__io__Write$GT$14write_vectored17h8bdd6f405487fb33E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, i64toi32_i32$1 = 0, $11 = 0, $19 = 0;
  $4 = __stack_pointer - 16 | 0;
  __stack_pointer = $4;
  _ZN4wasi13lib_generated8fd_write17h5efa9dd89fd18687E($4 | 0, 2 | 0, $2 | 0, $3 | 0);
  label$1 : {
   label$2 : {
    if (HEAPU16[$4 >> 1] | 0) {
     break label$2
    }
    HEAP32[($0 + 4 | 0) >> 2] = HEAP32[($4 + 4 | 0) >> 2] | 0;
    $2 = 0;
    break label$1;
   }
   HEAP16[($4 + 14 | 0) >> 1] = HEAPU16[($4 + 2 | 0) >> 1] | 0;
   $19 = $0;
   i64toi32_i32$0 = 0;
   i64toi32_i32$2 = _ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E($4 + 14 | 0 | 0) | 0;
   i64toi32_i32$1 = 0;
   i64toi32_i32$3 = 65535;
   i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
   i64toi32_i32$0 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
   i64toi32_i32$2 = 0;
   i64toi32_i32$3 = 32;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$2 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
    $11 = 0;
   } else {
    i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
    $11 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
   }
   i64toi32_i32$0 = $19;
   HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = $11;
   HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = i64toi32_i32$2;
   $2 = 1;
  }
  HEAP32[$0 >> 2] = $2;
  __stack_pointer = $4 + 16 | 0;
 }
 
 function _ZN64_$LT$std__sys__wasi__stdio__Stderr$u20$as$u20$std__io__Write$GT$17is_write_vectored17h23e8925bb54017c9E($0) {
  $0 = $0 | 0;
  return 1 | 0;
 }
 
 function _ZN64_$LT$std__sys__wasi__stdio__Stderr$u20$as$u20$std__io__Write$GT$5flush17h977a971126c5ac7fE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  HEAP8[$0 >> 0] = 4;
 }
 
 function __rust_start_panic($0) {
  $0 = $0 | 0;
  abort();
 }
 
 function _ZN4wasi13lib_generated5Errno3raw17h57f3e6b9c8f27413E($0) {
  $0 = $0 | 0;
  return HEAPU16[$0 >> 1] | 0 | 0;
 }
 
 function _ZN4wasi13lib_generated8fd_write17h5efa9dd89fd18687E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0;
  $4 = __stack_pointer - 16 | 0;
  __stack_pointer = $4;
  label$1 : {
   label$2 : {
    $1 = _ZN4wasi13lib_generated22wasi_snapshot_preview18fd_write17h1ddc5ed58010b6c1E($1 | 0, $2 | 0, $3 | 0, $4 + 12 | 0 | 0) | 0;
    if ($1) {
     break label$2
    }
    HEAP32[($0 + 4 | 0) >> 2] = HEAP32[($4 + 12 | 0) >> 2] | 0;
    $1 = 0;
    break label$1;
   }
   HEAP16[($0 + 2 | 0) >> 1] = $1;
   $1 = 1;
  }
  HEAP16[$0 >> 1] = $1;
  __stack_pointer = $4 + 16 | 0;
 }
 
 function malloc($0) {
  $0 = $0 | 0;
  return dlmalloc($0 | 0) | 0 | 0;
 }
 
 function dlmalloc($0) {
  $0 = $0 | 0;
  var $3 = 0, $4 = 0, $5 = 0, $8 = 0, $2 = 0, $6 = 0, $11 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $7 = 0, $9 = 0, i64toi32_i32$2 = 0, $1 = 0, $10 = 0, $147 = 0, $160 = 0, $171 = 0, $179 = 0, $187 = 0, $230 = 0, $278 = 0, $289 = 0, $297 = 0, $305 = 0, $340 = 0, $407 = 0, $414 = 0, $421 = 0, $512 = 0, $523 = 0, $531 = 0, $539 = 0, $1244 = 0, $1251 = 0, $1258 = 0, $1384 = 0, $1386 = 0, $1445 = 0, $1452 = 0, $1459 = 0, $1698 = 0, $1705 = 0, $1712 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $1 = __stack_pointer - 16 | 0;
  __stack_pointer = $1;
  label$1 : {
   if (HEAP32[(0 + 1059124 | 0) >> 2] | 0) {
    break label$1
   }
   $2 = (sbrk(0 | 0) | 0) - 1059648 | 0;
   if ($2 >>> 0 < 89 >>> 0) {
    break label$1
   }
   $3 = 0;
   label$2 : {
    $4 = HEAP32[(0 + 1059572 | 0) >> 2] | 0;
    if ($4) {
     break label$2
    }
    i64toi32_i32$1 = 0;
    i64toi32_i32$0 = -1;
    HEAP32[(i64toi32_i32$1 + 1059584 | 0) >> 2] = -1;
    HEAP32[(i64toi32_i32$1 + 1059588 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = 0;
    i64toi32_i32$0 = 65536;
    HEAP32[(i64toi32_i32$1 + 1059576 | 0) >> 2] = 65536;
    HEAP32[(i64toi32_i32$1 + 1059580 | 0) >> 2] = i64toi32_i32$0;
    $4 = (($1 + 8 | 0) & -16 | 0) ^ 1431655768 | 0;
    HEAP32[(0 + 1059572 | 0) >> 2] = $4;
    HEAP32[(0 + 1059592 | 0) >> 2] = 0;
    HEAP32[(0 + 1059544 | 0) >> 2] = 0;
   }
   HEAP32[(0 + 1059552 | 0) >> 2] = $2;
   HEAP32[(0 + 1059548 | 0) >> 2] = 1059648;
   HEAP32[(0 + 1059116 | 0) >> 2] = 1059648;
   HEAP32[(0 + 1059136 | 0) >> 2] = $4;
   HEAP32[(0 + 1059132 | 0) >> 2] = -1;
   label$3 : while (1) {
    $4 = $3 + 1059148 | 0;
    HEAP32[($3 + 1059160 | 0) >> 2] = $4;
    $5 = $3 + 1059140 | 0;
    HEAP32[$4 >> 2] = $5;
    HEAP32[($3 + 1059152 | 0) >> 2] = $5;
    $5 = $3 + 1059156 | 0;
    HEAP32[($3 + 1059168 | 0) >> 2] = $5;
    HEAP32[$5 >> 2] = $4;
    $4 = $3 + 1059164 | 0;
    HEAP32[($3 + 1059176 | 0) >> 2] = $4;
    HEAP32[$4 >> 2] = $5;
    HEAP32[($3 + 1059172 | 0) >> 2] = $4;
    $3 = $3 + 32 | 0;
    if (($3 | 0) != (256 | 0)) {
     continue label$3
    }
    break label$3;
   };
   $3 = (1059648 + 8 | 0) & 15 | 0 ? (-8 - 1059648 | 0) & 15 | 0 : 0;
   $4 = 1059648 + $3 | 0;
   $5 = $2 + -56 | 0;
   $3 = $5 - $3 | 0;
   HEAP32[($4 + 4 | 0) >> 2] = $3 | 1 | 0;
   HEAP32[(0 + 1059128 | 0) >> 2] = HEAP32[(0 + 1059588 | 0) >> 2] | 0;
   HEAP32[(0 + 1059112 | 0) >> 2] = $3;
   HEAP32[(0 + 1059124 | 0) >> 2] = $4;
   HEAP32[((1059648 + $5 | 0) + 4 | 0) >> 2] = 56;
  }
  label$4 : {
   label$5 : {
    label$6 : {
     label$7 : {
      label$8 : {
       label$9 : {
        label$10 : {
         label$11 : {
          label$12 : {
           label$13 : {
            label$14 : {
             label$15 : {
              if ($0 >>> 0 > 236 >>> 0) {
               break label$15
              }
              label$16 : {
               $6 = HEAP32[(0 + 1059100 | 0) >> 2] | 0;
               $2 = $0 >>> 0 < 11 >>> 0 ? 16 : ($0 + 19 | 0) & -16 | 0;
               $4 = $2 >>> 3 | 0;
               $3 = $6 >>> $4 | 0;
               if (!($3 & 3 | 0)) {
                break label$16
               }
               $5 = ($3 & 1 | 0 | $4 | 0) ^ 1 | 0;
               $0 = $5 << 3 | 0;
               $4 = HEAP32[($0 + 1059148 | 0) >> 2] | 0;
               $3 = $4 + 8 | 0;
               label$17 : {
                label$18 : {
                 $2 = HEAP32[($4 + 8 | 0) >> 2] | 0;
                 $0 = $0 + 1059140 | 0;
                 if (($2 | 0) != ($0 | 0)) {
                  break label$18
                 }
                 (wasm2js_i32$0 = 0, wasm2js_i32$1 = $6 & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059100 | 0) >> 2] = wasm2js_i32$1;
                 break label$17;
                }
                HEAP32[($0 + 8 | 0) >> 2] = $2;
                HEAP32[($2 + 12 | 0) >> 2] = $0;
               }
               $5 = $5 << 3 | 0;
               HEAP32[($4 + 4 | 0) >> 2] = $5 | 3 | 0;
               $4 = $4 + $5 | 0;
               HEAP32[($4 + 4 | 0) >> 2] = HEAP32[($4 + 4 | 0) >> 2] | 0 | 1 | 0;
               break label$4;
              }
              $7 = HEAP32[(0 + 1059108 | 0) >> 2] | 0;
              if ($2 >>> 0 <= $7 >>> 0) {
               break label$14
              }
              label$19 : {
               if (!$3) {
                break label$19
               }
               label$20 : {
                label$21 : {
                 $147 = $3 << $4 | 0;
                 $3 = 2 << $4 | 0;
                 $3 = $147 & ($3 | (0 - $3 | 0) | 0) | 0;
                 $3 = ($3 & (0 - $3 | 0) | 0) + -1 | 0;
                 $160 = $3;
                 $3 = ($3 >>> 12 | 0) & 16 | 0;
                 $4 = $160 >>> $3 | 0;
                 $5 = ($4 >>> 5 | 0) & 8 | 0;
                 $171 = $5 | $3 | 0;
                 $3 = $4 >>> $5 | 0;
                 $4 = ($3 >>> 2 | 0) & 4 | 0;
                 $179 = $171 | $4 | 0;
                 $3 = $3 >>> $4 | 0;
                 $4 = ($3 >>> 1 | 0) & 2 | 0;
                 $187 = $179 | $4 | 0;
                 $3 = $3 >>> $4 | 0;
                 $4 = ($3 >>> 1 | 0) & 1 | 0;
                 $5 = ($187 | $4 | 0) + ($3 >>> $4 | 0) | 0;
                 $0 = $5 << 3 | 0;
                 $4 = HEAP32[($0 + 1059148 | 0) >> 2] | 0;
                 $3 = HEAP32[($4 + 8 | 0) >> 2] | 0;
                 $0 = $0 + 1059140 | 0;
                 if (($3 | 0) != ($0 | 0)) {
                  break label$21
                 }
                 $6 = $6 & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0;
                 HEAP32[(0 + 1059100 | 0) >> 2] = $6;
                 break label$20;
                }
                HEAP32[($0 + 8 | 0) >> 2] = $3;
                HEAP32[($3 + 12 | 0) >> 2] = $0;
               }
               $3 = $4 + 8 | 0;
               HEAP32[($4 + 4 | 0) >> 2] = $2 | 3 | 0;
               $5 = $5 << 3 | 0;
               $230 = $4 + $5 | 0;
               $5 = $5 - $2 | 0;
               HEAP32[$230 >> 2] = $5;
               $0 = $4 + $2 | 0;
               HEAP32[($0 + 4 | 0) >> 2] = $5 | 1 | 0;
               label$22 : {
                if (!$7) {
                 break label$22
                }
                $8 = $7 >>> 3 | 0;
                $2 = ($8 << 3 | 0) + 1059140 | 0;
                $4 = HEAP32[(0 + 1059120 | 0) >> 2] | 0;
                label$23 : {
                 label$24 : {
                  $8 = 1 << $8 | 0;
                  if ($6 & $8 | 0) {
                   break label$24
                  }
                  HEAP32[(0 + 1059100 | 0) >> 2] = $6 | $8 | 0;
                  $8 = $2;
                  break label$23;
                 }
                 $8 = HEAP32[($2 + 8 | 0) >> 2] | 0;
                }
                HEAP32[($8 + 12 | 0) >> 2] = $4;
                HEAP32[($2 + 8 | 0) >> 2] = $4;
                HEAP32[($4 + 12 | 0) >> 2] = $2;
                HEAP32[($4 + 8 | 0) >> 2] = $8;
               }
               HEAP32[(0 + 1059120 | 0) >> 2] = $0;
               HEAP32[(0 + 1059108 | 0) >> 2] = $5;
               break label$4;
              }
              $9 = HEAP32[(0 + 1059104 | 0) >> 2] | 0;
              if (!$9) {
               break label$14
              }
              $3 = ($9 & (0 - $9 | 0) | 0) + -1 | 0;
              $278 = $3;
              $3 = ($3 >>> 12 | 0) & 16 | 0;
              $4 = $278 >>> $3 | 0;
              $5 = ($4 >>> 5 | 0) & 8 | 0;
              $289 = $5 | $3 | 0;
              $3 = $4 >>> $5 | 0;
              $4 = ($3 >>> 2 | 0) & 4 | 0;
              $297 = $289 | $4 | 0;
              $3 = $3 >>> $4 | 0;
              $4 = ($3 >>> 1 | 0) & 2 | 0;
              $305 = $297 | $4 | 0;
              $3 = $3 >>> $4 | 0;
              $4 = ($3 >>> 1 | 0) & 1 | 0;
              $0 = HEAP32[(((($305 | $4 | 0) + ($3 >>> $4 | 0) | 0) << 2 | 0) + 1059404 | 0) >> 2] | 0;
              $4 = ((HEAP32[($0 + 4 | 0) >> 2] | 0) & -8 | 0) - $2 | 0;
              $5 = $0;
              label$25 : {
               label$26 : while (1) {
                label$27 : {
                 $3 = HEAP32[($5 + 16 | 0) >> 2] | 0;
                 if ($3) {
                  break label$27
                 }
                 $3 = HEAP32[($5 + 20 | 0) >> 2] | 0;
                 if (!$3) {
                  break label$25
                 }
                }
                $5 = ((HEAP32[($3 + 4 | 0) >> 2] | 0) & -8 | 0) - $2 | 0;
                $340 = $5;
                $5 = $5 >>> 0 < $4 >>> 0;
                $4 = $5 ? $340 : $4;
                $0 = $5 ? $3 : $0;
                $5 = $3;
                continue label$26;
               };
              }
              $10 = HEAP32[($0 + 24 | 0) >> 2] | 0;
              label$28 : {
               $8 = HEAP32[($0 + 12 | 0) >> 2] | 0;
               if (($8 | 0) == ($0 | 0)) {
                break label$28
               }
               $3 = HEAP32[($0 + 8 | 0) >> 2] | 0;
               HEAP32[(0 + 1059116 | 0) >> 2] | 0;
               HEAP32[($8 + 8 | 0) >> 2] = $3;
               HEAP32[($3 + 12 | 0) >> 2] = $8;
               break label$5;
              }
              label$29 : {
               $5 = $0 + 20 | 0;
               $3 = HEAP32[$5 >> 2] | 0;
               if ($3) {
                break label$29
               }
               $3 = HEAP32[($0 + 16 | 0) >> 2] | 0;
               if (!$3) {
                break label$13
               }
               $5 = $0 + 16 | 0;
              }
              label$30 : while (1) {
               $11 = $5;
               $8 = $3;
               $5 = $3 + 20 | 0;
               $3 = HEAP32[$5 >> 2] | 0;
               if ($3) {
                continue label$30
               }
               $5 = $8 + 16 | 0;
               $3 = HEAP32[($8 + 16 | 0) >> 2] | 0;
               if ($3) {
                continue label$30
               }
               break label$30;
              };
              HEAP32[$11 >> 2] = 0;
              break label$5;
             }
             $2 = -1;
             if ($0 >>> 0 > -65 >>> 0) {
              break label$14
             }
             $3 = $0 + 19 | 0;
             $2 = $3 & -16 | 0;
             $7 = HEAP32[(0 + 1059104 | 0) >> 2] | 0;
             if (!$7) {
              break label$14
             }
             $11 = 0;
             label$31 : {
              if ($2 >>> 0 < 256 >>> 0) {
               break label$31
              }
              $11 = 31;
              if ($2 >>> 0 > 16777215 >>> 0) {
               break label$31
              }
              $3 = $3 >>> 8 | 0;
              $407 = $3;
              $3 = (($3 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
              $4 = $407 << $3 | 0;
              $414 = $4;
              $4 = (($4 + 520192 | 0) >>> 16 | 0) & 4 | 0;
              $5 = $414 << $4 | 0;
              $421 = $5;
              $5 = (($5 + 245760 | 0) >>> 16 | 0) & 2 | 0;
              $3 = (($421 << $5 | 0) >>> 15 | 0) - ($3 | $4 | 0 | $5 | 0) | 0;
              $11 = ($3 << 1 | 0 | (($2 >>> ($3 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
             }
             $4 = 0 - $2 | 0;
             label$32 : {
              label$33 : {
               label$34 : {
                label$35 : {
                 $5 = HEAP32[(($11 << 2 | 0) + 1059404 | 0) >> 2] | 0;
                 if ($5) {
                  break label$35
                 }
                 $3 = 0;
                 $8 = 0;
                 break label$34;
                }
                $3 = 0;
                $0 = $2 << (($11 | 0) == (31 | 0) ? 0 : 25 - ($11 >>> 1 | 0) | 0) | 0;
                $8 = 0;
                label$36 : while (1) {
                 label$37 : {
                  $6 = ((HEAP32[($5 + 4 | 0) >> 2] | 0) & -8 | 0) - $2 | 0;
                  if ($6 >>> 0 >= $4 >>> 0) {
                   break label$37
                  }
                  $4 = $6;
                  $8 = $5;
                  if ($4) {
                   break label$37
                  }
                  $4 = 0;
                  $8 = $5;
                  $3 = $5;
                  break label$33;
                 }
                 $6 = HEAP32[($5 + 20 | 0) >> 2] | 0;
                 $5 = HEAP32[(($5 + (($0 >>> 29 | 0) & 4 | 0) | 0) + 16 | 0) >> 2] | 0;
                 $3 = $6 ? (($6 | 0) == ($5 | 0) ? $3 : $6) : $3;
                 $0 = $0 << 1 | 0;
                 if ($5) {
                  continue label$36
                 }
                 break label$36;
                };
               }
               label$38 : {
                if ($3 | $8 | 0) {
                 break label$38
                }
                $8 = 0;
                $3 = 2 << $11 | 0;
                $3 = ($3 | (0 - $3 | 0) | 0) & $7 | 0;
                if (!$3) {
                 break label$14
                }
                $3 = ($3 & (0 - $3 | 0) | 0) + -1 | 0;
                $512 = $3;
                $3 = ($3 >>> 12 | 0) & 16 | 0;
                $5 = $512 >>> $3 | 0;
                $0 = ($5 >>> 5 | 0) & 8 | 0;
                $523 = $0 | $3 | 0;
                $3 = $5 >>> $0 | 0;
                $5 = ($3 >>> 2 | 0) & 4 | 0;
                $531 = $523 | $5 | 0;
                $3 = $3 >>> $5 | 0;
                $5 = ($3 >>> 1 | 0) & 2 | 0;
                $539 = $531 | $5 | 0;
                $3 = $3 >>> $5 | 0;
                $5 = ($3 >>> 1 | 0) & 1 | 0;
                $3 = HEAP32[(((($539 | $5 | 0) + ($3 >>> $5 | 0) | 0) << 2 | 0) + 1059404 | 0) >> 2] | 0;
               }
               if (!$3) {
                break label$32
               }
              }
              label$39 : while (1) {
               $6 = ((HEAP32[($3 + 4 | 0) >> 2] | 0) & -8 | 0) - $2 | 0;
               $0 = $6 >>> 0 < $4 >>> 0;
               label$40 : {
                $5 = HEAP32[($3 + 16 | 0) >> 2] | 0;
                if ($5) {
                 break label$40
                }
                $5 = HEAP32[($3 + 20 | 0) >> 2] | 0;
               }
               $4 = $0 ? $6 : $4;
               $8 = $0 ? $3 : $8;
               $3 = $5;
               if ($3) {
                continue label$39
               }
               break label$39;
              };
             }
             if (!$8) {
              break label$14
             }
             if ($4 >>> 0 >= ((HEAP32[(0 + 1059108 | 0) >> 2] | 0) - $2 | 0) >>> 0) {
              break label$14
             }
             $11 = HEAP32[($8 + 24 | 0) >> 2] | 0;
             label$41 : {
              $0 = HEAP32[($8 + 12 | 0) >> 2] | 0;
              if (($0 | 0) == ($8 | 0)) {
               break label$41
              }
              $3 = HEAP32[($8 + 8 | 0) >> 2] | 0;
              HEAP32[(0 + 1059116 | 0) >> 2] | 0;
              HEAP32[($0 + 8 | 0) >> 2] = $3;
              HEAP32[($3 + 12 | 0) >> 2] = $0;
              break label$6;
             }
             label$42 : {
              $5 = $8 + 20 | 0;
              $3 = HEAP32[$5 >> 2] | 0;
              if ($3) {
               break label$42
              }
              $3 = HEAP32[($8 + 16 | 0) >> 2] | 0;
              if (!$3) {
               break label$12
              }
              $5 = $8 + 16 | 0;
             }
             label$43 : while (1) {
              $6 = $5;
              $0 = $3;
              $5 = $3 + 20 | 0;
              $3 = HEAP32[$5 >> 2] | 0;
              if ($3) {
               continue label$43
              }
              $5 = $0 + 16 | 0;
              $3 = HEAP32[($0 + 16 | 0) >> 2] | 0;
              if ($3) {
               continue label$43
              }
              break label$43;
             };
             HEAP32[$6 >> 2] = 0;
             break label$6;
            }
            label$44 : {
             $3 = HEAP32[(0 + 1059108 | 0) >> 2] | 0;
             if ($3 >>> 0 < $2 >>> 0) {
              break label$44
             }
             $4 = HEAP32[(0 + 1059120 | 0) >> 2] | 0;
             label$45 : {
              label$46 : {
               $5 = $3 - $2 | 0;
               if ($5 >>> 0 < 16 >>> 0) {
                break label$46
               }
               $0 = $4 + $2 | 0;
               HEAP32[($0 + 4 | 0) >> 2] = $5 | 1 | 0;
               HEAP32[(0 + 1059108 | 0) >> 2] = $5;
               HEAP32[(0 + 1059120 | 0) >> 2] = $0;
               HEAP32[($4 + $3 | 0) >> 2] = $5;
               HEAP32[($4 + 4 | 0) >> 2] = $2 | 3 | 0;
               break label$45;
              }
              HEAP32[($4 + 4 | 0) >> 2] = $3 | 3 | 0;
              $3 = $4 + $3 | 0;
              HEAP32[($3 + 4 | 0) >> 2] = HEAP32[($3 + 4 | 0) >> 2] | 0 | 1 | 0;
              HEAP32[(0 + 1059120 | 0) >> 2] = 0;
              HEAP32[(0 + 1059108 | 0) >> 2] = 0;
             }
             $3 = $4 + 8 | 0;
             break label$4;
            }
            label$47 : {
             $0 = HEAP32[(0 + 1059112 | 0) >> 2] | 0;
             if ($0 >>> 0 <= $2 >>> 0) {
              break label$47
             }
             $3 = HEAP32[(0 + 1059124 | 0) >> 2] | 0;
             $4 = $3 + $2 | 0;
             $5 = $0 - $2 | 0;
             HEAP32[($4 + 4 | 0) >> 2] = $5 | 1 | 0;
             HEAP32[(0 + 1059112 | 0) >> 2] = $5;
             HEAP32[(0 + 1059124 | 0) >> 2] = $4;
             HEAP32[($3 + 4 | 0) >> 2] = $2 | 3 | 0;
             $3 = $3 + 8 | 0;
             break label$4;
            }
            label$48 : {
             label$49 : {
              if (!(HEAP32[(0 + 1059572 | 0) >> 2] | 0)) {
               break label$49
              }
              $4 = HEAP32[(0 + 1059580 | 0) >> 2] | 0;
              break label$48;
             }
             i64toi32_i32$1 = 0;
             i64toi32_i32$0 = -1;
             HEAP32[(i64toi32_i32$1 + 1059584 | 0) >> 2] = -1;
             HEAP32[(i64toi32_i32$1 + 1059588 | 0) >> 2] = i64toi32_i32$0;
             i64toi32_i32$1 = 0;
             i64toi32_i32$0 = 65536;
             HEAP32[(i64toi32_i32$1 + 1059576 | 0) >> 2] = 65536;
             HEAP32[(i64toi32_i32$1 + 1059580 | 0) >> 2] = i64toi32_i32$0;
             HEAP32[(0 + 1059572 | 0) >> 2] = (($1 + 12 | 0) & -16 | 0) ^ 1431655768 | 0;
             HEAP32[(0 + 1059592 | 0) >> 2] = 0;
             HEAP32[(0 + 1059544 | 0) >> 2] = 0;
             $4 = 65536;
            }
            $3 = 0;
            label$50 : {
             $7 = $2 + 71 | 0;
             $6 = $4 + $7 | 0;
             $11 = 0 - $4 | 0;
             $8 = $6 & $11 | 0;
             if ($8 >>> 0 > $2 >>> 0) {
              break label$50
             }
             HEAP32[(0 + 1059596 | 0) >> 2] = 48;
             break label$4;
            }
            label$51 : {
             $3 = HEAP32[(0 + 1059540 | 0) >> 2] | 0;
             if (!$3) {
              break label$51
             }
             label$52 : {
              $4 = HEAP32[(0 + 1059532 | 0) >> 2] | 0;
              $5 = $4 + $8 | 0;
              if ($5 >>> 0 <= $4 >>> 0) {
               break label$52
              }
              if ($5 >>> 0 <= $3 >>> 0) {
               break label$51
              }
             }
             $3 = 0;
             HEAP32[(0 + 1059596 | 0) >> 2] = 48;
             break label$4;
            }
            if ((HEAPU8[(0 + 1059544 | 0) >> 0] | 0) & 4 | 0) {
             break label$9
            }
            label$53 : {
             label$54 : {
              label$55 : {
               $4 = HEAP32[(0 + 1059124 | 0) >> 2] | 0;
               if (!$4) {
                break label$55
               }
               $3 = 1059548;
               label$56 : while (1) {
                label$57 : {
                 $5 = HEAP32[$3 >> 2] | 0;
                 if ($5 >>> 0 > $4 >>> 0) {
                  break label$57
                 }
                 if (($5 + (HEAP32[($3 + 4 | 0) >> 2] | 0) | 0) >>> 0 > $4 >>> 0) {
                  break label$54
                 }
                }
                $3 = HEAP32[($3 + 8 | 0) >> 2] | 0;
                if ($3) {
                 continue label$56
                }
                break label$56;
               };
              }
              $0 = sbrk(0 | 0) | 0;
              if (($0 | 0) == (-1 | 0)) {
               break label$10
              }
              $6 = $8;
              label$58 : {
               $3 = HEAP32[(0 + 1059576 | 0) >> 2] | 0;
               $4 = $3 + -1 | 0;
               if (!($4 & $0 | 0)) {
                break label$58
               }
               $6 = ($8 - $0 | 0) + (($4 + $0 | 0) & (0 - $3 | 0) | 0) | 0;
              }
              if ($6 >>> 0 <= $2 >>> 0) {
               break label$10
              }
              if ($6 >>> 0 > 2147483646 >>> 0) {
               break label$10
              }
              label$59 : {
               $3 = HEAP32[(0 + 1059540 | 0) >> 2] | 0;
               if (!$3) {
                break label$59
               }
               $4 = HEAP32[(0 + 1059532 | 0) >> 2] | 0;
               $5 = $4 + $6 | 0;
               if ($5 >>> 0 <= $4 >>> 0) {
                break label$10
               }
               if ($5 >>> 0 > $3 >>> 0) {
                break label$10
               }
              }
              $3 = sbrk($6 | 0) | 0;
              if (($3 | 0) != ($0 | 0)) {
               break label$53
              }
              break label$8;
             }
             $6 = ($6 - $0 | 0) & $11 | 0;
             if ($6 >>> 0 > 2147483646 >>> 0) {
              break label$10
             }
             $0 = sbrk($6 | 0) | 0;
             if (($0 | 0) == ((HEAP32[$3 >> 2] | 0) + (HEAP32[($3 + 4 | 0) >> 2] | 0) | 0 | 0)) {
              break label$11
             }
             $3 = $0;
            }
            label$60 : {
             if (($3 | 0) == (-1 | 0)) {
              break label$60
             }
             if (($2 + 72 | 0) >>> 0 <= $6 >>> 0) {
              break label$60
             }
             label$61 : {
              $4 = HEAP32[(0 + 1059580 | 0) >> 2] | 0;
              $4 = (($7 - $6 | 0) + $4 | 0) & (0 - $4 | 0) | 0;
              if ($4 >>> 0 <= 2147483646 >>> 0) {
               break label$61
              }
              $0 = $3;
              break label$8;
             }
             label$62 : {
              if ((sbrk($4 | 0) | 0 | 0) == (-1 | 0)) {
               break label$62
              }
              $6 = $4 + $6 | 0;
              $0 = $3;
              break label$8;
             }
             sbrk(0 - $6 | 0 | 0) | 0;
             break label$10;
            }
            $0 = $3;
            if (($3 | 0) != (-1 | 0)) {
             break label$8
            }
            break label$10;
           }
           $8 = 0;
           break label$5;
          }
          $0 = 0;
          break label$6;
         }
         if (($0 | 0) != (-1 | 0)) {
          break label$8
         }
        }
        HEAP32[(0 + 1059544 | 0) >> 2] = HEAP32[(0 + 1059544 | 0) >> 2] | 0 | 4 | 0;
       }
       if ($8 >>> 0 > 2147483646 >>> 0) {
        break label$7
       }
       $0 = sbrk($8 | 0) | 0;
       $3 = sbrk(0 | 0) | 0;
       if (($0 | 0) == (-1 | 0)) {
        break label$7
       }
       if (($3 | 0) == (-1 | 0)) {
        break label$7
       }
       if ($0 >>> 0 >= $3 >>> 0) {
        break label$7
       }
       $6 = $3 - $0 | 0;
       if ($6 >>> 0 <= ($2 + 56 | 0) >>> 0) {
        break label$7
       }
      }
      $3 = (HEAP32[(0 + 1059532 | 0) >> 2] | 0) + $6 | 0;
      HEAP32[(0 + 1059532 | 0) >> 2] = $3;
      label$63 : {
       if ($3 >>> 0 <= (HEAP32[(0 + 1059536 | 0) >> 2] | 0) >>> 0) {
        break label$63
       }
       HEAP32[(0 + 1059536 | 0) >> 2] = $3;
      }
      label$64 : {
       label$65 : {
        label$66 : {
         label$67 : {
          $4 = HEAP32[(0 + 1059124 | 0) >> 2] | 0;
          if (!$4) {
           break label$67
          }
          $3 = 1059548;
          label$68 : while (1) {
           $5 = HEAP32[$3 >> 2] | 0;
           $8 = HEAP32[($3 + 4 | 0) >> 2] | 0;
           if (($0 | 0) == ($5 + $8 | 0 | 0)) {
            break label$66
           }
           $3 = HEAP32[($3 + 8 | 0) >> 2] | 0;
           if ($3) {
            continue label$68
           }
           break label$65;
          };
         }
         label$69 : {
          label$70 : {
           $3 = HEAP32[(0 + 1059116 | 0) >> 2] | 0;
           if (!$3) {
            break label$70
           }
           if ($0 >>> 0 >= $3 >>> 0) {
            break label$69
           }
          }
          HEAP32[(0 + 1059116 | 0) >> 2] = $0;
         }
         $3 = 0;
         HEAP32[(0 + 1059552 | 0) >> 2] = $6;
         HEAP32[(0 + 1059548 | 0) >> 2] = $0;
         HEAP32[(0 + 1059132 | 0) >> 2] = -1;
         HEAP32[(0 + 1059136 | 0) >> 2] = HEAP32[(0 + 1059572 | 0) >> 2] | 0;
         HEAP32[(0 + 1059560 | 0) >> 2] = 0;
         label$71 : while (1) {
          $4 = $3 + 1059148 | 0;
          HEAP32[($3 + 1059160 | 0) >> 2] = $4;
          $5 = $3 + 1059140 | 0;
          HEAP32[$4 >> 2] = $5;
          HEAP32[($3 + 1059152 | 0) >> 2] = $5;
          $5 = $3 + 1059156 | 0;
          HEAP32[($3 + 1059168 | 0) >> 2] = $5;
          HEAP32[$5 >> 2] = $4;
          $4 = $3 + 1059164 | 0;
          HEAP32[($3 + 1059176 | 0) >> 2] = $4;
          HEAP32[$4 >> 2] = $5;
          HEAP32[($3 + 1059172 | 0) >> 2] = $4;
          $3 = $3 + 32 | 0;
          if (($3 | 0) != (256 | 0)) {
           continue label$71
          }
          break label$71;
         };
         $3 = ($0 + 8 | 0) & 15 | 0 ? (-8 - $0 | 0) & 15 | 0 : 0;
         $4 = $0 + $3 | 0;
         $5 = $6 + -56 | 0;
         $3 = $5 - $3 | 0;
         HEAP32[($4 + 4 | 0) >> 2] = $3 | 1 | 0;
         HEAP32[(0 + 1059128 | 0) >> 2] = HEAP32[(0 + 1059588 | 0) >> 2] | 0;
         HEAP32[(0 + 1059112 | 0) >> 2] = $3;
         HEAP32[(0 + 1059124 | 0) >> 2] = $4;
         HEAP32[(($0 + $5 | 0) + 4 | 0) >> 2] = 56;
         break label$64;
        }
        if ((HEAPU8[($3 + 12 | 0) >> 0] | 0) & 8 | 0) {
         break label$65
        }
        if ($5 >>> 0 > $4 >>> 0) {
         break label$65
        }
        if ($0 >>> 0 <= $4 >>> 0) {
         break label$65
        }
        $5 = ($4 + 8 | 0) & 15 | 0 ? (-8 - $4 | 0) & 15 | 0 : 0;
        $0 = $4 + $5 | 0;
        $11 = (HEAP32[(0 + 1059112 | 0) >> 2] | 0) + $6 | 0;
        $5 = $11 - $5 | 0;
        HEAP32[($0 + 4 | 0) >> 2] = $5 | 1 | 0;
        HEAP32[($3 + 4 | 0) >> 2] = $8 + $6 | 0;
        HEAP32[(0 + 1059128 | 0) >> 2] = HEAP32[(0 + 1059588 | 0) >> 2] | 0;
        HEAP32[(0 + 1059112 | 0) >> 2] = $5;
        HEAP32[(0 + 1059124 | 0) >> 2] = $0;
        HEAP32[(($4 + $11 | 0) + 4 | 0) >> 2] = 56;
        break label$64;
       }
       label$72 : {
        $8 = HEAP32[(0 + 1059116 | 0) >> 2] | 0;
        if ($0 >>> 0 >= $8 >>> 0) {
         break label$72
        }
        HEAP32[(0 + 1059116 | 0) >> 2] = $0;
        $8 = $0;
       }
       $5 = $0 + $6 | 0;
       $3 = 1059548;
       label$73 : {
        label$74 : {
         label$75 : {
          label$76 : {
           label$77 : {
            label$78 : {
             label$79 : {
              label$80 : while (1) {
               if ((HEAP32[$3 >> 2] | 0 | 0) == ($5 | 0)) {
                break label$79
               }
               $3 = HEAP32[($3 + 8 | 0) >> 2] | 0;
               if ($3) {
                continue label$80
               }
               break label$78;
              };
             }
             if (!((HEAPU8[($3 + 12 | 0) >> 0] | 0) & 8 | 0)) {
              break label$77
             }
            }
            $3 = 1059548;
            label$81 : while (1) {
             label$82 : {
              $5 = HEAP32[$3 >> 2] | 0;
              if ($5 >>> 0 > $4 >>> 0) {
               break label$82
              }
              $5 = $5 + (HEAP32[($3 + 4 | 0) >> 2] | 0) | 0;
              if ($5 >>> 0 > $4 >>> 0) {
               break label$76
              }
             }
             $3 = HEAP32[($3 + 8 | 0) >> 2] | 0;
             continue label$81;
            };
           }
           HEAP32[$3 >> 2] = $0;
           HEAP32[($3 + 4 | 0) >> 2] = (HEAP32[($3 + 4 | 0) >> 2] | 0) + $6 | 0;
           $11 = $0 + (($0 + 8 | 0) & 15 | 0 ? (-8 - $0 | 0) & 15 | 0 : 0) | 0;
           HEAP32[($11 + 4 | 0) >> 2] = $2 | 3 | 0;
           $6 = $5 + (($5 + 8 | 0) & 15 | 0 ? (-8 - $5 | 0) & 15 | 0 : 0) | 0;
           $2 = $11 + $2 | 0;
           $5 = $6 - $2 | 0;
           label$83 : {
            if (($4 | 0) != ($6 | 0)) {
             break label$83
            }
            HEAP32[(0 + 1059124 | 0) >> 2] = $2;
            $3 = (HEAP32[(0 + 1059112 | 0) >> 2] | 0) + $5 | 0;
            HEAP32[(0 + 1059112 | 0) >> 2] = $3;
            HEAP32[($2 + 4 | 0) >> 2] = $3 | 1 | 0;
            break label$74;
           }
           label$84 : {
            if ((HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0) != ($6 | 0)) {
             break label$84
            }
            HEAP32[(0 + 1059120 | 0) >> 2] = $2;
            $3 = (HEAP32[(0 + 1059108 | 0) >> 2] | 0) + $5 | 0;
            HEAP32[(0 + 1059108 | 0) >> 2] = $3;
            HEAP32[($2 + 4 | 0) >> 2] = $3 | 1 | 0;
            HEAP32[($2 + $3 | 0) >> 2] = $3;
            break label$74;
           }
           label$85 : {
            $3 = HEAP32[($6 + 4 | 0) >> 2] | 0;
            if (($3 & 3 | 0 | 0) != (1 | 0)) {
             break label$85
            }
            $7 = $3 & -8 | 0;
            label$86 : {
             label$87 : {
              if ($3 >>> 0 > 255 >>> 0) {
               break label$87
              }
              $4 = HEAP32[($6 + 8 | 0) >> 2] | 0;
              $8 = $3 >>> 3 | 0;
              $0 = ($8 << 3 | 0) + 1059140 | 0;
              label$88 : {
               $3 = HEAP32[($6 + 12 | 0) >> 2] | 0;
               if (($3 | 0) != ($4 | 0)) {
                break label$88
               }
               (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059100 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $8 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059100 | 0) >> 2] = wasm2js_i32$1;
               break label$86;
              }
              HEAP32[($3 + 8 | 0) >> 2] = $4;
              HEAP32[($4 + 12 | 0) >> 2] = $3;
              break label$86;
             }
             $9 = HEAP32[($6 + 24 | 0) >> 2] | 0;
             label$89 : {
              label$90 : {
               $0 = HEAP32[($6 + 12 | 0) >> 2] | 0;
               if (($0 | 0) == ($6 | 0)) {
                break label$90
               }
               $3 = HEAP32[($6 + 8 | 0) >> 2] | 0;
               HEAP32[($0 + 8 | 0) >> 2] = $3;
               HEAP32[($3 + 12 | 0) >> 2] = $0;
               break label$89;
              }
              label$91 : {
               $3 = $6 + 20 | 0;
               $4 = HEAP32[$3 >> 2] | 0;
               if ($4) {
                break label$91
               }
               $3 = $6 + 16 | 0;
               $4 = HEAP32[$3 >> 2] | 0;
               if ($4) {
                break label$91
               }
               $0 = 0;
               break label$89;
              }
              label$92 : while (1) {
               $8 = $3;
               $0 = $4;
               $3 = $4 + 20 | 0;
               $4 = HEAP32[$3 >> 2] | 0;
               if ($4) {
                continue label$92
               }
               $3 = $0 + 16 | 0;
               $4 = HEAP32[($0 + 16 | 0) >> 2] | 0;
               if ($4) {
                continue label$92
               }
               break label$92;
              };
              HEAP32[$8 >> 2] = 0;
             }
             if (!$9) {
              break label$86
             }
             label$93 : {
              label$94 : {
               $4 = HEAP32[($6 + 28 | 0) >> 2] | 0;
               $3 = ($4 << 2 | 0) + 1059404 | 0;
               if ((HEAP32[$3 >> 2] | 0 | 0) != ($6 | 0)) {
                break label$94
               }
               HEAP32[$3 >> 2] = $0;
               if ($0) {
                break label$93
               }
               (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059104 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $4 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059104 | 0) >> 2] = wasm2js_i32$1;
               break label$86;
              }
              HEAP32[($9 + ((HEAP32[($9 + 16 | 0) >> 2] | 0 | 0) == ($6 | 0) ? 16 : 20) | 0) >> 2] = $0;
              if (!$0) {
               break label$86
              }
             }
             HEAP32[($0 + 24 | 0) >> 2] = $9;
             label$95 : {
              $3 = HEAP32[($6 + 16 | 0) >> 2] | 0;
              if (!$3) {
               break label$95
              }
              HEAP32[($0 + 16 | 0) >> 2] = $3;
              HEAP32[($3 + 24 | 0) >> 2] = $0;
             }
             $3 = HEAP32[($6 + 20 | 0) >> 2] | 0;
             if (!$3) {
              break label$86
             }
             HEAP32[($0 + 20 | 0) >> 2] = $3;
             HEAP32[($3 + 24 | 0) >> 2] = $0;
            }
            $5 = $7 + $5 | 0;
            $6 = $6 + $7 | 0;
           }
           HEAP32[($6 + 4 | 0) >> 2] = (HEAP32[($6 + 4 | 0) >> 2] | 0) & -2 | 0;
           HEAP32[($2 + $5 | 0) >> 2] = $5;
           HEAP32[($2 + 4 | 0) >> 2] = $5 | 1 | 0;
           label$96 : {
            if ($5 >>> 0 > 255 >>> 0) {
             break label$96
            }
            $4 = $5 >>> 3 | 0;
            $3 = ($4 << 3 | 0) + 1059140 | 0;
            label$97 : {
             label$98 : {
              $5 = HEAP32[(0 + 1059100 | 0) >> 2] | 0;
              $4 = 1 << $4 | 0;
              if ($5 & $4 | 0) {
               break label$98
              }
              HEAP32[(0 + 1059100 | 0) >> 2] = $5 | $4 | 0;
              $4 = $3;
              break label$97;
             }
             $4 = HEAP32[($3 + 8 | 0) >> 2] | 0;
            }
            HEAP32[($4 + 12 | 0) >> 2] = $2;
            HEAP32[($3 + 8 | 0) >> 2] = $2;
            HEAP32[($2 + 12 | 0) >> 2] = $3;
            HEAP32[($2 + 8 | 0) >> 2] = $4;
            break label$74;
           }
           $3 = 31;
           label$99 : {
            if ($5 >>> 0 > 16777215 >>> 0) {
             break label$99
            }
            $3 = $5 >>> 8 | 0;
            $1244 = $3;
            $3 = (($3 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
            $4 = $1244 << $3 | 0;
            $1251 = $4;
            $4 = (($4 + 520192 | 0) >>> 16 | 0) & 4 | 0;
            $0 = $1251 << $4 | 0;
            $1258 = $0;
            $0 = (($0 + 245760 | 0) >>> 16 | 0) & 2 | 0;
            $3 = (($1258 << $0 | 0) >>> 15 | 0) - ($3 | $4 | 0 | $0 | 0) | 0;
            $3 = ($3 << 1 | 0 | (($5 >>> ($3 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
           }
           HEAP32[($2 + 28 | 0) >> 2] = $3;
           i64toi32_i32$1 = $2;
           i64toi32_i32$0 = 0;
           HEAP32[($2 + 16 | 0) >> 2] = 0;
           HEAP32[($2 + 20 | 0) >> 2] = i64toi32_i32$0;
           $4 = ($3 << 2 | 0) + 1059404 | 0;
           label$100 : {
            $0 = HEAP32[(0 + 1059104 | 0) >> 2] | 0;
            $8 = 1 << $3 | 0;
            if ($0 & $8 | 0) {
             break label$100
            }
            HEAP32[$4 >> 2] = $2;
            HEAP32[(0 + 1059104 | 0) >> 2] = $0 | $8 | 0;
            HEAP32[($2 + 24 | 0) >> 2] = $4;
            HEAP32[($2 + 8 | 0) >> 2] = $2;
            HEAP32[($2 + 12 | 0) >> 2] = $2;
            break label$74;
           }
           $3 = $5 << (($3 | 0) == (31 | 0) ? 0 : 25 - ($3 >>> 1 | 0) | 0) | 0;
           $0 = HEAP32[$4 >> 2] | 0;
           label$101 : while (1) {
            $4 = $0;
            if (((HEAP32[($4 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($5 | 0)) {
             break label$75
            }
            $0 = $3 >>> 29 | 0;
            $3 = $3 << 1 | 0;
            $8 = ($4 + ($0 & 4 | 0) | 0) + 16 | 0;
            $0 = HEAP32[$8 >> 2] | 0;
            if ($0) {
             continue label$101
            }
            break label$101;
           };
           HEAP32[$8 >> 2] = $2;
           HEAP32[($2 + 24 | 0) >> 2] = $4;
           HEAP32[($2 + 12 | 0) >> 2] = $2;
           HEAP32[($2 + 8 | 0) >> 2] = $2;
           break label$74;
          }
          $3 = ($0 + 8 | 0) & 15 | 0 ? (-8 - $0 | 0) & 15 | 0 : 0;
          $11 = $0 + $3 | 0;
          $8 = $6 + -56 | 0;
          $3 = $8 - $3 | 0;
          HEAP32[($11 + 4 | 0) >> 2] = $3 | 1 | 0;
          HEAP32[(($0 + $8 | 0) + 4 | 0) >> 2] = 56;
          $8 = ($5 + (($5 + -55 | 0) & 15 | 0 ? (55 - $5 | 0) & 15 | 0 : 0) | 0) + -63 | 0;
          $8 = $8 >>> 0 < ($4 + 16 | 0) >>> 0 ? $4 : $8;
          HEAP32[($8 + 4 | 0) >> 2] = 35;
          HEAP32[(0 + 1059128 | 0) >> 2] = HEAP32[(0 + 1059588 | 0) >> 2] | 0;
          HEAP32[(0 + 1059112 | 0) >> 2] = $3;
          HEAP32[(0 + 1059124 | 0) >> 2] = $11;
          i64toi32_i32$2 = 0;
          i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 1059556 | 0) >> 2] | 0;
          i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 1059560 | 0) >> 2] | 0;
          $1384 = i64toi32_i32$0;
          i64toi32_i32$0 = $8 + 16 | 0;
          HEAP32[i64toi32_i32$0 >> 2] = $1384;
          HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
          i64toi32_i32$2 = 0;
          i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 1059548 | 0) >> 2] | 0;
          i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 1059552 | 0) >> 2] | 0;
          $1386 = i64toi32_i32$1;
          i64toi32_i32$1 = $8;
          HEAP32[($8 + 8 | 0) >> 2] = $1386;
          HEAP32[($8 + 12 | 0) >> 2] = i64toi32_i32$0;
          HEAP32[(0 + 1059556 | 0) >> 2] = $8 + 8 | 0;
          HEAP32[(0 + 1059552 | 0) >> 2] = $6;
          HEAP32[(0 + 1059548 | 0) >> 2] = $0;
          HEAP32[(0 + 1059560 | 0) >> 2] = 0;
          $3 = $8 + 36 | 0;
          label$102 : while (1) {
           HEAP32[$3 >> 2] = 7;
           $3 = $3 + 4 | 0;
           if ($5 >>> 0 > $3 >>> 0) {
            continue label$102
           }
           break label$102;
          };
          if (($8 | 0) == ($4 | 0)) {
           break label$64
          }
          HEAP32[($8 + 4 | 0) >> 2] = (HEAP32[($8 + 4 | 0) >> 2] | 0) & -2 | 0;
          $6 = $8 - $4 | 0;
          HEAP32[$8 >> 2] = $6;
          HEAP32[($4 + 4 | 0) >> 2] = $6 | 1 | 0;
          label$103 : {
           if ($6 >>> 0 > 255 >>> 0) {
            break label$103
           }
           $5 = $6 >>> 3 | 0;
           $3 = ($5 << 3 | 0) + 1059140 | 0;
           label$104 : {
            label$105 : {
             $0 = HEAP32[(0 + 1059100 | 0) >> 2] | 0;
             $5 = 1 << $5 | 0;
             if ($0 & $5 | 0) {
              break label$105
             }
             HEAP32[(0 + 1059100 | 0) >> 2] = $0 | $5 | 0;
             $5 = $3;
             break label$104;
            }
            $5 = HEAP32[($3 + 8 | 0) >> 2] | 0;
           }
           HEAP32[($5 + 12 | 0) >> 2] = $4;
           HEAP32[($3 + 8 | 0) >> 2] = $4;
           HEAP32[($4 + 12 | 0) >> 2] = $3;
           HEAP32[($4 + 8 | 0) >> 2] = $5;
           break label$64;
          }
          $3 = 31;
          label$106 : {
           if ($6 >>> 0 > 16777215 >>> 0) {
            break label$106
           }
           $3 = $6 >>> 8 | 0;
           $1445 = $3;
           $3 = (($3 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
           $5 = $1445 << $3 | 0;
           $1452 = $5;
           $5 = (($5 + 520192 | 0) >>> 16 | 0) & 4 | 0;
           $0 = $1452 << $5 | 0;
           $1459 = $0;
           $0 = (($0 + 245760 | 0) >>> 16 | 0) & 2 | 0;
           $3 = (($1459 << $0 | 0) >>> 15 | 0) - ($3 | $5 | 0 | $0 | 0) | 0;
           $3 = ($3 << 1 | 0 | (($6 >>> ($3 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
          }
          i64toi32_i32$1 = $4;
          i64toi32_i32$0 = 0;
          HEAP32[($4 + 16 | 0) >> 2] = 0;
          HEAP32[($4 + 20 | 0) >> 2] = i64toi32_i32$0;
          HEAP32[($4 + 28 | 0) >> 2] = $3;
          $5 = ($3 << 2 | 0) + 1059404 | 0;
          label$107 : {
           $0 = HEAP32[(0 + 1059104 | 0) >> 2] | 0;
           $8 = 1 << $3 | 0;
           if ($0 & $8 | 0) {
            break label$107
           }
           HEAP32[$5 >> 2] = $4;
           HEAP32[(0 + 1059104 | 0) >> 2] = $0 | $8 | 0;
           HEAP32[($4 + 24 | 0) >> 2] = $5;
           HEAP32[($4 + 8 | 0) >> 2] = $4;
           HEAP32[($4 + 12 | 0) >> 2] = $4;
           break label$64;
          }
          $3 = $6 << (($3 | 0) == (31 | 0) ? 0 : 25 - ($3 >>> 1 | 0) | 0) | 0;
          $0 = HEAP32[$5 >> 2] | 0;
          label$108 : while (1) {
           $5 = $0;
           if (((HEAP32[($0 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($6 | 0)) {
            break label$73
           }
           $0 = $3 >>> 29 | 0;
           $3 = $3 << 1 | 0;
           $8 = ($5 + ($0 & 4 | 0) | 0) + 16 | 0;
           $0 = HEAP32[$8 >> 2] | 0;
           if ($0) {
            continue label$108
           }
           break label$108;
          };
          HEAP32[$8 >> 2] = $4;
          HEAP32[($4 + 24 | 0) >> 2] = $5;
          HEAP32[($4 + 12 | 0) >> 2] = $4;
          HEAP32[($4 + 8 | 0) >> 2] = $4;
          break label$64;
         }
         $3 = HEAP32[($4 + 8 | 0) >> 2] | 0;
         HEAP32[($3 + 12 | 0) >> 2] = $2;
         HEAP32[($4 + 8 | 0) >> 2] = $2;
         HEAP32[($2 + 24 | 0) >> 2] = 0;
         HEAP32[($2 + 12 | 0) >> 2] = $4;
         HEAP32[($2 + 8 | 0) >> 2] = $3;
        }
        $3 = $11 + 8 | 0;
        break label$4;
       }
       $3 = HEAP32[($5 + 8 | 0) >> 2] | 0;
       HEAP32[($3 + 12 | 0) >> 2] = $4;
       HEAP32[($5 + 8 | 0) >> 2] = $4;
       HEAP32[($4 + 24 | 0) >> 2] = 0;
       HEAP32[($4 + 12 | 0) >> 2] = $5;
       HEAP32[($4 + 8 | 0) >> 2] = $3;
      }
      $3 = HEAP32[(0 + 1059112 | 0) >> 2] | 0;
      if ($3 >>> 0 <= $2 >>> 0) {
       break label$7
      }
      $4 = HEAP32[(0 + 1059124 | 0) >> 2] | 0;
      $5 = $4 + $2 | 0;
      $3 = $3 - $2 | 0;
      HEAP32[($5 + 4 | 0) >> 2] = $3 | 1 | 0;
      HEAP32[(0 + 1059112 | 0) >> 2] = $3;
      HEAP32[(0 + 1059124 | 0) >> 2] = $5;
      HEAP32[($4 + 4 | 0) >> 2] = $2 | 3 | 0;
      $3 = $4 + 8 | 0;
      break label$4;
     }
     $3 = 0;
     HEAP32[(0 + 1059596 | 0) >> 2] = 48;
     break label$4;
    }
    label$109 : {
     if (!$11) {
      break label$109
     }
     label$110 : {
      label$111 : {
       $5 = HEAP32[($8 + 28 | 0) >> 2] | 0;
       $3 = ($5 << 2 | 0) + 1059404 | 0;
       if (($8 | 0) != (HEAP32[$3 >> 2] | 0 | 0)) {
        break label$111
       }
       HEAP32[$3 >> 2] = $0;
       if ($0) {
        break label$110
       }
       $7 = $7 & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0;
       HEAP32[(0 + 1059104 | 0) >> 2] = $7;
       break label$109;
      }
      HEAP32[($11 + ((HEAP32[($11 + 16 | 0) >> 2] | 0 | 0) == ($8 | 0) ? 16 : 20) | 0) >> 2] = $0;
      if (!$0) {
       break label$109
      }
     }
     HEAP32[($0 + 24 | 0) >> 2] = $11;
     label$112 : {
      $3 = HEAP32[($8 + 16 | 0) >> 2] | 0;
      if (!$3) {
       break label$112
      }
      HEAP32[($0 + 16 | 0) >> 2] = $3;
      HEAP32[($3 + 24 | 0) >> 2] = $0;
     }
     $3 = HEAP32[($8 + 20 | 0) >> 2] | 0;
     if (!$3) {
      break label$109
     }
     HEAP32[($0 + 20 | 0) >> 2] = $3;
     HEAP32[($3 + 24 | 0) >> 2] = $0;
    }
    label$113 : {
     label$114 : {
      if ($4 >>> 0 > 15 >>> 0) {
       break label$114
      }
      $3 = $4 + $2 | 0;
      HEAP32[($8 + 4 | 0) >> 2] = $3 | 3 | 0;
      $3 = $8 + $3 | 0;
      HEAP32[($3 + 4 | 0) >> 2] = HEAP32[($3 + 4 | 0) >> 2] | 0 | 1 | 0;
      break label$113;
     }
     $0 = $8 + $2 | 0;
     HEAP32[($0 + 4 | 0) >> 2] = $4 | 1 | 0;
     HEAP32[($8 + 4 | 0) >> 2] = $2 | 3 | 0;
     HEAP32[($0 + $4 | 0) >> 2] = $4;
     label$115 : {
      if ($4 >>> 0 > 255 >>> 0) {
       break label$115
      }
      $4 = $4 >>> 3 | 0;
      $3 = ($4 << 3 | 0) + 1059140 | 0;
      label$116 : {
       label$117 : {
        $5 = HEAP32[(0 + 1059100 | 0) >> 2] | 0;
        $4 = 1 << $4 | 0;
        if ($5 & $4 | 0) {
         break label$117
        }
        HEAP32[(0 + 1059100 | 0) >> 2] = $5 | $4 | 0;
        $4 = $3;
        break label$116;
       }
       $4 = HEAP32[($3 + 8 | 0) >> 2] | 0;
      }
      HEAP32[($4 + 12 | 0) >> 2] = $0;
      HEAP32[($3 + 8 | 0) >> 2] = $0;
      HEAP32[($0 + 12 | 0) >> 2] = $3;
      HEAP32[($0 + 8 | 0) >> 2] = $4;
      break label$113;
     }
     $3 = 31;
     label$118 : {
      if ($4 >>> 0 > 16777215 >>> 0) {
       break label$118
      }
      $3 = $4 >>> 8 | 0;
      $1698 = $3;
      $3 = (($3 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
      $5 = $1698 << $3 | 0;
      $1705 = $5;
      $5 = (($5 + 520192 | 0) >>> 16 | 0) & 4 | 0;
      $2 = $1705 << $5 | 0;
      $1712 = $2;
      $2 = (($2 + 245760 | 0) >>> 16 | 0) & 2 | 0;
      $3 = (($1712 << $2 | 0) >>> 15 | 0) - ($3 | $5 | 0 | $2 | 0) | 0;
      $3 = ($3 << 1 | 0 | (($4 >>> ($3 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
     }
     HEAP32[($0 + 28 | 0) >> 2] = $3;
     i64toi32_i32$1 = $0;
     i64toi32_i32$0 = 0;
     HEAP32[($0 + 16 | 0) >> 2] = 0;
     HEAP32[($0 + 20 | 0) >> 2] = i64toi32_i32$0;
     $5 = ($3 << 2 | 0) + 1059404 | 0;
     label$119 : {
      $2 = 1 << $3 | 0;
      if ($7 & $2 | 0) {
       break label$119
      }
      HEAP32[$5 >> 2] = $0;
      HEAP32[(0 + 1059104 | 0) >> 2] = $7 | $2 | 0;
      HEAP32[($0 + 24 | 0) >> 2] = $5;
      HEAP32[($0 + 8 | 0) >> 2] = $0;
      HEAP32[($0 + 12 | 0) >> 2] = $0;
      break label$113;
     }
     $3 = $4 << (($3 | 0) == (31 | 0) ? 0 : 25 - ($3 >>> 1 | 0) | 0) | 0;
     $2 = HEAP32[$5 >> 2] | 0;
     label$120 : {
      label$121 : while (1) {
       $5 = $2;
       if (((HEAP32[($5 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($4 | 0)) {
        break label$120
       }
       $2 = $3 >>> 29 | 0;
       $3 = $3 << 1 | 0;
       $6 = ($5 + ($2 & 4 | 0) | 0) + 16 | 0;
       $2 = HEAP32[$6 >> 2] | 0;
       if ($2) {
        continue label$121
       }
       break label$121;
      };
      HEAP32[$6 >> 2] = $0;
      HEAP32[($0 + 24 | 0) >> 2] = $5;
      HEAP32[($0 + 12 | 0) >> 2] = $0;
      HEAP32[($0 + 8 | 0) >> 2] = $0;
      break label$113;
     }
     $3 = HEAP32[($5 + 8 | 0) >> 2] | 0;
     HEAP32[($3 + 12 | 0) >> 2] = $0;
     HEAP32[($5 + 8 | 0) >> 2] = $0;
     HEAP32[($0 + 24 | 0) >> 2] = 0;
     HEAP32[($0 + 12 | 0) >> 2] = $5;
     HEAP32[($0 + 8 | 0) >> 2] = $3;
    }
    $3 = $8 + 8 | 0;
    break label$4;
   }
   label$122 : {
    if (!$10) {
     break label$122
    }
    label$123 : {
     label$124 : {
      $5 = HEAP32[($0 + 28 | 0) >> 2] | 0;
      $3 = ($5 << 2 | 0) + 1059404 | 0;
      if (($0 | 0) != (HEAP32[$3 >> 2] | 0 | 0)) {
       break label$124
      }
      HEAP32[$3 >> 2] = $8;
      if ($8) {
       break label$123
      }
      (wasm2js_i32$0 = 0, wasm2js_i32$1 = $9 & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059104 | 0) >> 2] = wasm2js_i32$1;
      break label$122;
     }
     HEAP32[($10 + ((HEAP32[($10 + 16 | 0) >> 2] | 0 | 0) == ($0 | 0) ? 16 : 20) | 0) >> 2] = $8;
     if (!$8) {
      break label$122
     }
    }
    HEAP32[($8 + 24 | 0) >> 2] = $10;
    label$125 : {
     $3 = HEAP32[($0 + 16 | 0) >> 2] | 0;
     if (!$3) {
      break label$125
     }
     HEAP32[($8 + 16 | 0) >> 2] = $3;
     HEAP32[($3 + 24 | 0) >> 2] = $8;
    }
    $3 = HEAP32[($0 + 20 | 0) >> 2] | 0;
    if (!$3) {
     break label$122
    }
    HEAP32[($8 + 20 | 0) >> 2] = $3;
    HEAP32[($3 + 24 | 0) >> 2] = $8;
   }
   label$126 : {
    label$127 : {
     if ($4 >>> 0 > 15 >>> 0) {
      break label$127
     }
     $3 = $4 + $2 | 0;
     HEAP32[($0 + 4 | 0) >> 2] = $3 | 3 | 0;
     $3 = $0 + $3 | 0;
     HEAP32[($3 + 4 | 0) >> 2] = HEAP32[($3 + 4 | 0) >> 2] | 0 | 1 | 0;
     break label$126;
    }
    $5 = $0 + $2 | 0;
    HEAP32[($5 + 4 | 0) >> 2] = $4 | 1 | 0;
    HEAP32[($0 + 4 | 0) >> 2] = $2 | 3 | 0;
    HEAP32[($5 + $4 | 0) >> 2] = $4;
    label$128 : {
     if (!$7) {
      break label$128
     }
     $8 = $7 >>> 3 | 0;
     $2 = ($8 << 3 | 0) + 1059140 | 0;
     $3 = HEAP32[(0 + 1059120 | 0) >> 2] | 0;
     label$129 : {
      label$130 : {
       $8 = 1 << $8 | 0;
       if ($8 & $6 | 0) {
        break label$130
       }
       HEAP32[(0 + 1059100 | 0) >> 2] = $8 | $6 | 0;
       $8 = $2;
       break label$129;
      }
      $8 = HEAP32[($2 + 8 | 0) >> 2] | 0;
     }
     HEAP32[($8 + 12 | 0) >> 2] = $3;
     HEAP32[($2 + 8 | 0) >> 2] = $3;
     HEAP32[($3 + 12 | 0) >> 2] = $2;
     HEAP32[($3 + 8 | 0) >> 2] = $8;
    }
    HEAP32[(0 + 1059120 | 0) >> 2] = $5;
    HEAP32[(0 + 1059108 | 0) >> 2] = $4;
   }
   $3 = $0 + 8 | 0;
  }
  __stack_pointer = $1 + 16 | 0;
  return $3 | 0;
 }
 
 function free($0) {
  $0 = $0 | 0;
  dlfree($0 | 0);
 }
 
 function dlfree($0) {
  $0 = $0 | 0;
  var $2 = 0, $1 = 0, $6 = 0, $4 = 0, $3 = 0, $5 = 0, $7 = 0, $379 = 0, $386 = 0, $393 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  label$1 : {
   if (!$0) {
    break label$1
   }
   $1 = $0 + -8 | 0;
   $2 = HEAP32[($0 + -4 | 0) >> 2] | 0;
   $0 = $2 & -8 | 0;
   $3 = $1 + $0 | 0;
   label$2 : {
    if ($2 & 1 | 0) {
     break label$2
    }
    if (!($2 & 3 | 0)) {
     break label$1
    }
    $2 = HEAP32[$1 >> 2] | 0;
    $1 = $1 - $2 | 0;
    $4 = HEAP32[(0 + 1059116 | 0) >> 2] | 0;
    if ($1 >>> 0 < $4 >>> 0) {
     break label$1
    }
    $0 = $2 + $0 | 0;
    label$3 : {
     if ((HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0) == ($1 | 0)) {
      break label$3
     }
     label$4 : {
      if ($2 >>> 0 > 255 >>> 0) {
       break label$4
      }
      $4 = HEAP32[($1 + 8 | 0) >> 2] | 0;
      $5 = $2 >>> 3 | 0;
      $6 = ($5 << 3 | 0) + 1059140 | 0;
      label$5 : {
       $2 = HEAP32[($1 + 12 | 0) >> 2] | 0;
       if (($2 | 0) != ($4 | 0)) {
        break label$5
       }
       (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059100 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059100 | 0) >> 2] = wasm2js_i32$1;
       break label$2;
      }
      HEAP32[($2 + 8 | 0) >> 2] = $4;
      HEAP32[($4 + 12 | 0) >> 2] = $2;
      break label$2;
     }
     $7 = HEAP32[($1 + 24 | 0) >> 2] | 0;
     label$6 : {
      label$7 : {
       $6 = HEAP32[($1 + 12 | 0) >> 2] | 0;
       if (($6 | 0) == ($1 | 0)) {
        break label$7
       }
       $2 = HEAP32[($1 + 8 | 0) >> 2] | 0;
       HEAP32[($6 + 8 | 0) >> 2] = $2;
       HEAP32[($2 + 12 | 0) >> 2] = $6;
       break label$6;
      }
      label$8 : {
       $2 = $1 + 20 | 0;
       $4 = HEAP32[$2 >> 2] | 0;
       if ($4) {
        break label$8
       }
       $2 = $1 + 16 | 0;
       $4 = HEAP32[$2 >> 2] | 0;
       if ($4) {
        break label$8
       }
       $6 = 0;
       break label$6;
      }
      label$9 : while (1) {
       $5 = $2;
       $6 = $4;
       $2 = $6 + 20 | 0;
       $4 = HEAP32[$2 >> 2] | 0;
       if ($4) {
        continue label$9
       }
       $2 = $6 + 16 | 0;
       $4 = HEAP32[($6 + 16 | 0) >> 2] | 0;
       if ($4) {
        continue label$9
       }
       break label$9;
      };
      HEAP32[$5 >> 2] = 0;
     }
     if (!$7) {
      break label$2
     }
     label$10 : {
      label$11 : {
       $4 = HEAP32[($1 + 28 | 0) >> 2] | 0;
       $2 = ($4 << 2 | 0) + 1059404 | 0;
       if ((HEAP32[$2 >> 2] | 0 | 0) != ($1 | 0)) {
        break label$11
       }
       HEAP32[$2 >> 2] = $6;
       if ($6) {
        break label$10
       }
       (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059104 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $4 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059104 | 0) >> 2] = wasm2js_i32$1;
       break label$2;
      }
      HEAP32[($7 + ((HEAP32[($7 + 16 | 0) >> 2] | 0 | 0) == ($1 | 0) ? 16 : 20) | 0) >> 2] = $6;
      if (!$6) {
       break label$2
      }
     }
     HEAP32[($6 + 24 | 0) >> 2] = $7;
     label$12 : {
      $2 = HEAP32[($1 + 16 | 0) >> 2] | 0;
      if (!$2) {
       break label$12
      }
      HEAP32[($6 + 16 | 0) >> 2] = $2;
      HEAP32[($2 + 24 | 0) >> 2] = $6;
     }
     $2 = HEAP32[($1 + 20 | 0) >> 2] | 0;
     if (!$2) {
      break label$2
     }
     HEAP32[($6 + 20 | 0) >> 2] = $2;
     HEAP32[($2 + 24 | 0) >> 2] = $6;
     break label$2;
    }
    $2 = HEAP32[($3 + 4 | 0) >> 2] | 0;
    if (($2 & 3 | 0 | 0) != (3 | 0)) {
     break label$2
    }
    HEAP32[($3 + 4 | 0) >> 2] = $2 & -2 | 0;
    HEAP32[(0 + 1059108 | 0) >> 2] = $0;
    HEAP32[($1 + $0 | 0) >> 2] = $0;
    HEAP32[($1 + 4 | 0) >> 2] = $0 | 1 | 0;
    return;
   }
   if ($3 >>> 0 <= $1 >>> 0) {
    break label$1
   }
   $2 = HEAP32[($3 + 4 | 0) >> 2] | 0;
   if (!($2 & 1 | 0)) {
    break label$1
   }
   label$13 : {
    label$14 : {
     if ($2 & 2 | 0) {
      break label$14
     }
     label$15 : {
      if ((HEAP32[(0 + 1059124 | 0) >> 2] | 0 | 0) != ($3 | 0)) {
       break label$15
      }
      HEAP32[(0 + 1059124 | 0) >> 2] = $1;
      $0 = (HEAP32[(0 + 1059112 | 0) >> 2] | 0) + $0 | 0;
      HEAP32[(0 + 1059112 | 0) >> 2] = $0;
      HEAP32[($1 + 4 | 0) >> 2] = $0 | 1 | 0;
      if (($1 | 0) != (HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0)) {
       break label$1
      }
      HEAP32[(0 + 1059108 | 0) >> 2] = 0;
      HEAP32[(0 + 1059120 | 0) >> 2] = 0;
      return;
     }
     label$16 : {
      if ((HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0) != ($3 | 0)) {
       break label$16
      }
      HEAP32[(0 + 1059120 | 0) >> 2] = $1;
      $0 = (HEAP32[(0 + 1059108 | 0) >> 2] | 0) + $0 | 0;
      HEAP32[(0 + 1059108 | 0) >> 2] = $0;
      HEAP32[($1 + 4 | 0) >> 2] = $0 | 1 | 0;
      HEAP32[($1 + $0 | 0) >> 2] = $0;
      return;
     }
     $0 = ($2 & -8 | 0) + $0 | 0;
     label$17 : {
      label$18 : {
       if ($2 >>> 0 > 255 >>> 0) {
        break label$18
       }
       $4 = HEAP32[($3 + 8 | 0) >> 2] | 0;
       $5 = $2 >>> 3 | 0;
       $6 = ($5 << 3 | 0) + 1059140 | 0;
       label$19 : {
        $2 = HEAP32[($3 + 12 | 0) >> 2] | 0;
        if (($2 | 0) != ($4 | 0)) {
         break label$19
        }
        (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059100 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059100 | 0) >> 2] = wasm2js_i32$1;
        break label$17;
       }
       HEAP32[($2 + 8 | 0) >> 2] = $4;
       HEAP32[($4 + 12 | 0) >> 2] = $2;
       break label$17;
      }
      $7 = HEAP32[($3 + 24 | 0) >> 2] | 0;
      label$20 : {
       label$21 : {
        $6 = HEAP32[($3 + 12 | 0) >> 2] | 0;
        if (($6 | 0) == ($3 | 0)) {
         break label$21
        }
        $2 = HEAP32[($3 + 8 | 0) >> 2] | 0;
        HEAP32[(0 + 1059116 | 0) >> 2] | 0;
        HEAP32[($6 + 8 | 0) >> 2] = $2;
        HEAP32[($2 + 12 | 0) >> 2] = $6;
        break label$20;
       }
       label$22 : {
        $2 = $3 + 20 | 0;
        $4 = HEAP32[$2 >> 2] | 0;
        if ($4) {
         break label$22
        }
        $2 = $3 + 16 | 0;
        $4 = HEAP32[$2 >> 2] | 0;
        if ($4) {
         break label$22
        }
        $6 = 0;
        break label$20;
       }
       label$23 : while (1) {
        $5 = $2;
        $6 = $4;
        $2 = $6 + 20 | 0;
        $4 = HEAP32[$2 >> 2] | 0;
        if ($4) {
         continue label$23
        }
        $2 = $6 + 16 | 0;
        $4 = HEAP32[($6 + 16 | 0) >> 2] | 0;
        if ($4) {
         continue label$23
        }
        break label$23;
       };
       HEAP32[$5 >> 2] = 0;
      }
      if (!$7) {
       break label$17
      }
      label$24 : {
       label$25 : {
        $4 = HEAP32[($3 + 28 | 0) >> 2] | 0;
        $2 = ($4 << 2 | 0) + 1059404 | 0;
        if ((HEAP32[$2 >> 2] | 0 | 0) != ($3 | 0)) {
         break label$25
        }
        HEAP32[$2 >> 2] = $6;
        if ($6) {
         break label$24
        }
        (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059104 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $4 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059104 | 0) >> 2] = wasm2js_i32$1;
        break label$17;
       }
       HEAP32[($7 + ((HEAP32[($7 + 16 | 0) >> 2] | 0 | 0) == ($3 | 0) ? 16 : 20) | 0) >> 2] = $6;
       if (!$6) {
        break label$17
       }
      }
      HEAP32[($6 + 24 | 0) >> 2] = $7;
      label$26 : {
       $2 = HEAP32[($3 + 16 | 0) >> 2] | 0;
       if (!$2) {
        break label$26
       }
       HEAP32[($6 + 16 | 0) >> 2] = $2;
       HEAP32[($2 + 24 | 0) >> 2] = $6;
      }
      $2 = HEAP32[($3 + 20 | 0) >> 2] | 0;
      if (!$2) {
       break label$17
      }
      HEAP32[($6 + 20 | 0) >> 2] = $2;
      HEAP32[($2 + 24 | 0) >> 2] = $6;
     }
     HEAP32[($1 + $0 | 0) >> 2] = $0;
     HEAP32[($1 + 4 | 0) >> 2] = $0 | 1 | 0;
     if (($1 | 0) != (HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0)) {
      break label$13
     }
     HEAP32[(0 + 1059108 | 0) >> 2] = $0;
     return;
    }
    HEAP32[($3 + 4 | 0) >> 2] = $2 & -2 | 0;
    HEAP32[($1 + $0 | 0) >> 2] = $0;
    HEAP32[($1 + 4 | 0) >> 2] = $0 | 1 | 0;
   }
   label$27 : {
    if ($0 >>> 0 > 255 >>> 0) {
     break label$27
    }
    $2 = $0 >>> 3 | 0;
    $0 = ($2 << 3 | 0) + 1059140 | 0;
    label$28 : {
     label$29 : {
      $4 = HEAP32[(0 + 1059100 | 0) >> 2] | 0;
      $2 = 1 << $2 | 0;
      if ($4 & $2 | 0) {
       break label$29
      }
      HEAP32[(0 + 1059100 | 0) >> 2] = $4 | $2 | 0;
      $2 = $0;
      break label$28;
     }
     $2 = HEAP32[($0 + 8 | 0) >> 2] | 0;
    }
    HEAP32[($2 + 12 | 0) >> 2] = $1;
    HEAP32[($0 + 8 | 0) >> 2] = $1;
    HEAP32[($1 + 12 | 0) >> 2] = $0;
    HEAP32[($1 + 8 | 0) >> 2] = $2;
    return;
   }
   $2 = 31;
   label$30 : {
    if ($0 >>> 0 > 16777215 >>> 0) {
     break label$30
    }
    $2 = $0 >>> 8 | 0;
    $379 = $2;
    $2 = (($2 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
    $4 = $379 << $2 | 0;
    $386 = $4;
    $4 = (($4 + 520192 | 0) >>> 16 | 0) & 4 | 0;
    $6 = $386 << $4 | 0;
    $393 = $6;
    $6 = (($6 + 245760 | 0) >>> 16 | 0) & 2 | 0;
    $2 = (($393 << $6 | 0) >>> 15 | 0) - ($2 | $4 | 0 | $6 | 0) | 0;
    $2 = ($2 << 1 | 0 | (($0 >>> ($2 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
   }
   HEAP32[($1 + 16 | 0) >> 2] = 0;
   HEAP32[($1 + 20 | 0) >> 2] = 0;
   HEAP32[($1 + 28 | 0) >> 2] = $2;
   $4 = ($2 << 2 | 0) + 1059404 | 0;
   label$31 : {
    label$32 : {
     $6 = HEAP32[(0 + 1059104 | 0) >> 2] | 0;
     $3 = 1 << $2 | 0;
     if ($6 & $3 | 0) {
      break label$32
     }
     HEAP32[$4 >> 2] = $1;
     HEAP32[(0 + 1059104 | 0) >> 2] = $6 | $3 | 0;
     HEAP32[($1 + 24 | 0) >> 2] = $4;
     HEAP32[($1 + 8 | 0) >> 2] = $1;
     HEAP32[($1 + 12 | 0) >> 2] = $1;
     break label$31;
    }
    $2 = $0 << (($2 | 0) == (31 | 0) ? 0 : 25 - ($2 >>> 1 | 0) | 0) | 0;
    $6 = HEAP32[$4 >> 2] | 0;
    label$33 : {
     label$34 : while (1) {
      $4 = $6;
      if (((HEAP32[($6 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($0 | 0)) {
       break label$33
      }
      $6 = $2 >>> 29 | 0;
      $2 = $2 << 1 | 0;
      $3 = ($4 + ($6 & 4 | 0) | 0) + 16 | 0;
      $6 = HEAP32[$3 >> 2] | 0;
      if ($6) {
       continue label$34
      }
      break label$34;
     };
     HEAP32[$3 >> 2] = $1;
     HEAP32[($1 + 24 | 0) >> 2] = $4;
     HEAP32[($1 + 12 | 0) >> 2] = $1;
     HEAP32[($1 + 8 | 0) >> 2] = $1;
     break label$31;
    }
    $0 = HEAP32[($4 + 8 | 0) >> 2] | 0;
    HEAP32[($0 + 12 | 0) >> 2] = $1;
    HEAP32[($4 + 8 | 0) >> 2] = $1;
    HEAP32[($1 + 24 | 0) >> 2] = 0;
    HEAP32[($1 + 12 | 0) >> 2] = $4;
    HEAP32[($1 + 8 | 0) >> 2] = $0;
   }
   $1 = (HEAP32[(0 + 1059132 | 0) >> 2] | 0) + -1 | 0;
   HEAP32[(0 + 1059132 | 0) >> 2] = $1 ? $1 : -1;
  }
 }
 
 function calloc($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $2 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $13 = 0, $6$hi = 0, $8$hi = 0, $3 = 0, $3$hi = 0, $16 = 0, i64toi32_i32$2 = 0;
  label$1 : {
   label$2 : {
    if ($0) {
     break label$2
    }
    $2 = 0;
    break label$1;
   }
   i64toi32_i32$0 = 0;
   $6$hi = i64toi32_i32$0;
   i64toi32_i32$0 = 0;
   $8$hi = i64toi32_i32$0;
   i64toi32_i32$0 = $6$hi;
   i64toi32_i32$1 = $8$hi;
   i64toi32_i32$1 = __wasm_i64_mul($0 | 0, i64toi32_i32$0 | 0, $1 | 0, i64toi32_i32$1 | 0) | 0;
   i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
   $3 = i64toi32_i32$1;
   $3$hi = i64toi32_i32$0;
   $2 = i64toi32_i32$1;
   if (($1 | $0 | 0) >>> 0 < 65536 >>> 0) {
    break label$1
   }
   $16 = $2;
   i64toi32_i32$0 = $3$hi;
   i64toi32_i32$2 = $3;
   i64toi32_i32$1 = 0;
   i64toi32_i32$3 = 32;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$1 = 0;
    $13 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   } else {
    i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
    $13 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
   }
   $2 = ($13 | 0) != (0 | 0) ? -1 : $16;
  }
  label$3 : {
   $0 = dlmalloc($2 | 0) | 0;
   if (!$0) {
    break label$3
   }
   if (!((HEAPU8[($0 + -4 | 0) >> 0] | 0) & 3 | 0)) {
    break label$3
   }
   memset($0 | 0, 0 | 0, $2 | 0) | 0;
  }
  return $0 | 0;
 }
 
 function realloc($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $5 = 0, $2 = 0, $8 = 0, $7 = 0, $6 = 0, $3 = 0, $4 = 0, $9 = 0, $11 = 0, $12 = 0, $10 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  label$1 : {
   if ($0) {
    break label$1
   }
   return dlmalloc($1 | 0) | 0 | 0;
  }
  label$2 : {
   if ($1 >>> 0 < -64 >>> 0) {
    break label$2
   }
   HEAP32[(0 + 1059596 | 0) >> 2] = 48;
   return 0 | 0;
  }
  $2 = $1 >>> 0 < 11 >>> 0 ? 16 : ($1 + 19 | 0) & -16 | 0;
  $3 = $0 + -4 | 0;
  $4 = HEAP32[$3 >> 2] | 0;
  $5 = $4 & -8 | 0;
  label$3 : {
   label$4 : {
    label$5 : {
     if ($4 & 3 | 0) {
      break label$5
     }
     if ($2 >>> 0 < 256 >>> 0) {
      break label$4
     }
     if ($5 >>> 0 < ($2 | 4 | 0) >>> 0) {
      break label$4
     }
     if (($5 - $2 | 0) >>> 0 <= ((HEAP32[(0 + 1059580 | 0) >> 2] | 0) << 1 | 0) >>> 0) {
      break label$3
     }
     break label$4;
    }
    $6 = $0 + -8 | 0;
    $7 = $6 + $5 | 0;
    label$6 : {
     if ($5 >>> 0 < $2 >>> 0) {
      break label$6
     }
     $1 = $5 - $2 | 0;
     if ($1 >>> 0 < 16 >>> 0) {
      break label$3
     }
     HEAP32[$3 >> 2] = $2 | ($4 & 1 | 0) | 0 | 2 | 0;
     $2 = $6 + $2 | 0;
     HEAP32[($2 + 4 | 0) >> 2] = $1 | 3 | 0;
     HEAP32[($7 + 4 | 0) >> 2] = HEAP32[($7 + 4 | 0) >> 2] | 0 | 1 | 0;
     dispose_chunk($2 | 0, $1 | 0);
     return $0 | 0;
    }
    label$7 : {
     if ((HEAP32[(0 + 1059124 | 0) >> 2] | 0 | 0) != ($7 | 0)) {
      break label$7
     }
     $5 = (HEAP32[(0 + 1059112 | 0) >> 2] | 0) + $5 | 0;
     if ($5 >>> 0 <= $2 >>> 0) {
      break label$4
     }
     HEAP32[$3 >> 2] = $2 | ($4 & 1 | 0) | 0 | 2 | 0;
     $1 = $6 + $2 | 0;
     HEAP32[(0 + 1059124 | 0) >> 2] = $1;
     $2 = $5 - $2 | 0;
     HEAP32[(0 + 1059112 | 0) >> 2] = $2;
     HEAP32[($1 + 4 | 0) >> 2] = $2 | 1 | 0;
     return $0 | 0;
    }
    label$8 : {
     if ((HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0) != ($7 | 0)) {
      break label$8
     }
     $5 = (HEAP32[(0 + 1059108 | 0) >> 2] | 0) + $5 | 0;
     if ($5 >>> 0 < $2 >>> 0) {
      break label$4
     }
     label$9 : {
      label$10 : {
       $1 = $5 - $2 | 0;
       if ($1 >>> 0 < 16 >>> 0) {
        break label$10
       }
       HEAP32[$3 >> 2] = $2 | ($4 & 1 | 0) | 0 | 2 | 0;
       $2 = $6 + $2 | 0;
       HEAP32[($2 + 4 | 0) >> 2] = $1 | 1 | 0;
       $5 = $6 + $5 | 0;
       HEAP32[$5 >> 2] = $1;
       HEAP32[($5 + 4 | 0) >> 2] = (HEAP32[($5 + 4 | 0) >> 2] | 0) & -2 | 0;
       break label$9;
      }
      HEAP32[$3 >> 2] = $4 & 1 | 0 | $5 | 0 | 2 | 0;
      $1 = $6 + $5 | 0;
      HEAP32[($1 + 4 | 0) >> 2] = HEAP32[($1 + 4 | 0) >> 2] | 0 | 1 | 0;
      $1 = 0;
      $2 = 0;
     }
     HEAP32[(0 + 1059120 | 0) >> 2] = $2;
     HEAP32[(0 + 1059108 | 0) >> 2] = $1;
     return $0 | 0;
    }
    $8 = HEAP32[($7 + 4 | 0) >> 2] | 0;
    if ($8 & 2 | 0) {
     break label$4
    }
    $9 = ($8 & -8 | 0) + $5 | 0;
    if ($9 >>> 0 < $2 >>> 0) {
     break label$4
    }
    $10 = $9 - $2 | 0;
    label$11 : {
     label$12 : {
      if ($8 >>> 0 > 255 >>> 0) {
       break label$12
      }
      $1 = HEAP32[($7 + 8 | 0) >> 2] | 0;
      $11 = $8 >>> 3 | 0;
      $8 = ($11 << 3 | 0) + 1059140 | 0;
      label$13 : {
       $5 = HEAP32[($7 + 12 | 0) >> 2] | 0;
       if (($5 | 0) != ($1 | 0)) {
        break label$13
       }
       (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059100 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $11 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059100 | 0) >> 2] = wasm2js_i32$1;
       break label$11;
      }
      HEAP32[($5 + 8 | 0) >> 2] = $1;
      HEAP32[($1 + 12 | 0) >> 2] = $5;
      break label$11;
     }
     $12 = HEAP32[($7 + 24 | 0) >> 2] | 0;
     label$14 : {
      label$15 : {
       $8 = HEAP32[($7 + 12 | 0) >> 2] | 0;
       if (($8 | 0) == ($7 | 0)) {
        break label$15
       }
       $1 = HEAP32[($7 + 8 | 0) >> 2] | 0;
       HEAP32[(0 + 1059116 | 0) >> 2] | 0;
       HEAP32[($8 + 8 | 0) >> 2] = $1;
       HEAP32[($1 + 12 | 0) >> 2] = $8;
       break label$14;
      }
      label$16 : {
       $1 = $7 + 20 | 0;
       $5 = HEAP32[$1 >> 2] | 0;
       if ($5) {
        break label$16
       }
       $1 = $7 + 16 | 0;
       $5 = HEAP32[$1 >> 2] | 0;
       if ($5) {
        break label$16
       }
       $8 = 0;
       break label$14;
      }
      label$17 : while (1) {
       $11 = $1;
       $8 = $5;
       $1 = $5 + 20 | 0;
       $5 = HEAP32[$1 >> 2] | 0;
       if ($5) {
        continue label$17
       }
       $1 = $8 + 16 | 0;
       $5 = HEAP32[($8 + 16 | 0) >> 2] | 0;
       if ($5) {
        continue label$17
       }
       break label$17;
      };
      HEAP32[$11 >> 2] = 0;
     }
     if (!$12) {
      break label$11
     }
     label$18 : {
      label$19 : {
       $5 = HEAP32[($7 + 28 | 0) >> 2] | 0;
       $1 = ($5 << 2 | 0) + 1059404 | 0;
       if ((HEAP32[$1 >> 2] | 0 | 0) != ($7 | 0)) {
        break label$19
       }
       HEAP32[$1 >> 2] = $8;
       if ($8) {
        break label$18
       }
       (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059104 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059104 | 0) >> 2] = wasm2js_i32$1;
       break label$11;
      }
      HEAP32[($12 + ((HEAP32[($12 + 16 | 0) >> 2] | 0 | 0) == ($7 | 0) ? 16 : 20) | 0) >> 2] = $8;
      if (!$8) {
       break label$11
      }
     }
     HEAP32[($8 + 24 | 0) >> 2] = $12;
     label$20 : {
      $1 = HEAP32[($7 + 16 | 0) >> 2] | 0;
      if (!$1) {
       break label$20
      }
      HEAP32[($8 + 16 | 0) >> 2] = $1;
      HEAP32[($1 + 24 | 0) >> 2] = $8;
     }
     $1 = HEAP32[($7 + 20 | 0) >> 2] | 0;
     if (!$1) {
      break label$11
     }
     HEAP32[($8 + 20 | 0) >> 2] = $1;
     HEAP32[($1 + 24 | 0) >> 2] = $8;
    }
    label$21 : {
     if ($10 >>> 0 > 15 >>> 0) {
      break label$21
     }
     HEAP32[$3 >> 2] = $4 & 1 | 0 | $9 | 0 | 2 | 0;
     $1 = $6 + $9 | 0;
     HEAP32[($1 + 4 | 0) >> 2] = HEAP32[($1 + 4 | 0) >> 2] | 0 | 1 | 0;
     return $0 | 0;
    }
    HEAP32[$3 >> 2] = $2 | ($4 & 1 | 0) | 0 | 2 | 0;
    $1 = $6 + $2 | 0;
    HEAP32[($1 + 4 | 0) >> 2] = $10 | 3 | 0;
    $2 = $6 + $9 | 0;
    HEAP32[($2 + 4 | 0) >> 2] = HEAP32[($2 + 4 | 0) >> 2] | 0 | 1 | 0;
    dispose_chunk($1 | 0, $10 | 0);
    return $0 | 0;
   }
   label$22 : {
    $2 = dlmalloc($1 | 0) | 0;
    if ($2) {
     break label$22
    }
    return 0 | 0;
   }
   $5 = HEAP32[$3 >> 2] | 0;
   $5 = ($5 & 3 | 0 ? -4 : -8) + ($5 & -8 | 0) | 0;
   $1 = memcpy($2 | 0, $0 | 0, ($5 >>> 0 < $1 >>> 0 ? $5 : $1) | 0) | 0;
   dlfree($0 | 0);
   $0 = $1;
  }
  return $0 | 0;
 }
 
 function dispose_chunk($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $3 = 0, $6 = 0, $4 = 0, $2 = 0, $5 = 0, $7 = 0, $360 = 0, $367 = 0, $374 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $2 = $0 + $1 | 0;
  label$1 : {
   label$2 : {
    $3 = HEAP32[($0 + 4 | 0) >> 2] | 0;
    if ($3 & 1 | 0) {
     break label$2
    }
    if (!($3 & 3 | 0)) {
     break label$1
    }
    $3 = HEAP32[$0 >> 2] | 0;
    $1 = $3 + $1 | 0;
    label$3 : {
     label$4 : {
      $0 = $0 - $3 | 0;
      if ((HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0) == ($0 | 0)) {
       break label$4
      }
      label$5 : {
       if ($3 >>> 0 > 255 >>> 0) {
        break label$5
       }
       $4 = HEAP32[($0 + 8 | 0) >> 2] | 0;
       $5 = $3 >>> 3 | 0;
       $6 = ($5 << 3 | 0) + 1059140 | 0;
       $3 = HEAP32[($0 + 12 | 0) >> 2] | 0;
       if (($3 | 0) != ($4 | 0)) {
        break label$3
       }
       (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059100 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059100 | 0) >> 2] = wasm2js_i32$1;
       break label$2;
      }
      $7 = HEAP32[($0 + 24 | 0) >> 2] | 0;
      label$6 : {
       label$7 : {
        $6 = HEAP32[($0 + 12 | 0) >> 2] | 0;
        if (($6 | 0) == ($0 | 0)) {
         break label$7
        }
        $3 = HEAP32[($0 + 8 | 0) >> 2] | 0;
        HEAP32[(0 + 1059116 | 0) >> 2] | 0;
        HEAP32[($6 + 8 | 0) >> 2] = $3;
        HEAP32[($3 + 12 | 0) >> 2] = $6;
        break label$6;
       }
       label$8 : {
        $3 = $0 + 20 | 0;
        $4 = HEAP32[$3 >> 2] | 0;
        if ($4) {
         break label$8
        }
        $3 = $0 + 16 | 0;
        $4 = HEAP32[$3 >> 2] | 0;
        if ($4) {
         break label$8
        }
        $6 = 0;
        break label$6;
       }
       label$9 : while (1) {
        $5 = $3;
        $6 = $4;
        $3 = $6 + 20 | 0;
        $4 = HEAP32[$3 >> 2] | 0;
        if ($4) {
         continue label$9
        }
        $3 = $6 + 16 | 0;
        $4 = HEAP32[($6 + 16 | 0) >> 2] | 0;
        if ($4) {
         continue label$9
        }
        break label$9;
       };
       HEAP32[$5 >> 2] = 0;
      }
      if (!$7) {
       break label$2
      }
      label$10 : {
       label$11 : {
        $4 = HEAP32[($0 + 28 | 0) >> 2] | 0;
        $3 = ($4 << 2 | 0) + 1059404 | 0;
        if ((HEAP32[$3 >> 2] | 0 | 0) != ($0 | 0)) {
         break label$11
        }
        HEAP32[$3 >> 2] = $6;
        if ($6) {
         break label$10
        }
        (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059104 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $4 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059104 | 0) >> 2] = wasm2js_i32$1;
        break label$2;
       }
       HEAP32[($7 + ((HEAP32[($7 + 16 | 0) >> 2] | 0 | 0) == ($0 | 0) ? 16 : 20) | 0) >> 2] = $6;
       if (!$6) {
        break label$2
       }
      }
      HEAP32[($6 + 24 | 0) >> 2] = $7;
      label$12 : {
       $3 = HEAP32[($0 + 16 | 0) >> 2] | 0;
       if (!$3) {
        break label$12
       }
       HEAP32[($6 + 16 | 0) >> 2] = $3;
       HEAP32[($3 + 24 | 0) >> 2] = $6;
      }
      $3 = HEAP32[($0 + 20 | 0) >> 2] | 0;
      if (!$3) {
       break label$2
      }
      HEAP32[($6 + 20 | 0) >> 2] = $3;
      HEAP32[($3 + 24 | 0) >> 2] = $6;
      break label$2;
     }
     $3 = HEAP32[($2 + 4 | 0) >> 2] | 0;
     if (($3 & 3 | 0 | 0) != (3 | 0)) {
      break label$2
     }
     HEAP32[($2 + 4 | 0) >> 2] = $3 & -2 | 0;
     HEAP32[(0 + 1059108 | 0) >> 2] = $1;
     HEAP32[$2 >> 2] = $1;
     HEAP32[($0 + 4 | 0) >> 2] = $1 | 1 | 0;
     return;
    }
    HEAP32[($3 + 8 | 0) >> 2] = $4;
    HEAP32[($4 + 12 | 0) >> 2] = $3;
   }
   label$13 : {
    label$14 : {
     $3 = HEAP32[($2 + 4 | 0) >> 2] | 0;
     if ($3 & 2 | 0) {
      break label$14
     }
     label$15 : {
      if ((HEAP32[(0 + 1059124 | 0) >> 2] | 0 | 0) != ($2 | 0)) {
       break label$15
      }
      HEAP32[(0 + 1059124 | 0) >> 2] = $0;
      $1 = (HEAP32[(0 + 1059112 | 0) >> 2] | 0) + $1 | 0;
      HEAP32[(0 + 1059112 | 0) >> 2] = $1;
      HEAP32[($0 + 4 | 0) >> 2] = $1 | 1 | 0;
      if (($0 | 0) != (HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0)) {
       break label$1
      }
      HEAP32[(0 + 1059108 | 0) >> 2] = 0;
      HEAP32[(0 + 1059120 | 0) >> 2] = 0;
      return;
     }
     label$16 : {
      if ((HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0) != ($2 | 0)) {
       break label$16
      }
      HEAP32[(0 + 1059120 | 0) >> 2] = $0;
      $1 = (HEAP32[(0 + 1059108 | 0) >> 2] | 0) + $1 | 0;
      HEAP32[(0 + 1059108 | 0) >> 2] = $1;
      HEAP32[($0 + 4 | 0) >> 2] = $1 | 1 | 0;
      HEAP32[($0 + $1 | 0) >> 2] = $1;
      return;
     }
     $1 = ($3 & -8 | 0) + $1 | 0;
     label$17 : {
      label$18 : {
       if ($3 >>> 0 > 255 >>> 0) {
        break label$18
       }
       $4 = HEAP32[($2 + 8 | 0) >> 2] | 0;
       $5 = $3 >>> 3 | 0;
       $6 = ($5 << 3 | 0) + 1059140 | 0;
       label$19 : {
        $3 = HEAP32[($2 + 12 | 0) >> 2] | 0;
        if (($3 | 0) != ($4 | 0)) {
         break label$19
        }
        (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059100 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $5 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059100 | 0) >> 2] = wasm2js_i32$1;
        break label$17;
       }
       HEAP32[($3 + 8 | 0) >> 2] = $4;
       HEAP32[($4 + 12 | 0) >> 2] = $3;
       break label$17;
      }
      $7 = HEAP32[($2 + 24 | 0) >> 2] | 0;
      label$20 : {
       label$21 : {
        $6 = HEAP32[($2 + 12 | 0) >> 2] | 0;
        if (($6 | 0) == ($2 | 0)) {
         break label$21
        }
        $3 = HEAP32[($2 + 8 | 0) >> 2] | 0;
        HEAP32[(0 + 1059116 | 0) >> 2] | 0;
        HEAP32[($6 + 8 | 0) >> 2] = $3;
        HEAP32[($3 + 12 | 0) >> 2] = $6;
        break label$20;
       }
       label$22 : {
        $4 = $2 + 20 | 0;
        $3 = HEAP32[$4 >> 2] | 0;
        if ($3) {
         break label$22
        }
        $4 = $2 + 16 | 0;
        $3 = HEAP32[$4 >> 2] | 0;
        if ($3) {
         break label$22
        }
        $6 = 0;
        break label$20;
       }
       label$23 : while (1) {
        $5 = $4;
        $6 = $3;
        $4 = $3 + 20 | 0;
        $3 = HEAP32[$4 >> 2] | 0;
        if ($3) {
         continue label$23
        }
        $4 = $6 + 16 | 0;
        $3 = HEAP32[($6 + 16 | 0) >> 2] | 0;
        if ($3) {
         continue label$23
        }
        break label$23;
       };
       HEAP32[$5 >> 2] = 0;
      }
      if (!$7) {
       break label$17
      }
      label$24 : {
       label$25 : {
        $4 = HEAP32[($2 + 28 | 0) >> 2] | 0;
        $3 = ($4 << 2 | 0) + 1059404 | 0;
        if ((HEAP32[$3 >> 2] | 0 | 0) != ($2 | 0)) {
         break label$25
        }
        HEAP32[$3 >> 2] = $6;
        if ($6) {
         break label$24
        }
        (wasm2js_i32$0 = 0, wasm2js_i32$1 = (HEAP32[(0 + 1059104 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $4 | 0) | 0) | 0), HEAP32[(wasm2js_i32$0 + 1059104 | 0) >> 2] = wasm2js_i32$1;
        break label$17;
       }
       HEAP32[($7 + ((HEAP32[($7 + 16 | 0) >> 2] | 0 | 0) == ($2 | 0) ? 16 : 20) | 0) >> 2] = $6;
       if (!$6) {
        break label$17
       }
      }
      HEAP32[($6 + 24 | 0) >> 2] = $7;
      label$26 : {
       $3 = HEAP32[($2 + 16 | 0) >> 2] | 0;
       if (!$3) {
        break label$26
       }
       HEAP32[($6 + 16 | 0) >> 2] = $3;
       HEAP32[($3 + 24 | 0) >> 2] = $6;
      }
      $3 = HEAP32[($2 + 20 | 0) >> 2] | 0;
      if (!$3) {
       break label$17
      }
      HEAP32[($6 + 20 | 0) >> 2] = $3;
      HEAP32[($3 + 24 | 0) >> 2] = $6;
     }
     HEAP32[($0 + $1 | 0) >> 2] = $1;
     HEAP32[($0 + 4 | 0) >> 2] = $1 | 1 | 0;
     if (($0 | 0) != (HEAP32[(0 + 1059120 | 0) >> 2] | 0 | 0)) {
      break label$13
     }
     HEAP32[(0 + 1059108 | 0) >> 2] = $1;
     return;
    }
    HEAP32[($2 + 4 | 0) >> 2] = $3 & -2 | 0;
    HEAP32[($0 + $1 | 0) >> 2] = $1;
    HEAP32[($0 + 4 | 0) >> 2] = $1 | 1 | 0;
   }
   label$27 : {
    if ($1 >>> 0 > 255 >>> 0) {
     break label$27
    }
    $3 = $1 >>> 3 | 0;
    $1 = ($3 << 3 | 0) + 1059140 | 0;
    label$28 : {
     label$29 : {
      $4 = HEAP32[(0 + 1059100 | 0) >> 2] | 0;
      $3 = 1 << $3 | 0;
      if ($4 & $3 | 0) {
       break label$29
      }
      HEAP32[(0 + 1059100 | 0) >> 2] = $4 | $3 | 0;
      $3 = $1;
      break label$28;
     }
     $3 = HEAP32[($1 + 8 | 0) >> 2] | 0;
    }
    HEAP32[($3 + 12 | 0) >> 2] = $0;
    HEAP32[($1 + 8 | 0) >> 2] = $0;
    HEAP32[($0 + 12 | 0) >> 2] = $1;
    HEAP32[($0 + 8 | 0) >> 2] = $3;
    return;
   }
   $3 = 31;
   label$30 : {
    if ($1 >>> 0 > 16777215 >>> 0) {
     break label$30
    }
    $3 = $1 >>> 8 | 0;
    $360 = $3;
    $3 = (($3 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
    $4 = $360 << $3 | 0;
    $367 = $4;
    $4 = (($4 + 520192 | 0) >>> 16 | 0) & 4 | 0;
    $6 = $367 << $4 | 0;
    $374 = $6;
    $6 = (($6 + 245760 | 0) >>> 16 | 0) & 2 | 0;
    $3 = (($374 << $6 | 0) >>> 15 | 0) - ($3 | $4 | 0 | $6 | 0) | 0;
    $3 = ($3 << 1 | 0 | (($1 >>> ($3 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
   }
   HEAP32[($0 + 16 | 0) >> 2] = 0;
   HEAP32[($0 + 20 | 0) >> 2] = 0;
   HEAP32[($0 + 28 | 0) >> 2] = $3;
   $4 = ($3 << 2 | 0) + 1059404 | 0;
   label$31 : {
    $6 = HEAP32[(0 + 1059104 | 0) >> 2] | 0;
    $2 = 1 << $3 | 0;
    if ($6 & $2 | 0) {
     break label$31
    }
    HEAP32[$4 >> 2] = $0;
    HEAP32[(0 + 1059104 | 0) >> 2] = $6 | $2 | 0;
    HEAP32[($0 + 24 | 0) >> 2] = $4;
    HEAP32[($0 + 8 | 0) >> 2] = $0;
    HEAP32[($0 + 12 | 0) >> 2] = $0;
    return;
   }
   $3 = $1 << (($3 | 0) == (31 | 0) ? 0 : 25 - ($3 >>> 1 | 0) | 0) | 0;
   $6 = HEAP32[$4 >> 2] | 0;
   label$32 : {
    label$33 : while (1) {
     $4 = $6;
     if (((HEAP32[($6 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($1 | 0)) {
      break label$32
     }
     $6 = $3 >>> 29 | 0;
     $3 = $3 << 1 | 0;
     $2 = ($4 + ($6 & 4 | 0) | 0) + 16 | 0;
     $6 = HEAP32[$2 >> 2] | 0;
     if ($6) {
      continue label$33
     }
     break label$33;
    };
    HEAP32[$2 >> 2] = $0;
    HEAP32[($0 + 24 | 0) >> 2] = $4;
    HEAP32[($0 + 12 | 0) >> 2] = $0;
    HEAP32[($0 + 8 | 0) >> 2] = $0;
    return;
   }
   $1 = HEAP32[($4 + 8 | 0) >> 2] | 0;
   HEAP32[($1 + 12 | 0) >> 2] = $0;
   HEAP32[($4 + 8 | 0) >> 2] = $0;
   HEAP32[($0 + 24 | 0) >> 2] = 0;
   HEAP32[($0 + 12 | 0) >> 2] = $4;
   HEAP32[($0 + 8 | 0) >> 2] = $1;
  }
 }
 
 function internal_memalign($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $3 = 0, $2 = 0, $6 = 0, $4 = 0, $5 = 0;
  label$1 : {
   label$2 : {
    $2 = $0 >>> 0 > 16 >>> 0 ? $0 : 16;
    if ($2 & ($2 + -1 | 0) | 0) {
     break label$2
    }
    $0 = $2;
    break label$1;
   }
   $3 = 32;
   label$3 : while (1) {
    $0 = $3;
    $3 = $0 << 1 | 0;
    if ($0 >>> 0 < $2 >>> 0) {
     continue label$3
    }
    break label$3;
   };
  }
  label$4 : {
   if ((-64 - $0 | 0) >>> 0 > $1 >>> 0) {
    break label$4
   }
   HEAP32[(0 + 1059596 | 0) >> 2] = 48;
   return 0 | 0;
  }
  label$5 : {
   $1 = $1 >>> 0 < 11 >>> 0 ? 16 : ($1 + 19 | 0) & -16 | 0;
   $3 = dlmalloc(($0 + $1 | 0) + 12 | 0 | 0) | 0;
   if ($3) {
    break label$5
   }
   return 0 | 0;
  }
  $2 = $3 + -8 | 0;
  label$6 : {
   label$7 : {
    if (($0 + -1 | 0) & $3 | 0) {
     break label$7
    }
    $0 = $2;
    break label$6;
   }
   $4 = $3 + -4 | 0;
   $5 = HEAP32[$4 >> 2] | 0;
   $3 = ((($3 + $0 | 0) + -1 | 0) & (0 - $0 | 0) | 0) + -8 | 0;
   $0 = $3 + (($3 - $2 | 0) >>> 0 > 15 >>> 0 ? 0 : $0) | 0;
   $3 = $0 - $2 | 0;
   $6 = ($5 & -8 | 0) - $3 | 0;
   label$8 : {
    if ($5 & 3 | 0) {
     break label$8
    }
    HEAP32[($0 + 4 | 0) >> 2] = $6;
    HEAP32[$0 >> 2] = (HEAP32[$2 >> 2] | 0) + $3 | 0;
    break label$6;
   }
   HEAP32[($0 + 4 | 0) >> 2] = $6 | ((HEAP32[($0 + 4 | 0) >> 2] | 0) & 1 | 0) | 0 | 2 | 0;
   $6 = $0 + $6 | 0;
   HEAP32[($6 + 4 | 0) >> 2] = HEAP32[($6 + 4 | 0) >> 2] | 0 | 1 | 0;
   HEAP32[$4 >> 2] = $3 | ((HEAP32[$4 >> 2] | 0) & 1 | 0) | 0 | 2 | 0;
   $6 = $2 + $3 | 0;
   HEAP32[($6 + 4 | 0) >> 2] = HEAP32[($6 + 4 | 0) >> 2] | 0 | 1 | 0;
   dispose_chunk($2 | 0, $3 | 0);
  }
  label$9 : {
   $3 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   if (!($3 & 3 | 0)) {
    break label$9
   }
   $2 = $3 & -8 | 0;
   if ($2 >>> 0 <= ($1 + 16 | 0) >>> 0) {
    break label$9
   }
   HEAP32[($0 + 4 | 0) >> 2] = $1 | ($3 & 1 | 0) | 0 | 2 | 0;
   $3 = $0 + $1 | 0;
   $1 = $2 - $1 | 0;
   HEAP32[($3 + 4 | 0) >> 2] = $1 | 3 | 0;
   $2 = $0 + $2 | 0;
   HEAP32[($2 + 4 | 0) >> 2] = HEAP32[($2 + 4 | 0) >> 2] | 0 | 1 | 0;
   dispose_chunk($3 | 0, $1 | 0);
  }
  return $0 + 8 | 0 | 0;
 }
 
 function aligned_alloc($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  label$1 : {
   if ($0 >>> 0 > 16 >>> 0) {
    break label$1
   }
   return dlmalloc($1 | 0) | 0 | 0;
  }
  return internal_memalign($0 | 0, $1 | 0) | 0 | 0;
 }
 
 function __wasilibc_initialize_environ_eagerly() {
  __wasilibc_initialize_environ();
 }
 
 function abort() {
  abort();
 }
 
 function __original_main() {
  return __main_void() | 0 | 0;
 }
 
 function __wasi_args_get($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return (__imported_wasi_snapshot_preview1_args_get($0 | 0, $1 | 0) | 0) & 65535 | 0 | 0;
 }
 
 function __wasi_args_sizes_get($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return (__imported_wasi_snapshot_preview1_args_sizes_get($0 | 0, $1 | 0) | 0) & 65535 | 0 | 0;
 }
 
 function __wasi_environ_get($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return (__imported_wasi_snapshot_preview1_environ_get($0 | 0, $1 | 0) | 0) & 65535 | 0 | 0;
 }
 
 function __wasi_environ_sizes_get($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return (__imported_wasi_snapshot_preview1_environ_sizes_get($0 | 0, $1 | 0) | 0) & 65535 | 0 | 0;
 }
 
 function __wasi_proc_exit($0) {
  $0 = $0 | 0;
  __imported_wasi_snapshot_preview1_proc_exit($0 | 0);
  abort();
 }
 
 function sbrk($0) {
  $0 = $0 | 0;
  label$1 : {
   if ($0) {
    break label$1
   }
   return __wasm_memory_size() << 16 | 0 | 0;
  }
  label$2 : {
   if ($0 & 65535 | 0) {
    break label$2
   }
   if (($0 | 0) <= (-1 | 0)) {
    break label$2
   }
   label$3 : {
    $0 = __wasm_memory_grow($0 >>> 16 | 0 | 0);
    if (($0 | 0) != (-1 | 0)) {
     break label$3
    }
    HEAP32[(0 + 1059596 | 0) >> 2] = 48;
    return -1 | 0;
   }
   return $0 << 16 | 0 | 0;
  }
  abort();
  abort();
 }
 
 function main_1($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return main($0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _Exit($0) {
  $0 = $0 | 0;
  __wasi_proc_exit($0 | 0);
  abort();
 }
 
 function __main_void() {
  var $1 = 0, $0 = 0, $3 = 0, $2 = 0;
  $0 = __stack_pointer - 16 | 0;
  __stack_pointer = $0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       if (__wasi_args_sizes_get($0 + 8 | 0 | 0, $0 + 12 | 0 | 0) | 0) {
        break label$5
       }
       $1 = HEAP32[($0 + 8 | 0) >> 2] | 0;
       $2 = $1 + 1 | 0;
       if ($2 >>> 0 < $1 >>> 0) {
        break label$4
       }
       $3 = malloc(HEAP32[($0 + 12 | 0) >> 2] | 0 | 0) | 0;
       if (!$3) {
        break label$3
       }
       $1 = calloc($2 | 0, 4 | 0) | 0;
       if (!$1) {
        break label$2
       }
       if (__wasi_args_get($1 | 0, $3 | 0) | 0) {
        break label$1
       }
       $1 = main_1(HEAP32[($0 + 8 | 0) >> 2] | 0 | 0, $1 | 0) | 0;
       __stack_pointer = $0 + 16 | 0;
       return $1 | 0;
      }
      _Exit(71 | 0);
      abort();
     }
     _Exit(70 | 0);
     abort();
    }
    _Exit(70 | 0);
    abort();
   }
   free($3 | 0);
   _Exit(70 | 0);
   abort();
  }
  free($3 | 0);
  free($1 | 0);
  _Exit(71 | 0);
  abort();
 }
 
 function getcwd($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = HEAP32[(0 + 1059004 | 0) >> 2] | 0;
  label$1 : {
   label$2 : {
    if ($0) {
     break label$2
    }
    $0 = strdup($2 | 0) | 0;
    if ($0) {
     break label$1
    }
    HEAP32[(0 + 1059596 | 0) >> 2] = 48;
    return 0 | 0;
   }
   label$3 : {
    if (((strlen($2 | 0) | 0) + 1 | 0) >>> 0 > $1 >>> 0) {
     break label$3
    }
    return strcpy($0 | 0, $2 | 0) | 0 | 0;
   }
   $0 = 0;
   HEAP32[(0 + 1059596 | 0) >> 2] = 68;
  }
  return $0 | 0;
 }
 
 function __wasilibc_ensure_environ() {
  label$1 : {
   if ((HEAP32[(0 + 1059600 | 0) >> 2] | 0 | 0) != (-1 | 0)) {
    break label$1
   }
   __wasilibc_initialize_environ();
  }
 }
 
 function __wasilibc_initialize_environ() {
  var $1 = 0, $0 = 0, $3 = 0, $2 = 0;
  $0 = __stack_pointer - 16 | 0;
  __stack_pointer = $0;
  label$1 : {
   label$2 : {
    label$3 : {
     if (__wasi_environ_sizes_get($0 + 12 | 0 | 0, $0 + 8 | 0 | 0) | 0) {
      break label$3
     }
     label$4 : {
      $1 = HEAP32[($0 + 12 | 0) >> 2] | 0;
      if ($1) {
       break label$4
      }
      HEAP32[(0 + 1059600 | 0) >> 2] = 1059604;
      break label$1;
     }
     label$5 : {
      label$6 : {
       $2 = $1 + 1 | 0;
       if ($2 >>> 0 < $1 >>> 0) {
        break label$6
       }
       $3 = malloc(HEAP32[($0 + 8 | 0) >> 2] | 0 | 0) | 0;
       if (!$3) {
        break label$6
       }
       $1 = calloc($2 | 0, 4 | 0) | 0;
       if ($1) {
        break label$5
       }
       free($3 | 0);
      }
      _Exit(70 | 0);
      abort();
     }
     if (!(__wasi_environ_get($1 | 0, $3 | 0) | 0)) {
      break label$2
     }
     free($3 | 0);
     free($1 | 0);
    }
    _Exit(71 | 0);
    abort();
   }
   HEAP32[(0 + 1059600 | 0) >> 2] = $1;
  }
  __stack_pointer = $0 + 16 | 0;
 }
 
 function dummy() {
  
 }
 
 function __wasm_call_dtors() {
  dummy();
  dummy();
 }
 
 function exit($0) {
  $0 = $0 | 0;
  dummy();
  dummy();
  _Exit($0 | 0);
  abort();
 }
 
 function getenv($0) {
  $0 = $0 | 0;
  var $4 = 0, $3 = 0, $1 = 0, $2 = 0;
  __wasilibc_ensure_environ();
  label$1 : {
   $1 = (__strchrnul($0 | 0, 61 | 0) | 0) - $0 | 0;
   if ($1) {
    break label$1
   }
   return 0 | 0;
  }
  $2 = 0;
  label$2 : {
   if (HEAPU8[($0 + $1 | 0) >> 0] | 0) {
    break label$2
   }
   $3 = HEAP32[(0 + 1059600 | 0) >> 2] | 0;
   if (!$3) {
    break label$2
   }
   $4 = HEAP32[$3 >> 2] | 0;
   if (!$4) {
    break label$2
   }
   $3 = $3 + 4 | 0;
   label$3 : {
    label$4 : while (1) {
     label$5 : {
      if (strncmp($0 | 0, $4 | 0, $1 | 0) | 0) {
       break label$5
      }
      $4 = $4 + $1 | 0;
      if ((HEAPU8[$4 >> 0] | 0 | 0) == (61 | 0)) {
       break label$3
      }
     }
     $4 = HEAP32[$3 >> 2] | 0;
     $3 = $3 + 4 | 0;
     if ($4) {
      continue label$4
     }
     break label$2;
    };
   }
   $2 = $4 + 1 | 0;
  }
  return $2 | 0;
 }
 
 function strdup($0) {
  $0 = $0 | 0;
  var $2 = 0, $1 = 0;
  label$1 : {
   $1 = (strlen($0 | 0) | 0) + 1 | 0;
   $2 = malloc($1 | 0) | 0;
   if (!$2) {
    break label$1
   }
   memcpy($2 | 0, $0 | 0, $1 | 0) | 0;
  }
  return $2 | 0;
 }
 
 function memmove($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $4 = 0, $6 = 0, $5 = 0;
  label$1 : {
   if (($0 | 0) == ($1 | 0)) {
    break label$1
   }
   label$2 : {
    $3 = $0 + $2 | 0;
    if (($1 - $3 | 0) >>> 0 > (0 - ($2 << 1 | 0) | 0) >>> 0) {
     break label$2
    }
    memcpy($0 | 0, $1 | 0, $2 | 0) | 0;
    break label$1;
   }
   $4 = ($1 ^ $0 | 0) & 3 | 0;
   label$3 : {
    label$4 : {
     label$5 : {
      if ($0 >>> 0 >= $1 >>> 0) {
       break label$5
      }
      label$6 : {
       if (!$4) {
        break label$6
       }
       $4 = $2;
       $3 = $0;
       break label$3;
      }
      label$7 : {
       if ($0 & 3 | 0) {
        break label$7
       }
       $4 = $2;
       $3 = $0;
       break label$4;
      }
      if (!$2) {
       break label$1
      }
      HEAP8[$0 >> 0] = HEAPU8[$1 >> 0] | 0;
      $4 = $2 + -1 | 0;
      label$8 : {
       $3 = $0 + 1 | 0;
       if ($3 & 3 | 0) {
        break label$8
       }
       $1 = $1 + 1 | 0;
       break label$4;
      }
      if (!$4) {
       break label$1
      }
      HEAP8[($0 + 1 | 0) >> 0] = HEAPU8[($1 + 1 | 0) >> 0] | 0;
      $4 = $2 + -2 | 0;
      label$9 : {
       $3 = $0 + 2 | 0;
       if ($3 & 3 | 0) {
        break label$9
       }
       $1 = $1 + 2 | 0;
       break label$4;
      }
      if (!$4) {
       break label$1
      }
      HEAP8[($0 + 2 | 0) >> 0] = HEAPU8[($1 + 2 | 0) >> 0] | 0;
      $4 = $2 + -3 | 0;
      label$10 : {
       $3 = $0 + 3 | 0;
       if ($3 & 3 | 0) {
        break label$10
       }
       $1 = $1 + 3 | 0;
       break label$4;
      }
      if (!$4) {
       break label$1
      }
      HEAP8[($0 + 3 | 0) >> 0] = HEAPU8[($1 + 3 | 0) >> 0] | 0;
      $3 = $0 + 4 | 0;
      $1 = $1 + 4 | 0;
      $4 = $2 + -4 | 0;
      break label$4;
     }
     label$11 : {
      if ($4) {
       break label$11
      }
      label$12 : {
       if (!($3 & 3 | 0)) {
        break label$12
       }
       if (!$2) {
        break label$1
       }
       $3 = $2 + -1 | 0;
       $4 = $0 + $3 | 0;
       HEAP8[$4 >> 0] = HEAPU8[($1 + $3 | 0) >> 0] | 0;
       label$13 : {
        if ($4 & 3 | 0) {
         break label$13
        }
        $2 = $3;
        break label$12;
       }
       if (!$3) {
        break label$1
       }
       $3 = $2 + -2 | 0;
       $4 = $0 + $3 | 0;
       HEAP8[$4 >> 0] = HEAPU8[($1 + $3 | 0) >> 0] | 0;
       label$14 : {
        if ($4 & 3 | 0) {
         break label$14
        }
        $2 = $3;
        break label$12;
       }
       if (!$3) {
        break label$1
       }
       $3 = $2 + -3 | 0;
       $4 = $0 + $3 | 0;
       HEAP8[$4 >> 0] = HEAPU8[($1 + $3 | 0) >> 0] | 0;
       label$15 : {
        if ($4 & 3 | 0) {
         break label$15
        }
        $2 = $3;
        break label$12;
       }
       if (!$3) {
        break label$1
       }
       $2 = $2 + -4 | 0;
       HEAP8[($0 + $2 | 0) >> 0] = HEAPU8[($1 + $2 | 0) >> 0] | 0;
      }
      if ($2 >>> 0 < 4 >>> 0) {
       break label$11
      }
      label$16 : {
       $5 = $2 + -4 | 0;
       $3 = (($5 >>> 2 | 0) + 1 | 0) & 3 | 0;
       if (!$3) {
        break label$16
       }
       $4 = $1 + -4 | 0;
       $6 = $0 + -4 | 0;
       label$17 : while (1) {
        HEAP32[($6 + $2 | 0) >> 2] = HEAP32[($4 + $2 | 0) >> 2] | 0;
        $2 = $2 + -4 | 0;
        $3 = $3 + -1 | 0;
        if ($3) {
         continue label$17
        }
        break label$17;
       };
      }
      if ($5 >>> 0 < 12 >>> 0) {
       break label$11
      }
      $6 = $1 + -16 | 0;
      $5 = $0 + -16 | 0;
      label$18 : while (1) {
       $3 = $5 + $2 | 0;
       $4 = $6 + $2 | 0;
       HEAP32[($3 + 12 | 0) >> 2] = HEAP32[($4 + 12 | 0) >> 2] | 0;
       HEAP32[($3 + 8 | 0) >> 2] = HEAP32[($4 + 8 | 0) >> 2] | 0;
       HEAP32[($3 + 4 | 0) >> 2] = HEAP32[($4 + 4 | 0) >> 2] | 0;
       HEAP32[$3 >> 2] = HEAP32[$4 >> 2] | 0;
       $2 = $2 + -16 | 0;
       if ($2 >>> 0 > 3 >>> 0) {
        continue label$18
       }
       break label$18;
      };
     }
     if (!$2) {
      break label$1
     }
     $5 = $2 + -1 | 0;
     label$19 : {
      $3 = $2 & 3 | 0;
      if (!$3) {
       break label$19
      }
      $4 = $1 + -1 | 0;
      $6 = $0 + -1 | 0;
      label$20 : while (1) {
       HEAP8[($6 + $2 | 0) >> 0] = HEAPU8[($4 + $2 | 0) >> 0] | 0;
       $2 = $2 + -1 | 0;
       $3 = $3 + -1 | 0;
       if ($3) {
        continue label$20
       }
       break label$20;
      };
     }
     if ($5 >>> 0 < 3 >>> 0) {
      break label$1
     }
     $4 = $1 + -4 | 0;
     $6 = $0 + -4 | 0;
     label$21 : while (1) {
      $1 = $6 + $2 | 0;
      $3 = $4 + $2 | 0;
      HEAP8[($1 + 3 | 0) >> 0] = HEAPU8[($3 + 3 | 0) >> 0] | 0;
      HEAP8[($1 + 2 | 0) >> 0] = HEAPU8[($3 + 2 | 0) >> 0] | 0;
      HEAP8[($1 + 1 | 0) >> 0] = HEAPU8[($3 + 1 | 0) >> 0] | 0;
      HEAP8[$1 >> 0] = HEAPU8[$3 >> 0] | 0;
      $2 = $2 + -4 | 0;
      if ($2) {
       continue label$21
      }
      break label$1;
     };
    }
    if ($4 >>> 0 < 4 >>> 0) {
     break label$3
    }
    label$22 : {
     $6 = $4 + -4 | 0;
     $2 = (($6 >>> 2 | 0) + 1 | 0) & 7 | 0;
     if (!$2) {
      break label$22
     }
     label$23 : while (1) {
      HEAP32[$3 >> 2] = HEAP32[$1 >> 2] | 0;
      $1 = $1 + 4 | 0;
      $3 = $3 + 4 | 0;
      $4 = $4 + -4 | 0;
      $2 = $2 + -1 | 0;
      if ($2) {
       continue label$23
      }
      break label$23;
     };
    }
    if ($6 >>> 0 < 28 >>> 0) {
     break label$3
    }
    label$24 : while (1) {
     HEAP32[$3 >> 2] = HEAP32[$1 >> 2] | 0;
     HEAP32[($3 + 4 | 0) >> 2] = HEAP32[($1 + 4 | 0) >> 2] | 0;
     HEAP32[($3 + 8 | 0) >> 2] = HEAP32[($1 + 8 | 0) >> 2] | 0;
     HEAP32[($3 + 12 | 0) >> 2] = HEAP32[($1 + 12 | 0) >> 2] | 0;
     HEAP32[($3 + 16 | 0) >> 2] = HEAP32[($1 + 16 | 0) >> 2] | 0;
     HEAP32[($3 + 20 | 0) >> 2] = HEAP32[($1 + 20 | 0) >> 2] | 0;
     HEAP32[($3 + 24 | 0) >> 2] = HEAP32[($1 + 24 | 0) >> 2] | 0;
     HEAP32[($3 + 28 | 0) >> 2] = HEAP32[($1 + 28 | 0) >> 2] | 0;
     $3 = $3 + 32 | 0;
     $1 = $1 + 32 | 0;
     $4 = $4 + -32 | 0;
     if ($4 >>> 0 > 3 >>> 0) {
      continue label$24
     }
     break label$24;
    };
   }
   if (!$4) {
    break label$1
   }
   $6 = $4 + -1 | 0;
   label$25 : {
    $2 = $4 & 7 | 0;
    if (!$2) {
     break label$25
    }
    label$26 : while (1) {
     HEAP8[$3 >> 0] = HEAPU8[$1 >> 0] | 0;
     $4 = $4 + -1 | 0;
     $3 = $3 + 1 | 0;
     $1 = $1 + 1 | 0;
     $2 = $2 + -1 | 0;
     if ($2) {
      continue label$26
     }
     break label$26;
    };
   }
   if ($6 >>> 0 < 7 >>> 0) {
    break label$1
   }
   label$27 : while (1) {
    HEAP8[$3 >> 0] = HEAPU8[$1 >> 0] | 0;
    HEAP8[($3 + 1 | 0) >> 0] = HEAPU8[($1 + 1 | 0) >> 0] | 0;
    HEAP8[($3 + 2 | 0) >> 0] = HEAPU8[($1 + 2 | 0) >> 0] | 0;
    HEAP8[($3 + 3 | 0) >> 0] = HEAPU8[($1 + 3 | 0) >> 0] | 0;
    HEAP8[($3 + 4 | 0) >> 0] = HEAPU8[($1 + 4 | 0) >> 0] | 0;
    HEAP8[($3 + 5 | 0) >> 0] = HEAPU8[($1 + 5 | 0) >> 0] | 0;
    HEAP8[($3 + 6 | 0) >> 0] = HEAPU8[($1 + 6 | 0) >> 0] | 0;
    HEAP8[($3 + 7 | 0) >> 0] = HEAPU8[($1 + 7 | 0) >> 0] | 0;
    $3 = $3 + 8 | 0;
    $1 = $1 + 8 | 0;
    $4 = $4 + -8 | 0;
    if ($4) {
     continue label$27
    }
    break label$27;
   };
  }
  return $0 | 0;
 }
 
 function strlen($0) {
  $0 = $0 | 0;
  var $1 = 0, $2 = 0;
  $1 = $0;
  label$1 : {
   label$2 : {
    if (!($1 & 3 | 0)) {
     break label$2
    }
    $1 = $0;
    if (!(HEAPU8[$1 >> 0] | 0)) {
     break label$1
    }
    $1 = $0 + 1 | 0;
    if (!($1 & 3 | 0)) {
     break label$2
    }
    if (!(HEAPU8[$1 >> 0] | 0)) {
     break label$1
    }
    $1 = $0 + 2 | 0;
    if (!($1 & 3 | 0)) {
     break label$2
    }
    if (!(HEAPU8[$1 >> 0] | 0)) {
     break label$1
    }
    $1 = $0 + 3 | 0;
    if (!($1 & 3 | 0)) {
     break label$2
    }
    if (!(HEAPU8[$1 >> 0] | 0)) {
     break label$1
    }
    $1 = $0 + 4 | 0;
   }
   $1 = $1 + -4 | 0;
   label$3 : while (1) {
    $1 = $1 + 4 | 0;
    $2 = HEAP32[$1 >> 2] | 0;
    if (!((($2 ^ -1 | 0) & ($2 + -16843009 | 0) | 0) & -2139062144 | 0)) {
     continue label$3
    }
    break label$3;
   };
   if (!($2 & 255 | 0)) {
    break label$1
   }
   label$4 : while (1) {
    $1 = $1 + 1 | 0;
    if (HEAPU8[$1 >> 0] | 0) {
     continue label$4
    }
    break label$4;
   };
  }
  return $1 - $0 | 0 | 0;
 }
 
 function strerror($0) {
  $0 = $0 | 0;
  var $1 = 0;
  label$1 : {
   $1 = HEAP32[(0 + 1059632 | 0) >> 2] | 0;
   if ($1) {
    break label$1
   }
   $1 = 1059608;
   HEAP32[(0 + 1059632 | 0) >> 2] = 1059608;
  }
  return __lctrans((HEAPU16[((($0 >>> 0 > 76 >>> 0 ? 0 : $0) << 1 | 0) + 1054736 | 0) >> 1] | 0) + 1053178 | 0 | 0, HEAP32[($1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0;
 }
 
 function strerror_r($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  label$1 : {
   label$2 : {
    $0 = strerror($0 | 0) | 0;
    $3 = strlen($0 | 0) | 0;
    if ($3 >>> 0 < $2 >>> 0) {
     break label$2
    }
    $3 = 68;
    if (!$2) {
     break label$1
    }
    $2 = $2 + -1 | 0;
    (wasm2js_i32$0 = (memcpy($1 | 0, $0 | 0, $2 | 0) | 0) + $2 | 0, wasm2js_i32$1 = 0), HEAP8[wasm2js_i32$0 >> 0] = wasm2js_i32$1;
    return 68 | 0;
   }
   memcpy($1 | 0, $0 | 0, $3 + 1 | 0 | 0) | 0;
   $3 = 0;
  }
  return $3 | 0;
 }
 
 function __strchrnul($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $3 = 0, $4 = 0, $2 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      $2 = $1 & 255 | 0;
      if (!$2) {
       break label$4
      }
      if (!($0 & 3 | 0)) {
       break label$2
      }
      label$5 : {
       $3 = HEAPU8[$0 >> 0] | 0;
       if ($3) {
        break label$5
       }
       return $0 | 0;
      }
      if (($3 | 0) != ($1 & 255 | 0 | 0)) {
       break label$3
      }
      return $0 | 0;
     }
     return $0 + (strlen($0 | 0) | 0) | 0 | 0;
    }
    label$6 : {
     $3 = $0 + 1 | 0;
     if ($3 & 3 | 0) {
      break label$6
     }
     $0 = $3;
     break label$2;
    }
    $4 = HEAPU8[$3 >> 0] | 0;
    if (!$4) {
     break label$1
    }
    if (($4 | 0) == ($1 & 255 | 0 | 0)) {
     break label$1
    }
    label$7 : {
     $3 = $0 + 2 | 0;
     if ($3 & 3 | 0) {
      break label$7
     }
     $0 = $3;
     break label$2;
    }
    $4 = HEAPU8[$3 >> 0] | 0;
    if (!$4) {
     break label$1
    }
    if (($4 | 0) == ($1 & 255 | 0 | 0)) {
     break label$1
    }
    label$8 : {
     $3 = $0 + 3 | 0;
     if ($3 & 3 | 0) {
      break label$8
     }
     $0 = $3;
     break label$2;
    }
    $4 = HEAPU8[$3 >> 0] | 0;
    if (!$4) {
     break label$1
    }
    if (($4 | 0) == ($1 & 255 | 0 | 0)) {
     break label$1
    }
    $0 = $0 + 4 | 0;
   }
   label$9 : {
    $3 = HEAP32[$0 >> 2] | 0;
    if ((($3 ^ -1 | 0) & ($3 + -16843009 | 0) | 0) & -2139062144 | 0) {
     break label$9
    }
    $2 = Math_imul($2, 16843009);
    label$10 : while (1) {
     $3 = $3 ^ $2 | 0;
     if ((($3 ^ -1 | 0) & ($3 + -16843009 | 0) | 0) & -2139062144 | 0) {
      break label$9
     }
     $0 = $0 + 4 | 0;
     $3 = HEAP32[$0 >> 2] | 0;
     if (!((($3 ^ -1 | 0) & ($3 + -16843009 | 0) | 0) & -2139062144 | 0)) {
      continue label$10
     }
     break label$10;
    };
   }
   $3 = $0 + -1 | 0;
   label$11 : while (1) {
    $3 = $3 + 1 | 0;
    $0 = HEAPU8[$3 >> 0] | 0;
    if (!$0) {
     break label$1
    }
    if (($0 | 0) != ($1 & 255 | 0 | 0)) {
     continue label$11
    }
    break label$11;
   };
  }
  return $3 | 0;
 }
 
 function memcpy($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $4 = 0, $5 = 0, $3 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $6 = 0, $8 = 0, i64toi32_i32$2 = 0, $7 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $79 = 0, $82 = 0, $92 = 0, $97 = 0, $102 = 0, $107 = 0, $122 = 0, $368 = 0, $384 = 0;
  label$1 : {
   label$2 : {
    if (!($1 & 3 | 0)) {
     break label$2
    }
    if (!$2) {
     break label$2
    }
    HEAP8[$0 >> 0] = HEAPU8[$1 >> 0] | 0;
    $3 = $2 + -1 | 0;
    $4 = $0 + 1 | 0;
    $5 = $1 + 1 | 0;
    if (!($5 & 3 | 0)) {
     break label$1
    }
    if (!$3) {
     break label$1
    }
    HEAP8[($0 + 1 | 0) >> 0] = HEAPU8[($1 + 1 | 0) >> 0] | 0;
    $3 = $2 + -2 | 0;
    $4 = $0 + 2 | 0;
    $5 = $1 + 2 | 0;
    if (!($5 & 3 | 0)) {
     break label$1
    }
    if (!$3) {
     break label$1
    }
    HEAP8[($0 + 2 | 0) >> 0] = HEAPU8[($1 + 2 | 0) >> 0] | 0;
    $3 = $2 + -3 | 0;
    $4 = $0 + 3 | 0;
    $5 = $1 + 3 | 0;
    if (!($5 & 3 | 0)) {
     break label$1
    }
    if (!$3) {
     break label$1
    }
    HEAP8[($0 + 3 | 0) >> 0] = HEAPU8[($1 + 3 | 0) >> 0] | 0;
    $3 = $2 + -4 | 0;
    $4 = $0 + 4 | 0;
    $5 = $1 + 4 | 0;
    break label$1;
   }
   $3 = $2;
   $4 = $0;
   $5 = $1;
  }
  label$3 : {
   label$4 : {
    label$5 : {
     $1 = $4 & 3 | 0;
     if ($1) {
      break label$5
     }
     label$6 : {
      label$7 : {
       if ($3 >>> 0 < 16 >>> 0) {
        break label$7
       }
       label$8 : {
        $1 = $3 + -16 | 0;
        if ($1 & 16 | 0) {
         break label$8
        }
        i64toi32_i32$2 = $5;
        i64toi32_i32$0 = HEAP32[$5 >> 2] | 0;
        i64toi32_i32$1 = HEAP32[($5 + 4 | 0) >> 2] | 0;
        $79 = i64toi32_i32$0;
        i64toi32_i32$0 = $4;
        HEAP32[$4 >> 2] = $79;
        HEAP32[($4 + 4 | 0) >> 2] = i64toi32_i32$1;
        i64toi32_i32$2 = $5;
        i64toi32_i32$1 = HEAP32[($5 + 8 | 0) >> 2] | 0;
        i64toi32_i32$0 = HEAP32[($5 + 12 | 0) >> 2] | 0;
        $82 = i64toi32_i32$1;
        i64toi32_i32$1 = $4;
        HEAP32[($4 + 8 | 0) >> 2] = $82;
        HEAP32[($4 + 12 | 0) >> 2] = i64toi32_i32$0;
        $4 = $4 + 16 | 0;
        $5 = $5 + 16 | 0;
        $3 = $1;
       }
       if ($1 >>> 0 < 16 >>> 0) {
        break label$6
       }
       label$9 : while (1) {
        i64toi32_i32$2 = $5;
        i64toi32_i32$0 = HEAP32[$5 >> 2] | 0;
        i64toi32_i32$1 = HEAP32[($5 + 4 | 0) >> 2] | 0;
        $92 = i64toi32_i32$0;
        i64toi32_i32$0 = $4;
        HEAP32[$4 >> 2] = $92;
        HEAP32[($4 + 4 | 0) >> 2] = i64toi32_i32$1;
        i64toi32_i32$2 = $5 + 8 | 0;
        i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
        i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
        $97 = i64toi32_i32$1;
        i64toi32_i32$1 = $4 + 8 | 0;
        HEAP32[i64toi32_i32$1 >> 2] = $97;
        HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
        i64toi32_i32$2 = $5 + 16 | 0;
        i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
        i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
        $102 = i64toi32_i32$0;
        i64toi32_i32$0 = $4 + 16 | 0;
        HEAP32[i64toi32_i32$0 >> 2] = $102;
        HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
        i64toi32_i32$2 = $5 + 24 | 0;
        i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
        i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
        $107 = i64toi32_i32$1;
        i64toi32_i32$1 = $4 + 24 | 0;
        HEAP32[i64toi32_i32$1 >> 2] = $107;
        HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
        $4 = $4 + 32 | 0;
        $5 = $5 + 32 | 0;
        $3 = $3 + -32 | 0;
        if ($3 >>> 0 > 15 >>> 0) {
         continue label$9
        }
        break label$9;
       };
      }
      $1 = $3;
     }
     label$10 : {
      if (!($1 & 8 | 0)) {
       break label$10
      }
      i64toi32_i32$2 = $5;
      i64toi32_i32$0 = HEAP32[$5 >> 2] | 0;
      i64toi32_i32$1 = HEAP32[($5 + 4 | 0) >> 2] | 0;
      $122 = i64toi32_i32$0;
      i64toi32_i32$0 = $4;
      HEAP32[$4 >> 2] = $122;
      HEAP32[($4 + 4 | 0) >> 2] = i64toi32_i32$1;
      $5 = $5 + 8 | 0;
      $4 = $4 + 8 | 0;
     }
     label$11 : {
      if (!($1 & 4 | 0)) {
       break label$11
      }
      HEAP32[$4 >> 2] = HEAP32[$5 >> 2] | 0;
      $5 = $5 + 4 | 0;
      $4 = $4 + 4 | 0;
     }
     label$12 : {
      if (!($1 & 2 | 0)) {
       break label$12
      }
      $25 = HEAPU8[$5 >> 0] | 0 | ((HEAPU8[($5 + 1 | 0) >> 0] | 0) << 8 | 0) | 0;
      HEAP8[$4 >> 0] = $25;
      HEAP8[($4 + 1 | 0) >> 0] = $25 >>> 8 | 0;
      $4 = $4 + 2 | 0;
      $5 = $5 + 2 | 0;
     }
     if ($1 & 1 | 0) {
      break label$4
     }
     break label$3;
    }
    label$13 : {
     if ($3 >>> 0 < 32 >>> 0) {
      break label$13
     }
     label$14 : {
      switch ($1 + -1 | 0 | 0) {
      case 0:
       $6 = HEAP32[$5 >> 2] | 0;
       HEAP8[$4 >> 0] = $6;
       HEAP8[($4 + 2 | 0) >> 0] = $6 >>> 16 | 0;
       HEAP8[($4 + 1 | 0) >> 0] = $6 >>> 8 | 0;
       $3 = $3 + -3 | 0;
       $7 = $4 + 3 | 0;
       $1 = 0;
       label$17 : while (1) {
        $4 = $7 + $1 | 0;
        $2 = $5 + $1 | 0;
        $8 = HEAP32[($2 + 4 | 0) >> 2] | 0;
        HEAP32[$4 >> 2] = $8 << 8 | 0 | ($6 >>> 24 | 0) | 0;
        $6 = HEAP32[($2 + 8 | 0) >> 2] | 0;
        HEAP32[($4 + 4 | 0) >> 2] = $6 << 8 | 0 | ($8 >>> 24 | 0) | 0;
        $8 = HEAP32[($2 + 12 | 0) >> 2] | 0;
        HEAP32[($4 + 8 | 0) >> 2] = $8 << 8 | 0 | ($6 >>> 24 | 0) | 0;
        $6 = HEAP32[($2 + 16 | 0) >> 2] | 0;
        HEAP32[($4 + 12 | 0) >> 2] = $6 << 8 | 0 | ($8 >>> 24 | 0) | 0;
        $1 = $1 + 16 | 0;
        $3 = $3 + -16 | 0;
        if ($3 >>> 0 > 16 >>> 0) {
         continue label$17
        }
        break label$17;
       };
       $4 = $7 + $1 | 0;
       $5 = ($5 + $1 | 0) + 3 | 0;
       break label$13;
      case 1:
       $6 = HEAP32[$5 >> 2] | 0;
       HEAP8[$4 >> 0] = $6;
       HEAP8[($4 + 1 | 0) >> 0] = $6 >>> 8 | 0;
       $3 = $3 + -2 | 0;
       $7 = $4 + 2 | 0;
       $1 = 0;
       label$18 : while (1) {
        $4 = $7 + $1 | 0;
        $2 = $5 + $1 | 0;
        $8 = HEAP32[($2 + 4 | 0) >> 2] | 0;
        HEAP32[$4 >> 2] = $8 << 16 | 0 | ($6 >>> 16 | 0) | 0;
        $6 = HEAP32[($2 + 8 | 0) >> 2] | 0;
        HEAP32[($4 + 4 | 0) >> 2] = $6 << 16 | 0 | ($8 >>> 16 | 0) | 0;
        $8 = HEAP32[($2 + 12 | 0) >> 2] | 0;
        HEAP32[($4 + 8 | 0) >> 2] = $8 << 16 | 0 | ($6 >>> 16 | 0) | 0;
        $6 = HEAP32[($2 + 16 | 0) >> 2] | 0;
        HEAP32[($4 + 12 | 0) >> 2] = $6 << 16 | 0 | ($8 >>> 16 | 0) | 0;
        $1 = $1 + 16 | 0;
        $3 = $3 + -16 | 0;
        if ($3 >>> 0 > 17 >>> 0) {
         continue label$18
        }
        break label$18;
       };
       $4 = $7 + $1 | 0;
       $5 = ($5 + $1 | 0) + 2 | 0;
       break label$13;
      case 2:
       break label$14;
      default:
       break label$13;
      };
     }
     $6 = HEAP32[$5 >> 2] | 0;
     HEAP8[$4 >> 0] = $6;
     $3 = $3 + -1 | 0;
     $7 = $4 + 1 | 0;
     $1 = 0;
     label$19 : while (1) {
      $4 = $7 + $1 | 0;
      $2 = $5 + $1 | 0;
      $8 = HEAP32[($2 + 4 | 0) >> 2] | 0;
      HEAP32[$4 >> 2] = $8 << 24 | 0 | ($6 >>> 8 | 0) | 0;
      $6 = HEAP32[($2 + 8 | 0) >> 2] | 0;
      HEAP32[($4 + 4 | 0) >> 2] = $6 << 24 | 0 | ($8 >>> 8 | 0) | 0;
      $8 = HEAP32[($2 + 12 | 0) >> 2] | 0;
      HEAP32[($4 + 8 | 0) >> 2] = $8 << 24 | 0 | ($6 >>> 8 | 0) | 0;
      $6 = HEAP32[($2 + 16 | 0) >> 2] | 0;
      HEAP32[($4 + 12 | 0) >> 2] = $6 << 24 | 0 | ($8 >>> 8 | 0) | 0;
      $1 = $1 + 16 | 0;
      $3 = $3 + -16 | 0;
      if ($3 >>> 0 > 18 >>> 0) {
       continue label$19
      }
      break label$19;
     };
     $4 = $7 + $1 | 0;
     $5 = ($5 + $1 | 0) + 1 | 0;
    }
    label$20 : {
     if (!($3 & 16 | 0)) {
      break label$20
     }
     HEAP8[$4 >> 0] = HEAPU8[$5 >> 0] | 0;
     $21 = HEAPU8[($5 + 1 | 0) >> 0] | 0 | ((HEAPU8[($5 + 2 | 0) >> 0] | 0) << 8 | 0) | 0 | ((HEAPU8[($5 + 3 | 0) >> 0] | 0) << 16 | 0 | ((HEAPU8[($5 + 4 | 0) >> 0] | 0) << 24 | 0) | 0) | 0;
     HEAP8[($4 + 1 | 0) >> 0] = $21;
     HEAP8[($4 + 2 | 0) >> 0] = $21 >>> 8 | 0;
     HEAP8[($4 + 3 | 0) >> 0] = $21 >>> 16 | 0;
     HEAP8[($4 + 4 | 0) >> 0] = $21 >>> 24 | 0;
     i64toi32_i32$2 = $5;
     i64toi32_i32$1 = HEAPU8[($5 + 5 | 0) >> 0] | 0 | ((HEAPU8[($5 + 6 | 0) >> 0] | 0) << 8 | 0) | 0 | ((HEAPU8[($5 + 7 | 0) >> 0] | 0) << 16 | 0 | ((HEAPU8[($5 + 8 | 0) >> 0] | 0) << 24 | 0) | 0) | 0;
     i64toi32_i32$0 = HEAPU8[($5 + 9 | 0) >> 0] | 0 | ((HEAPU8[($5 + 10 | 0) >> 0] | 0) << 8 | 0) | 0 | ((HEAPU8[($5 + 11 | 0) >> 0] | 0) << 16 | 0 | ((HEAPU8[($5 + 12 | 0) >> 0] | 0) << 24 | 0) | 0) | 0;
     $368 = i64toi32_i32$1;
     i64toi32_i32$1 = $4;
     $22 = $368;
     HEAP8[($4 + 5 | 0) >> 0] = $22;
     HEAP8[($4 + 6 | 0) >> 0] = $22 >>> 8 | 0;
     HEAP8[($4 + 7 | 0) >> 0] = $22 >>> 16 | 0;
     HEAP8[($4 + 8 | 0) >> 0] = $22 >>> 24 | 0;
     HEAP8[($4 + 9 | 0) >> 0] = i64toi32_i32$0;
     HEAP8[($4 + 10 | 0) >> 0] = i64toi32_i32$0 >>> 8 | 0;
     HEAP8[($4 + 11 | 0) >> 0] = i64toi32_i32$0 >>> 16 | 0;
     HEAP8[($4 + 12 | 0) >> 0] = i64toi32_i32$0 >>> 24 | 0;
     $26 = HEAPU8[($5 + 13 | 0) >> 0] | 0 | ((HEAPU8[($5 + 14 | 0) >> 0] | 0) << 8 | 0) | 0;
     HEAP8[($4 + 13 | 0) >> 0] = $26;
     HEAP8[($4 + 14 | 0) >> 0] = $26 >>> 8 | 0;
     HEAP8[($4 + 15 | 0) >> 0] = HEAPU8[($5 + 15 | 0) >> 0] | 0;
     $4 = $4 + 16 | 0;
     $5 = $5 + 16 | 0;
    }
    label$21 : {
     if (!($3 & 8 | 0)) {
      break label$21
     }
     i64toi32_i32$2 = $5;
     i64toi32_i32$0 = HEAPU8[$5 >> 0] | 0 | ((HEAPU8[($5 + 1 | 0) >> 0] | 0) << 8 | 0) | 0 | ((HEAPU8[($5 + 2 | 0) >> 0] | 0) << 16 | 0 | ((HEAPU8[($5 + 3 | 0) >> 0] | 0) << 24 | 0) | 0) | 0;
     i64toi32_i32$1 = HEAPU8[($5 + 4 | 0) >> 0] | 0 | ((HEAPU8[($5 + 5 | 0) >> 0] | 0) << 8 | 0) | 0 | ((HEAPU8[($5 + 6 | 0) >> 0] | 0) << 16 | 0 | ((HEAPU8[($5 + 7 | 0) >> 0] | 0) << 24 | 0) | 0) | 0;
     $384 = i64toi32_i32$0;
     i64toi32_i32$0 = $4;
     $23 = $384;
     HEAP8[$4 >> 0] = $23;
     HEAP8[($4 + 1 | 0) >> 0] = $23 >>> 8 | 0;
     HEAP8[($4 + 2 | 0) >> 0] = $23 >>> 16 | 0;
     HEAP8[($4 + 3 | 0) >> 0] = $23 >>> 24 | 0;
     HEAP8[($4 + 4 | 0) >> 0] = i64toi32_i32$1;
     HEAP8[($4 + 5 | 0) >> 0] = i64toi32_i32$1 >>> 8 | 0;
     HEAP8[($4 + 6 | 0) >> 0] = i64toi32_i32$1 >>> 16 | 0;
     HEAP8[($4 + 7 | 0) >> 0] = i64toi32_i32$1 >>> 24 | 0;
     $4 = $4 + 8 | 0;
     $5 = $5 + 8 | 0;
    }
    label$22 : {
     if (!($3 & 4 | 0)) {
      break label$22
     }
     $24 = HEAPU8[$5 >> 0] | 0 | ((HEAPU8[($5 + 1 | 0) >> 0] | 0) << 8 | 0) | 0 | ((HEAPU8[($5 + 2 | 0) >> 0] | 0) << 16 | 0 | ((HEAPU8[($5 + 3 | 0) >> 0] | 0) << 24 | 0) | 0) | 0;
     HEAP8[$4 >> 0] = $24;
     HEAP8[($4 + 1 | 0) >> 0] = $24 >>> 8 | 0;
     HEAP8[($4 + 2 | 0) >> 0] = $24 >>> 16 | 0;
     HEAP8[($4 + 3 | 0) >> 0] = $24 >>> 24 | 0;
     $4 = $4 + 4 | 0;
     $5 = $5 + 4 | 0;
    }
    label$23 : {
     if (!($3 & 2 | 0)) {
      break label$23
     }
     $27 = HEAPU8[$5 >> 0] | 0 | ((HEAPU8[($5 + 1 | 0) >> 0] | 0) << 8 | 0) | 0;
     HEAP8[$4 >> 0] = $27;
     HEAP8[($4 + 1 | 0) >> 0] = $27 >>> 8 | 0;
     $4 = $4 + 2 | 0;
     $5 = $5 + 2 | 0;
    }
    if (!($3 & 1 | 0)) {
     break label$3
    }
   }
   HEAP8[$4 >> 0] = HEAPU8[$5 >> 0] | 0;
  }
  return $0 | 0;
 }
 
 function strncmp($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $4 = 0, $3 = 0, $5 = 0;
  label$1 : {
   if ($2) {
    break label$1
   }
   return 0 | 0;
  }
  $3 = 0;
  label$2 : {
   $4 = HEAPU8[$0 >> 0] | 0;
   if (!$4) {
    break label$2
   }
   $0 = $0 + 1 | 0;
   $2 = $2 + -1 | 0;
   label$3 : while (1) {
    label$4 : {
     $5 = HEAPU8[$1 >> 0] | 0;
     if ($5) {
      break label$4
     }
     $3 = $4;
     break label$2;
    }
    label$5 : {
     if ($2) {
      break label$5
     }
     $3 = $4;
     break label$2;
    }
    label$6 : {
     if (($4 & 255 | 0 | 0) == ($5 | 0)) {
      break label$6
     }
     $3 = $4;
     break label$2;
    }
    $2 = $2 + -1 | 0;
    $1 = $1 + 1 | 0;
    $4 = HEAPU8[$0 >> 0] | 0;
    $0 = $0 + 1 | 0;
    if ($4) {
     continue label$3
    }
    break label$3;
   };
  }
  return ($3 & 255 | 0) - (HEAPU8[$1 >> 0] | 0) | 0 | 0;
 }
 
 function __stpcpy($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $3 = 0, $2 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     if (!(($1 ^ $0 | 0) & 3 | 0)) {
      break label$3
     }
     $2 = $0;
     break label$2;
    }
    label$4 : {
     label$5 : {
      if ($1 & 3 | 0) {
       break label$5
      }
      $2 = $0;
      break label$4;
     }
     $2 = HEAPU8[$1 >> 0] | 0;
     HEAP8[$0 >> 0] = $2;
     label$6 : {
      if ($2) {
       break label$6
      }
      return $0 | 0;
     }
     $2 = $0 + 1 | 0;
     label$7 : {
      $3 = $1 + 1 | 0;
      if ($3 & 3 | 0) {
       break label$7
      }
      $1 = $3;
      break label$4;
     }
     $3 = HEAPU8[$3 >> 0] | 0;
     HEAP8[$2 >> 0] = $3;
     if (!$3) {
      break label$1
     }
     $2 = $0 + 2 | 0;
     label$8 : {
      $3 = $1 + 2 | 0;
      if ($3 & 3 | 0) {
       break label$8
      }
      $1 = $3;
      break label$4;
     }
     $3 = HEAPU8[$3 >> 0] | 0;
     HEAP8[$2 >> 0] = $3;
     if (!$3) {
      break label$1
     }
     $2 = $0 + 3 | 0;
     label$9 : {
      $3 = $1 + 3 | 0;
      if ($3 & 3 | 0) {
       break label$9
      }
      $1 = $3;
      break label$4;
     }
     $3 = HEAPU8[$3 >> 0] | 0;
     HEAP8[$2 >> 0] = $3;
     if (!$3) {
      break label$1
     }
     $2 = $0 + 4 | 0;
     $1 = $1 + 4 | 0;
    }
    $0 = HEAP32[$1 >> 2] | 0;
    if ((($0 ^ -1 | 0) & ($0 + -16843009 | 0) | 0) & -2139062144 | 0) {
     break label$2
    }
    label$10 : while (1) {
     HEAP32[$2 >> 2] = $0;
     $2 = $2 + 4 | 0;
     $1 = $1 + 4 | 0;
     $0 = HEAP32[$1 >> 2] | 0;
     if (!((($0 ^ -1 | 0) & ($0 + -16843009 | 0) | 0) & -2139062144 | 0)) {
      continue label$10
     }
     break label$10;
    };
   }
   $0 = HEAPU8[$1 >> 0] | 0;
   HEAP8[$2 >> 0] = $0;
   if (!$0) {
    break label$1
   }
   $1 = $1 + 1 | 0;
   label$11 : while (1) {
    $2 = $2 + 1 | 0;
    $0 = HEAPU8[$1 >> 0] | 0;
    HEAP8[$2 >> 0] = $0;
    $1 = $1 + 1 | 0;
    if ($0) {
     continue label$11
    }
    break label$11;
   };
  }
  return $2 | 0;
 }
 
 function strcpy($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  __stpcpy($0 | 0, $1 | 0) | 0;
  return $0 | 0;
 }
 
 function memset($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $4 = 0, $6 = 0, $5 = 0, $6$hi = 0;
  label$1 : {
   if (!$2) {
    break label$1
   }
   HEAP8[$0 >> 0] = $1;
   $3 = $2 + $0 | 0;
   HEAP8[($3 + -1 | 0) >> 0] = $1;
   if ($2 >>> 0 < 3 >>> 0) {
    break label$1
   }
   HEAP8[($0 + 2 | 0) >> 0] = $1;
   HEAP8[($0 + 1 | 0) >> 0] = $1;
   HEAP8[($3 + -3 | 0) >> 0] = $1;
   HEAP8[($3 + -2 | 0) >> 0] = $1;
   if ($2 >>> 0 < 7 >>> 0) {
    break label$1
   }
   HEAP8[($0 + 3 | 0) >> 0] = $1;
   HEAP8[($3 + -4 | 0) >> 0] = $1;
   if ($2 >>> 0 < 9 >>> 0) {
    break label$1
   }
   $4 = (0 - $0 | 0) & 3 | 0;
   $3 = $0 + $4 | 0;
   $1 = Math_imul($1 & 255 | 0, 16843009);
   HEAP32[$3 >> 2] = $1;
   $4 = ($2 - $4 | 0) & -4 | 0;
   $2 = $3 + $4 | 0;
   HEAP32[($2 + -4 | 0) >> 2] = $1;
   if ($4 >>> 0 < 9 >>> 0) {
    break label$1
   }
   HEAP32[($3 + 8 | 0) >> 2] = $1;
   HEAP32[($3 + 4 | 0) >> 2] = $1;
   HEAP32[($2 + -8 | 0) >> 2] = $1;
   HEAP32[($2 + -12 | 0) >> 2] = $1;
   if ($4 >>> 0 < 25 >>> 0) {
    break label$1
   }
   HEAP32[($3 + 24 | 0) >> 2] = $1;
   HEAP32[($3 + 20 | 0) >> 2] = $1;
   HEAP32[($3 + 16 | 0) >> 2] = $1;
   HEAP32[($3 + 12 | 0) >> 2] = $1;
   HEAP32[($2 + -16 | 0) >> 2] = $1;
   HEAP32[($2 + -20 | 0) >> 2] = $1;
   HEAP32[($2 + -24 | 0) >> 2] = $1;
   HEAP32[($2 + -28 | 0) >> 2] = $1;
   $5 = $3 & 4 | 0 | 24 | 0;
   $2 = $4 - $5 | 0;
   if ($2 >>> 0 < 32 >>> 0) {
    break label$1
   }
   i64toi32_i32$0 = 0;
   i64toi32_i32$1 = 1;
   i64toi32_i32$1 = __wasm_i64_mul($1 | 0, i64toi32_i32$0 | 0, 1 | 0, i64toi32_i32$1 | 0) | 0;
   i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
   $6 = i64toi32_i32$1;
   $6$hi = i64toi32_i32$0;
   $1 = $3 + $5 | 0;
   label$2 : while (1) {
    i64toi32_i32$0 = $6$hi;
    i64toi32_i32$1 = $1;
    HEAP32[$1 >> 2] = $6;
    HEAP32[($1 + 4 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $1 + 24 | 0;
    HEAP32[i64toi32_i32$1 >> 2] = $6;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $1 + 16 | 0;
    HEAP32[i64toi32_i32$1 >> 2] = $6;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $1 + 8 | 0;
    HEAP32[i64toi32_i32$1 >> 2] = $6;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    $1 = $1 + 32 | 0;
    $2 = $2 + -32 | 0;
    if ($2 >>> 0 > 31 >>> 0) {
     continue label$2
    }
    break label$2;
   };
  }
  return $0 | 0;
 }
 
 function dummy_1($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return $0 | 0;
 }
 
 function __lctrans($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return dummy_1($0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN4core10intrinsics17const_eval_select17h8a6a832f7056c43aE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN4core3ops8function6FnOnce9call_once17h4d6acaa7ab1df652E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core3ops8function6FnOnce9call_once17h4d6acaa7ab1df652E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN5alloc5alloc18handle_alloc_error8rt_error17he27203bd7d9482b1E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN5alloc5alloc18handle_alloc_error8rt_error17he27203bd7d9482b1E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  __rust_alloc_error_handler($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN5alloc7raw_vec11finish_grow17hb690026d1ce856c3E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, $5 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         if (!$2) {
          break label$7
         }
         $4 = 1;
         if (($1 | 0) < (0 | 0)) {
          break label$6
         }
         if (!(HEAP32[($3 + 8 | 0) >> 2] | 0)) {
          break label$4
         }
         $5 = HEAP32[($3 + 4 | 0) >> 2] | 0;
         if ($5) {
          break label$5
         }
         if ($1) {
          break label$3
         }
         $3 = $2;
         break label$2;
        }
        HEAP32[($0 + 4 | 0) >> 2] = $1;
        $4 = 1;
       }
       $1 = 0;
       break label$1;
      }
      $3 = __rust_realloc(HEAP32[$3 >> 2] | 0 | 0, $5 | 0, $2 | 0, $1 | 0) | 0;
      break label$2;
     }
     if ($1) {
      break label$3
     }
     $3 = $2;
     break label$2;
    }
    $3 = __rust_alloc($1 | 0, $2 | 0) | 0;
   }
   label$8 : {
    if (!$3) {
     break label$8
    }
    HEAP32[($0 + 4 | 0) >> 2] = $3;
    $4 = 0;
    break label$1;
   }
   HEAP32[($0 + 4 | 0) >> 2] = $1;
   $1 = $2;
  }
  HEAP32[$0 >> 2] = $4;
  HEAP32[($0 + 8 | 0) >> 2] = $1;
 }
 
 function _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN4core10intrinsics17const_eval_select17h8a6a832f7056c43aE($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN5alloc7raw_vec17capacity_overflow17h1271517144c3fe0fE() {
  var $0 = 0;
  $0 = __stack_pointer - 32 | 0;
  __stack_pointer = $0;
  HEAP32[($0 + 28 | 0) >> 2] = 0;
  HEAP32[($0 + 24 | 0) >> 2] = 1054892;
  HEAP32[($0 + 12 | 0) >> 2] = 1;
  HEAP32[($0 + 16 | 0) >> 2] = 0;
  HEAP32[($0 + 8 | 0) >> 2] = 1054980;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($0 + 8 | 0 | 0, 1054988 | 0);
  abort();
 }
 
 function _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17hc0dcc85cfb69e0ecE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  label$1 : {
   $3 = $1 + 1 | 0;
   if ($3 >>> 0 < $1 >>> 0) {
    break label$1
   }
   $4 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   $1 = $4 << 1 | 0;
   $1 = $1 >>> 0 > $3 >>> 0 ? $1 : $3;
   $1 = $1 >>> 0 > 8 >>> 0 ? $1 : 8;
   label$2 : {
    label$3 : {
     if ($4) {
      break label$3
     }
     $3 = 0;
     break label$2;
    }
    HEAP32[($2 + 20 | 0) >> 2] = $4;
    HEAP32[($2 + 16 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
    $3 = 1;
   }
   HEAP32[($2 + 24 | 0) >> 2] = $3;
   _ZN5alloc7raw_vec11finish_grow17hb690026d1ce856c3E($2 | 0, $1 | 0, 1 | 0, $2 + 16 | 0 | 0);
   label$4 : {
    if (!(HEAP32[$2 >> 2] | 0)) {
     break label$4
    }
    $0 = HEAP32[($2 + 8 | 0) >> 2] | 0;
    if (!$0) {
     break label$1
    }
    _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(HEAP32[($2 + 4 | 0) >> 2] | 0 | 0, $0 | 0);
    abort();
   }
   $3 = HEAP32[($2 + 4 | 0) >> 2] | 0;
   HEAP32[($0 + 4 | 0) >> 2] = $1;
   HEAP32[$0 >> 2] = $3;
   __stack_pointer = $2 + 32 | 0;
   return;
  }
  _ZN5alloc7raw_vec17capacity_overflow17h1271517144c3fe0fE();
  abort();
 }
 
 function __rg_oom($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  rust_oom($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN72_$LT$$RF$str$u20$as$u20$alloc__ffi__c_str__CString__new__SpecNewImpl$GT$13spec_new_impl17hffaa9687d9263c37E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $7 = 0, $5 = 0, $8 = 0, $4 = 0, $6 = 0, i64toi32_i32$1 = 0;
  $3 = __stack_pointer - 32 | 0;
  __stack_pointer = $3;
  label$1 : {
   label$2 : {
    label$3 : {
     $4 = $2 + 1 | 0;
     if ($4 >>> 0 < $2 >>> 0) {
      break label$3
     }
     if (($4 | 0) <= (-1 | 0)) {
      break label$2
     }
     $5 = __rust_alloc($4 | 0, 1 | 0) | 0;
     if (!$5) {
      break label$1
     }
     $6 = memcpy($5 | 0, $1 | 0, $2 | 0) | 0;
     label$4 : {
      label$5 : {
       if ($2 >>> 0 < 8 >>> 0) {
        break label$5
       }
       _ZN4core5slice6memchr19memchr_general_case17he26bb40f07f8be83E($3 + 8 | 0 | 0, 0 | 0, $1 | 0, $2 | 0);
       $7 = HEAP32[($3 + 12 | 0) >> 2] | 0;
       $5 = HEAP32[($3 + 8 | 0) >> 2] | 0;
       break label$4;
      }
      label$6 : {
       if ($2) {
        break label$6
       }
       $7 = 0;
       $5 = 0;
       break label$4;
      }
      label$7 : {
       label$8 : {
        if (HEAPU8[$1 >> 0] | 0) {
         break label$8
        }
        $8 = 0;
        break label$7;
       }
       $8 = 1;
       $5 = 0;
       label$9 : {
        if (($2 | 0) != (1 | 0)) {
         break label$9
        }
        $7 = $2;
        break label$4;
       }
       if (!(HEAPU8[($1 + 1 | 0) >> 0] | 0)) {
        break label$7
       }
       $8 = 2;
       label$10 : {
        if (($2 | 0) != (2 | 0)) {
         break label$10
        }
        $7 = $2;
        break label$4;
       }
       if (!(HEAPU8[($1 + 2 | 0) >> 0] | 0)) {
        break label$7
       }
       $8 = 3;
       label$11 : {
        if (($2 | 0) != (3 | 0)) {
         break label$11
        }
        $7 = $2;
        break label$4;
       }
       if (!(HEAPU8[($1 + 3 | 0) >> 0] | 0)) {
        break label$7
       }
       $8 = 4;
       label$12 : {
        if (($2 | 0) != (4 | 0)) {
         break label$12
        }
        $7 = $2;
        break label$4;
       }
       if (!(HEAPU8[($1 + 4 | 0) >> 0] | 0)) {
        break label$7
       }
       $8 = 5;
       label$13 : {
        if (($2 | 0) != (5 | 0)) {
         break label$13
        }
        $7 = $2;
        break label$4;
       }
       if (!(HEAPU8[($1 + 5 | 0) >> 0] | 0)) {
        break label$7
       }
       $8 = 6;
       label$14 : {
        if (($2 | 0) != (6 | 0)) {
         break label$14
        }
        $7 = $2;
        break label$4;
       }
       $7 = $2;
       if (HEAPU8[($1 + 6 | 0) >> 0] | 0) {
        break label$4
       }
      }
      $5 = 1;
      $7 = $8;
     }
     label$15 : {
      label$16 : {
       if ($5) {
        break label$16
       }
       HEAP32[($3 + 24 | 0) >> 2] = $2;
       HEAP32[($3 + 20 | 0) >> 2] = $4;
       HEAP32[($3 + 16 | 0) >> 2] = $6;
       _ZN5alloc3ffi5c_str7CString19_from_vec_unchecked17h5d2dbfd0b5bc0763E($3 | 0, $3 + 16 | 0 | 0);
       i64toi32_i32$1 = HEAP32[($3 + 4 | 0) >> 2] | 0;
       HEAP32[($0 + 4 | 0) >> 2] = HEAP32[$3 >> 2] | 0;
       HEAP32[($0 + 8 | 0) >> 2] = i64toi32_i32$1;
       $2 = 0;
       break label$15;
      }
      HEAP32[($0 + 16 | 0) >> 2] = $2;
      HEAP32[($0 + 12 | 0) >> 2] = $4;
      HEAP32[($0 + 8 | 0) >> 2] = $6;
      HEAP32[($0 + 4 | 0) >> 2] = $7;
      $2 = 1;
     }
     HEAP32[$0 >> 2] = $2;
     __stack_pointer = $3 + 32 | 0;
     return;
    }
    _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1054892 | 0, 43 | 0, 1055036 | 0);
    abort();
   }
   _ZN5alloc7raw_vec17capacity_overflow17h1271517144c3fe0fE();
   abort();
  }
  _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E($4 | 0, 1 | 0);
  abort();
 }
 
 function _ZN5alloc3ffi5c_str7CString19_from_vec_unchecked17h5d2dbfd0b5bc0763E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $4 = 0, $2 = 0, $5 = 0, $3 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        $3 = HEAP32[($1 + 4 | 0) >> 2] | 0;
        $4 = HEAP32[($1 + 8 | 0) >> 2] | 0;
        if (($3 | 0) != ($4 | 0)) {
         break label$6
        }
        $3 = $4 + 1 | 0;
        if ($3 >>> 0 < $4 >>> 0) {
         break label$2
        }
        label$7 : {
         label$8 : {
          if ($4) {
           break label$8
          }
          $5 = 0;
          break label$7;
         }
         HEAP32[($2 + 20 | 0) >> 2] = $4;
         HEAP32[($2 + 16 | 0) >> 2] = HEAP32[$1 >> 2] | 0;
         $5 = 1;
        }
        HEAP32[($2 + 24 | 0) >> 2] = $5;
        _ZN5alloc7raw_vec11finish_grow17hb690026d1ce856c3E($2 | 0, $3 | 0, 1 | 0, $2 + 16 | 0 | 0);
        if (HEAP32[$2 >> 2] | 0) {
         break label$5
        }
        $5 = HEAP32[($2 + 4 | 0) >> 2] | 0;
        HEAP32[($1 + 4 | 0) >> 2] = $3;
        HEAP32[$1 >> 2] = $5;
       }
       label$9 : {
        if (($4 | 0) != ($3 | 0)) {
         break label$9
        }
        _ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17hc0dcc85cfb69e0ecE($1 | 0, $4 | 0);
        $3 = HEAP32[($1 + 4 | 0) >> 2] | 0;
        $4 = HEAP32[($1 + 8 | 0) >> 2] | 0;
       }
       $5 = $4 + 1 | 0;
       HEAP32[($1 + 8 | 0) >> 2] = $5;
       $1 = HEAP32[$1 >> 2] | 0;
       HEAP8[($1 + $4 | 0) >> 0] = 0;
       if ($3 >>> 0 > $5 >>> 0) {
        break label$4
       }
       $4 = $1;
       break label$3;
      }
      $1 = HEAP32[($2 + 8 | 0) >> 2] | 0;
      if (!$1) {
       break label$2
      }
      _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E(HEAP32[($2 + 4 | 0) >> 2] | 0 | 0, $1 | 0);
      abort();
     }
     label$10 : {
      if ($5) {
       break label$10
      }
      $4 = 1;
      __rust_dealloc($1 | 0, $3 | 0, 1 | 0);
      break label$3;
     }
     $4 = __rust_realloc($1 | 0, $3 | 0, 1 | 0, $5 | 0) | 0;
     if (!$4) {
      break label$1
     }
    }
    HEAP32[($0 + 4 | 0) >> 2] = $5;
    HEAP32[$0 >> 2] = $4;
    __stack_pointer = $2 + 32 | 0;
    return;
   }
   _ZN5alloc7raw_vec17capacity_overflow17h1271517144c3fe0fE();
   abort();
  }
  _ZN5alloc5alloc18handle_alloc_error17h9fd04940404f7669E($5 | 0, 1 | 0);
  abort();
 }
 
 function _ZN4core3ops8function6FnOnce9call_once17h982de4d8beb48819E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN4core5slice5index29slice_start_index_len_fail_rt17h8ad3331fb0105623E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core5slice5index29slice_start_index_len_fail_rt17h8ad3331fb0105623E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 48 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = $1;
  HEAP32[$2 >> 2] = $0;
  HEAP32[($2 + 28 | 0) >> 2] = 2;
  HEAP32[($2 + 44 | 0) >> 2] = 5;
  HEAP32[($2 + 12 | 0) >> 2] = 2;
  HEAP32[($2 + 16 | 0) >> 2] = 0;
  HEAP32[($2 + 8 | 0) >> 2] = 1055800;
  HEAP32[($2 + 36 | 0) >> 2] = 5;
  HEAP32[($2 + 24 | 0) >> 2] = $2 + 32 | 0;
  HEAP32[($2 + 40 | 0) >> 2] = $2 + 4 | 0;
  HEAP32[($2 + 32 | 0) >> 2] = $2;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($2 + 8 | 0 | 0, 1055848 | 0);
  abort();
 }
 
 function _ZN4core3ops8function6FnOnce9call_once17hbe5c5ea40f4c4a8eE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN4core5slice5index25slice_index_order_fail_rt17h9e1dc5ce32f29604E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core5slice5index25slice_index_order_fail_rt17h9e1dc5ce32f29604E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 48 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = $1;
  HEAP32[$2 >> 2] = $0;
  HEAP32[($2 + 28 | 0) >> 2] = 2;
  HEAP32[($2 + 44 | 0) >> 2] = 5;
  HEAP32[($2 + 12 | 0) >> 2] = 2;
  HEAP32[($2 + 16 | 0) >> 2] = 0;
  HEAP32[($2 + 8 | 0) >> 2] = 1055948;
  HEAP32[($2 + 36 | 0) >> 2] = 5;
  HEAP32[($2 + 24 | 0) >> 2] = $2 + 32 | 0;
  HEAP32[($2 + 40 | 0) >> 2] = $2 + 4 | 0;
  HEAP32[($2 + 32 | 0) >> 2] = $2;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($2 + 8 | 0 | 0, 1055964 | 0);
  abort();
 }
 
 function _ZN4core3ops8function6FnOnce9call_once17hbf979cffe6390897E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN4core5slice5index27slice_end_index_len_fail_rt17h8bccaaf603cd6474E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core5slice5index27slice_end_index_len_fail_rt17h8bccaaf603cd6474E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 48 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = $1;
  HEAP32[$2 >> 2] = $0;
  HEAP32[($2 + 28 | 0) >> 2] = 2;
  HEAP32[($2 + 44 | 0) >> 2] = 5;
  HEAP32[($2 + 12 | 0) >> 2] = 2;
  HEAP32[($2 + 16 | 0) >> 2] = 0;
  HEAP32[($2 + 8 | 0) >> 2] = 1055880;
  HEAP32[($2 + 36 | 0) >> 2] = 5;
  HEAP32[($2 + 24 | 0) >> 2] = $2 + 32 | 0;
  HEAP32[($2 + 40 | 0) >> 2] = $2 + 4 | 0;
  HEAP32[($2 + 32 | 0) >> 2] = $2;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($2 + 8 | 0 | 0, 1055896 | 0);
  abort();
 }
 
 function _ZN4core3ops8function6FnOnce9call_once17hd19de2a9e46d9a94E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  HEAP32[$0 >> 2] | 0;
  label$1 : while (1) continue label$1;
 }
 
 function _ZN4core3ops8function6FnOnce9call_once17hf368024d5e4131d8E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  _ZN4core3str19slice_error_fail_rt17he80274026a72fe9fE($0 | 0, $1 | 0, $2 | 0, $3 | 0);
  abort();
 }
 
 function _ZN4core3str19slice_error_fail_rt17he80274026a72fe9fE($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, $5 = 0, $6 = 0, i64toi32_i32$0 = 0, $7 = 0, $8 = 0;
  $4 = __stack_pointer - 112 | 0;
  __stack_pointer = $4;
  HEAP32[($4 + 12 | 0) >> 2] = $3;
  HEAP32[($4 + 8 | 0) >> 2] = $2;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$8 : {
          if ($1 >>> 0 < 257 >>> 0) {
           break label$8
          }
          $5 = 256;
          label$9 : {
           if ((HEAP8[($0 + 256 | 0) >> 0] | 0 | 0) > (-65 | 0)) {
            break label$9
           }
           $5 = 255;
           if ((HEAP8[($0 + 255 | 0) >> 0] | 0 | 0) > (-65 | 0)) {
            break label$9
           }
           $5 = 254;
           if ((HEAP8[($0 + 254 | 0) >> 0] | 0 | 0) > (-65 | 0)) {
            break label$9
           }
           $5 = 253;
          }
          if ($5 >>> 0 < $1 >>> 0) {
           break label$7
          }
          if (($5 | 0) != ($1 | 0)) {
           break label$5
          }
         }
         HEAP32[($4 + 20 | 0) >> 2] = $1;
         HEAP32[($4 + 16 | 0) >> 2] = $0;
         $5 = 0;
         $6 = 1055052;
         break label$6;
        }
        HEAP32[($4 + 20 | 0) >> 2] = $5;
        HEAP32[($4 + 16 | 0) >> 2] = $0;
        $5 = 5;
        $6 = 1056263;
       }
       HEAP32[($4 + 28 | 0) >> 2] = $5;
       HEAP32[($4 + 24 | 0) >> 2] = $6;
       $5 = $2 >>> 0 > $1 >>> 0;
       if ($5) {
        break label$4
       }
       if ($3 >>> 0 > $1 >>> 0) {
        break label$4
       }
       label$10 : {
        if ($2 >>> 0 > $3 >>> 0) {
         break label$10
        }
        label$11 : {
         label$12 : {
          if (!$2) {
           break label$12
          }
          label$13 : {
           if ($2 >>> 0 < $1 >>> 0) {
            break label$13
           }
           if (($1 | 0) == ($2 | 0)) {
            break label$12
           }
           break label$11;
          }
          if ((HEAP8[($0 + $2 | 0) >> 0] | 0 | 0) < (-64 | 0)) {
           break label$11
          }
         }
         $2 = $3;
        }
        HEAP32[($4 + 32 | 0) >> 2] = $2;
        $3 = $1;
        label$14 : {
         if ($2 >>> 0 >= $3 >>> 0) {
          break label$14
         }
         $5 = $2 + 1 | 0;
         $3 = $2 + -3 | 0;
         $3 = $3 >>> 0 > $2 >>> 0 ? 0 : $3;
         if ($5 >>> 0 < $3 >>> 0) {
          break label$3
         }
         label$15 : {
          if (($3 | 0) == ($5 | 0)) {
           break label$15
          }
          $7 = $0 + $3 | 0;
          $5 = ($0 + $5 | 0) - $7 | 0;
          label$16 : {
           $8 = $0 + $2 | 0;
           if ((HEAP8[$8 >> 0] | 0 | 0) <= (-65 | 0)) {
            break label$16
           }
           $6 = $5 + -1 | 0;
           break label$15;
          }
          if (($3 | 0) == ($2 | 0)) {
           break label$15
          }
          label$17 : {
           $2 = $8 + -1 | 0;
           if ((HEAP8[$2 >> 0] | 0 | 0) <= (-65 | 0)) {
            break label$17
           }
           $6 = $5 + -2 | 0;
           break label$15;
          }
          if (($7 | 0) == ($2 | 0)) {
           break label$15
          }
          label$18 : {
           $2 = $8 + -2 | 0;
           if ((HEAP8[$2 >> 0] | 0 | 0) <= (-65 | 0)) {
            break label$18
           }
           $6 = $5 + -3 | 0;
           break label$15;
          }
          if (($7 | 0) == ($2 | 0)) {
           break label$15
          }
          label$19 : {
           $2 = $8 + -3 | 0;
           if ((HEAP8[$2 >> 0] | 0 | 0) <= (-65 | 0)) {
            break label$19
           }
           $6 = $5 + -4 | 0;
           break label$15;
          }
          if (($7 | 0) == ($2 | 0)) {
           break label$15
          }
          $6 = $5 + -5 | 0;
         }
         $3 = $6 + $3 | 0;
        }
        label$20 : {
         if (!$3) {
          break label$20
         }
         label$21 : {
          if ($3 >>> 0 < $1 >>> 0) {
           break label$21
          }
          if (($3 | 0) == ($1 | 0)) {
           break label$20
          }
          break label$1;
         }
         if ((HEAP8[($0 + $3 | 0) >> 0] | 0 | 0) <= (-65 | 0)) {
          break label$1
         }
        }
        if (($3 | 0) == ($1 | 0)) {
         break label$2
        }
        label$22 : {
         label$23 : {
          label$24 : {
           label$25 : {
            $2 = $0 + $3 | 0;
            $1 = HEAP8[$2 >> 0] | 0;
            if (($1 | 0) > (-1 | 0)) {
             break label$25
            }
            $0 = (HEAPU8[($2 + 1 | 0) >> 0] | 0) & 63 | 0;
            $5 = $1 & 31 | 0;
            if ($1 >>> 0 > -33 >>> 0) {
             break label$24
            }
            $2 = $5 << 6 | 0 | $0 | 0;
            break label$23;
           }
           HEAP32[($4 + 36 | 0) >> 2] = $1 & 255 | 0;
           $1 = 1;
           break label$22;
          }
          $0 = $0 << 6 | 0 | ((HEAPU8[($2 + 2 | 0) >> 0] | 0) & 63 | 0) | 0;
          label$26 : {
           if ($1 >>> 0 >= -16 >>> 0) {
            break label$26
           }
           $2 = $0 | ($5 << 12 | 0) | 0;
           break label$23;
          }
          $2 = $0 << 6 | 0 | ((HEAPU8[($2 + 3 | 0) >> 0] | 0) & 63 | 0) | 0 | (($5 << 18 | 0) & 1835008 | 0) | 0;
          if (($2 | 0) == (1114112 | 0)) {
           break label$2
          }
         }
         HEAP32[($4 + 36 | 0) >> 2] = $2;
         $1 = 1;
         if ($2 >>> 0 < 128 >>> 0) {
          break label$22
         }
         $1 = 2;
         if ($2 >>> 0 < 2048 >>> 0) {
          break label$22
         }
         $1 = $2 >>> 0 < 65536 >>> 0 ? 3 : 4;
        }
        HEAP32[($4 + 40 | 0) >> 2] = $3;
        HEAP32[($4 + 44 | 0) >> 2] = $1 + $3 | 0;
        HEAP32[(($4 + 48 | 0) + 20 | 0) >> 2] = 5;
        HEAP32[($4 + 108 | 0) >> 2] = 65;
        HEAP32[($4 + 100 | 0) >> 2] = 65;
        HEAP32[(($4 + 72 | 0) + 20 | 0) >> 2] = 66;
        HEAP32[($4 + 84 | 0) >> 2] = 67;
        i64toi32_i32$0 = 0;
        HEAP32[($4 + 52 | 0) >> 2] = 5;
        HEAP32[($4 + 56 | 0) >> 2] = i64toi32_i32$0;
        HEAP32[($4 + 48 | 0) >> 2] = 1056496;
        HEAP32[($4 + 76 | 0) >> 2] = 5;
        HEAP32[($4 + 64 | 0) >> 2] = $4 + 72 | 0;
        HEAP32[($4 + 104 | 0) >> 2] = $4 + 24 | 0;
        HEAP32[($4 + 96 | 0) >> 2] = $4 + 16 | 0;
        HEAP32[($4 + 88 | 0) >> 2] = $4 + 40 | 0;
        HEAP32[($4 + 80 | 0) >> 2] = $4 + 36 | 0;
        HEAP32[($4 + 72 | 0) >> 2] = $4 + 32 | 0;
        _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($4 + 48 | 0 | 0, 1056536 | 0);
        abort();
       }
       HEAP32[($4 + 100 | 0) >> 2] = 65;
       HEAP32[(($4 + 72 | 0) + 20 | 0) >> 2] = 65;
       HEAP32[($4 + 84 | 0) >> 2] = 5;
       HEAP32[(($4 + 48 | 0) + 20 | 0) >> 2] = 4;
       i64toi32_i32$0 = 0;
       HEAP32[($4 + 52 | 0) >> 2] = 4;
       HEAP32[($4 + 56 | 0) >> 2] = i64toi32_i32$0;
       HEAP32[($4 + 48 | 0) >> 2] = 1056380;
       HEAP32[($4 + 76 | 0) >> 2] = 5;
       HEAP32[($4 + 64 | 0) >> 2] = $4 + 72 | 0;
       HEAP32[($4 + 96 | 0) >> 2] = $4 + 24 | 0;
       HEAP32[($4 + 88 | 0) >> 2] = $4 + 16 | 0;
       HEAP32[($4 + 80 | 0) >> 2] = $4 + 12 | 0;
       HEAP32[($4 + 72 | 0) >> 2] = $4 + 8 | 0;
       _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($4 + 48 | 0 | 0, 1056412 | 0);
       abort();
      }
      _ZN4core3str16slice_error_fail17h0df39b83f8d5042dE($0 | 0, $1 | 0, 0 | 0, $5 | 0, $4 | 0);
      abort();
     }
     HEAP32[($4 + 40 | 0) >> 2] = $5 ? $2 : $3;
     HEAP32[(($4 + 48 | 0) + 20 | 0) >> 2] = 3;
     HEAP32[(($4 + 72 | 0) + 20 | 0) >> 2] = 65;
     HEAP32[($4 + 84 | 0) >> 2] = 65;
     i64toi32_i32$0 = 0;
     HEAP32[($4 + 52 | 0) >> 2] = 3;
     HEAP32[($4 + 56 | 0) >> 2] = i64toi32_i32$0;
     HEAP32[($4 + 48 | 0) >> 2] = 1056304;
     HEAP32[($4 + 76 | 0) >> 2] = 5;
     HEAP32[($4 + 64 | 0) >> 2] = $4 + 72 | 0;
     HEAP32[($4 + 88 | 0) >> 2] = $4 + 24 | 0;
     HEAP32[($4 + 80 | 0) >> 2] = $4 + 16 | 0;
     HEAP32[($4 + 72 | 0) >> 2] = $4 + 40 | 0;
     _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($4 + 48 | 0 | 0, 1056328 | 0);
     abort();
    }
    _ZN4core5slice5index22slice_index_order_fail17h78715c680d488b78E($3 | 0, $5 | 0, $4 | 0);
    abort();
   }
   _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1055144 | 0, 43 | 0, 1056428 | 0);
   abort();
  }
  _ZN4core3str16slice_error_fail17h0df39b83f8d5042dE($0 | 0, $1 | 0, $3 | 0, $1 | 0, $4 | 0);
  abort();
 }
 
 function _ZN4core3ptr102drop_in_place$LT$$RF$core__iter__adapters__copied__Copied$LT$core__slice__iter__Iter$LT$u8$GT$$GT$$GT$17h5cb8c015b89953c6E($0) {
  $0 = $0 | 0;
 }
 
 function _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP8[($2 + 24 | 0) >> 0] = 1;
  HEAP32[($2 + 20 | 0) >> 2] = $1;
  HEAP32[($2 + 16 | 0) >> 2] = $0;
  HEAP32[($2 + 12 | 0) >> 2] = 1055212;
  HEAP32[($2 + 8 | 0) >> 2] = 1055052;
  rust_begin_unwind($2 + 8 | 0 | 0);
  abort();
 }
 
 function _ZN4core9panicking18panic_bounds_check17h6173caa48eb1b6ceE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0;
  $3 = __stack_pointer - 48 | 0;
  __stack_pointer = $3;
  HEAP32[($3 + 4 | 0) >> 2] = $1;
  HEAP32[$3 >> 2] = $0;
  HEAP32[($3 + 28 | 0) >> 2] = 2;
  HEAP32[($3 + 44 | 0) >> 2] = 5;
  HEAP32[($3 + 12 | 0) >> 2] = 2;
  HEAP32[($3 + 16 | 0) >> 2] = 0;
  HEAP32[($3 + 8 | 0) >> 2] = 1055128;
  HEAP32[($3 + 36 | 0) >> 2] = 5;
  HEAP32[($3 + 24 | 0) >> 2] = $3 + 32 | 0;
  HEAP32[($3 + 40 | 0) >> 2] = $3;
  HEAP32[($3 + 32 | 0) >> 2] = $3 + 4 | 0;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($3 + 8 | 0 | 0, $2 | 0);
  abort();
 }
 
 function _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  _ZN4core10intrinsics17const_eval_select17h7e2fb6c435dc1ae5E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core5slice5index24slice_end_index_len_fail17h27705fedb298ed88E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  _ZN4core10intrinsics17const_eval_select17hf23d401686a38d1bE($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core3fmt9Formatter3pad17h88c30040786a4792E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $8 = 0, $7 = 0, $6 = 0, $5 = 0, $4 = 0;
  $3 = HEAP32[($0 + 16 | 0) >> 2] | 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        $4 = HEAP32[($0 + 8 | 0) >> 2] | 0;
        if (($4 | 0) == (1 | 0)) {
         break label$6
        }
        if (($3 | 0) != (1 | 0)) {
         break label$5
        }
       }
       if (($3 | 0) != (1 | 0)) {
        break label$2
       }
       $5 = $1 + $2 | 0;
       $6 = HEAP32[($0 + 20 | 0) >> 2] | 0;
       if ($6) {
        break label$4
       }
       $7 = 0;
       $8 = $1;
       break label$3;
      }
      $3 = FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $1, $2) | 0;
      break label$1;
     }
     $7 = 0;
     $8 = $1;
     label$7 : while (1) {
      $3 = $8;
      if (($3 | 0) == ($5 | 0)) {
       break label$2
      }
      label$8 : {
       label$9 : {
        $8 = HEAP8[$3 >> 0] | 0;
        if (($8 | 0) <= (-1 | 0)) {
         break label$9
        }
        $8 = $3 + 1 | 0;
        break label$8;
       }
       label$10 : {
        if ($8 >>> 0 >= -32 >>> 0) {
         break label$10
        }
        $8 = $3 + 2 | 0;
        break label$8;
       }
       label$11 : {
        if ($8 >>> 0 >= -16 >>> 0) {
         break label$11
        }
        $8 = $3 + 3 | 0;
        break label$8;
       }
       if ((((HEAPU8[($3 + 2 | 0) >> 0] | 0) & 63 | 0) << 6 | 0 | (((HEAPU8[($3 + 1 | 0) >> 0] | 0) & 63 | 0) << 12 | 0) | 0 | ((HEAPU8[($3 + 3 | 0) >> 0] | 0) & 63 | 0) | 0 | ((($8 & 255 | 0) << 18 | 0) & 1835008 | 0) | 0 | 0) == (1114112 | 0)) {
        break label$2
       }
       $8 = $3 + 4 | 0;
      }
      $7 = ($7 - $3 | 0) + $8 | 0;
      $6 = $6 + -1 | 0;
      if ($6) {
       continue label$7
      }
      break label$7;
     };
    }
    if (($8 | 0) == ($5 | 0)) {
     break label$2
    }
    label$12 : {
     $3 = HEAP8[$8 >> 0] | 0;
     if (($3 | 0) > (-1 | 0)) {
      break label$12
     }
     if ($3 >>> 0 < -32 >>> 0) {
      break label$12
     }
     if ($3 >>> 0 < -16 >>> 0) {
      break label$12
     }
     if ((((HEAPU8[($8 + 2 | 0) >> 0] | 0) & 63 | 0) << 6 | 0 | (((HEAPU8[($8 + 1 | 0) >> 0] | 0) & 63 | 0) << 12 | 0) | 0 | ((HEAPU8[($8 + 3 | 0) >> 0] | 0) & 63 | 0) | 0 | ((($3 & 255 | 0) << 18 | 0) & 1835008 | 0) | 0 | 0) == (1114112 | 0)) {
      break label$2
     }
    }
    label$13 : {
     label$14 : {
      label$15 : {
       if ($7) {
        break label$15
       }
       $8 = 0;
       break label$14;
      }
      label$16 : {
       if ($7 >>> 0 < $2 >>> 0) {
        break label$16
       }
       $3 = 0;
       $8 = $2;
       if (($7 | 0) == ($8 | 0)) {
        break label$14
       }
       break label$13;
      }
      $3 = 0;
      $8 = $7;
      if ((HEAP8[($1 + $8 | 0) >> 0] | 0 | 0) < (-64 | 0)) {
       break label$13
      }
     }
     $7 = $8;
     $3 = $1;
    }
    $2 = $3 ? $7 : $2;
    $1 = $3 ? $3 : $1;
   }
   label$17 : {
    if ($4) {
     break label$17
    }
    return FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $1, $2) | 0 | 0;
   }
   $5 = HEAP32[($0 + 12 | 0) >> 2] | 0;
   label$18 : {
    label$19 : {
     if ($2 >>> 0 < 16 >>> 0) {
      break label$19
     }
     $8 = _ZN4core3str5count14do_count_chars17hf88c7cdd09a667a7E($1 | 0, $2 | 0) | 0;
     break label$18;
    }
    label$20 : {
     if ($2) {
      break label$20
     }
     $8 = 0;
     break label$18;
    }
    $7 = $2 & 3 | 0;
    label$21 : {
     label$22 : {
      if (($2 + -1 | 0) >>> 0 >= 3 >>> 0) {
       break label$22
      }
      $8 = 0;
      $3 = $1;
      break label$21;
     }
     $6 = $2 & -4 | 0;
     $8 = 0;
     $3 = $1;
     label$23 : while (1) {
      $8 = ((($8 + ((HEAP8[$3 >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($3 + 1 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($3 + 2 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($3 + 3 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0;
      $3 = $3 + 4 | 0;
      $6 = $6 + -4 | 0;
      if ($6) {
       continue label$23
      }
      break label$23;
     };
    }
    if (!$7) {
     break label$18
    }
    label$24 : while (1) {
     $8 = $8 + ((HEAP8[$3 >> 0] | 0 | 0) > (-65 | 0)) | 0;
     $3 = $3 + 1 | 0;
     $7 = $7 + -1 | 0;
     if ($7) {
      continue label$24
     }
     break label$24;
    };
   }
   label$25 : {
    if ($5 >>> 0 <= $8 >>> 0) {
     break label$25
    }
    $3 = 0;
    $7 = $5 - $8 | 0;
    $6 = $7;
    label$26 : {
     label$27 : {
      label$28 : {
       $8 = HEAPU8[($0 + 32 | 0) >> 0] | 0;
       switch ((($8 | 0) == (3 | 0) ? 0 : $8) & 3 | 0 | 0) {
       case 2:
        break label$27;
       case 1:
        break label$28;
       default:
        break label$26;
       };
      }
      $6 = 0;
      $3 = $7;
      break label$26;
     }
     $3 = $7 >>> 1 | 0;
     $6 = ($7 + 1 | 0) >>> 1 | 0;
    }
    $3 = $3 + 1 | 0;
    $7 = HEAP32[($0 + 28 | 0) >> 2] | 0;
    $8 = HEAP32[($0 + 4 | 0) >> 2] | 0;
    $0 = HEAP32[($0 + 24 | 0) >> 2] | 0;
    label$29 : {
     label$30 : while (1) {
      $3 = $3 + -1 | 0;
      if (!$3) {
       break label$29
      }
      if (!(FUNCTION_TABLE[HEAP32[($7 + 16 | 0) >> 2] | 0 | 0]($0, $8) | 0)) {
       continue label$30
      }
      break label$30;
     };
     return 1 | 0;
    }
    $3 = 1;
    if (($8 | 0) == (1114112 | 0)) {
     break label$1
    }
    if (FUNCTION_TABLE[HEAP32[($7 + 12 | 0) >> 2] | 0 | 0]($0, $1, $2) | 0) {
     break label$1
    }
    $3 = 0;
    label$31 : while (1) {
     label$32 : {
      if (($6 | 0) != ($3 | 0)) {
       break label$32
      }
      return $6 >>> 0 < $6 >>> 0 | 0;
     }
     $3 = $3 + 1 | 0;
     if (!(FUNCTION_TABLE[HEAP32[($7 + 16 | 0) >> 2] | 0 | 0]($0, $8) | 0)) {
      continue label$31
     }
     break label$31;
    };
    return ($3 + -1 | 0) >>> 0 < $6 >>> 0 | 0;
   }
   return FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $1, $2) | 0 | 0;
  }
  return $3 | 0;
 }
 
 function _ZN4core9panicking5panic17hd987aee4d3a1bda7E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0;
  $3 = __stack_pointer - 32 | 0;
  __stack_pointer = $3;
  HEAP32[($3 + 20 | 0) >> 2] = 0;
  HEAP32[($3 + 16 | 0) >> 2] = 1055052;
  HEAP32[($3 + 4 | 0) >> 2] = 1;
  HEAP32[($3 + 8 | 0) >> 2] = 0;
  HEAP32[($3 + 28 | 0) >> 2] = $1;
  HEAP32[($3 + 24 | 0) >> 2] = $0;
  HEAP32[$3 >> 2] = $3 + 24 | 0;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($3 | 0, $2 | 0);
  abort();
 }
 
 function _ZN4core5slice5index22slice_index_order_fail17h78715c680d488b78E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  _ZN4core10intrinsics17const_eval_select17ha1429097594861a2E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core3fmt3num3imp52_$LT$impl$u20$core__fmt__Display$u20$for$u20$u32$GT$3fmt17hd8b7165cf120cb31E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$1 = 0;
  i64toi32_i32$1 = 0;
  return _ZN4core3fmt3num3imp7fmt_u6417hbcc4e9eaf34213beE(HEAP32[$0 >> 2] | 0 | 0, i64toi32_i32$1 | 0, 1 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN4core10intrinsics17const_eval_select17h41905e329ae28bfcE($0) {
  $0 = $0 | 0;
  _ZN4core3ops8function6FnOnce9call_once17hf368024d5e4131d8E(HEAP32[$0 >> 2] | 0 | 0, HEAP32[($0 + 4 | 0) >> 2] | 0 | 0, HEAP32[($0 + 8 | 0) >> 2] | 0 | 0, HEAP32[($0 + 12 | 0) >> 2] | 0 | 0);
  abort();
 }
 
 function _ZN4core10intrinsics17const_eval_select17h7e2fb6c435dc1ae5E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN4core3ops8function6FnOnce9call_once17h982de4d8beb48819E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core10intrinsics17const_eval_select17ha1429097594861a2E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN4core3ops8function6FnOnce9call_once17hbe5c5ea40f4c4a8eE($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core10intrinsics17const_eval_select17hf23d401686a38d1bE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  _ZN4core3ops8function6FnOnce9call_once17hbf979cffe6390897E($0 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core3fmt3num50_$LT$impl$u20$core__fmt__Debug$u20$for$u20$u32$GT$3fmt17hd7e0831cf3549090E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $3 = 0, $4 = 0, $2 = 0, i64toi32_i32$1 = 0;
  $2 = __stack_pointer - 128 | 0;
  __stack_pointer = $2;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       $3 = HEAP32[$1 >> 2] | 0;
       if ($3 & 16 | 0) {
        break label$5
       }
       if ($3 & 32 | 0) {
        break label$4
       }
       i64toi32_i32$1 = 0;
       $0 = _ZN4core3fmt3num3imp7fmt_u6417hbcc4e9eaf34213beE(HEAP32[$0 >> 2] | 0 | 0, i64toi32_i32$1 | 0, 1 | 0, $1 | 0) | 0;
       break label$1;
      }
      $0 = HEAP32[$0 >> 2] | 0;
      $3 = 0;
      label$6 : while (1) {
       $4 = $0 & 15 | 0;
       HEAP8[(($2 + $3 | 0) + 127 | 0) >> 0] = ($4 >>> 0 < 10 >>> 0 ? 48 : 87) + $4 | 0;
       $3 = $3 + -1 | 0;
       $4 = $0 >>> 0 > 15 >>> 0;
       $0 = $0 >>> 4 | 0;
       if ($4) {
        continue label$6
       }
       break label$6;
      };
      $0 = $3 + 128 | 0;
      if ($0 >>> 0 >= 129 >>> 0) {
       break label$3
      }
      $0 = _ZN4core3fmt9Formatter12pad_integral17h07bec98d9f428dc7E($1 | 0, 1 | 0, 1055508 | 0, 2 | 0, ($2 + $3 | 0) + 128 | 0 | 0, 0 - $3 | 0 | 0) | 0;
      break label$1;
     }
     $0 = HEAP32[$0 >> 2] | 0;
     $3 = 0;
     label$7 : while (1) {
      $4 = $0 & 15 | 0;
      HEAP8[(($2 + $3 | 0) + 127 | 0) >> 0] = ($4 >>> 0 < 10 >>> 0 ? 48 : 55) + $4 | 0;
      $3 = $3 + -1 | 0;
      $4 = $0 >>> 0 > 15 >>> 0;
      $0 = $0 >>> 4 | 0;
      if ($4) {
       continue label$7
      }
      break label$7;
     };
     $0 = $3 + 128 | 0;
     if ($0 >>> 0 >= 129 >>> 0) {
      break label$2
     }
     $0 = _ZN4core3fmt9Formatter12pad_integral17h07bec98d9f428dc7E($1 | 0, 1 | 0, 1055508 | 0, 2 | 0, ($2 + $3 | 0) + 128 | 0 | 0, 0 - $3 | 0 | 0) | 0;
     break label$1;
    }
    _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($0 | 0, 128 | 0, $0 | 0);
    abort();
   }
   _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($0 | 0, 128 | 0, $0 | 0);
   abort();
  }
  __stack_pointer = $2 + 128 | 0;
  return $0 | 0;
 }
 
 function _ZN4core3fmt5write17h6461900980c16fcdE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $6 = 0, $7 = 0, i64toi32_i32$0 = 0, $9 = 0, $4 = 0, i64toi32_i32$1 = 0, $12 = 0, $10 = 0, $5 = 0, i64toi32_i32$2 = 0, $11 = 0, $8 = 0, $17 = 0, $109 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0, wasm2js_i32$2 = 0;
  $3 = __stack_pointer - 48 | 0;
  __stack_pointer = $3;
  HEAP32[($3 + 36 | 0) >> 2] = $1;
  HEAP8[($3 + 40 | 0) >> 0] = 3;
  i64toi32_i32$1 = $3;
  i64toi32_i32$0 = 32;
  HEAP32[($3 + 8 | 0) >> 2] = 0;
  HEAP32[($3 + 12 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($3 + 32 | 0) >> 2] = $0;
  $4 = 0;
  HEAP32[($3 + 24 | 0) >> 2] = 0;
  HEAP32[($3 + 16 | 0) >> 2] = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      $5 = HEAP32[($2 + 8 | 0) >> 2] | 0;
      if ($5) {
       break label$4
      }
      $6 = HEAP32[($2 + 20 | 0) >> 2] | 0;
      if (!$6) {
       break label$3
      }
      $1 = HEAP32[$2 >> 2] | 0;
      $0 = HEAP32[($2 + 16 | 0) >> 2] | 0;
      $4 = (($6 + -1 | 0) & 536870911 | 0) + 1 | 0;
      $6 = $4;
      label$5 : while (1) {
       label$6 : {
        $7 = HEAP32[($1 + 4 | 0) >> 2] | 0;
        if (!$7) {
         break label$6
        }
        if (FUNCTION_TABLE[HEAP32[((HEAP32[($3 + 36 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($3 + 32 | 0) >> 2] | 0, HEAP32[$1 >> 2] | 0, $7) | 0) {
         break label$2
        }
       }
       if (FUNCTION_TABLE[HEAP32[($0 + 4 | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0, $3 + 8 | 0) | 0) {
        break label$2
       }
       $0 = $0 + 8 | 0;
       $1 = $1 + 8 | 0;
       $6 = $6 + -1 | 0;
       if ($6) {
        continue label$5
       }
       break label$3;
      };
     }
     $0 = HEAP32[($2 + 12 | 0) >> 2] | 0;
     if (!$0) {
      break label$3
     }
     $8 = $0 << 5 | 0;
     $4 = (($0 + -1 | 0) & 134217727 | 0) + 1 | 0;
     $1 = HEAP32[$2 >> 2] | 0;
     $6 = 0;
     label$7 : while (1) {
      label$8 : {
       $0 = HEAP32[($1 + 4 | 0) >> 2] | 0;
       if (!$0) {
        break label$8
       }
       if (FUNCTION_TABLE[HEAP32[((HEAP32[($3 + 36 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($3 + 32 | 0) >> 2] | 0, HEAP32[$1 >> 2] | 0, $0) | 0) {
        break label$2
       }
      }
      $0 = $5 + $6 | 0;
      HEAP8[($3 + 40 | 0) >> 0] = HEAPU8[($0 + 28 | 0) >> 0] | 0;
      i64toi32_i32$2 = $0 + 4 | 0;
      i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
      i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
      $17 = i64toi32_i32$0;
      i64toi32_i32$0 = 0;
      i64toi32_i32$0 = __wasm_rotl_i64($17 | 0, i64toi32_i32$1 | 0, 32 | 0, i64toi32_i32$0 | 0) | 0;
      i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
      $109 = i64toi32_i32$0;
      i64toi32_i32$0 = $3;
      HEAP32[($3 + 8 | 0) >> 2] = $109;
      HEAP32[($3 + 12 | 0) >> 2] = i64toi32_i32$1;
      $9 = HEAP32[($0 + 24 | 0) >> 2] | 0;
      $10 = HEAP32[($2 + 16 | 0) >> 2] | 0;
      $11 = 0;
      $7 = 0;
      label$9 : {
       label$10 : {
        switch (HEAP32[($0 + 20 | 0) >> 2] | 0 | 0) {
        case 1:
         $12 = $9 << 3 | 0;
         $7 = 0;
         $12 = $10 + $12 | 0;
         if ((HEAP32[($12 + 4 | 0) >> 2] | 0 | 0) != (68 | 0)) {
          break label$9
         }
         $9 = HEAP32[(HEAP32[$12 >> 2] | 0) >> 2] | 0;
         break;
        case 2:
         break label$9;
        default:
         break label$10;
        };
       }
       $7 = 1;
      }
      HEAP32[($3 + 20 | 0) >> 2] = $9;
      HEAP32[($3 + 16 | 0) >> 2] = $7;
      $7 = HEAP32[($0 + 16 | 0) >> 2] | 0;
      label$12 : {
       label$13 : {
        switch (HEAP32[($0 + 12 | 0) >> 2] | 0 | 0) {
        case 1:
         $9 = $7 << 3 | 0;
         $9 = $10 + $9 | 0;
         if ((HEAP32[($9 + 4 | 0) >> 2] | 0 | 0) != (68 | 0)) {
          break label$12
         }
         $7 = HEAP32[(HEAP32[$9 >> 2] | 0) >> 2] | 0;
         break;
        case 2:
         break label$12;
        default:
         break label$13;
        };
       }
       $11 = 1;
      }
      HEAP32[($3 + 28 | 0) >> 2] = $7;
      HEAP32[($3 + 24 | 0) >> 2] = $11;
      $0 = $10 + ((HEAP32[$0 >> 2] | 0) << 3 | 0) | 0;
      if (FUNCTION_TABLE[HEAP32[($0 + 4 | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0, $3 + 8 | 0) | 0) {
       break label$2
      }
      $1 = $1 + 8 | 0;
      $6 = $6 + 32 | 0;
      if (($8 | 0) != ($6 | 0)) {
       continue label$7
      }
      break label$7;
     };
    }
    $0 = 0;
    $1 = $4 >>> 0 < (HEAP32[($2 + 4 | 0) >> 2] | 0) >>> 0;
    if (!$1) {
     break label$1
    }
    $1 = (wasm2js_i32$0 = (HEAP32[$2 >> 2] | 0) + ($4 << 3 | 0) | 0, wasm2js_i32$1 = 0, wasm2js_i32$2 = $1, wasm2js_i32$2 ? wasm2js_i32$0 : wasm2js_i32$1);
    if (!(FUNCTION_TABLE[HEAP32[((HEAP32[($3 + 36 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($3 + 32 | 0) >> 2] | 0, HEAP32[$1 >> 2] | 0, HEAP32[($1 + 4 | 0) >> 2] | 0) | 0)) {
     break label$1
    }
   }
   $0 = 1;
  }
  __stack_pointer = $3 + 48 | 0;
  return $0 | 0;
 }
 
 function _ZN71_$LT$core__ops__range__Range$LT$Idx$GT$$u20$as$u20$core__fmt__Debug$GT$3fmt17h59cfba0461d4ab44E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  $3 = 1;
  label$1 : {
   if (_ZN4core3fmt3num50_$LT$impl$u20$core__fmt__Debug$u20$for$u20$u32$GT$3fmt17hd7e0831cf3549090E($0 | 0, $1 | 0) | 0) {
    break label$1
   }
   $4 = HEAP32[($1 + 28 | 0) >> 2] | 0;
   $5 = HEAP32[($1 + 24 | 0) >> 2] | 0;
   HEAP32[($2 + 28 | 0) >> 2] = 0;
   HEAP32[($2 + 24 | 0) >> 2] = 1055052;
   HEAP32[($2 + 12 | 0) >> 2] = 1;
   HEAP32[($2 + 16 | 0) >> 2] = 0;
   HEAP32[($2 + 8 | 0) >> 2] = 1055056;
   if (_ZN4core3fmt5write17h6461900980c16fcdE($5 | 0, $4 | 0, $2 + 8 | 0 | 0) | 0) {
    break label$1
   }
   $3 = _ZN4core3fmt3num50_$LT$impl$u20$core__fmt__Debug$u20$for$u20$u32$GT$3fmt17hd7e0831cf3549090E($0 + 4 | 0 | 0, $1 | 0) | 0;
  }
  __stack_pointer = $2 + 32 | 0;
  return $3 | 0;
 }
 
 function _ZN36_$LT$T$u20$as$u20$core__any__Any$GT$7type_id17hacd5f54e85b9fb6dE($0) {
  $0 = $0 | 0;
  i64toi32_i32$HIGH_BITS = -79280728;
  return 250261600 | 0;
 }
 
 function _ZN63_$LT$core__cell__BorrowMutError$u20$as$u20$core__fmt__Debug$GT$3fmt17h1e5b39c7ead358b3E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, 1055064, 14) | 0 | 0;
 }
 
 function _ZN4core5slice6memchr19memchr_general_case17he26bb40f07f8be83E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      $4 = (($2 + 3 | 0) & -4 | 0) - $2 | 0;
      if (!$4) {
       break label$4
      }
      $4 = $4 >>> 0 > $3 >>> 0 ? $3 : $4;
      if (!$4) {
       break label$4
      }
      $5 = 0;
      $6 = $1 & 255 | 0;
      $7 = 1;
      label$5 : while (1) {
       if ((HEAPU8[($2 + $5 | 0) >> 0] | 0 | 0) == ($6 | 0)) {
        break label$1
       }
       $5 = $5 + 1 | 0;
       if (($4 | 0) != ($5 | 0)) {
        continue label$5
       }
       break label$5;
      };
      $8 = $3 + -8 | 0;
      if ($4 >>> 0 > $8 >>> 0) {
       break label$2
      }
      break label$3;
     }
     $8 = $3 + -8 | 0;
     $4 = 0;
    }
    $5 = Math_imul($1 & 255 | 0, 16843009);
    label$6 : {
     label$7 : while (1) {
      $6 = $2 + $4 | 0;
      $7 = (HEAP32[$6 >> 2] | 0) ^ $5 | 0;
      $6 = (HEAP32[($6 + 4 | 0) >> 2] | 0) ^ $5 | 0;
      if ((($7 ^ -1 | 0) & ($7 + -16843009 | 0) | 0 | (($6 ^ -1 | 0) & ($6 + -16843009 | 0) | 0) | 0) & -2139062144 | 0) {
       break label$6
      }
      $4 = $4 + 8 | 0;
      if ($4 >>> 0 <= $8 >>> 0) {
       continue label$7
      }
      break label$7;
     };
    }
    if ($4 >>> 0 <= $3 >>> 0) {
     break label$2
    }
    _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($4 | 0, $3 | 0, $4 | 0);
    abort();
   }
   label$8 : {
    if (($4 | 0) == ($3 | 0)) {
     break label$8
    }
    $8 = $4 - $3 | 0;
    $6 = $2 + $4 | 0;
    $5 = 0;
    $7 = $1 & 255 | 0;
    label$9 : {
     label$10 : while (1) {
      if ((HEAPU8[($6 + $5 | 0) >> 0] | 0 | 0) == ($7 | 0)) {
       break label$9
      }
      $5 = $5 + 1 | 0;
      if (!($8 + $5 | 0)) {
       break label$8
      }
      continue label$10;
     };
    }
    $5 = $4 + $5 | 0;
    $7 = 1;
    break label$1;
   }
   $7 = 0;
  }
  HEAP32[($0 + 4 | 0) >> 2] = $5;
  HEAP32[$0 >> 2] = $7;
 }
 
 function _ZN4core3ffi5c_str4CStr29from_bytes_with_nul_unchecked7rt_impl17hf4dd9bf93c6afe10E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  HEAP32[($0 + 4 | 0) >> 2] = $2;
  HEAP32[$0 >> 2] = $1;
 }
 
 function _ZN4core3str8converts9from_utf817h3503debc4f1e2f4bE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var i64toi32_i32$0 = 0, $3 = 0, $6 = 0, $10 = 0, $8$hi = 0, $9$hi = 0, $8 = 0, $9 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, $7 = 0, $4 = 0, $5 = 0, $179$hi = 0, $180$hi = 0, $182 = 0;
  label$1 : {
   if (!$2) {
    break label$1
   }
   $3 = $2 + -7 | 0;
   $4 = $3 >>> 0 > $2 >>> 0 ? 0 : $3;
   $5 = (($1 + 3 | 0) & -4 | 0) - $1 | 0;
   $3 = 0;
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : while (1) {
        label$7 : {
         label$8 : {
          label$9 : {
           $6 = HEAPU8[($1 + $3 | 0) >> 0] | 0;
           $7 = ($6 << 24 | 0) >> 24 | 0;
           if (($7 | 0) < (0 | 0)) {
            break label$9
           }
           if (($5 | 0) == (-1 | 0)) {
            break label$8
           }
           if (($5 - $3 | 0) & 3 | 0) {
            break label$8
           }
           label$10 : {
            if ($3 >>> 0 >= $4 >>> 0) {
             break label$10
            }
            label$11 : while (1) {
             $6 = $1 + $3 | 0;
             if ((HEAP32[$6 >> 2] | 0 | (HEAP32[($6 + 4 | 0) >> 2] | 0) | 0) & -2139062144 | 0) {
              break label$10
             }
             $3 = $3 + 8 | 0;
             if ($3 >>> 0 < $4 >>> 0) {
              continue label$11
             }
             break label$11;
            };
           }
           if ($3 >>> 0 >= $2 >>> 0) {
            break label$7
           }
           label$12 : while (1) {
            if ((HEAP8[($1 + $3 | 0) >> 0] | 0 | 0) < (0 | 0)) {
             break label$7
            }
            $3 = $3 + 1 | 0;
            if (($2 | 0) != ($3 | 0)) {
             continue label$12
            }
            break label$1;
           };
          }
          i64toi32_i32$0 = 256;
          $8 = 0;
          $8$hi = i64toi32_i32$0;
          i64toi32_i32$0 = 1;
          $9 = 0;
          $9$hi = i64toi32_i32$0;
          label$13 : {
           label$14 : {
            label$15 : {
             label$16 : {
              label$17 : {
               label$18 : {
                label$19 : {
                 switch ((HEAPU8[($6 + 1055980 | 0) >> 0] | 0) + -2 | 0 | 0) {
                 case 0:
                  $6 = $3 + 1 | 0;
                  if ($6 >>> 0 < $2 >>> 0) {
                   break label$14
                  }
                  i64toi32_i32$0 = 0;
                  $8 = 0;
                  $8$hi = i64toi32_i32$0;
                  break label$3;
                 case 1:
                  i64toi32_i32$0 = 0;
                  $8 = 0;
                  $8$hi = i64toi32_i32$0;
                  $10 = $3 + 1 | 0;
                  if ($10 >>> 0 >= $2 >>> 0) {
                   break label$3
                  }
                  $10 = HEAP8[($1 + $10 | 0) >> 0] | 0;
                  switch ($6 + -224 | 0 | 0) {
                  case 13:
                   break label$17;
                  case 0:
                   break label$18;
                  default:
                   break label$16;
                  };
                 case 2:
                  break label$19;
                 default:
                  break label$2;
                 };
                }
                i64toi32_i32$0 = 0;
                $8 = 0;
                $8$hi = i64toi32_i32$0;
                $10 = $3 + 1 | 0;
                if ($10 >>> 0 >= $2 >>> 0) {
                 break label$3
                }
                $10 = HEAP8[($1 + $10 | 0) >> 0] | 0;
                label$22 : {
                 label$23 : {
                  switch ($6 + -240 | 0 | 0) {
                  default:
                   if ((($7 + 15 | 0) & 255 | 0) >>> 0 > 2 >>> 0) {
                    break label$4
                   }
                   if (($10 | 0) > (-1 | 0)) {
                    break label$4
                   }
                   if ($10 >>> 0 >= -64 >>> 0) {
                    break label$4
                   }
                   break label$22;
                  case 0:
                   if ((($10 + 112 | 0) & 255 | 0) >>> 0 >= 48 >>> 0) {
                    break label$4
                   }
                   break label$22;
                  case 4:
                   break label$23;
                  };
                 }
                 if (($10 | 0) > (-113 | 0)) {
                  break label$4
                 }
                }
                $6 = $3 + 2 | 0;
                if ($6 >>> 0 >= $2 >>> 0) {
                 break label$3
                }
                if ((HEAP8[($1 + $6 | 0) >> 0] | 0 | 0) > (-65 | 0)) {
                 break label$5
                }
                i64toi32_i32$0 = 0;
                $9 = 0;
                $9$hi = i64toi32_i32$0;
                $6 = $3 + 3 | 0;
                if ($6 >>> 0 >= $2 >>> 0) {
                 break label$2
                }
                if ((HEAP8[($1 + $6 | 0) >> 0] | 0 | 0) <= (-65 | 0)) {
                 break label$13
                }
                i64toi32_i32$0 = 768;
                $8 = 0;
                $8$hi = i64toi32_i32$0;
                i64toi32_i32$0 = 1;
                $9 = 0;
                $9$hi = i64toi32_i32$0;
                break label$2;
               }
               if (($10 & -32 | 0 | 0) != (-96 | 0)) {
                break label$4
               }
               break label$15;
              }
              if (($10 | 0) >= (-96 | 0)) {
               break label$4
              }
              break label$15;
             }
             label$26 : {
              if ((($7 + 31 | 0) & 255 | 0) >>> 0 < 12 >>> 0) {
               break label$26
              }
              if (($7 & -2 | 0 | 0) != (-18 | 0)) {
               break label$4
              }
              if (($10 | 0) > (-1 | 0)) {
               break label$4
              }
              if ($10 >>> 0 >= -64 >>> 0) {
               break label$4
              }
              break label$15;
             }
             if (($10 | 0) > (-65 | 0)) {
              break label$4
             }
            }
            i64toi32_i32$0 = 0;
            $9 = 0;
            $9$hi = i64toi32_i32$0;
            $6 = $3 + 2 | 0;
            if ($6 >>> 0 >= $2 >>> 0) {
             break label$2
            }
            if ((HEAP8[($1 + $6 | 0) >> 0] | 0 | 0) > (-65 | 0)) {
             break label$5
            }
            break label$13;
           }
           i64toi32_i32$0 = 256;
           $8 = 0;
           $8$hi = i64toi32_i32$0;
           i64toi32_i32$0 = 1;
           $9 = 0;
           $9$hi = i64toi32_i32$0;
           if ((HEAP8[($1 + $6 | 0) >> 0] | 0 | 0) > (-65 | 0)) {
            break label$2
           }
          }
          $3 = $6 + 1 | 0;
          break label$7;
         }
         $3 = $3 + 1 | 0;
        }
        if ($3 >>> 0 < $2 >>> 0) {
         continue label$6
        }
        break label$1;
       };
      }
      i64toi32_i32$0 = 512;
      $8 = 0;
      $8$hi = i64toi32_i32$0;
      i64toi32_i32$0 = 1;
      $9 = 0;
      $9$hi = i64toi32_i32$0;
      break label$2;
     }
     i64toi32_i32$0 = 256;
     $8 = 0;
     $8$hi = i64toi32_i32$0;
     i64toi32_i32$0 = 1;
     $9 = 0;
     $9$hi = i64toi32_i32$0;
     break label$2;
    }
    i64toi32_i32$0 = 0;
    $9 = 0;
    $9$hi = i64toi32_i32$0;
   }
   i64toi32_i32$0 = $8$hi;
   i64toi32_i32$0 = 0;
   $179$hi = i64toi32_i32$0;
   i64toi32_i32$0 = $8$hi;
   i64toi32_i32$2 = $8;
   i64toi32_i32$1 = $179$hi;
   i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
   $180$hi = i64toi32_i32$1;
   i64toi32_i32$1 = $9$hi;
   i64toi32_i32$1 = $180$hi;
   i64toi32_i32$0 = i64toi32_i32$2 | $3 | 0;
   i64toi32_i32$2 = $9$hi;
   i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
   $182 = i64toi32_i32$0 | $9 | 0;
   i64toi32_i32$0 = $0;
   HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = $182;
   HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = i64toi32_i32$2;
   HEAP32[i64toi32_i32$0 >> 2] = 1;
   return;
  }
  HEAP32[($0 + 4 | 0) >> 2] = $1;
  HEAP32[($0 + 8 | 0) >> 2] = $2;
  HEAP32[$0 >> 2] = 0;
 }
 
 function _ZN4core3fmt8builders11DebugStruct5field17h1acdae178491c74aE($0, $1, $2, $3, $4) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  var $5 = 0, $8 = 0, $6 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $7 = 0, $9 = 0, $79 = 0, $10 = 0, $10$hi = 0, $91 = 0;
  $5 = __stack_pointer - 64 | 0;
  __stack_pointer = $5;
  $6 = 1;
  label$1 : {
   if (HEAPU8[($0 + 4 | 0) >> 0] | 0) {
    break label$1
   }
   $7 = HEAPU8[($0 + 5 | 0) >> 0] | 0;
   label$2 : {
    $8 = HEAP32[$0 >> 2] | 0;
    $9 = HEAP32[$8 >> 2] | 0;
    if ($9 & 4 | 0) {
     break label$2
    }
    $6 = 1;
    $7 = $7 & 255 | 0;
    if (FUNCTION_TABLE[HEAP32[((HEAP32[($8 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($8 + 24 | 0) >> 2] | 0, $7 ? 1055461 : 1055463, $7 ? 2 : 3) | 0) {
     break label$1
    }
    $6 = 1;
    if (FUNCTION_TABLE[HEAP32[((HEAP32[($8 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($8 + 24 | 0) >> 2] | 0, $1, $2) | 0) {
     break label$1
    }
    $6 = 1;
    if (FUNCTION_TABLE[HEAP32[((HEAP32[($8 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($8 + 24 | 0) >> 2] | 0, 1055408, 2) | 0) {
     break label$1
    }
    $6 = FUNCTION_TABLE[HEAP32[($4 + 12 | 0) >> 2] | 0 | 0]($3, $8) | 0;
    break label$1;
   }
   label$3 : {
    if ($7 & 255 | 0) {
     break label$3
    }
    $6 = 1;
    if (FUNCTION_TABLE[HEAP32[((HEAP32[($8 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($8 + 24 | 0) >> 2] | 0, 1055456, 3) | 0) {
     break label$1
    }
    $9 = HEAP32[$8 >> 2] | 0;
   }
   $6 = 1;
   HEAP8[($5 + 23 | 0) >> 0] = 1;
   HEAP32[($5 + 52 | 0) >> 2] = 1055428;
   HEAP32[($5 + 16 | 0) >> 2] = $5 + 23 | 0;
   HEAP32[($5 + 24 | 0) >> 2] = $9;
   i64toi32_i32$0 = HEAP32[($8 + 24 | 0) >> 2] | 0;
   i64toi32_i32$1 = HEAP32[($8 + 28 | 0) >> 2] | 0;
   $79 = i64toi32_i32$0;
   i64toi32_i32$0 = $5;
   HEAP32[($5 + 8 | 0) >> 2] = $79;
   HEAP32[($5 + 12 | 0) >> 2] = i64toi32_i32$1;
   i64toi32_i32$1 = HEAP32[($8 + 8 | 0) >> 2] | 0;
   i64toi32_i32$0 = HEAP32[($8 + 12 | 0) >> 2] | 0;
   $10 = i64toi32_i32$1;
   $10$hi = i64toi32_i32$0;
   i64toi32_i32$0 = HEAP32[($8 + 16 | 0) >> 2] | 0;
   i64toi32_i32$1 = HEAP32[($8 + 20 | 0) >> 2] | 0;
   HEAP8[($5 + 56 | 0) >> 0] = HEAPU8[($8 + 32 | 0) >> 0] | 0;
   HEAP32[($5 + 28 | 0) >> 2] = HEAP32[($8 + 4 | 0) >> 2] | 0;
   $91 = i64toi32_i32$0;
   i64toi32_i32$0 = $5;
   HEAP32[($5 + 40 | 0) >> 2] = $91;
   HEAP32[($5 + 44 | 0) >> 2] = i64toi32_i32$1;
   i64toi32_i32$1 = $10$hi;
   i64toi32_i32$0 = $5;
   HEAP32[($5 + 32 | 0) >> 2] = $10;
   HEAP32[($5 + 36 | 0) >> 2] = i64toi32_i32$1;
   HEAP32[($5 + 48 | 0) >> 2] = $5 + 8 | 0;
   if (_ZN68_$LT$core__fmt__builders__PadAdapter$u20$as$u20$core__fmt__Write$GT$9write_str17hcf1464355de32109E($5 + 8 | 0 | 0, $1 | 0, $2 | 0) | 0) {
    break label$1
   }
   if (_ZN68_$LT$core__fmt__builders__PadAdapter$u20$as$u20$core__fmt__Write$GT$9write_str17hcf1464355de32109E($5 + 8 | 0 | 0, 1055408 | 0, 2 | 0) | 0) {
    break label$1
   }
   if (FUNCTION_TABLE[HEAP32[($4 + 12 | 0) >> 2] | 0 | 0]($3, $5 + 24 | 0) | 0) {
    break label$1
   }
   $6 = FUNCTION_TABLE[HEAP32[((HEAP32[($5 + 52 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($5 + 48 | 0) >> 2] | 0, 1055459, 2) | 0;
  }
  HEAP8[($0 + 5 | 0) >> 0] = 1;
  HEAP8[($0 + 4 | 0) >> 0] = $6;
  __stack_pointer = $5 + 64 | 0;
  return $0 | 0;
 }
 
 function _ZN4core6option13expect_failed17he17117bab9f5843eE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  _ZN4core9panicking9panic_str17h1ab3c65ee0b468afE($0 | 0, $1 | 0, $2 | 0);
  abort();
 }
 
 function _ZN4core9panicking9panic_str17h1ab3c65ee0b468afE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0;
  $3 = __stack_pointer - 16 | 0;
  __stack_pointer = $3;
  HEAP32[($3 + 12 | 0) >> 2] = $1;
  HEAP32[($3 + 8 | 0) >> 2] = $0;
  _ZN4core9panicking13panic_display17h98d70992f866a7c3E($3 + 8 | 0 | 0, $2 | 0);
  abort();
 }
 
 function _ZN70_$LT$core__panic__location__Location$u20$as$u20$core__fmt__Display$GT$3fmt17ha8020e17e3352036E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 48 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 20 | 0) >> 2] = 5;
  HEAP32[($2 + 12 | 0) >> 2] = 5;
  HEAP32[($2 + 4 | 0) >> 2] = 65;
  HEAP32[$2 >> 2] = $0;
  HEAP32[($2 + 16 | 0) >> 2] = $0 + 12 | 0;
  HEAP32[($2 + 8 | 0) >> 2] = $0 + 8 | 0;
  $0 = HEAP32[($1 + 28 | 0) >> 2] | 0;
  $1 = HEAP32[($1 + 24 | 0) >> 2] | 0;
  HEAP32[(($2 + 24 | 0) + 20 | 0) >> 2] = 3;
  HEAP32[($2 + 28 | 0) >> 2] = 3;
  HEAP32[($2 + 32 | 0) >> 2] = 0;
  HEAP32[($2 + 24 | 0) >> 2] = 1055188;
  HEAP32[($2 + 40 | 0) >> 2] = $2;
  $0 = _ZN4core3fmt5write17h6461900980c16fcdE($1 | 0, $0 | 0, $2 + 24 | 0 | 0) | 0;
  __stack_pointer = $2 + 48 | 0;
  return $0 | 0;
 }
 
 function _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17h09e0edc340f976d6E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN4core3fmt9Formatter3pad17h88c30040786a4792E($1 | 0, HEAP32[$0 >> 2] | 0 | 0, HEAP32[($0 + 4 | 0) >> 2] | 0 | 0) | 0 | 0;
 }
 
 function _ZN4core5panic10panic_info9PanicInfo7payload17hf32a31e780cf45f5E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $4 = 0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $4 = i64toi32_i32$0;
  i64toi32_i32$0 = $0;
  HEAP32[i64toi32_i32$0 >> 2] = $4;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
 }
 
 function _ZN4core5panic10panic_info9PanicInfo7message17ha3f77d3d16253e49E($0) {
  $0 = $0 | 0;
  return HEAP32[($0 + 8 | 0) >> 2] | 0 | 0;
 }
 
 function _ZN4core5panic10panic_info9PanicInfo8location17h07198a946bdf74c0E($0) {
  $0 = $0 | 0;
  return HEAP32[($0 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function _ZN4core5panic10panic_info9PanicInfo10can_unwind17h6aa0afbb95410b80E($0) {
  $0 = $0 | 0;
  return HEAPU8[($0 + 16 | 0) >> 0] | 0 | 0;
 }
 
 function _ZN73_$LT$core__panic__panic_info__PanicInfo$u20$as$u20$core__fmt__Display$GT$3fmt17ha5a8d5d305ca3db6E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, $4 = 0, i64toi32_i32$1 = 0;
  $2 = __stack_pointer - 64 | 0;
  __stack_pointer = $2;
  $3 = 1;
  label$1 : {
   $4 = HEAP32[($1 + 24 | 0) >> 2] | 0;
   $1 = HEAP32[($1 + 28 | 0) >> 2] | 0;
   if (FUNCTION_TABLE[HEAP32[($1 + 12 | 0) >> 2] | 0 | 0]($4, 1055228, 12) | 0) {
    break label$1
   }
   label$2 : {
    label$3 : {
     $3 = HEAP32[($0 + 8 | 0) >> 2] | 0;
     if (!$3) {
      break label$3
     }
     HEAP32[($2 + 12 | 0) >> 2] = $3;
     HEAP32[($2 + 20 | 0) >> 2] = 69;
     HEAP32[($2 + 16 | 0) >> 2] = $2 + 12 | 0;
     $3 = 1;
     HEAP32[($2 + 60 | 0) >> 2] = 1;
     i64toi32_i32$1 = $2;
     i64toi32_i32$0 = 0;
     HEAP32[($2 + 44 | 0) >> 2] = 2;
     HEAP32[($2 + 48 | 0) >> 2] = i64toi32_i32$0;
     HEAP32[($2 + 40 | 0) >> 2] = 1055244;
     HEAP32[($2 + 56 | 0) >> 2] = $2 + 16 | 0;
     if (!(_ZN4core3fmt5write17h6461900980c16fcdE($4 | 0, $1 | 0, $2 + 40 | 0 | 0) | 0)) {
      break label$2
     }
     break label$1;
    }
    $3 = HEAP32[$0 >> 2] | 0;
    i64toi32_i32$0 = FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 4 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0]($3) | 0;
    i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
    i64toi32_i32$2 = i64toi32_i32$0;
    i64toi32_i32$0 = -1196540473;
    if ((i64toi32_i32$2 | 0) != (582611467 | 0) | (i64toi32_i32$1 | 0) != (i64toi32_i32$0 | 0) | 0) {
     break label$2
    }
    HEAP32[($2 + 12 | 0) >> 2] = $3;
    HEAP32[($2 + 20 | 0) >> 2] = 70;
    HEAP32[($2 + 16 | 0) >> 2] = $2 + 12 | 0;
    $3 = 1;
    HEAP32[($2 + 60 | 0) >> 2] = 1;
    i64toi32_i32$1 = $2;
    i64toi32_i32$2 = 0;
    HEAP32[($2 + 44 | 0) >> 2] = 2;
    HEAP32[($2 + 48 | 0) >> 2] = i64toi32_i32$2;
    HEAP32[($2 + 40 | 0) >> 2] = 1055244;
    HEAP32[($2 + 56 | 0) >> 2] = $2 + 16 | 0;
    if (_ZN4core3fmt5write17h6461900980c16fcdE($4 | 0, $1 | 0, $2 + 40 | 0 | 0) | 0) {
     break label$1
    }
   }
   $3 = HEAP32[($0 + 12 | 0) >> 2] | 0;
   HEAP32[(($2 + 16 | 0) + 20 | 0) >> 2] = 5;
   HEAP32[(($2 + 16 | 0) + 12 | 0) >> 2] = 5;
   HEAP32[($2 + 32 | 0) >> 2] = $3 + 12 | 0;
   HEAP32[($2 + 24 | 0) >> 2] = $3 + 8 | 0;
   HEAP32[($2 + 20 | 0) >> 2] = 65;
   HEAP32[($2 + 16 | 0) >> 2] = $3;
   HEAP32[(($2 + 40 | 0) + 20 | 0) >> 2] = 3;
   i64toi32_i32$1 = $2;
   i64toi32_i32$2 = 0;
   HEAP32[($2 + 44 | 0) >> 2] = 3;
   HEAP32[($2 + 48 | 0) >> 2] = i64toi32_i32$2;
   HEAP32[($2 + 40 | 0) >> 2] = 1055188;
   HEAP32[($2 + 56 | 0) >> 2] = $2 + 16 | 0;
   $3 = _ZN4core3fmt5write17h6461900980c16fcdE($4 | 0, $1 | 0, $2 + 40 | 0 | 0) | 0;
  }
  __stack_pointer = $2 + 64 | 0;
  return $3 | 0;
 }
 
 function _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17h3da498b26607d90fE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, $2 = 0, $3 = 0, $4 = 0, $20 = 0, $26 = 0, $29 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  $3 = HEAP32[($1 + 28 | 0) >> 2] | 0;
  $4 = HEAP32[($1 + 24 | 0) >> 2] | 0;
  $1 = HEAP32[$0 >> 2] | 0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $20 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $20;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $26 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $26;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[$1 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[($1 + 4 | 0) >> 2] | 0;
  $29 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = $29;
  HEAP32[(i64toi32_i32$0 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($4 | 0, $3 | 0, i64toi32_i32$0 + 8 | 0 | 0) | 0;
  __stack_pointer = i64toi32_i32$0 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17hfa457ee95475e8c3E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $0 = HEAP32[$0 >> 2] | 0;
  return _ZN4core3fmt9Formatter3pad17h88c30040786a4792E($1 | 0, HEAP32[$0 >> 2] | 0 | 0, HEAP32[($0 + 4 | 0) >> 2] | 0 | 0) | 0 | 0;
 }
 
 function _ZN4core9panicking13panic_display17h98d70992f866a7c3E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 20 | 0) >> 2] = 1;
  HEAP32[($2 + 4 | 0) >> 2] = 1;
  HEAP32[($2 + 8 | 0) >> 2] = 0;
  HEAP32[$2 >> 2] = 1055260;
  HEAP32[($2 + 28 | 0) >> 2] = 65;
  HEAP32[($2 + 24 | 0) >> 2] = $0;
  HEAP32[($2 + 16 | 0) >> 2] = $2 + 24 | 0;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($2 | 0, $1 | 0);
  abort();
 }
 
 function _ZN4core9panicking19assert_failed_inner17h73546127ae8f600bE($0, $1, $2, $3, $4, $5, $6) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  $5 = $5 | 0;
  $6 = $6 | 0;
  var $7 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, $59 = 0, $65 = 0, $68 = 0;
  $7 = __stack_pointer - 112 | 0;
  __stack_pointer = $7;
  HEAP32[($7 + 12 | 0) >> 2] = $2;
  HEAP32[($7 + 8 | 0) >> 2] = $1;
  HEAP32[($7 + 20 | 0) >> 2] = $4;
  HEAP32[($7 + 16 | 0) >> 2] = $3;
  label$1 : {
   label$2 : {
    switch ($0 & 255 | 0 | 0) {
    default:
     HEAP32[($7 + 24 | 0) >> 2] = 1055277;
     $0 = 2;
     break label$1;
    case 1:
     HEAP32[($7 + 24 | 0) >> 2] = 1055275;
     $0 = 2;
     break label$1;
    case 2:
     break label$2;
    };
   }
   HEAP32[($7 + 24 | 0) >> 2] = 1055268;
   $0 = 7;
  }
  HEAP32[($7 + 28 | 0) >> 2] = $0;
  label$5 : {
   if (HEAP32[$5 >> 2] | 0) {
    break label$5
   }
   HEAP32[(($7 + 56 | 0) + 20 | 0) >> 2] = 71;
   HEAP32[($7 + 68 | 0) >> 2] = 71;
   HEAP32[(($7 + 88 | 0) + 20 | 0) >> 2] = 3;
   i64toi32_i32$1 = $7;
   i64toi32_i32$0 = 0;
   HEAP32[($7 + 92 | 0) >> 2] = 4;
   HEAP32[($7 + 96 | 0) >> 2] = i64toi32_i32$0;
   HEAP32[($7 + 88 | 0) >> 2] = 1055376;
   HEAP32[($7 + 60 | 0) >> 2] = 65;
   HEAP32[($7 + 104 | 0) >> 2] = $7 + 56 | 0;
   HEAP32[($7 + 72 | 0) >> 2] = $7 + 16 | 0;
   HEAP32[($7 + 64 | 0) >> 2] = $7 + 8 | 0;
   HEAP32[($7 + 56 | 0) >> 2] = $7 + 24 | 0;
   _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($7 + 88 | 0 | 0, $6 | 0);
   abort();
  }
  i64toi32_i32$2 = $5 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $59 = i64toi32_i32$0;
  i64toi32_i32$0 = ($7 + 32 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $59;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $5 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $65 = i64toi32_i32$1;
  i64toi32_i32$1 = ($7 + 32 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $65;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $5;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $68 = i64toi32_i32$0;
  i64toi32_i32$0 = $7;
  HEAP32[($7 + 32 | 0) >> 2] = $68;
  HEAP32[($7 + 36 | 0) >> 2] = i64toi32_i32$1;
  HEAP32[(($7 + 88 | 0) + 20 | 0) >> 2] = 4;
  HEAP32[($7 + 84 | 0) >> 2] = 10;
  HEAP32[(($7 + 56 | 0) + 20 | 0) >> 2] = 71;
  HEAP32[($7 + 68 | 0) >> 2] = 71;
  i64toi32_i32$0 = $7;
  i64toi32_i32$1 = 0;
  HEAP32[($7 + 92 | 0) >> 2] = 4;
  HEAP32[($7 + 96 | 0) >> 2] = i64toi32_i32$1;
  HEAP32[($7 + 88 | 0) >> 2] = 1055340;
  HEAP32[($7 + 60 | 0) >> 2] = 65;
  HEAP32[($7 + 104 | 0) >> 2] = $7 + 56 | 0;
  HEAP32[($7 + 80 | 0) >> 2] = $7 + 32 | 0;
  HEAP32[($7 + 72 | 0) >> 2] = $7 + 16 | 0;
  HEAP32[($7 + 64 | 0) >> 2] = $7 + 8 | 0;
  HEAP32[($7 + 56 | 0) >> 2] = $7 + 24 | 0;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($7 + 88 | 0 | 0, $6 | 0);
  abort();
 }
 
 function _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h3405c7424f3ace02E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 4 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[$0 >> 2] | 0, $1) | 0 | 0;
 }
 
 function _ZN59_$LT$core__fmt__Arguments$u20$as$u20$core__fmt__Display$GT$3fmt17h3c5217b12139caceE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $2 = 0, $3 = 0, $17 = 0, $23 = 0, $26 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  $3 = HEAP32[($1 + 28 | 0) >> 2] | 0;
  $1 = HEAP32[($1 + 24 | 0) >> 2] | 0;
  i64toi32_i32$2 = $0 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $17 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $17;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $0 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $23;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $26 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = $26;
  HEAP32[(i64toi32_i32$0 + 12 | 0) >> 2] = i64toi32_i32$1;
  $0 = _ZN4core3fmt5write17h6461900980c16fcdE($1 | 0, $3 | 0, i64toi32_i32$0 + 8 | 0 | 0) | 0;
  __stack_pointer = i64toi32_i32$0 + 32 | 0;
  return $0 | 0;
 }
 
 function _ZN4core6result13unwrap_failed17hcf4dc3db6a31deeeE($0, $1, $2, $3, $4) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  var $5 = 0;
  $5 = __stack_pointer - 64 | 0;
  __stack_pointer = $5;
  HEAP32[($5 + 12 | 0) >> 2] = $1;
  HEAP32[($5 + 8 | 0) >> 2] = $0;
  HEAP32[($5 + 20 | 0) >> 2] = $3;
  HEAP32[($5 + 16 | 0) >> 2] = $2;
  HEAP32[($5 + 44 | 0) >> 2] = 2;
  HEAP32[($5 + 60 | 0) >> 2] = 71;
  HEAP32[($5 + 28 | 0) >> 2] = 2;
  HEAP32[($5 + 32 | 0) >> 2] = 0;
  HEAP32[($5 + 24 | 0) >> 2] = 1055412;
  HEAP32[($5 + 52 | 0) >> 2] = 65;
  HEAP32[($5 + 40 | 0) >> 2] = $5 + 48 | 0;
  HEAP32[($5 + 56 | 0) >> 2] = $5 + 16 | 0;
  HEAP32[($5 + 48 | 0) >> 2] = $5 + 8 | 0;
  _ZN4core9panicking9panic_fmt17h7092b9385b17ba68E($5 + 24 | 0 | 0, $4 | 0);
  abort();
 }
 
 function _ZN68_$LT$core__fmt__builders__PadAdapter$u20$as$u20$core__fmt__Write$GT$9write_str17hcf1464355de32109E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $10 = 0, $7 = 0, $8 = 0, $6 = 0, $11 = 0, $5 = 0, $9 = 0, $3 = 0, $4 = 0;
  label$1 : {
   label$2 : {
    if (!$2) {
     break label$2
    }
    $3 = HEAP32[($0 + 4 | 0) >> 2] | 0;
    $4 = HEAP32[$0 >> 2] | 0;
    $5 = HEAP32[($0 + 8 | 0) >> 2] | 0;
    label$3 : while (1) {
     label$4 : {
      if (!(HEAPU8[$5 >> 0] | 0)) {
       break label$4
      }
      if (!(FUNCTION_TABLE[HEAP32[($3 + 12 | 0) >> 2] | 0 | 0]($4, 1055452, 4) | 0)) {
       break label$4
      }
      return 1 | 0;
     }
     $6 = 0;
     $7 = $2;
     label$5 : {
      label$6 : {
       label$7 : {
        label$8 : {
         label$9 : while (1) {
          $8 = $1 + $6 | 0;
          label$10 : {
           label$11 : {
            label$12 : {
             label$13 : {
              label$14 : {
               if ($7 >>> 0 < 8 >>> 0) {
                break label$14
               }
               label$15 : {
                $0 = (($8 + 3 | 0) & -4 | 0) - $8 | 0;
                if ($0) {
                 break label$15
                }
                $9 = $7 + -8 | 0;
                $0 = 0;
                break label$12;
               }
               $0 = $0 >>> 0 > $7 >>> 0 ? $7 : $0;
               $10 = 0;
               label$16 : while (1) {
                if ((HEAPU8[($8 + $10 | 0) >> 0] | 0 | 0) == (10 | 0)) {
                 break label$10
                }
                $10 = $10 + 1 | 0;
                if (($0 | 0) == ($10 | 0)) {
                 break label$13
                }
                continue label$16;
               };
              }
              if (!$7) {
               break label$8
              }
              $10 = 0;
              if ((HEAPU8[$8 >> 0] | 0 | 0) == (10 | 0)) {
               break label$10
              }
              if (($7 | 0) == (1 | 0)) {
               break label$8
              }
              $10 = 1;
              if ((HEAPU8[($8 + 1 | 0) >> 0] | 0 | 0) == (10 | 0)) {
               break label$10
              }
              if (($7 | 0) == (2 | 0)) {
               break label$8
              }
              $10 = 2;
              if ((HEAPU8[($8 + 2 | 0) >> 0] | 0 | 0) == (10 | 0)) {
               break label$10
              }
              if (($7 | 0) == (3 | 0)) {
               break label$8
              }
              $10 = 3;
              if ((HEAPU8[($8 + 3 | 0) >> 0] | 0 | 0) == (10 | 0)) {
               break label$10
              }
              if (($7 | 0) == (4 | 0)) {
               break label$8
              }
              $10 = 4;
              if ((HEAPU8[($8 + 4 | 0) >> 0] | 0 | 0) == (10 | 0)) {
               break label$10
              }
              if (($7 | 0) == (5 | 0)) {
               break label$8
              }
              $10 = 5;
              if ((HEAPU8[($8 + 5 | 0) >> 0] | 0 | 0) == (10 | 0)) {
               break label$10
              }
              if (($7 | 0) == (6 | 0)) {
               break label$8
              }
              $10 = 6;
              if ((HEAPU8[($8 + 6 | 0) >> 0] | 0 | 0) != (10 | 0)) {
               break label$8
              }
              break label$10;
             }
             $9 = $7 + -8 | 0;
             if ($0 >>> 0 > $9 >>> 0) {
              break label$11
             }
            }
            label$17 : {
             label$18 : while (1) {
              $10 = $8 + $0 | 0;
              $11 = HEAP32[$10 >> 2] | 0;
              $10 = HEAP32[($10 + 4 | 0) >> 2] | 0;
              if ((($11 ^ -1 | 0) & (($11 ^ 168430090 | 0) + -16843009 | 0) | 0 | (($10 ^ -1 | 0) & (($10 ^ 168430090 | 0) + -16843009 | 0) | 0) | 0) & -2139062144 | 0) {
               break label$17
              }
              $0 = $0 + 8 | 0;
              if ($0 >>> 0 <= $9 >>> 0) {
               continue label$18
              }
              break label$18;
             };
            }
            if ($0 >>> 0 <= $7 >>> 0) {
             break label$11
            }
            _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($0 | 0, $7 | 0, $0 | 0);
            abort();
           }
           if (($0 | 0) == ($7 | 0)) {
            break label$8
           }
           $11 = $0 - $7 | 0;
           $8 = $8 + $0 | 0;
           $10 = 0;
           label$19 : {
            label$20 : while (1) {
             if ((HEAPU8[($8 + $10 | 0) >> 0] | 0 | 0) == (10 | 0)) {
              break label$19
             }
             $10 = $10 + 1 | 0;
             if ($11 + $10 | 0) {
              continue label$20
             }
             break label$8;
            };
           }
           $10 = $0 + $10 | 0;
          }
          label$21 : {
           $0 = $10 + $6 | 0;
           $6 = $0 + 1 | 0;
           if ($6 >>> 0 < $0 >>> 0) {
            break label$21
           }
           if ($2 >>> 0 < $6 >>> 0) {
            break label$21
           }
           if ((HEAPU8[($1 + $0 | 0) >> 0] | 0 | 0) != (10 | 0)) {
            break label$21
           }
           HEAP8[$5 >> 0] = 1;
           if ($2 >>> 0 <= $6 >>> 0) {
            break label$7
           }
           $0 = $6;
           if ((HEAP8[($1 + $0 | 0) >> 0] | 0 | 0) <= (-65 | 0)) {
            break label$6
           }
           break label$5;
          }
          $7 = $2 - $6 | 0;
          if ($2 >>> 0 >= $6 >>> 0) {
           continue label$9
          }
          break label$9;
         };
        }
        HEAP8[$5 >> 0] = 0;
        $6 = $2;
       }
       $0 = $2;
       if (($0 | 0) == ($6 | 0)) {
        break label$5
       }
      }
      _ZN4core3str16slice_error_fail17h0df39b83f8d5042dE($1 | 0, $2 | 0, 0 | 0, $6 | 0, $0 | 0);
      abort();
     }
     label$22 : {
      if (!(FUNCTION_TABLE[HEAP32[($3 + 12 | 0) >> 2] | 0 | 0]($4, $1, $0) | 0)) {
       break label$22
      }
      return 1 | 0;
     }
     label$23 : {
      label$24 : {
       if ($2 >>> 0 > $0 >>> 0) {
        break label$24
       }
       if (($2 | 0) == ($0 | 0)) {
        break label$23
       }
       break label$1;
      }
      if ((HEAP8[($1 + $0 | 0) >> 0] | 0 | 0) <= (-65 | 0)) {
       break label$1
      }
     }
     $1 = $1 + $0 | 0;
     $2 = $2 - $0 | 0;
     if ($2) {
      continue label$3
     }
     break label$3;
    };
   }
   return 0 | 0;
  }
  _ZN4core3str16slice_error_fail17h0df39b83f8d5042dE($1 | 0, $2 | 0, $0 | 0, $2 | 0, $0 | 0);
  abort();
 }
 
 function _ZN4core3str16slice_error_fail17h0df39b83f8d5042dE($0, $1, $2, $3, $4) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  var $5 = 0;
  $5 = __stack_pointer - 16 | 0;
  __stack_pointer = $5;
  HEAP32[($5 + 12 | 0) >> 2] = $3;
  HEAP32[($5 + 8 | 0) >> 2] = $2;
  HEAP32[($5 + 4 | 0) >> 2] = $1;
  HEAP32[$5 >> 2] = $0;
  _ZN4core10intrinsics17const_eval_select17h41905e329ae28bfcE($5 | 0);
  abort();
 }
 
 function _ZN4core3fmt8builders11DebugStruct21finish_non_exhaustive17h6db77858e25e5c86E($0) {
  $0 = $0 | 0;
  var $3 = 0, $1 = 0, $2 = 0, i64toi32_i32$1 = 0;
  $1 = __stack_pointer - 16 | 0;
  __stack_pointer = $1;
  $2 = 1;
  label$1 : {
   if (HEAPU8[($0 + 4 | 0) >> 0] | 0) {
    break label$1
   }
   $3 = HEAP32[$0 >> 2] | 0;
   label$2 : {
    if (HEAPU8[($0 + 5 | 0) >> 0] | 0) {
     break label$2
    }
    $2 = FUNCTION_TABLE[HEAP32[((HEAP32[($3 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($3 + 24 | 0) >> 2] | 0, 1055476, 7) | 0;
    break label$1;
   }
   label$3 : {
    if ((HEAPU8[$3 >> 0] | 0) & 4 | 0) {
     break label$3
    }
    $2 = FUNCTION_TABLE[HEAP32[((HEAP32[($3 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($3 + 24 | 0) >> 2] | 0, 1055470, 6) | 0;
    break label$1;
   }
   $2 = 1;
   HEAP8[($1 + 15 | 0) >> 0] = 1;
   HEAP32[($1 + 8 | 0) >> 2] = $1 + 15 | 0;
   i64toi32_i32$1 = HEAP32[($3 + 28 | 0) >> 2] | 0;
   HEAP32[$1 >> 2] = HEAP32[($3 + 24 | 0) >> 2] | 0;
   HEAP32[($1 + 4 | 0) >> 2] = i64toi32_i32$1;
   if (_ZN68_$LT$core__fmt__builders__PadAdapter$u20$as$u20$core__fmt__Write$GT$9write_str17hcf1464355de32109E($1 | 0, 1055466 | 0, 3 | 0) | 0) {
    break label$1
   }
   $2 = FUNCTION_TABLE[HEAP32[((HEAP32[($3 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($3 + 24 | 0) >> 2] | 0, 1055469, 1) | 0;
  }
  HEAP8[($0 + 4 | 0) >> 0] = $2;
  __stack_pointer = $1 + 16 | 0;
  return $2 | 0;
 }
 
 function _ZN4core3fmt8builders10DebugTuple5field17hbd726cddd42feca2E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var $3 = 0, $6 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $4 = 0, $5 = 0, $7 = 0, $64 = 0, $8 = 0, $8$hi = 0, $76 = 0;
  $3 = __stack_pointer - 64 | 0;
  __stack_pointer = $3;
  label$1 : {
   label$2 : {
    if (!(HEAPU8[($0 + 8 | 0) >> 0] | 0)) {
     break label$2
    }
    $4 = HEAP32[($0 + 4 | 0) >> 2] | 0;
    $5 = 1;
    break label$1;
   }
   $4 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   label$3 : {
    $6 = HEAP32[$0 >> 2] | 0;
    $7 = HEAP32[$6 >> 2] | 0;
    if ($7 & 4 | 0) {
     break label$3
    }
    $5 = 1;
    if (FUNCTION_TABLE[HEAP32[((HEAP32[($6 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($6 + 24 | 0) >> 2] | 0, $4 ? 1055461 : 1055487, $4 ? 2 : 1) | 0) {
     break label$1
    }
    $5 = FUNCTION_TABLE[HEAP32[($2 + 12 | 0) >> 2] | 0 | 0]($1, $6) | 0;
    break label$1;
   }
   label$4 : {
    if ($4) {
     break label$4
    }
    label$5 : {
     if (!(FUNCTION_TABLE[HEAP32[((HEAP32[($6 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($6 + 24 | 0) >> 2] | 0, 1055485, 2) | 0)) {
      break label$5
     }
     $5 = 1;
     $4 = 0;
     break label$1;
    }
    $7 = HEAP32[$6 >> 2] | 0;
   }
   $5 = 1;
   HEAP8[($3 + 23 | 0) >> 0] = 1;
   HEAP32[($3 + 52 | 0) >> 2] = 1055428;
   HEAP32[($3 + 16 | 0) >> 2] = $3 + 23 | 0;
   HEAP32[($3 + 24 | 0) >> 2] = $7;
   i64toi32_i32$0 = HEAP32[($6 + 24 | 0) >> 2] | 0;
   i64toi32_i32$1 = HEAP32[($6 + 28 | 0) >> 2] | 0;
   $64 = i64toi32_i32$0;
   i64toi32_i32$0 = $3;
   HEAP32[($3 + 8 | 0) >> 2] = $64;
   HEAP32[($3 + 12 | 0) >> 2] = i64toi32_i32$1;
   i64toi32_i32$1 = HEAP32[($6 + 8 | 0) >> 2] | 0;
   i64toi32_i32$0 = HEAP32[($6 + 12 | 0) >> 2] | 0;
   $8 = i64toi32_i32$1;
   $8$hi = i64toi32_i32$0;
   i64toi32_i32$0 = HEAP32[($6 + 16 | 0) >> 2] | 0;
   i64toi32_i32$1 = HEAP32[($6 + 20 | 0) >> 2] | 0;
   HEAP8[($3 + 56 | 0) >> 0] = HEAPU8[($6 + 32 | 0) >> 0] | 0;
   HEAP32[($3 + 28 | 0) >> 2] = HEAP32[($6 + 4 | 0) >> 2] | 0;
   $76 = i64toi32_i32$0;
   i64toi32_i32$0 = $3;
   HEAP32[($3 + 40 | 0) >> 2] = $76;
   HEAP32[($3 + 44 | 0) >> 2] = i64toi32_i32$1;
   i64toi32_i32$1 = $8$hi;
   i64toi32_i32$0 = $3;
   HEAP32[($3 + 32 | 0) >> 2] = $8;
   HEAP32[($3 + 36 | 0) >> 2] = i64toi32_i32$1;
   HEAP32[($3 + 48 | 0) >> 2] = $3 + 8 | 0;
   if (FUNCTION_TABLE[HEAP32[($2 + 12 | 0) >> 2] | 0 | 0]($1, $3 + 24 | 0) | 0) {
    break label$1
   }
   $5 = FUNCTION_TABLE[HEAP32[((HEAP32[($3 + 52 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($3 + 48 | 0) >> 2] | 0, 1055459, 2) | 0;
  }
  HEAP8[($0 + 8 | 0) >> 0] = $5;
  HEAP32[($0 + 4 | 0) >> 2] = $4 + 1 | 0;
  __stack_pointer = $3 + 64 | 0;
  return $0 | 0;
 }
 
 function _ZN4core3fmt9Formatter12pad_integral17h07bec98d9f428dc7E($0, $1, $2, $3, $4, $5) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  $5 = $5 | 0;
  var $6 = 0, $9 = 0, $8 = 0, $10 = 0, $7 = 0, $11 = 0, $12 = 0;
  label$1 : {
   label$2 : {
    if (!$1) {
     break label$2
    }
    $1 = HEAP32[$0 >> 2] | 0;
    $6 = $1 & 1 | 0;
    $7 = $6 ? 43 : 1114112;
    $8 = $6 + $5 | 0;
    break label$1;
   }
   $8 = $5 + 1 | 0;
   $1 = HEAP32[$0 >> 2] | 0;
   $7 = 45;
  }
  label$3 : {
   label$4 : {
    if ($1 & 4 | 0) {
     break label$4
    }
    $2 = 0;
    break label$3;
   }
   label$5 : {
    label$6 : {
     if ($3 >>> 0 < 16 >>> 0) {
      break label$6
     }
     $6 = _ZN4core3str5count14do_count_chars17hf88c7cdd09a667a7E($2 | 0, $3 | 0) | 0;
     break label$5;
    }
    label$7 : {
     if ($3) {
      break label$7
     }
     $6 = 0;
     break label$5;
    }
    $9 = $3 & 3 | 0;
    label$8 : {
     label$9 : {
      if (($3 + -1 | 0) >>> 0 >= 3 >>> 0) {
       break label$9
      }
      $6 = 0;
      $1 = $2;
      break label$8;
     }
     $10 = $3 & -4 | 0;
     $6 = 0;
     $1 = $2;
     label$10 : while (1) {
      $6 = ((($6 + ((HEAP8[$1 >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($1 + 1 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($1 + 2 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($1 + 3 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0;
      $1 = $1 + 4 | 0;
      $10 = $10 + -4 | 0;
      if ($10) {
       continue label$10
      }
      break label$10;
     };
    }
    if (!$9) {
     break label$5
    }
    label$11 : while (1) {
     $6 = $6 + ((HEAP8[$1 >> 0] | 0 | 0) > (-65 | 0)) | 0;
     $1 = $1 + 1 | 0;
     $9 = $9 + -1 | 0;
     if ($9) {
      continue label$11
     }
     break label$11;
    };
   }
   $8 = $6 + $8 | 0;
  }
  label$12 : {
   label$13 : {
    if (HEAP32[($0 + 8 | 0) >> 2] | 0) {
     break label$13
    }
    $1 = 1;
    if (_ZN4core3fmt9Formatter12pad_integral12write_prefix17h42baf2efff555885E($0 | 0, $7 | 0, $2 | 0, $3 | 0) | 0) {
     break label$12
    }
    return FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $4, $5) | 0 | 0;
   }
   label$14 : {
    label$15 : {
     label$16 : {
      label$17 : {
       label$18 : {
        $6 = HEAP32[($0 + 12 | 0) >> 2] | 0;
        if ($6 >>> 0 <= $8 >>> 0) {
         break label$18
        }
        if ((HEAPU8[$0 >> 0] | 0) & 8 | 0) {
         break label$14
        }
        $1 = 0;
        $9 = $6 - $8 | 0;
        $8 = $9;
        $6 = HEAPU8[($0 + 32 | 0) >> 0] | 0;
        switch ((($6 | 0) == (3 | 0) ? 1 : $6) & 3 | 0 | 0) {
        case 2:
         break label$16;
        case 1:
         break label$17;
        default:
         break label$15;
        };
       }
       $1 = 1;
       if (_ZN4core3fmt9Formatter12pad_integral12write_prefix17h42baf2efff555885E($0 | 0, $7 | 0, $2 | 0, $3 | 0) | 0) {
        break label$12
       }
       return FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $4, $5) | 0 | 0;
      }
      $8 = 0;
      $1 = $9;
      break label$15;
     }
     $1 = $9 >>> 1 | 0;
     $8 = ($9 + 1 | 0) >>> 1 | 0;
    }
    $1 = $1 + 1 | 0;
    $9 = HEAP32[($0 + 28 | 0) >> 2] | 0;
    $6 = HEAP32[($0 + 4 | 0) >> 2] | 0;
    $10 = HEAP32[($0 + 24 | 0) >> 2] | 0;
    label$19 : {
     label$20 : while (1) {
      $1 = $1 + -1 | 0;
      if (!$1) {
       break label$19
      }
      if (!(FUNCTION_TABLE[HEAP32[($9 + 16 | 0) >> 2] | 0 | 0]($10, $6) | 0)) {
       continue label$20
      }
      break label$20;
     };
     return 1 | 0;
    }
    $1 = 1;
    if (($6 | 0) == (1114112 | 0)) {
     break label$12
    }
    if (_ZN4core3fmt9Formatter12pad_integral12write_prefix17h42baf2efff555885E($0 | 0, $7 | 0, $2 | 0, $3 | 0) | 0) {
     break label$12
    }
    if (FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $4, $5) | 0) {
     break label$12
    }
    $9 = HEAP32[($0 + 28 | 0) >> 2] | 0;
    $0 = HEAP32[($0 + 24 | 0) >> 2] | 0;
    $1 = 0;
    label$21 : {
     label$22 : while (1) {
      label$23 : {
       if (($8 | 0) != ($1 | 0)) {
        break label$23
       }
       $1 = $8;
       break label$21;
      }
      $1 = $1 + 1 | 0;
      if (!(FUNCTION_TABLE[HEAP32[($9 + 16 | 0) >> 2] | 0 | 0]($0, $6) | 0)) {
       continue label$22
      }
      break label$22;
     };
     $1 = $1 + -1 | 0;
    }
    $1 = $1 >>> 0 < $8 >>> 0;
    break label$12;
   }
   $11 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   HEAP32[($0 + 4 | 0) >> 2] = 48;
   $12 = HEAPU8[($0 + 32 | 0) >> 0] | 0;
   $1 = 1;
   HEAP8[($0 + 32 | 0) >> 0] = 1;
   if (_ZN4core3fmt9Formatter12pad_integral12write_prefix17h42baf2efff555885E($0 | 0, $7 | 0, $2 | 0, $3 | 0) | 0) {
    break label$12
   }
   $1 = 0;
   $9 = $6 - $8 | 0;
   $3 = $9;
   label$24 : {
    label$25 : {
     label$26 : {
      $6 = HEAPU8[($0 + 32 | 0) >> 0] | 0;
      switch ((($6 | 0) == (3 | 0) ? 1 : $6) & 3 | 0 | 0) {
      case 2:
       break label$25;
      case 1:
       break label$26;
      default:
       break label$24;
      };
     }
     $3 = 0;
     $1 = $9;
     break label$24;
    }
    $1 = $9 >>> 1 | 0;
    $3 = ($9 + 1 | 0) >>> 1 | 0;
   }
   $1 = $1 + 1 | 0;
   $9 = HEAP32[($0 + 28 | 0) >> 2] | 0;
   $6 = HEAP32[($0 + 4 | 0) >> 2] | 0;
   $10 = HEAP32[($0 + 24 | 0) >> 2] | 0;
   label$27 : {
    label$28 : while (1) {
     $1 = $1 + -1 | 0;
     if (!$1) {
      break label$27
     }
     if (!(FUNCTION_TABLE[HEAP32[($9 + 16 | 0) >> 2] | 0 | 0]($10, $6) | 0)) {
      continue label$28
     }
     break label$28;
    };
    return 1 | 0;
   }
   $1 = 1;
   if (($6 | 0) == (1114112 | 0)) {
    break label$12
   }
   if (FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $4, $5) | 0) {
    break label$12
   }
   $1 = HEAP32[($0 + 28 | 0) >> 2] | 0;
   $10 = HEAP32[($0 + 24 | 0) >> 2] | 0;
   $9 = 0;
   label$29 : {
    label$30 : while (1) {
     if (($3 | 0) == ($9 | 0)) {
      break label$29
     }
     $9 = $9 + 1 | 0;
     if (!(FUNCTION_TABLE[HEAP32[($1 + 16 | 0) >> 2] | 0 | 0]($10, $6) | 0)) {
      continue label$30
     }
     break label$30;
    };
    $1 = 1;
    if (($9 + -1 | 0) >>> 0 < $3 >>> 0) {
     break label$12
    }
   }
   HEAP8[($0 + 32 | 0) >> 0] = $12;
   HEAP32[($0 + 4 | 0) >> 2] = $11;
   return 0 | 0;
  }
  return $1 | 0;
 }
 
 function _ZN4core3fmt5Write10write_char17h541c746737eec467E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 12 | 0) >> 2] = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if ($1 >>> 0 < 128 >>> 0) {
       break label$4
      }
      if ($1 >>> 0 < 2048 >>> 0) {
       break label$3
      }
      if ($1 >>> 0 >= 65536 >>> 0) {
       break label$2
      }
      HEAP8[($2 + 14 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
      HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 12 | 0 | 224 | 0;
      HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      $1 = 3;
      break label$1;
     }
     HEAP8[($2 + 12 | 0) >> 0] = $1;
     $1 = 1;
     break label$1;
    }
    HEAP8[($2 + 13 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
    HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 6 | 0 | 192 | 0;
    $1 = 2;
    break label$1;
   }
   HEAP8[($2 + 15 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
   HEAP8[($2 + 14 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 12 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 12 | 0) >> 0] = ($1 >>> 18 | 0) & 7 | 0 | 240 | 0;
   $1 = 4;
  }
  $1 = _ZN68_$LT$core__fmt__builders__PadAdapter$u20$as$u20$core__fmt__Write$GT$9write_str17hcf1464355de32109E($0 | 0, $2 + 12 | 0 | 0, $1 | 0) | 0;
  __stack_pointer = $2 + 16 | 0;
  return $1 | 0;
 }
 
 function _ZN4core3fmt5Write9write_fmt17hc4f89bad97591bfbE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $13 = 0, $19 = 0, $22 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = $0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $13 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $13;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $19 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $19;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $22 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $22;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1055712 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h0321d74a01f97c6dE($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  return _ZN68_$LT$core__fmt__builders__PadAdapter$u20$as$u20$core__fmt__Write$GT$9write_str17hcf1464355de32109E(HEAP32[$0 >> 2] | 0 | 0, $1 | 0, $2 | 0) | 0 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17h5e93c043e4ea9a67E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  $0 = HEAP32[$0 >> 2] | 0;
  HEAP32[($2 + 12 | 0) >> 2] = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if ($1 >>> 0 < 128 >>> 0) {
       break label$4
      }
      if ($1 >>> 0 < 2048 >>> 0) {
       break label$3
      }
      if ($1 >>> 0 >= 65536 >>> 0) {
       break label$2
      }
      HEAP8[($2 + 14 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
      HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 12 | 0 | 224 | 0;
      HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      $1 = 3;
      break label$1;
     }
     HEAP8[($2 + 12 | 0) >> 0] = $1;
     $1 = 1;
     break label$1;
    }
    HEAP8[($2 + 13 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
    HEAP8[($2 + 12 | 0) >> 0] = $1 >>> 6 | 0 | 192 | 0;
    $1 = 2;
    break label$1;
   }
   HEAP8[($2 + 15 | 0) >> 0] = $1 & 63 | 0 | 128 | 0;
   HEAP8[($2 + 14 | 0) >> 0] = ($1 >>> 6 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 13 | 0) >> 0] = ($1 >>> 12 | 0) & 63 | 0 | 128 | 0;
   HEAP8[($2 + 12 | 0) >> 0] = ($1 >>> 18 | 0) & 7 | 0 | 240 | 0;
   $1 = 4;
  }
  $1 = _ZN68_$LT$core__fmt__builders__PadAdapter$u20$as$u20$core__fmt__Write$GT$9write_str17hcf1464355de32109E($0 | 0, $2 + 12 | 0 | 0, $1 | 0) | 0;
  __stack_pointer = $2 + 16 | 0;
  return $1 | 0;
 }
 
 function _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17hb32926fa79eac353E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $14 = 0, $20 = 0, $23 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  HEAP32[($2 + 4 | 0) >> 2] = HEAP32[$0 >> 2] | 0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $14 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $14;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $20 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $20;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[($2 + 8 | 0) >> 2] = $23;
  HEAP32[($2 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($2 + 4 | 0 | 0, 1055712 | 0, $2 + 8 | 0 | 0) | 0;
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN4core3str5count14do_count_chars17hf88c7cdd09a667a7E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $7 = 0, $3 = 0, $8 = 0, $4 = 0, $6 = 0, $5 = 0, $10 = 0, $9 = 0, $139 = 0, $149 = 0, $159 = 0, $222 = 0, $232 = 0, $242 = 0;
  label$1 : {
   label$2 : {
    $2 = ($0 + 3 | 0) & -4 | 0;
    $3 = $2 - $0 | 0;
    if ($3 >>> 0 > $1 >>> 0) {
     break label$2
    }
    if ($3 >>> 0 > 4 >>> 0) {
     break label$2
    }
    $4 = $1 - $3 | 0;
    if ($4 >>> 0 < 4 >>> 0) {
     break label$2
    }
    $5 = $4 & 3 | 0;
    $6 = 0;
    $1 = 0;
    label$3 : {
     if (!$3) {
      break label$3
     }
     $7 = $3 & 3 | 0;
     label$4 : {
      label$5 : {
       if (($2 + ($0 ^ -1 | 0) | 0) >>> 0 >= 3 >>> 0) {
        break label$5
       }
       $1 = 0;
       $2 = $0;
       break label$4;
      }
      $8 = $3 & -4 | 0;
      $1 = 0;
      $2 = $0;
      label$6 : while (1) {
       $1 = ((($1 + ((HEAP8[$2 >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($2 + 1 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($2 + 2 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($2 + 3 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0;
       $2 = $2 + 4 | 0;
       $8 = $8 + -4 | 0;
       if ($8) {
        continue label$6
       }
       break label$6;
      };
     }
     if (!$7) {
      break label$3
     }
     label$7 : while (1) {
      $1 = $1 + ((HEAP8[$2 >> 0] | 0 | 0) > (-65 | 0)) | 0;
      $2 = $2 + 1 | 0;
      $7 = $7 + -1 | 0;
      if ($7) {
       continue label$7
      }
      break label$7;
     };
    }
    $0 = $0 + $3 | 0;
    label$8 : {
     if (!$5) {
      break label$8
     }
     $2 = $0 + ($4 & -4 | 0) | 0;
     $6 = (HEAP8[$2 >> 0] | 0 | 0) > (-65 | 0);
     if (($5 | 0) == (1 | 0)) {
      break label$8
     }
     $6 = $6 + ((HEAP8[($2 + 1 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0;
     if (($5 | 0) == (2 | 0)) {
      break label$8
     }
     $6 = $6 + ((HEAP8[($2 + 2 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0;
    }
    $3 = $4 >>> 2 | 0;
    $8 = $6 + $1 | 0;
    label$9 : while (1) {
     $6 = $0;
     if (!$3) {
      break label$1
     }
     $4 = $3 >>> 0 < 192 >>> 0 ? $3 : 192;
     $5 = $4 & 3 | 0;
     $9 = $4 << 2 | 0;
     label$10 : {
      label$11 : {
       $10 = $4 & 252 | 0;
       $0 = $10 << 2 | 0;
       if ($0) {
        break label$11
       }
       $2 = 0;
       break label$10;
      }
      $7 = $6 + $0 | 0;
      $2 = 0;
      $0 = $6;
      label$12 : while (1) {
       $1 = HEAP32[($0 + 12 | 0) >> 2] | 0;
       $139 = (($1 ^ -1 | 0) >>> 7 | 0 | ($1 >>> 6 | 0) | 0) & 16843009 | 0;
       $1 = HEAP32[($0 + 8 | 0) >> 2] | 0;
       $149 = (($1 ^ -1 | 0) >>> 7 | 0 | ($1 >>> 6 | 0) | 0) & 16843009 | 0;
       $1 = HEAP32[($0 + 4 | 0) >> 2] | 0;
       $159 = (($1 ^ -1 | 0) >>> 7 | 0 | ($1 >>> 6 | 0) | 0) & 16843009 | 0;
       $1 = HEAP32[$0 >> 2] | 0;
       $2 = $139 + ($149 + ($159 + (((($1 ^ -1 | 0) >>> 7 | 0 | ($1 >>> 6 | 0) | 0) & 16843009 | 0) + $2 | 0) | 0) | 0) | 0;
       $0 = $0 + 16 | 0;
       if (($0 | 0) != ($7 | 0)) {
        continue label$12
       }
       break label$12;
      };
     }
     $0 = $6 + $9 | 0;
     $3 = $3 - $4 | 0;
     $8 = (Math_imul((($2 >>> 8 | 0) & 16711935 | 0) + ($2 & 16711935 | 0) | 0, 65537) >>> 16 | 0) + $8 | 0;
     if (!$5) {
      continue label$9
     }
     break label$9;
    };
    $0 = $6 + ($10 << 2 | 0) | 0;
    $4 = $5 + 1073741823 | 0;
    $2 = $4 & 1073741823 | 0;
    $1 = $2 + 1 | 0;
    $3 = $1 & 3 | 0;
    label$13 : {
     label$14 : {
      if ($2 >>> 0 >= 3 >>> 0) {
       break label$14
      }
      $2 = 0;
      break label$13;
     }
     $1 = $1 & 2147483644 | 0;
     $2 = 0;
     label$15 : while (1) {
      $7 = HEAP32[($0 + 12 | 0) >> 2] | 0;
      $222 = (($7 ^ -1 | 0) >>> 7 | 0 | ($7 >>> 6 | 0) | 0) & 16843009 | 0;
      $7 = HEAP32[($0 + 8 | 0) >> 2] | 0;
      $232 = (($7 ^ -1 | 0) >>> 7 | 0 | ($7 >>> 6 | 0) | 0) & 16843009 | 0;
      $7 = HEAP32[($0 + 4 | 0) >> 2] | 0;
      $242 = (($7 ^ -1 | 0) >>> 7 | 0 | ($7 >>> 6 | 0) | 0) & 16843009 | 0;
      $7 = HEAP32[$0 >> 2] | 0;
      $2 = $222 + ($232 + ($242 + (((($7 ^ -1 | 0) >>> 7 | 0 | ($7 >>> 6 | 0) | 0) & 16843009 | 0) + $2 | 0) | 0) | 0) | 0;
      $0 = $0 + 16 | 0;
      $1 = $1 + -4 | 0;
      if ($1) {
       continue label$15
      }
      break label$15;
     };
    }
    label$16 : {
     if (!$3) {
      break label$16
     }
     $1 = $4 + -1073741823 | 0;
     label$17 : while (1) {
      $7 = HEAP32[$0 >> 2] | 0;
      $2 = ((($7 ^ -1 | 0) >>> 7 | 0 | ($7 >>> 6 | 0) | 0) & 16843009 | 0) + $2 | 0;
      $0 = $0 + 4 | 0;
      $1 = $1 + -1 | 0;
      if ($1) {
       continue label$17
      }
      break label$17;
     };
    }
    return (Math_imul((($2 >>> 8 | 0) & 16711935 | 0) + ($2 & 16711935 | 0) | 0, 65537) >>> 16 | 0) + $8 | 0 | 0;
   }
   label$18 : {
    if ($1) {
     break label$18
    }
    return 0 | 0;
   }
   $2 = $1 & 3 | 0;
   label$19 : {
    label$20 : {
     if (($1 + -1 | 0) >>> 0 >= 3 >>> 0) {
      break label$20
     }
     $8 = 0;
     break label$19;
    }
    $1 = $1 & -4 | 0;
    $8 = 0;
    label$21 : while (1) {
     $8 = ((($8 + ((HEAP8[$0 >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($0 + 1 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($0 + 2 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0) + ((HEAP8[($0 + 3 | 0) >> 0] | 0 | 0) > (-65 | 0)) | 0;
     $0 = $0 + 4 | 0;
     $1 = $1 + -4 | 0;
     if ($1) {
      continue label$21
     }
     break label$21;
    };
   }
   if (!$2) {
    break label$1
   }
   label$22 : while (1) {
    $8 = $8 + ((HEAP8[$0 >> 0] | 0 | 0) > (-65 | 0)) | 0;
    $0 = $0 + 1 | 0;
    $2 = $2 + -1 | 0;
    if ($2) {
     continue label$22
    }
    break label$22;
   };
  }
  return $8 | 0;
 }
 
 function _ZN4core3fmt9Formatter12pad_integral12write_prefix17h42baf2efff555885E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     if (($1 | 0) == (1114112 | 0)) {
      break label$3
     }
     $4 = 1;
     if (FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 16 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $1) | 0) {
      break label$2
     }
    }
    if ($2) {
     break label$1
    }
    $4 = 0;
   }
   return $4 | 0;
  }
  return FUNCTION_TABLE[HEAP32[((HEAP32[($0 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($0 + 24 | 0) >> 2] | 0, $2, $3) | 0 | 0;
 }
 
 function _ZN4core3fmt9Formatter9write_fmt17h32544406667db88aE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $2 = 0, $3 = 0, $17 = 0, $23 = 0, $26 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  $3 = HEAP32[($0 + 28 | 0) >> 2] | 0;
  $0 = HEAP32[($0 + 24 | 0) >> 2] | 0;
  i64toi32_i32$2 = $1 + 16 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $17 = i64toi32_i32$0;
  i64toi32_i32$0 = ($2 + 8 | 0) + 16 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $17;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$2 = $1 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23 = i64toi32_i32$1;
  i64toi32_i32$1 = ($2 + 8 | 0) + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $23;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$2 = $1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $26 = i64toi32_i32$0;
  i64toi32_i32$0 = $2;
  HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = $26;
  HEAP32[(i64toi32_i32$0 + 12 | 0) >> 2] = i64toi32_i32$1;
  $1 = _ZN4core3fmt5write17h6461900980c16fcdE($0 | 0, $3 | 0, i64toi32_i32$0 + 8 | 0 | 0) | 0;
  __stack_pointer = i64toi32_i32$0 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN4core3fmt9Formatter15debug_lower_hex17h0aa615ed79f38ab7E($0) {
  $0 = $0 | 0;
  return ((HEAPU8[$0 >> 0] | 0) & 16 | 0) >>> 4 | 0 | 0;
 }
 
 function _ZN4core3fmt9Formatter15debug_upper_hex17h4a32746d7a339cc5E($0) {
  $0 = $0 | 0;
  return ((HEAPU8[$0 >> 0] | 0) & 32 | 0) >>> 5 | 0 | 0;
 }
 
 function _ZN4core3fmt9Formatter12debug_struct17h4e73711e0f9f87d6E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $2 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, $2, $3) | 0;
  HEAP8[($0 + 5 | 0) >> 0] = 0;
  HEAP8[($0 + 4 | 0) >> 0] = $2;
  HEAP32[$0 >> 2] = $1;
 }
 
 function _ZN43_$LT$bool$u20$as$u20$core__fmt__Display$GT$3fmt17h17a585dfee3be824E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  label$1 : {
   if (HEAPU8[$0 >> 0] | 0) {
    break label$1
   }
   return _ZN4core3fmt9Formatter3pad17h88c30040786a4792E($1 | 0, 1055740 | 0, 5 | 0) | 0 | 0;
  }
  return _ZN4core3fmt9Formatter3pad17h88c30040786a4792E($1 | 0, 1055736 | 0, 4 | 0) | 0 | 0;
 }
 
 function _ZN4core7unicode12unicode_data15grapheme_extend6lookup17hff5676ae9e34b968E($0) {
  $0 = $0 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $1 = 0;
  $1 = $0 << 11 | 0;
  $2 = 0;
  $3 = 32;
  $4 = 32;
  label$1 : {
   label$2 : {
    label$3 : while (1) {
     label$4 : {
      label$5 : {
       $3 = ($3 >>> 1 | 0) + $2 | 0;
       $5 = (HEAP32[(($3 << 2 | 0) + 1058156 | 0) >> 2] | 0) << 11 | 0;
       if ($5 >>> 0 < $1 >>> 0) {
        break label$5
       }
       if (($5 | 0) == ($1 | 0)) {
        break label$2
       }
       $4 = $3;
       break label$4;
      }
      $2 = $3 + 1 | 0;
     }
     $3 = $4 - $2 | 0;
     if ($4 >>> 0 > $2 >>> 0) {
      continue label$3
     }
     break label$1;
    };
   }
   $2 = $3 + 1 | 0;
  }
  label$6 : {
   label$7 : {
    label$8 : {
     if ($2 >>> 0 > 31 >>> 0) {
      break label$8
     }
     $3 = $2 << 2 | 0;
     $4 = 707;
     label$9 : {
      if (($2 | 0) == (31 | 0)) {
       break label$9
      }
      $4 = (HEAP32[($3 + 1058160 | 0) >> 2] | 0) >>> 21 | 0;
     }
     $1 = 0;
     label$10 : {
      $5 = $2 + -1 | 0;
      if ($5 >>> 0 > $2 >>> 0) {
       break label$10
      }
      if ($5 >>> 0 >= 32 >>> 0) {
       break label$7
      }
      $1 = (HEAP32[(($5 << 2 | 0) + 1058156 | 0) >> 2] | 0) & 2097151 | 0;
     }
     label$11 : {
      $2 = (HEAP32[($3 + 1058156 | 0) >> 2] | 0) >>> 21 | 0;
      if (!($4 + ($2 ^ -1 | 0) | 0)) {
       break label$11
      }
      $1 = $0 - $1 | 0;
      $3 = $2 >>> 0 > 707 >>> 0 ? $2 : 707;
      $5 = $4 + -1 | 0;
      $4 = 0;
      label$12 : while (1) {
       if (($3 | 0) == ($2 | 0)) {
        break label$6
       }
       $4 = $4 + (HEAPU8[($2 + 1058284 | 0) >> 0] | 0) | 0;
       if ($4 >>> 0 > $1 >>> 0) {
        break label$11
       }
       $2 = $2 + 1 | 0;
       if (($5 | 0) != ($2 | 0)) {
        continue label$12
       }
       break label$12;
      };
      $2 = $5;
     }
     return $2 & 1 | 0 | 0;
    }
    _ZN4core9panicking18panic_bounds_check17h6173caa48eb1b6ceE($2 | 0, 32 | 0, 1058036 | 0);
    abort();
   }
   _ZN4core9panicking18panic_bounds_check17h6173caa48eb1b6ceE($5 | 0, 32 | 0, 1058068 | 0);
   abort();
  }
  _ZN4core9panicking18panic_bounds_check17h6173caa48eb1b6ceE($3 | 0, 707 | 0, 1058052 | 0);
  abort();
 }
 
 function _ZN4core7unicode9printable12is_printable17hf3d1662ddfe7309dE($0) {
  $0 = $0 | 0;
  var $1 = 0;
  label$1 : {
   if ($0 >>> 0 >= 32 >>> 0) {
    break label$1
   }
   return 0 | 0;
  }
  $1 = 1;
  label$2 : {
   label$3 : {
    if ($0 >>> 0 < 127 >>> 0) {
     break label$3
    }
    if ($0 >>> 0 < 65536 >>> 0) {
     break label$2
    }
    label$4 : {
     label$5 : {
      if ($0 >>> 0 < 131072 >>> 0) {
       break label$5
      }
      label$6 : {
       if (($0 + -201547 | 0) >>> 0 >= 716213 >>> 0) {
        break label$6
       }
       return 0 | 0;
      }
      label$7 : {
       if (($0 + -195102 | 0) >>> 0 >= 1506 >>> 0) {
        break label$7
       }
       return 0 | 0;
      }
      label$8 : {
       if (($0 + -191457 | 0) >>> 0 >= 3103 >>> 0) {
        break label$8
       }
       return 0 | 0;
      }
      label$9 : {
       if (($0 + -183970 | 0) >>> 0 >= 14 >>> 0) {
        break label$9
       }
       return 0 | 0;
      }
      label$10 : {
       if (($0 & -2 | 0 | 0) != (178206 | 0)) {
        break label$10
       }
       return 0 | 0;
      }
      if (($0 & -32 | 0 | 0) != (173792 | 0)) {
       break label$4
      }
      return 0 | 0;
     }
     return _ZN4core7unicode9printable5check17hca26a3e687538472E($0 | 0, 1057279 | 0, 42 | 0, 1057363 | 0, 192 | 0, 1057555 | 0, 438 | 0) | 0 | 0;
    }
    $1 = 0;
    if (($0 + -177977 | 0) >>> 0 < 7 >>> 0) {
     break label$3
    }
    $1 = ($0 + -1114112 | 0) >>> 0 < -196112 >>> 0;
   }
   return $1 | 0;
  }
  return _ZN4core7unicode9printable5check17hca26a3e687538472E($0 | 0, 1056608 | 0, 40 | 0, 1056688 | 0, 288 | 0, 1056976 | 0, 303 | 0) | 0 | 0;
 }
 
 function _ZN42_$LT$str$u20$as$u20$core__fmt__Display$GT$3fmt17had6f7bdb177482f0E($0, $1, $2) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  return _ZN4core3fmt9Formatter3pad17h88c30040786a4792E($2 | 0, $0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN41_$LT$char$u20$as$u20$core__fmt__Debug$GT$3fmt17hf6ec58de099f6c9eE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$3 = 0, i64toi32_i32$2 = 0, $6 = 0, $6$hi = 0, i64toi32_i32$5 = 0, $5 = 0, i64toi32_i32$4 = 0, $3 = 0, $4 = 0, $2 = 0, $18 = 0, $7 = 0, $79 = 0, $79$hi = 0, $81$hi = 0;
  $2 = 1;
  label$1 : {
   $3 = HEAP32[($1 + 24 | 0) >> 2] | 0;
   $4 = HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 16 | 0) >> 2] | 0;
   if (FUNCTION_TABLE[$4 | 0]($3, 39) | 0) {
    break label$1
   }
   $1 = 2;
   $5 = 48;
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$8 : {
          label$9 : {
           label$10 : {
            $0 = HEAP32[$0 >> 2] | 0;
            switch ($0 | 0) {
            case 0:
             break label$2;
            case 39:
             break label$5;
            case 10:
             break label$6;
            case 13:
             break label$7;
            case 9:
             break label$8;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 11:
            case 12:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
            case 30:
            case 31:
            case 32:
            case 33:
            case 34:
            case 35:
            case 36:
            case 37:
            case 38:
             break label$9;
            default:
             break label$10;
            };
           }
           if (($0 | 0) == (92 | 0)) {
            break label$5
           }
          }
          if (!(_ZN4core7unicode12unicode_data15grapheme_extend6lookup17hff5676ae9e34b968E($0 | 0) | 0)) {
           break label$4
          }
          i64toi32_i32$0 = 0;
          i64toi32_i32$2 = (Math_clz32($0 | 1 | 0) >>> 2 | 0) ^ 7 | 0;
          i64toi32_i32$1 = 5;
          i64toi32_i32$3 = 0;
          i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
          $6 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
          $6$hi = i64toi32_i32$1;
          break label$3;
         }
         $5 = 116;
         $1 = 2;
         break label$2;
        }
        $5 = 114;
        $1 = 2;
        break label$2;
       }
       $5 = 110;
       $1 = 2;
       break label$2;
      }
      $1 = 2;
      $5 = $0;
      break label$2;
     }
     label$11 : {
      if (!(_ZN4core7unicode9printable12is_printable17hf3d1662ddfe7309dE($0 | 0) | 0)) {
       break label$11
      }
      $1 = 1;
      $5 = $0;
      break label$2;
     }
     i64toi32_i32$1 = 0;
     i64toi32_i32$0 = (Math_clz32($0 | 1 | 0) >>> 2 | 0) ^ 7 | 0;
     i64toi32_i32$2 = 5;
     i64toi32_i32$3 = 0;
     i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
     $6 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
     $6$hi = i64toi32_i32$2;
    }
    $1 = 3;
    $5 = $0;
   }
   label$12 : while (1) {
    $7 = $1;
    $1 = 0;
    $0 = $5;
    label$13 : {
     label$14 : {
      label$15 : {
       label$16 : {
        label$17 : {
         switch ($7 | 0) {
         case 1:
          break label$13;
         case 2:
          break label$15;
         case 3:
          break label$17;
         default:
          break label$16;
         };
        }
        label$18 : {
         label$19 : {
          label$20 : {
           label$21 : {
            label$22 : {
             i64toi32_i32$2 = $6$hi;
             i64toi32_i32$1 = $6;
             i64toi32_i32$0 = 0;
             i64toi32_i32$3 = 32;
             i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
             if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
              i64toi32_i32$0 = 0;
              $18 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
             } else {
              i64toi32_i32$0 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
              $18 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$1 >>> i64toi32_i32$4 | 0) | 0;
             }
             switch ($18 & 255 | 0 | 0) {
             case 2:
              break label$18;
             case 5:
              break label$19;
             case 4:
              break label$20;
             case 3:
              break label$21;
             case 1:
              break label$22;
             default:
              break label$16;
             };
            }
            i64toi32_i32$0 = $6$hi;
            i64toi32_i32$2 = $6;
            i64toi32_i32$1 = -256;
            i64toi32_i32$3 = -1;
            i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
            $6 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
            $6$hi = i64toi32_i32$1;
            $0 = 125;
            $1 = 3;
            break label$13;
           }
           i64toi32_i32$1 = $6$hi;
           i64toi32_i32$0 = $6;
           i64toi32_i32$2 = -256;
           i64toi32_i32$3 = -1;
           i64toi32_i32$2 = i64toi32_i32$1 & i64toi32_i32$2 | 0;
           i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$3 | 0;
           i64toi32_i32$0 = 2;
           i64toi32_i32$3 = 0;
           i64toi32_i32$0 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
           $6 = i64toi32_i32$1 | i64toi32_i32$3 | 0;
           $6$hi = i64toi32_i32$0;
           $0 = 123;
           $1 = 3;
           break label$13;
          }
          i64toi32_i32$0 = $6$hi;
          i64toi32_i32$2 = $6;
          i64toi32_i32$1 = -256;
          i64toi32_i32$3 = -1;
          i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
          i64toi32_i32$0 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
          i64toi32_i32$2 = 3;
          i64toi32_i32$3 = 0;
          i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
          $6 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
          $6$hi = i64toi32_i32$2;
          $0 = 117;
          $1 = 3;
          break label$13;
         }
         i64toi32_i32$2 = $6$hi;
         i64toi32_i32$1 = $6;
         i64toi32_i32$0 = -256;
         i64toi32_i32$3 = -1;
         i64toi32_i32$0 = i64toi32_i32$2 & i64toi32_i32$0 | 0;
         i64toi32_i32$2 = i64toi32_i32$1 & i64toi32_i32$3 | 0;
         i64toi32_i32$1 = 4;
         i64toi32_i32$3 = 0;
         i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
         $6 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
         $6$hi = i64toi32_i32$1;
         $0 = 92;
         $1 = 3;
         break label$13;
        }
        i64toi32_i32$1 = $6$hi;
        $1 = $6;
        $0 = ($5 >>> ($6 << 2 | 0) | 0) & 15 | 0;
        $0 = ($0 >>> 0 < 10 >>> 0 ? 48 : 87) + $0 | 0;
        if (!$6) {
         break label$14
        }
        i64toi32_i32$1 = $6$hi;
        i64toi32_i32$0 = $6;
        i64toi32_i32$2 = -1;
        i64toi32_i32$3 = -1;
        i64toi32_i32$4 = i64toi32_i32$0 + i64toi32_i32$3 | 0;
        i64toi32_i32$5 = i64toi32_i32$1 + i64toi32_i32$2 | 0;
        if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) {
         i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
        }
        i64toi32_i32$1 = i64toi32_i32$4;
        i64toi32_i32$0 = 0;
        i64toi32_i32$3 = -1;
        i64toi32_i32$0 = i64toi32_i32$5 & i64toi32_i32$0 | 0;
        $79 = i64toi32_i32$1 & i64toi32_i32$3 | 0;
        $79$hi = i64toi32_i32$0;
        i64toi32_i32$0 = $6$hi;
        i64toi32_i32$5 = $6;
        i64toi32_i32$1 = -1;
        i64toi32_i32$3 = 0;
        i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
        $81$hi = i64toi32_i32$1;
        i64toi32_i32$1 = $79$hi;
        i64toi32_i32$0 = $79;
        i64toi32_i32$5 = $81$hi;
        i64toi32_i32$3 = $6 & i64toi32_i32$3 | 0;
        i64toi32_i32$5 = i64toi32_i32$1 | i64toi32_i32$5 | 0;
        $6 = i64toi32_i32$0 | i64toi32_i32$3 | 0;
        $6$hi = i64toi32_i32$5;
        $1 = 3;
        break label$13;
       }
       $2 = FUNCTION_TABLE[$4 | 0]($3, 39) | 0;
       break label$1;
      }
      $0 = 92;
      $1 = 1;
      break label$13;
     }
     i64toi32_i32$5 = $6$hi;
     i64toi32_i32$5 = $6$hi;
     i64toi32_i32$1 = $6;
     i64toi32_i32$0 = -256;
     i64toi32_i32$3 = -1;
     i64toi32_i32$0 = $6$hi & i64toi32_i32$0 | 0;
     i64toi32_i32$5 = i64toi32_i32$1 & i64toi32_i32$3 | 0;
     i64toi32_i32$1 = 1;
     i64toi32_i32$3 = 0;
     i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
     $6 = i64toi32_i32$5 | i64toi32_i32$3 | 0;
     $6$hi = i64toi32_i32$1;
     $1 = 3;
    }
    if (!(FUNCTION_TABLE[$4 | 0]($3, $0) | 0)) {
     continue label$12
    }
    break label$12;
   };
  }
  return $2 | 0;
 }
 
 function _ZN4core5slice6memchr7memrchr17h81dd29bac10486f7E($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $6 = 0, $7 = 0, $10 = 0, $9 = 0, $5 = 0, $8 = 0, $4 = 0;
  $4 = (($2 + 3 | 0) & -4 | 0) - $2 | 0;
  $5 = $3 >>> 0 < $4 >>> 0;
  $6 = $5 ? 0 : ($3 - $4 | 0) & 7 | 0;
  $7 = $3 - $6 | 0;
  label$1 : {
   label$2 : {
    if ($3 >>> 0 < $6 >>> 0) {
     break label$2
    }
    label$3 : {
     label$4 : {
      label$5 : {
       if (!$6) {
        break label$5
       }
       $6 = $2 + $3 | 0;
       $8 = $2 + $7 | 0;
       $9 = $6 - $8 | 0;
       label$6 : {
        $10 = $6 + -1 | 0;
        if ((HEAPU8[$10 >> 0] | 0 | 0) != ($1 & 255 | 0 | 0)) {
         break label$6
        }
        $6 = ($9 + -1 | 0) + $7 | 0;
        break label$4;
       }
       if (($8 | 0) == ($10 | 0)) {
        break label$5
       }
       label$7 : {
        $10 = $6 + -2 | 0;
        if ((HEAPU8[$10 >> 0] | 0 | 0) != ($1 & 255 | 0 | 0)) {
         break label$7
        }
        $6 = ($9 + -2 | 0) + $7 | 0;
        break label$4;
       }
       if (($8 | 0) == ($10 | 0)) {
        break label$5
       }
       label$8 : {
        $10 = $6 + -3 | 0;
        if ((HEAPU8[$10 >> 0] | 0 | 0) != ($1 & 255 | 0 | 0)) {
         break label$8
        }
        $6 = ($9 + -3 | 0) + $7 | 0;
        break label$4;
       }
       if (($8 | 0) == ($10 | 0)) {
        break label$5
       }
       label$9 : {
        $10 = $6 + -4 | 0;
        if ((HEAPU8[$10 >> 0] | 0 | 0) != ($1 & 255 | 0 | 0)) {
         break label$9
        }
        $6 = ($9 + -4 | 0) + $7 | 0;
        break label$4;
       }
       if (($8 | 0) == ($10 | 0)) {
        break label$5
       }
       label$10 : {
        $10 = $6 + -5 | 0;
        if ((HEAPU8[$10 >> 0] | 0 | 0) != ($1 & 255 | 0 | 0)) {
         break label$10
        }
        $6 = ($9 + -5 | 0) + $7 | 0;
        break label$4;
       }
       if (($8 | 0) == ($10 | 0)) {
        break label$5
       }
       label$11 : {
        $10 = $6 + -6 | 0;
        if ((HEAPU8[$10 >> 0] | 0 | 0) != ($1 & 255 | 0 | 0)) {
         break label$11
        }
        $6 = ($9 + -6 | 0) + $7 | 0;
        break label$4;
       }
       if (($8 | 0) == ($10 | 0)) {
        break label$5
       }
       label$12 : {
        $6 = $6 + -7 | 0;
        if ((HEAPU8[$6 >> 0] | 0 | 0) != ($1 & 255 | 0 | 0)) {
         break label$12
        }
        $6 = ($9 + -7 | 0) + $7 | 0;
        break label$4;
       }
       if (($8 | 0) == ($6 | 0)) {
        break label$5
       }
       $6 = ($9 + -8 | 0) + $7 | 0;
       break label$4;
      }
      $8 = $5 ? $3 : $4;
      $4 = Math_imul($1 & 255 | 0, 16843009);
      label$13 : {
       label$14 : while (1) {
        $6 = $7;
        if ($6 >>> 0 <= $8 >>> 0) {
         break label$13
        }
        $7 = $6 + -8 | 0;
        $5 = $2 + $6 | 0;
        $9 = (HEAP32[($5 + -8 | 0) >> 2] | 0) ^ $4 | 0;
        $5 = (HEAP32[($5 + -4 | 0) >> 2] | 0) ^ $4 | 0;
        if (!((($9 ^ -1 | 0) & ($9 + -16843009 | 0) | 0 | (($5 ^ -1 | 0) & ($5 + -16843009 | 0) | 0) | 0) & -2139062144 | 0)) {
         continue label$14
        }
        break label$14;
       };
      }
      if ($6 >>> 0 > $3 >>> 0) {
       break label$1
      }
      $4 = $2 + -1 | 0;
      $5 = $1 & 255 | 0;
      label$15 : while (1) {
       label$16 : {
        if ($6) {
         break label$16
        }
        $7 = 0;
        break label$3;
       }
       $7 = $4 + $6 | 0;
       $6 = $6 + -1 | 0;
       if ((HEAPU8[$7 >> 0] | 0 | 0) != ($5 | 0)) {
        continue label$15
       }
       break label$15;
      };
     }
     $7 = 1;
    }
    HEAP32[($0 + 4 | 0) >> 2] = $6;
    HEAP32[$0 >> 2] = $7;
    return;
   }
   _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($7 | 0, $3 | 0, $6 | 0);
   abort();
  }
  _ZN4core5slice5index24slice_end_index_len_fail17h27705fedb298ed88E($6 | 0, $3 | 0, $6 | 0);
  abort();
 }
 
 function _ZN4core7unicode9printable5check17hca26a3e687538472E($0, $1, $2, $3, $4, $5, $6) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  $4 = $4 | 0;
  $5 = $5 | 0;
  $6 = $6 | 0;
  var $10 = 0, $13 = 0, $7 = 0, $11 = 0, $8 = 0, $9 = 0, $12 = 0;
  $7 = 1;
  label$1 : {
   label$2 : {
    if (!$2) {
     break label$2
    }
    $8 = $1 + ($2 << 1 | 0) | 0;
    $9 = ($0 & 65280 | 0) >>> 8 | 0;
    $10 = 0;
    $11 = $0 & 255 | 0;
    label$3 : {
     label$4 : while (1) {
      $12 = $1 + 2 | 0;
      $2 = HEAPU8[($1 + 1 | 0) >> 0] | 0;
      $13 = $10 + $2 | 0;
      label$5 : {
       $1 = HEAPU8[$1 >> 0] | 0;
       if (($1 | 0) == ($9 | 0)) {
        break label$5
       }
       if ($1 >>> 0 > $9 >>> 0) {
        break label$2
       }
       $10 = $13;
       $1 = $12;
       if (($1 | 0) != ($8 | 0)) {
        continue label$4
       }
       break label$2;
      }
      label$6 : {
       if ($13 >>> 0 < $10 >>> 0) {
        break label$6
       }
       if ($13 >>> 0 > $4 >>> 0) {
        break label$3
       }
       $1 = $3 + $10 | 0;
       label$7 : {
        label$8 : while (1) {
         if (!$2) {
          break label$7
         }
         $2 = $2 + -1 | 0;
         $10 = HEAPU8[$1 >> 0] | 0;
         $1 = $1 + 1 | 0;
         if (($10 | 0) != ($11 | 0)) {
          continue label$8
         }
         break label$8;
        };
        $7 = 0;
        break label$1;
       }
       $10 = $13;
       $1 = $12;
       if (($1 | 0) != ($8 | 0)) {
        continue label$4
       }
       break label$2;
      }
      break label$4;
     };
     _ZN4core5slice5index22slice_index_order_fail17h78715c680d488b78E($10 | 0, $13 | 0, $2 | 0);
     abort();
    }
    _ZN4core5slice5index24slice_end_index_len_fail17h27705fedb298ed88E($13 | 0, $4 | 0, $2 | 0);
    abort();
   }
   if (!$6) {
    break label$1
   }
   $11 = $5 + $6 | 0;
   $1 = $0 & 65535 | 0;
   $7 = 1;
   label$9 : {
    label$10 : while (1) {
     $10 = $5 + 1 | 0;
     label$11 : {
      label$12 : {
       $2 = HEAPU8[$5 >> 0] | 0;
       $13 = ($2 << 24 | 0) >> 24 | 0;
       if (($13 | 0) < (0 | 0)) {
        break label$12
       }
       $5 = $10;
       break label$11;
      }
      if (($10 | 0) == ($11 | 0)) {
       break label$9
      }
      $2 = ($13 & 127 | 0) << 8 | 0 | (HEAPU8[($5 + 1 | 0) >> 0] | 0) | 0;
      $5 = $5 + 2 | 0;
     }
     $1 = $1 - $2 | 0;
     if (($1 | 0) < (0 | 0)) {
      break label$1
     }
     $7 = $7 ^ 1 | 0;
     if (($5 | 0) != ($11 | 0)) {
      continue label$10
     }
     break label$1;
    };
   }
   _ZN4core9panicking5panic17hd987aee4d3a1bda7E(1055144 | 0, 43 | 0, 1056592 | 0);
   abort();
  }
  return $7 & 1 | 0 | 0;
 }
 
 function _ZN4core3fmt3num53_$LT$impl$u20$core__fmt__LowerHex$u20$for$u20$i32$GT$3fmt17hf201c6e79ac3d9a7E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $3 = 0, $2 = 0, $4 = 0;
  $2 = __stack_pointer - 128 | 0;
  __stack_pointer = $2;
  $0 = HEAP32[$0 >> 2] | 0;
  $3 = 0;
  label$1 : while (1) {
   $4 = $0 & 15 | 0;
   HEAP8[(($2 + $3 | 0) + 127 | 0) >> 0] = ($4 >>> 0 < 10 >>> 0 ? 48 : 87) + $4 | 0;
   $3 = $3 + -1 | 0;
   $4 = $0 >>> 0 > 15 >>> 0;
   $0 = $0 >>> 4 | 0;
   if ($4) {
    continue label$1
   }
   break label$1;
  };
  label$2 : {
   $0 = $3 + 128 | 0;
   if ($0 >>> 0 < 129 >>> 0) {
    break label$2
   }
   _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($0 | 0, 128 | 0, $0 | 0);
   abort();
  }
  $0 = _ZN4core3fmt9Formatter12pad_integral17h07bec98d9f428dc7E($1 | 0, 1 | 0, 1055508 | 0, 2 | 0, ($2 + $3 | 0) + 128 | 0 | 0, 0 - $3 | 0 | 0) | 0;
  __stack_pointer = $2 + 128 | 0;
  return $0 | 0;
 }
 
 function _ZN4core3fmt3num49_$LT$impl$u20$core__fmt__Debug$u20$for$u20$u8$GT$3fmt17h04e6a6dabadeca41E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $3 = 0, $4 = 0, $2 = 0, i64toi32_i32$1 = 0;
  $2 = __stack_pointer - 128 | 0;
  __stack_pointer = $2;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       $3 = HEAP32[$1 >> 2] | 0;
       if ($3 & 16 | 0) {
        break label$5
       }
       if ($3 & 32 | 0) {
        break label$4
       }
       i64toi32_i32$1 = 0;
       $0 = _ZN4core3fmt3num3imp7fmt_u6417hbcc4e9eaf34213beE(HEAPU8[$0 >> 0] | 0 | 0, i64toi32_i32$1 | 0, 1 | 0, $1 | 0) | 0;
       break label$1;
      }
      $3 = HEAPU8[$0 >> 0] | 0;
      $0 = 0;
      label$6 : while (1) {
       $4 = $3 & 15 | 0;
       HEAP8[(($2 + $0 | 0) + 127 | 0) >> 0] = ($4 >>> 0 < 10 >>> 0 ? 48 : 87) + $4 | 0;
       $0 = $0 + -1 | 0;
       $4 = $3 & 255 | 0;
       $3 = $4 >>> 4 | 0;
       if ($4 >>> 0 > 15 >>> 0) {
        continue label$6
       }
       break label$6;
      };
      $3 = $0 + 128 | 0;
      if ($3 >>> 0 >= 129 >>> 0) {
       break label$3
      }
      $0 = _ZN4core3fmt9Formatter12pad_integral17h07bec98d9f428dc7E($1 | 0, 1 | 0, 1055508 | 0, 2 | 0, ($2 + $0 | 0) + 128 | 0 | 0, 0 - $0 | 0 | 0) | 0;
      break label$1;
     }
     $3 = HEAPU8[$0 >> 0] | 0;
     $0 = 0;
     label$7 : while (1) {
      $4 = $3 & 15 | 0;
      HEAP8[(($2 + $0 | 0) + 127 | 0) >> 0] = ($4 >>> 0 < 10 >>> 0 ? 48 : 55) + $4 | 0;
      $0 = $0 + -1 | 0;
      $4 = $3 & 255 | 0;
      $3 = $4 >>> 4 | 0;
      if ($4 >>> 0 > 15 >>> 0) {
       continue label$7
      }
      break label$7;
     };
     $3 = $0 + 128 | 0;
     if ($3 >>> 0 >= 129 >>> 0) {
      break label$2
     }
     $0 = _ZN4core3fmt9Formatter12pad_integral17h07bec98d9f428dc7E($1 | 0, 1 | 0, 1055508 | 0, 2 | 0, ($2 + $0 | 0) + 128 | 0 | 0, 0 - $0 | 0 | 0) | 0;
     break label$1;
    }
    _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($3 | 0, 128 | 0, $0 | 0);
    abort();
   }
   _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($3 | 0, 128 | 0, $0 | 0);
   abort();
  }
  __stack_pointer = $2 + 128 | 0;
  return $0 | 0;
 }
 
 function _ZN4core3fmt3num3imp7fmt_u6417hbcc4e9eaf34213beE($0, $0$hi, $1, $2) {
  $0 = $0 | 0;
  $0$hi = $0$hi | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  var i64toi32_i32$2 = 0, $4 = 0, $6 = 0, i64toi32_i32$0 = 0, $3 = 0, i64toi32_i32$1 = 0, $5 = 0, i64toi32_i32$3 = 0, $5$hi = 0, i64toi32_i32$5 = 0, $7 = 0, $8 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $25 = 0, $25$hi = 0;
  $3 = __stack_pointer - 48 | 0;
  __stack_pointer = $3;
  $4 = 39;
  label$1 : {
   label$2 : {
    i64toi32_i32$0 = $0$hi;
    i64toi32_i32$2 = $0;
    i64toi32_i32$1 = 0;
    i64toi32_i32$3 = 1e4;
    if (i64toi32_i32$0 >>> 0 > i64toi32_i32$1 >>> 0 | ((i64toi32_i32$0 | 0) == (i64toi32_i32$1 | 0) & i64toi32_i32$2 >>> 0 >= i64toi32_i32$3 >>> 0 | 0) | 0) {
     break label$2
    }
    i64toi32_i32$2 = $0$hi;
    $5 = $0;
    $5$hi = i64toi32_i32$2;
    break label$1;
   }
   $4 = 39;
   label$3 : while (1) {
    $6 = ($3 + 9 | 0) + $4 | 0;
    i64toi32_i32$2 = $0$hi;
    i64toi32_i32$0 = 0;
    i64toi32_i32$0 = __wasm_i64_udiv($0 | 0, i64toi32_i32$2 | 0, 1e4 | 0, i64toi32_i32$0 | 0) | 0;
    i64toi32_i32$2 = i64toi32_i32$HIGH_BITS;
    $5 = i64toi32_i32$0;
    $5$hi = i64toi32_i32$2;
    i64toi32_i32$0 = 0;
    i64toi32_i32$0 = __wasm_i64_mul($5 | 0, i64toi32_i32$2 | 0, 1e4 | 0, i64toi32_i32$0 | 0) | 0;
    i64toi32_i32$2 = i64toi32_i32$HIGH_BITS;
    $25 = i64toi32_i32$0;
    $25$hi = i64toi32_i32$2;
    i64toi32_i32$2 = $0$hi;
    i64toi32_i32$3 = $0;
    i64toi32_i32$0 = $25$hi;
    i64toi32_i32$1 = $25;
    i64toi32_i32$5 = ($0 >>> 0 < i64toi32_i32$1 >>> 0) + i64toi32_i32$0 | 0;
    i64toi32_i32$5 = i64toi32_i32$2 - i64toi32_i32$5 | 0;
    $7 = $0 - i64toi32_i32$1 | 0;
    $8 = (($7 & 65535 | 0) >>> 0) / (100 >>> 0) | 0;
    $18 = ($8 << 1 | 0) + 1055510 | 0;
    $19 = $6 + -4 | 0;
    $20 = HEAPU8[$18 >> 0] | 0 | ((HEAPU8[($18 + 1 | 0) >> 0] | 0) << 8 | 0) | 0;
    HEAP8[$19 >> 0] = $20;
    HEAP8[($19 + 1 | 0) >> 0] = $20 >>> 8 | 0;
    $21 = ((($7 - Math_imul($8, 100) | 0) & 65535 | 0) << 1 | 0) + 1055510 | 0;
    $22 = $6 + -2 | 0;
    $23 = HEAPU8[$21 >> 0] | 0 | ((HEAPU8[($21 + 1 | 0) >> 0] | 0) << 8 | 0) | 0;
    HEAP8[$22 >> 0] = $23;
    HEAP8[($22 + 1 | 0) >> 0] = $23 >>> 8 | 0;
    $4 = $4 + -4 | 0;
    i64toi32_i32$5 = i64toi32_i32$2;
    i64toi32_i32$5 = i64toi32_i32$2;
    i64toi32_i32$2 = $0;
    i64toi32_i32$3 = 0;
    i64toi32_i32$1 = 99999999;
    $6 = $0$hi >>> 0 > i64toi32_i32$3 >>> 0 | (($0$hi | 0) == (i64toi32_i32$3 | 0) & i64toi32_i32$2 >>> 0 > i64toi32_i32$1 >>> 0 | 0) | 0;
    i64toi32_i32$2 = $5$hi;
    $0 = $5;
    $0$hi = i64toi32_i32$2;
    if ($6) {
     continue label$3
    }
    break label$3;
   };
  }
  label$4 : {
   i64toi32_i32$2 = $5$hi;
   $6 = $5;
   if ($6 >>> 0 <= 99 >>> 0) {
    break label$4
   }
   $4 = $4 + -2 | 0;
   i64toi32_i32$2 = $5$hi;
   $6 = $5;
   $6 = (($6 & 65535 | 0) >>> 0) / (100 >>> 0) | 0;
   $24 = ((($5 - Math_imul($6, 100) | 0) & 65535 | 0) << 1 | 0) + 1055510 | 0;
   $26 = ($3 + 9 | 0) + $4 | 0;
   $27 = HEAPU8[$24 >> 0] | 0 | ((HEAPU8[($24 + 1 | 0) >> 0] | 0) << 8 | 0) | 0;
   HEAP8[$26 >> 0] = $27;
   HEAP8[($26 + 1 | 0) >> 0] = $27 >>> 8 | 0;
  }
  label$5 : {
   label$6 : {
    if ($6 >>> 0 < 10 >>> 0) {
     break label$6
    }
    $4 = $4 + -2 | 0;
    $28 = ($6 << 1 | 0) + 1055510 | 0;
    $29 = ($3 + 9 | 0) + $4 | 0;
    $30 = HEAPU8[$28 >> 0] | 0 | ((HEAPU8[($28 + 1 | 0) >> 0] | 0) << 8 | 0) | 0;
    HEAP8[$29 >> 0] = $30;
    HEAP8[($29 + 1 | 0) >> 0] = $30 >>> 8 | 0;
    break label$5;
   }
   $4 = $4 + -1 | 0;
   HEAP8[(($3 + 9 | 0) + $4 | 0) >> 0] = $6 + 48 | 0;
  }
  $4 = _ZN4core3fmt9Formatter12pad_integral17h07bec98d9f428dc7E($2 | 0, $1 | 0, 1055052 | 0, 0 | 0, ($3 + 9 | 0) + $4 | 0 | 0, 39 - $4 | 0 | 0) | 0;
  __stack_pointer = $3 + 48 | 0;
  return $4 | 0;
 }
 
 function _ZN4core3fmt3num53_$LT$impl$u20$core__fmt__UpperHex$u20$for$u20$i32$GT$3fmt17hc87220efb89991c9E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $3 = 0, $2 = 0, $4 = 0;
  $2 = __stack_pointer - 128 | 0;
  __stack_pointer = $2;
  $0 = HEAP32[$0 >> 2] | 0;
  $3 = 0;
  label$1 : while (1) {
   $4 = $0 & 15 | 0;
   HEAP8[(($2 + $3 | 0) + 127 | 0) >> 0] = ($4 >>> 0 < 10 >>> 0 ? 48 : 55) + $4 | 0;
   $3 = $3 + -1 | 0;
   $4 = $0 >>> 0 > 15 >>> 0;
   $0 = $0 >>> 4 | 0;
   if ($4) {
    continue label$1
   }
   break label$1;
  };
  label$2 : {
   $0 = $3 + 128 | 0;
   if ($0 >>> 0 < 129 >>> 0) {
    break label$2
   }
   _ZN4core5slice5index26slice_start_index_len_fail17hbac89f7bf616abe3E($0 | 0, 128 | 0, $0 | 0);
   abort();
  }
  $0 = _ZN4core3fmt9Formatter12pad_integral17h07bec98d9f428dc7E($1 | 0, 1 | 0, 1055508 | 0, 2 | 0, ($2 + $3 | 0) + 128 | 0 | 0, 0 - $3 | 0 | 0) | 0;
  __stack_pointer = $2 + 128 | 0;
  return $0 | 0;
 }
 
 function _ZN4core3fmt3num3imp52_$LT$impl$u20$core__fmt__Display$u20$for$u20$i32$GT$3fmt17h60a4b7382aa18b2eE($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$5 = 0, i64toi32_i32$3 = 0, i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, $5 = 0, $5$hi = 0, $9$hi = 0;
  $0 = HEAP32[$0 >> 2] | 0;
  i64toi32_i32$0 = 0;
  $5 = $0;
  $5$hi = i64toi32_i32$0;
  i64toi32_i32$1 = $0 ^ -1 | 0;
  i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
  i64toi32_i32$2 = i64toi32_i32$1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 1;
  i64toi32_i32$4 = i64toi32_i32$2 + i64toi32_i32$3 | 0;
  i64toi32_i32$5 = i64toi32_i32$0 + i64toi32_i32$1 | 0;
  if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) {
   i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
  }
  $9$hi = i64toi32_i32$5;
  $0 = ($0 | 0) > (-1 | 0);
  i64toi32_i32$1 = $0;
  i64toi32_i32$5 = $5$hi;
  i64toi32_i32$2 = $9$hi;
  i64toi32_i32$3 = $0 ? $5 : i64toi32_i32$4;
  i64toi32_i32$0 = $0 ? i64toi32_i32$5 : i64toi32_i32$2;
  return _ZN4core3fmt3num3imp7fmt_u6417hbcc4e9eaf34213beE(i64toi32_i32$3 | 0, i64toi32_i32$0 | 0, $0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h1b496c9e750d3253E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN4core3fmt3num50_$LT$impl$u20$core__fmt__Debug$u20$for$u20$u32$GT$3fmt17hd7e0831cf3549090E(HEAP32[$0 >> 2] | 0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h5741b757aa2e4790E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $2 = __stack_pointer - 32 | 0;
  __stack_pointer = $2;
  label$1 : {
   label$2 : {
    $3 = HEAP32[$0 >> 2] | 0;
    if (HEAPU8[$3 >> 0] | 0) {
     break label$2
    }
    $1 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, 1058088, 4) | 0;
    break label$1;
   }
   $0 = 1;
   HEAP32[($2 + 12 | 0) >> 2] = $3 + 1 | 0;
   (wasm2js_i32$0 = $2, wasm2js_i32$1 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, 1058084, 4) | 0), HEAP8[(wasm2js_i32$0 + 24 | 0) >> 0] = wasm2js_i32$1;
   HEAP32[($2 + 16 | 0) >> 2] = $1;
   HEAP8[($2 + 25 | 0) >> 0] = 0;
   HEAP32[($2 + 20 | 0) >> 2] = 0;
   _ZN4core3fmt8builders10DebugTuple5field17hbd726cddd42feca2E($2 + 16 | 0 | 0, $2 + 12 | 0 | 0, 1055492 | 0) | 0;
   $1 = HEAPU8[($2 + 24 | 0) >> 0] | 0;
   label$3 : {
    label$4 : {
     $3 = HEAP32[($2 + 20 | 0) >> 2] | 0;
     if ($3) {
      break label$4
     }
     $0 = $1;
     break label$3;
    }
    if ($1 & 255 | 0) {
     break label$3
    }
    $1 = HEAP32[($2 + 16 | 0) >> 2] | 0;
    label$5 : {
     if (($3 | 0) != (1 | 0)) {
      break label$5
     }
     if (!((HEAPU8[($2 + 25 | 0) >> 0] | 0) & 255 | 0)) {
      break label$5
     }
     if ((HEAPU8[$1 >> 0] | 0) & 4 | 0) {
      break label$5
     }
     $0 = 1;
     if (FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, 1055488, 1) | 0) {
      break label$3
     }
    }
    $0 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, 1055052, 1) | 0;
   }
   $1 = ($0 & 255 | 0 | 0) != (0 | 0);
  }
  __stack_pointer = $2 + 32 | 0;
  return $1 | 0;
 }
 
 function _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h6b15d07331aa03c9E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return _ZN4core3fmt3num49_$LT$impl$u20$core__fmt__Debug$u20$for$u20$u8$GT$3fmt17h04e6a6dabadeca41E(HEAP32[$0 >> 2] | 0 | 0, $1 | 0) | 0 | 0;
 }
 
 function _ZN64_$LT$core__str__error__Utf8Error$u20$as$u20$core__fmt__Debug$GT$3fmt17h2173641612cdf147E($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0;
  $2 = __stack_pointer - 16 | 0;
  __stack_pointer = $2;
  HEAP32[$2 >> 2] = $0;
  HEAP32[($2 + 4 | 0) >> 2] = $0 + 4 | 0;
  $0 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, 1058108, 9) | 0;
  HEAP8[($2 + 13 | 0) >> 0] = 0;
  HEAP8[($2 + 12 | 0) >> 0] = $0;
  HEAP32[($2 + 8 | 0) >> 2] = $1;
  _ZN4core3fmt8builders11DebugStruct5field17h1acdae178491c74aE(_ZN4core3fmt8builders11DebugStruct5field17h1acdae178491c74aE($2 + 8 | 0 | 0, 1058117 | 0, 11 | 0, $2 | 0, 1058092 | 0) | 0 | 0, 1058128 | 0, 9 | 0, $2 + 4 | 0 | 0, 1058140 | 0) | 0;
  $1 = HEAPU8[($2 + 12 | 0) >> 0] | 0;
  label$1 : {
   if (!(HEAPU8[($2 + 13 | 0) >> 0] | 0)) {
    break label$1
   }
   $0 = $1 & 255 | 0;
   $1 = 1;
   if ($0) {
    break label$1
   }
   label$2 : {
    $1 = HEAP32[($2 + 8 | 0) >> 2] | 0;
    if ((HEAPU8[$1 >> 0] | 0) & 4 | 0) {
     break label$2
    }
    $1 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, 1055483, 2) | 0;
    break label$1;
   }
   $1 = FUNCTION_TABLE[HEAP32[((HEAP32[($1 + 28 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0](HEAP32[($1 + 24 | 0) >> 2] | 0, 1055469, 1) | 0;
  }
  __stack_pointer = $2 + 16 | 0;
  return ($1 & 255 | 0 | 0) != (0 | 0) | 0;
 }
 
 function _start_command_export() {
  __wasm_call_ctors();
  _start();
  __wasm_call_dtors();
 }
 
 function fuck_command_export() {
  var $0 = 0;
  __wasm_call_ctors();
  $0 = fuck() | 0;
  __wasm_call_dtors();
  return $0 | 0;
 }
 
 function _ZN17compiler_builtins3int3mul3Mul3mul17h070e9a1c69faec5bE(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, var$2 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, var$3 = 0, var$4 = 0, var$5 = 0, $21 = 0, $22 = 0, var$6 = 0, $24 = 0, $17 = 0, $18 = 0, $23 = 0, $29 = 0, $45 = 0, $56$hi = 0, $62$hi = 0;
  i64toi32_i32$0 = var$1$hi;
  var$2 = var$1;
  var$4 = var$2 >>> 16 | 0;
  i64toi32_i32$0 = var$0$hi;
  var$3 = var$0;
  var$5 = var$3 >>> 16 | 0;
  $17 = Math_imul(var$4, var$5);
  $18 = var$2;
  i64toi32_i32$2 = var$3;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = 0;
   $21 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   $21 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
  }
  $23 = $17 + Math_imul($18, $21) | 0;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$0 = var$1;
  i64toi32_i32$2 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$2 = 0;
   $22 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
   $22 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
  }
  $29 = $23 + Math_imul($22, var$3) | 0;
  var$2 = var$2 & 65535 | 0;
  var$3 = var$3 & 65535 | 0;
  var$6 = Math_imul(var$2, var$3);
  var$2 = (var$6 >>> 16 | 0) + Math_imul(var$2, var$5) | 0;
  $45 = $29 + (var$2 >>> 16 | 0) | 0;
  var$2 = (var$2 & 65535 | 0) + Math_imul(var$4, var$3) | 0;
  i64toi32_i32$2 = 0;
  i64toi32_i32$1 = $45 + (var$2 >>> 16 | 0) | 0;
  i64toi32_i32$0 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$0 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
   $24 = 0;
  } else {
   i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$1 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
   $24 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
  }
  $56$hi = i64toi32_i32$0;
  i64toi32_i32$0 = 0;
  $62$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $56$hi;
  i64toi32_i32$2 = $24;
  i64toi32_i32$1 = $62$hi;
  i64toi32_i32$3 = var$2 << 16 | 0 | (var$6 & 65535 | 0) | 0;
  i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
  i64toi32_i32$2 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
  return i64toi32_i32$2 | 0;
 }
 
 function _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, i64toi32_i32$4 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$5 = 0, var$2 = 0, var$3 = 0, var$4 = 0, var$5 = 0, var$5$hi = 0, var$6 = 0, var$6$hi = 0, i64toi32_i32$6 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, var$8$hi = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, var$7$hi = 0, $49 = 0, $63$hi = 0, $65 = 0, $65$hi = 0, $120$hi = 0, $129$hi = 0, $134$hi = 0, var$8 = 0, $140 = 0, $140$hi = 0, $142$hi = 0, $144 = 0, $144$hi = 0, $151 = 0, $151$hi = 0, $154$hi = 0, var$7 = 0, $165$hi = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$8 : {
          label$9 : {
           label$10 : {
            label$11 : {
             i64toi32_i32$0 = var$0$hi;
             i64toi32_i32$2 = var$0;
             i64toi32_i32$1 = 0;
             i64toi32_i32$3 = 32;
             i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
             if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
              i64toi32_i32$1 = 0;
              $37 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
             } else {
              i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
              $37 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
             }
             var$2 = $37;
             if (var$2) {
              block : {
               i64toi32_i32$1 = var$1$hi;
               var$3 = var$1;
               if (!var$3) {
                break label$11
               }
               i64toi32_i32$1 = var$1$hi;
               i64toi32_i32$0 = var$1;
               i64toi32_i32$2 = 0;
               i64toi32_i32$3 = 32;
               i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
               if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
                i64toi32_i32$2 = 0;
                $38 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
               } else {
                i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
                $38 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
               }
               var$4 = $38;
               if (!var$4) {
                break label$9
               }
               var$2 = Math_clz32(var$4) - Math_clz32(var$2) | 0;
               if (var$2 >>> 0 <= 31 >>> 0) {
                break label$8
               }
               break label$2;
              }
             }
             i64toi32_i32$2 = var$1$hi;
             i64toi32_i32$1 = var$1;
             i64toi32_i32$0 = 1;
             i64toi32_i32$3 = 0;
             if (i64toi32_i32$2 >>> 0 > i64toi32_i32$0 >>> 0 | ((i64toi32_i32$2 | 0) == (i64toi32_i32$0 | 0) & i64toi32_i32$1 >>> 0 >= i64toi32_i32$3 >>> 0 | 0) | 0) {
              break label$2
             }
             i64toi32_i32$1 = var$0$hi;
             var$2 = var$0;
             i64toi32_i32$1 = var$1$hi;
             var$3 = var$1;
             var$2 = (var$2 >>> 0) / (var$3 >>> 0) | 0;
             i64toi32_i32$1 = 0;
             __wasm_intrinsics_temp_i64 = var$0 - Math_imul(var$2, var$3) | 0;
             __wasm_intrinsics_temp_i64$hi = i64toi32_i32$1;
             i64toi32_i32$1 = 0;
             i64toi32_i32$2 = var$2;
             i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
             return i64toi32_i32$2 | 0;
            }
            i64toi32_i32$2 = var$1$hi;
            i64toi32_i32$3 = var$1;
            i64toi32_i32$1 = 0;
            i64toi32_i32$0 = 32;
            i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
            if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
             i64toi32_i32$1 = 0;
             $39 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
            } else {
             i64toi32_i32$1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
             $39 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$4 | 0) | 0;
            }
            var$3 = $39;
            i64toi32_i32$1 = var$0$hi;
            if (!var$0) {
             break label$7
            }
            if (!var$3) {
             break label$6
            }
            var$4 = var$3 + -1 | 0;
            if (var$4 & var$3 | 0) {
             break label$6
            }
            i64toi32_i32$1 = 0;
            i64toi32_i32$2 = var$4 & var$2 | 0;
            i64toi32_i32$3 = 0;
            i64toi32_i32$0 = 32;
            i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
            if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
             i64toi32_i32$3 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
             $40 = 0;
            } else {
             i64toi32_i32$3 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
             $40 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
            }
            $63$hi = i64toi32_i32$3;
            i64toi32_i32$3 = var$0$hi;
            i64toi32_i32$1 = var$0;
            i64toi32_i32$2 = 0;
            i64toi32_i32$0 = -1;
            i64toi32_i32$2 = i64toi32_i32$3 & i64toi32_i32$2 | 0;
            $65 = i64toi32_i32$1 & i64toi32_i32$0 | 0;
            $65$hi = i64toi32_i32$2;
            i64toi32_i32$2 = $63$hi;
            i64toi32_i32$3 = $40;
            i64toi32_i32$1 = $65$hi;
            i64toi32_i32$0 = $65;
            i64toi32_i32$1 = i64toi32_i32$2 | i64toi32_i32$1 | 0;
            __wasm_intrinsics_temp_i64 = i64toi32_i32$3 | i64toi32_i32$0 | 0;
            __wasm_intrinsics_temp_i64$hi = i64toi32_i32$1;
            i64toi32_i32$1 = 0;
            i64toi32_i32$3 = var$2 >>> ((__wasm_ctz_i32(var$3 | 0) | 0) & 31 | 0) | 0;
            i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
            return i64toi32_i32$3 | 0;
           }
          }
          var$4 = var$3 + -1 | 0;
          if (!(var$4 & var$3 | 0)) {
           break label$5
          }
          var$2 = (Math_clz32(var$3) + 33 | 0) - Math_clz32(var$2) | 0;
          var$3 = 0 - var$2 | 0;
          break label$3;
         }
         var$3 = 63 - var$2 | 0;
         var$2 = var$2 + 1 | 0;
         break label$3;
        }
        var$4 = (var$2 >>> 0) / (var$3 >>> 0) | 0;
        i64toi32_i32$3 = 0;
        i64toi32_i32$2 = var$2 - Math_imul(var$4, var$3) | 0;
        i64toi32_i32$1 = 0;
        i64toi32_i32$0 = 32;
        i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
         $41 = 0;
        } else {
         i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
         $41 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
        }
        __wasm_intrinsics_temp_i64 = $41;
        __wasm_intrinsics_temp_i64$hi = i64toi32_i32$1;
        i64toi32_i32$1 = 0;
        i64toi32_i32$2 = var$4;
        i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
        return i64toi32_i32$2 | 0;
       }
       var$2 = Math_clz32(var$3) - Math_clz32(var$2) | 0;
       if (var$2 >>> 0 < 31 >>> 0) {
        break label$4
       }
       break label$2;
      }
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$2 = 0;
      __wasm_intrinsics_temp_i64 = var$4 & var$0 | 0;
      __wasm_intrinsics_temp_i64$hi = i64toi32_i32$2;
      if ((var$3 | 0) == (1 | 0)) {
       break label$1
      }
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$2 = 0;
      $120$hi = i64toi32_i32$2;
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$3 = var$0;
      i64toi32_i32$1 = $120$hi;
      i64toi32_i32$0 = __wasm_ctz_i32(var$3 | 0) | 0;
      i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
      if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
       i64toi32_i32$1 = 0;
       $42 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
      } else {
       i64toi32_i32$1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
       $42 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$4 | 0) | 0;
      }
      i64toi32_i32$3 = $42;
      i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
      return i64toi32_i32$3 | 0;
     }
     var$3 = 63 - var$2 | 0;
     var$2 = var$2 + 1 | 0;
    }
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$3 = 0;
    $129$hi = i64toi32_i32$3;
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$2 = var$0;
    i64toi32_i32$1 = $129$hi;
    i64toi32_i32$0 = var$2 & 63 | 0;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = 0;
     $43 = i64toi32_i32$3 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$1 = i64toi32_i32$3 >>> i64toi32_i32$4 | 0;
     $43 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$3 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
    }
    var$5 = $43;
    var$5$hi = i64toi32_i32$1;
    i64toi32_i32$1 = var$0$hi;
    i64toi32_i32$1 = 0;
    $134$hi = i64toi32_i32$1;
    i64toi32_i32$1 = var$0$hi;
    i64toi32_i32$3 = var$0;
    i64toi32_i32$2 = $134$hi;
    i64toi32_i32$0 = var$3 & 63 | 0;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$3 << i64toi32_i32$4 | 0;
     $44 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$3 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
     $44 = i64toi32_i32$3 << i64toi32_i32$4 | 0;
    }
    var$0 = $44;
    var$0$hi = i64toi32_i32$2;
    label$13 : {
     if (var$2) {
      block3 : {
       i64toi32_i32$2 = var$1$hi;
       i64toi32_i32$1 = var$1;
       i64toi32_i32$3 = -1;
       i64toi32_i32$0 = -1;
       i64toi32_i32$4 = i64toi32_i32$1 + i64toi32_i32$0 | 0;
       i64toi32_i32$5 = i64toi32_i32$2 + i64toi32_i32$3 | 0;
       if (i64toi32_i32$4 >>> 0 < i64toi32_i32$0 >>> 0) {
        i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
       }
       var$8 = i64toi32_i32$4;
       var$8$hi = i64toi32_i32$5;
       label$15 : while (1) {
        i64toi32_i32$5 = var$5$hi;
        i64toi32_i32$2 = var$5;
        i64toi32_i32$1 = 0;
        i64toi32_i32$0 = 1;
        i64toi32_i32$3 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
         $45 = 0;
        } else {
         i64toi32_i32$1 = ((1 << i64toi32_i32$3 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$3 | 0) | 0) | 0 | (i64toi32_i32$5 << i64toi32_i32$3 | 0) | 0;
         $45 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
        }
        $140 = $45;
        $140$hi = i64toi32_i32$1;
        i64toi32_i32$1 = var$0$hi;
        i64toi32_i32$5 = var$0;
        i64toi32_i32$2 = 0;
        i64toi32_i32$0 = 63;
        i64toi32_i32$3 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$2 = 0;
         $46 = i64toi32_i32$1 >>> i64toi32_i32$3 | 0;
        } else {
         i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$3 | 0;
         $46 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$5 >>> i64toi32_i32$3 | 0) | 0;
        }
        $142$hi = i64toi32_i32$2;
        i64toi32_i32$2 = $140$hi;
        i64toi32_i32$1 = $140;
        i64toi32_i32$5 = $142$hi;
        i64toi32_i32$0 = $46;
        i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
        var$5 = i64toi32_i32$1 | i64toi32_i32$0 | 0;
        var$5$hi = i64toi32_i32$5;
        $144 = var$5;
        $144$hi = i64toi32_i32$5;
        i64toi32_i32$5 = var$8$hi;
        i64toi32_i32$5 = var$5$hi;
        i64toi32_i32$5 = var$8$hi;
        i64toi32_i32$2 = var$8;
        i64toi32_i32$1 = var$5$hi;
        i64toi32_i32$0 = var$5;
        i64toi32_i32$3 = i64toi32_i32$2 - i64toi32_i32$0 | 0;
        i64toi32_i32$6 = i64toi32_i32$2 >>> 0 < i64toi32_i32$0 >>> 0;
        i64toi32_i32$4 = i64toi32_i32$6 + i64toi32_i32$1 | 0;
        i64toi32_i32$4 = i64toi32_i32$5 - i64toi32_i32$4 | 0;
        i64toi32_i32$5 = i64toi32_i32$3;
        i64toi32_i32$2 = 0;
        i64toi32_i32$0 = 63;
        i64toi32_i32$1 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$2 = i64toi32_i32$4 >> 31 | 0;
         $47 = i64toi32_i32$4 >> i64toi32_i32$1 | 0;
        } else {
         i64toi32_i32$2 = i64toi32_i32$4 >> i64toi32_i32$1 | 0;
         $47 = (((1 << i64toi32_i32$1 | 0) - 1 | 0) & i64toi32_i32$4 | 0) << (32 - i64toi32_i32$1 | 0) | 0 | (i64toi32_i32$5 >>> i64toi32_i32$1 | 0) | 0;
        }
        var$6 = $47;
        var$6$hi = i64toi32_i32$2;
        i64toi32_i32$2 = var$1$hi;
        i64toi32_i32$2 = var$6$hi;
        i64toi32_i32$4 = var$6;
        i64toi32_i32$5 = var$1$hi;
        i64toi32_i32$0 = var$1;
        i64toi32_i32$5 = i64toi32_i32$2 & i64toi32_i32$5 | 0;
        $151 = i64toi32_i32$4 & i64toi32_i32$0 | 0;
        $151$hi = i64toi32_i32$5;
        i64toi32_i32$5 = $144$hi;
        i64toi32_i32$2 = $144;
        i64toi32_i32$4 = $151$hi;
        i64toi32_i32$0 = $151;
        i64toi32_i32$1 = i64toi32_i32$2 - i64toi32_i32$0 | 0;
        i64toi32_i32$6 = i64toi32_i32$2 >>> 0 < i64toi32_i32$0 >>> 0;
        i64toi32_i32$3 = i64toi32_i32$6 + i64toi32_i32$4 | 0;
        i64toi32_i32$3 = i64toi32_i32$5 - i64toi32_i32$3 | 0;
        var$5 = i64toi32_i32$1;
        var$5$hi = i64toi32_i32$3;
        i64toi32_i32$3 = var$0$hi;
        i64toi32_i32$5 = var$0;
        i64toi32_i32$2 = 0;
        i64toi32_i32$0 = 1;
        i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$2 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
         $48 = 0;
        } else {
         i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
         $48 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
        }
        $154$hi = i64toi32_i32$2;
        i64toi32_i32$2 = var$7$hi;
        i64toi32_i32$2 = $154$hi;
        i64toi32_i32$3 = $48;
        i64toi32_i32$5 = var$7$hi;
        i64toi32_i32$0 = var$7;
        i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
        var$0 = i64toi32_i32$3 | i64toi32_i32$0 | 0;
        var$0$hi = i64toi32_i32$5;
        i64toi32_i32$5 = var$6$hi;
        i64toi32_i32$2 = var$6;
        i64toi32_i32$3 = 0;
        i64toi32_i32$0 = 1;
        i64toi32_i32$3 = i64toi32_i32$5 & i64toi32_i32$3 | 0;
        var$6 = i64toi32_i32$2 & i64toi32_i32$0 | 0;
        var$6$hi = i64toi32_i32$3;
        var$7 = var$6;
        var$7$hi = i64toi32_i32$3;
        var$2 = var$2 + -1 | 0;
        if (var$2) {
         continue label$15
        }
        break label$15;
       };
       break label$13;
      }
     }
    }
    i64toi32_i32$3 = var$5$hi;
    __wasm_intrinsics_temp_i64 = var$5;
    __wasm_intrinsics_temp_i64$hi = i64toi32_i32$3;
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$5 = var$0;
    i64toi32_i32$2 = 0;
    i64toi32_i32$0 = 1;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
     $49 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
     $49 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
    }
    $165$hi = i64toi32_i32$2;
    i64toi32_i32$2 = var$6$hi;
    i64toi32_i32$2 = $165$hi;
    i64toi32_i32$3 = $49;
    i64toi32_i32$5 = var$6$hi;
    i64toi32_i32$0 = var$6;
    i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
    i64toi32_i32$3 = i64toi32_i32$3 | i64toi32_i32$0 | 0;
    i64toi32_i32$HIGH_BITS = i64toi32_i32$5;
    return i64toi32_i32$3 | 0;
   }
   i64toi32_i32$3 = var$0$hi;
   __wasm_intrinsics_temp_i64 = var$0;
   __wasm_intrinsics_temp_i64$hi = i64toi32_i32$3;
   i64toi32_i32$3 = 0;
   var$0 = 0;
   var$0$hi = i64toi32_i32$3;
  }
  i64toi32_i32$3 = var$0$hi;
  i64toi32_i32$5 = var$0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$3;
  return i64toi32_i32$5 | 0;
 }
 
 function __wasm_i64_mul(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$0 = var$1$hi;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$1 = _ZN17compiler_builtins3int3mul3Mul3mul17h070e9a1c69faec5bE(var$0 | 0, i64toi32_i32$0 | 0, var$1 | 0, i64toi32_i32$1 | 0) | 0;
  i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$0;
  return i64toi32_i32$1 | 0;
 }
 
 function __wasm_i64_udiv(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$0 = var$1$hi;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$1 = _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E(var$0 | 0, i64toi32_i32$0 | 0, var$1 | 0, i64toi32_i32$1 | 0) | 0;
  i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$0;
  return i64toi32_i32$1 | 0;
 }
 
 function __wasm_rotl_i32(var$0, var$1) {
  var$0 = var$0 | 0;
  var$1 = var$1 | 0;
  var var$2 = 0;
  var$2 = var$1 & 31 | 0;
  var$1 = (0 - var$1 | 0) & 31 | 0;
  return ((-1 >>> var$2 | 0) & var$0 | 0) << var$2 | 0 | (((-1 << var$1 | 0) & var$0 | 0) >>> var$1 | 0) | 0 | 0;
 }
 
 function __wasm_rotl_i64(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, i64toi32_i32$5 = 0, i64toi32_i32$4 = 0, var$2$hi = 0, var$2 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $6$hi = 0, $8$hi = 0, $10 = 0, $10$hi = 0, $15$hi = 0, $17$hi = 0, $19$hi = 0;
  i64toi32_i32$0 = var$1$hi;
  i64toi32_i32$2 = var$1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 63;
  i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
  var$2 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
  var$2$hi = i64toi32_i32$1;
  i64toi32_i32$1 = -1;
  i64toi32_i32$0 = -1;
  i64toi32_i32$2 = var$2$hi;
  i64toi32_i32$3 = var$2;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$2 = 0;
   $19 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
   $19 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
  }
  $6$hi = i64toi32_i32$2;
  i64toi32_i32$2 = var$0$hi;
  i64toi32_i32$2 = $6$hi;
  i64toi32_i32$1 = $19;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$3 = var$0;
  i64toi32_i32$0 = i64toi32_i32$2 & i64toi32_i32$0 | 0;
  $8$hi = i64toi32_i32$0;
  i64toi32_i32$0 = var$2$hi;
  i64toi32_i32$0 = $8$hi;
  i64toi32_i32$2 = i64toi32_i32$1 & i64toi32_i32$3 | 0;
  i64toi32_i32$1 = var$2$hi;
  i64toi32_i32$3 = var$2;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   $20 = 0;
  } else {
   i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
   $20 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
  }
  $10 = $20;
  $10$hi = i64toi32_i32$1;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$1 = 0;
  i64toi32_i32$0 = 0;
  i64toi32_i32$2 = var$1$hi;
  i64toi32_i32$3 = var$1;
  i64toi32_i32$4 = i64toi32_i32$0 - i64toi32_i32$3 | 0;
  i64toi32_i32$5 = (i64toi32_i32$0 >>> 0 < i64toi32_i32$3 >>> 0) + i64toi32_i32$2 | 0;
  i64toi32_i32$5 = i64toi32_i32$1 - i64toi32_i32$5 | 0;
  i64toi32_i32$1 = i64toi32_i32$4;
  i64toi32_i32$0 = 0;
  i64toi32_i32$3 = 63;
  i64toi32_i32$0 = i64toi32_i32$5 & i64toi32_i32$0 | 0;
  var$1 = i64toi32_i32$1 & i64toi32_i32$3 | 0;
  var$1$hi = i64toi32_i32$0;
  i64toi32_i32$0 = -1;
  i64toi32_i32$5 = -1;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$3 = var$1;
  i64toi32_i32$2 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$5 << i64toi32_i32$2 | 0;
   $21 = 0;
  } else {
   i64toi32_i32$1 = ((1 << i64toi32_i32$2 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$2 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$2 | 0) | 0;
   $21 = i64toi32_i32$5 << i64toi32_i32$2 | 0;
  }
  $15$hi = i64toi32_i32$1;
  i64toi32_i32$1 = var$0$hi;
  i64toi32_i32$1 = $15$hi;
  i64toi32_i32$0 = $21;
  i64toi32_i32$5 = var$0$hi;
  i64toi32_i32$3 = var$0;
  i64toi32_i32$5 = i64toi32_i32$1 & i64toi32_i32$5 | 0;
  $17$hi = i64toi32_i32$5;
  i64toi32_i32$5 = var$1$hi;
  i64toi32_i32$5 = $17$hi;
  i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$3 | 0;
  i64toi32_i32$0 = var$1$hi;
  i64toi32_i32$3 = var$1;
  i64toi32_i32$2 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$0 = 0;
   $22 = i64toi32_i32$5 >>> i64toi32_i32$2 | 0;
  } else {
   i64toi32_i32$0 = i64toi32_i32$5 >>> i64toi32_i32$2 | 0;
   $22 = (((1 << i64toi32_i32$2 | 0) - 1 | 0) & i64toi32_i32$5 | 0) << (32 - i64toi32_i32$2 | 0) | 0 | (i64toi32_i32$1 >>> i64toi32_i32$2 | 0) | 0;
  }
  $19$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $10$hi;
  i64toi32_i32$5 = $10;
  i64toi32_i32$1 = $19$hi;
  i64toi32_i32$3 = $22;
  i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
  i64toi32_i32$5 = i64toi32_i32$5 | i64toi32_i32$3 | 0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
  return i64toi32_i32$5 | 0;
 }
 
 function __wasm_ctz_i32(var$0) {
  var$0 = var$0 | 0;
  if (var$0) {
   return 31 - Math_clz32((var$0 + -1 | 0) ^ var$0 | 0) | 0 | 0
  }
  return 32 | 0;
 }
 
 bufferView = HEAPU8;
 initActiveSegments(env);
 var FUNCTION_TABLE = [null, _ZN4core3fmt3num3imp52_$LT$impl$u20$core__fmt__Display$u20$for$u20$i32$GT$3fmt17h60a4b7382aa18b2eE, _ZN60_$LT$alloc__string__String$u20$as$u20$core__fmt__Display$GT$3fmt17h47f5ab120110a9dbE, _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17h9d406cf23c11b6bfE, _ZN60_$LT$std__io__error__Error$u20$as$u20$core__fmt__Display$GT$3fmt17h35fdc6f9e4be55a0E, _ZN4core3fmt3num3imp52_$LT$impl$u20$core__fmt__Display$u20$for$u20$u32$GT$3fmt17hd8b7165cf120cb31E, _ZN3std5alloc24default_alloc_error_hook17h9f962deb47fde5d6E, _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17ha457960167401a4cE, _ZN91_$LT$std__sys_common__backtrace___print__DisplayBacktrace$u20$as$u20$core__fmt__Display$GT$3fmt17h72bede60375d7d67E, _ZN73_$LT$core__panic__panic_info__PanicInfo$u20$as$u20$core__fmt__Display$GT$3fmt17ha5a8d5d305ca3db6E, _ZN59_$LT$core__fmt__Arguments$u20$as$u20$core__fmt__Display$GT$3fmt17h3c5217b12139caceE, _ZN4core3ptr100drop_in_place$LT$$RF$mut$u20$std__io__Write__write_fmt__Adapter$LT$alloc__vec__Vec$LT$u8$GT$$GT$$GT$17hdf29bfed925752abE, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h53af1920c9c57bf6E, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17hb8a44e47634e1102E, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17h020a2471d8556426E, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h310bd2a462dd1dbbE, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17h156f652561e18dc0E, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17h8586c245f6d0e523E, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h62a8da3e2c64ef6bE, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17hf204ea9f008f8b6fE, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17h02725885f278630bE, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h21cada01fb43270aE, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17h7041ae904ed91c36E, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17h67110dcf2b263466E, _ZN36_$LT$T$u20$as$u20$core__any__Any$GT$7type_id17h707f34e71e2c316dE, _ZN63_$LT$core__cell__BorrowMutError$u20$as$u20$core__fmt__Debug$GT$3fmt17h1e5b39c7ead358b3E, _ZN64_$LT$core__str__error__Utf8Error$u20$as$u20$core__fmt__Debug$GT$3fmt17h2173641612cdf147E, _ZN4core3ptr103drop_in_place$LT$std__sync__poison__PoisonError$LT$std__sync__mutex__MutexGuard$LT$$LP$$RP$$GT$$GT$$GT$17h90716e2bc96dce67E, _ZN76_$LT$std__sync__poison__PoisonError$LT$T$GT$$u20$as$u20$core__fmt__Debug$GT$3fmt17h57b616b64dbb7c21E, _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h93eff3232b7c94b8E, _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17hf01d05f8ffc6998aE, _ZN4core3ptr87drop_in_place$LT$std__io__Write__write_fmt__Adapter$LT$$RF$mut$u20$$u5b$u8$u5d$$GT$$GT$17h7201544e6914916eE, _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17hc4fcd3d79836fae3E, _ZN4core3fmt5Write10write_char17hc020ba426170fec3E, _ZN4core3fmt5Write9write_fmt17h9cbf845483dea04eE, _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17h2c8585733a944f10E, _ZN4core3fmt5Write10write_char17hbc66407203c004dcE, _ZN4core3fmt5Write9write_fmt17h6a629a61cefccbadE, _ZN80_$LT$std__io__Write__write_fmt__Adapter$LT$T$GT$$u20$as$u20$core__fmt__Write$GT$9write_str17h7a67e08803b4d09fE, _ZN4core3fmt5Write10write_char17h21c4ea041e584ffeE, _ZN4core3fmt5Write9write_fmt17h6605f4d4890c4c04E, _ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable_shim$u7d$$u7d$17h1221fd053cf9becaE, _ZN3std4sync4once4Once15call_once_force28_$u7b$$u7b$closure$u7d$$u7d$17hf1f7ef6a532be73fE, _ZN64_$LT$std__sys__wasi__stdio__Stderr$u20$as$u20$std__io__Write$GT$5write17hdf75dff9e853891eE, _ZN64_$LT$std__sys__wasi__stdio__Stderr$u20$as$u20$std__io__Write$GT$14write_vectored17h8bdd6f405487fb33E, _ZN64_$LT$std__sys__wasi__stdio__Stderr$u20$as$u20$std__io__Write$GT$17is_write_vectored17h23e8925bb54017c9E, _ZN64_$LT$std__sys__wasi__stdio__Stderr$u20$as$u20$std__io__Write$GT$5flush17h977a971126c5ac7fE, _ZN3std2io5Write9write_all17h04ef04d2aefe2a00E, _ZN3std2io5Write18write_all_vectored17h9996a76fa2734775E, _ZN3std2io5Write9write_fmt17hdb49789eaf08346bE, _ZN4core3ptr226drop_in_place$LT$std__error__$LT$impl$u20$core__convert__From$LT$alloc__string__String$GT$$u20$for$u20$alloc__boxed__Box$LT$dyn$u20$std__error__Error$u2b$core__marker__Sync$u2b$core__marker__Send$GT$$GT$__from__StringError$GT$17h93379087c8f60e89E, _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$5write17hf178d7b0fc5657deE, _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$14write_vectored17h90777f8bc74c3235E, _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$17is_write_vectored17h944873638e458a23E, _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$5flush17h750191f711542006E, _ZN3std2io5impls74_$LT$impl$u20$std__io__Write$u20$for$u20$alloc__vec__Vec$LT$u8$C$A$GT$$GT$9write_all17ha958032f4557b936E, _ZN3std2io5Write18write_all_vectored17hd2fe6324cf3f60e6E, _ZN3std2io5Write9write_fmt17hd94531ad878fb413E, _ZN36_$LT$T$u20$as$u20$core__any__Any$GT$7type_id17he16982ceb64b952fE, _ZN36_$LT$T$u20$as$u20$core__any__Any$GT$7type_id17h2b5c69dbfb8a5fceE, _ZN4core3ptr70drop_in_place$LT$std__panicking__begin_panic_handler__PanicPayload$GT$17hf1e08952d4df757dE, _ZN90_$LT$std__panicking__begin_panic_handler__PanicPayload$u20$as$u20$core__panic__BoxMeUp$GT$8take_box17h2139a21a98a2a540E, _ZN90_$LT$std__panicking__begin_panic_handler__PanicPayload$u20$as$u20$core__panic__BoxMeUp$GT$3get17h123aa22be66f3217E, _ZN93_$LT$std__panicking__begin_panic_handler__StrPanicPayload$u20$as$u20$core__panic__BoxMeUp$GT$8take_box17h85a56aa9f7c333a7E, _ZN93_$LT$std__panicking__begin_panic_handler__StrPanicPayload$u20$as$u20$core__panic__BoxMeUp$GT$3get17hb34e8b1f5c511f2fE, _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17h09e0edc340f976d6E, _ZN71_$LT$core__ops__range__Range$LT$Idx$GT$$u20$as$u20$core__fmt__Debug$GT$3fmt17h59cfba0461d4ab44E, _ZN41_$LT$char$u20$as$u20$core__fmt__Debug$GT$3fmt17hf6ec58de099f6c9eE, _ZN4core3ops8function6FnOnce9call_once17hd19de2a9e46d9a94E, _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17h3da498b26607d90fE, _ZN44_$LT$$RF$T$u20$as$u20$core__fmt__Display$GT$3fmt17hfa457ee95475e8c3E, _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h3405c7424f3ace02E, _ZN4core3ptr102drop_in_place$LT$$RF$core__iter__adapters__copied__Copied$LT$core__slice__iter__Iter$LT$u8$GT$$GT$$GT$17h5cb8c015b89953c6E, _ZN36_$LT$T$u20$as$u20$core__any__Any$GT$7type_id17hacd5f54e85b9fb6dE, _ZN68_$LT$core__fmt__builders__PadAdapter$u20$as$u20$core__fmt__Write$GT$9write_str17hcf1464355de32109E, _ZN4core3fmt5Write10write_char17h541c746737eec467E, _ZN4core3fmt5Write9write_fmt17hc4f89bad97591bfbE, _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h6b15d07331aa03c9E, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_str17h0321d74a01f97c6dE, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$10write_char17h5e93c043e4ea9a67E, _ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core__fmt__Write$GT$9write_fmt17hb32926fa79eac353E, _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h1b496c9e750d3253E, _ZN42_$LT$$RF$T$u20$as$u20$core__fmt__Debug$GT$3fmt17h5741b757aa2e4790E];
 function __wasm_memory_size() {
  return buffer.byteLength / 65536 | 0;
 }
 
 function __wasm_memory_grow(pagesToAdd) {
  pagesToAdd = pagesToAdd | 0;
  var oldPages = __wasm_memory_size() | 0;
  var newPages = oldPages + pagesToAdd | 0;
  if ((oldPages < newPages) && (newPages < 65536)) {
   var newBuffer = new ArrayBuffer(Math_imul(newPages, 65536));
   var newHEAP8 = new Int8Array(newBuffer);
   newHEAP8.set(HEAP8);
   HEAP8 = new Int8Array(newBuffer);
   HEAP16 = new Int16Array(newBuffer);
   HEAP32 = new Int32Array(newBuffer);
   HEAPU8 = new Uint8Array(newBuffer);
   HEAPU16 = new Uint16Array(newBuffer);
   HEAPU32 = new Uint32Array(newBuffer);
   HEAPF32 = new Float32Array(newBuffer);
   HEAPF64 = new Float64Array(newBuffer);
   buffer = newBuffer;
   bufferView = HEAPU8;
  }
  return oldPages;
 }
 
 return {
  "memory": Object.create(Object.prototype, {
   "grow": {
    "value": __wasm_memory_grow
   }, 
   "buffer": {
    "get": function () {
     return buffer;
    }
    
   }
  }), 
  "__heap_base": {
   get value() {
    return global$1;
   }, 
   set value(_global$1) {
    global$1 = _global$1;
   }
  }, 
  "__data_end": {
   get value() {
    return global$2;
   }, 
   set value(_global$2) {
    global$2 = _global$2;
   }
  }, 
  "_start": _start_command_export, 
  "fuck": fuck_command_export
 };
}

var retasmFunc = asmFunc(  { abort: function() { throw new Error('abort'); },
    fd_write,
    args_get,
    args_sizes_get,
    environ_get,
    environ_sizes_get,
    proc_exit,
    main
  });
export var memory = retasmFunc.memory;
export var __heap_base = retasmFunc.__heap_base;
export var __data_end = retasmFunc.__data_end;
export var _start = retasmFunc._start;
export var fuck = retasmFunc.fuck;
