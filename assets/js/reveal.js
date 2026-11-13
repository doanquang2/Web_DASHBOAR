/* Hiệu ứng xuất hiện nhẹ khi cuộn trang.
   - Tự áp dụng cho các khối nằm sau phần đầu trang (hero) của mỗi trang, không cần sửa HTML.
   - Có thể thêm tay: gắn thuộc tính data-reveal vào bất kỳ phần tử nào.
   - Mỗi phần tử chỉ chạy một lần, rồi được trả về trạng thái bình thường.
   - Tắt hẳn nếu người dùng bật "giảm chuyển động" trong hệ điều hành,
     hoặc trình duyệt không hỗ trợ IntersectionObserver (nội dung vẫn hiện đầy đủ). */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var STEP = 70;      // ms lệch nhau giữa các mục trong cùng một danh sách
  var MAX_STEPS = 4;  // tối đa 4 bậc lệch, tránh phải chờ lâu

  function mark(el, delay) {
    if (el.hasAttribute('data-reveal')) return;
    el.setAttribute('data-reveal', '');
    if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
  }

  function collect() {
    var sections = document.querySelectorAll('main > section');
    Array.prototype.forEach.call(sections, function (sec, i) {
      if (i === 0) return;                     // hero: hiện ngay, không hiệu ứng
      var inner = sec.firstElementChild;
      if (!inner) return;
      Array.prototype.forEach.call(inner.children, function (item) {
        var isGroup = item.matches('.grid, ul, ol') && item.children.length > 1;
        if (isGroup) {
          Array.prototype.forEach.call(item.children, function (child, k) {
            mark(child, Math.min(k, MAX_STEPS) * STEP);
          });
        } else {
          mark(item, 0);
        }
      });
    });
  }

  function init() {
    collect();
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        el.classList.add('is-visible');
        /* Sau khi chạy xong, bỏ hẳn thuộc tính để hiệu ứng hover của phần tử không bị trễ theo */
        setTimeout(function () {
          el.removeAttribute('data-reveal');
          el.classList.remove('is-visible');
          el.style.removeProperty('--reveal-delay');
        }, 1000);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    /* Bật trạng thái ẩn và bắt đầu theo dõi trong cùng một nhịp để tránh nháy hình */
    document.documentElement.classList.add('js-reveal');
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
