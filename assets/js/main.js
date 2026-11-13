/* Sơ đồ ladder tương tác: mạch tự giữ (seal-in)
   Logic mô phỏng đúng một chu kỳ quét PLC:
     Y0_mới = (X0_START hoặc Y0_cũ) và không phải X1_STOP        */
(function () {
  'use strict';

  function initLadder() {
    var root = document.getElementById('ladder');
    if (!root) return;

    var state = { start: false, stop: false, motor: false };
    var status = document.getElementById('ladder-status');
    var statusDot = document.getElementById('ladder-dot');

    function mark(id, on) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('on', on);
    }

    function scan() {
      var prev = state.motor;                 // trạng thái tiếp điểm Y0 ở chu kỳ trước
      var node = state.start || prev;         // nhánh START song song với Y0
      state.motor = node && !state.stop;      // STOP là tiếp điểm thường đóng, nối tiếp

      mark('w-start', state.start);
      mark('w-seal', prev);
      mark('w-mid', node);
      mark('w-out', node && !state.stop);
      mark('w-rail', state.motor);
      mark('c-start', state.start);
      mark('c-seal', prev);
      mark('c-stop', !state.stop);            // thường đóng: đóng khi KHÔNG bấm
      mark('coil', state.motor);

      if (status) {
        status.textContent = state.motor
          ? 'Y0 đang có điện: động cơ chạy'
          : 'Y0 mất điện: động cơ dừng';
      }
      if (statusDot) {
        statusDot.classList.toggle('bg-signal', state.motor);
        statusDot.classList.toggle('bg-slate-300', !state.motor);
      }
    }

    /* Mỗi lần bấm là một "xung" ngắn, giống nhấn rồi nhả nút ngoài tủ điện */
    var timers = {};
    function press(which) {
      clearTimeout(timers[which]);
      state[which] = true;
      scan();
      timers[which] = setTimeout(function () {
        state[which] = false;
        scan();
      }, 500);
    }

    var btnStart = document.getElementById('btn-start');
    var btnStop = document.getElementById('btn-stop');
    if (btnStart) btnStart.addEventListener('click', function () { press('start'); });
    if (btnStop) btnStop.addEventListener('click', function () { press('stop'); });

    scan();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLadder);
  } else {
    initLadder();
  }
})();
