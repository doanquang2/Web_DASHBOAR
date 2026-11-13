/* Header + Footer dùng chung.
   Cách dùng ở mỗi trang:
     <div id="site-header" data-active="kien-thuc"></div>
     ...nội dung...
     <div id="site-footer"></div>
   data-active = id của mục menu đang mở (để trống ở trang chủ). */
(function () {
  'use strict';

  var SITE = {
    name: 'Automation DQ',
    zalo: 'https://zalo.me/0971048764',
    zaloText: '0971 048 764',
    email: 'automationDQ03@gmail.com',
  };

  var NAV = [
    { id: 'kien-thuc', label: 'Kiến thức', href: 'kien-thuc.html' },
    { id: 'source-code', label: 'Source code', href: 'source-code.html' },
    { id: 'tai-lieu', label: 'Tài liệu miễn phí', href: 'tai-lieu.html' },
    { id: 'gioi-thieu', label: 'Giới thiệu', href: 'gioi-thieu.html' },
    { id: 'lien-he', label: 'Liên hệ', href: 'lien-he.html' },
  ];

  /* Logo: một "nấc thang" ladder logic — hai thanh dọc và một tiếp điểm */
  function logo() {
    return (
      '<svg viewBox="0 0 32 32" class="h-8 w-8 shrink-0" aria-hidden="true">' +
      '<rect width="32" height="32" rx="7" fill="#0B2A5B"/>' +
      '<path d="M7 9v14M25 9v14M7 16h7M18 16h7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M14 11.5v9M18 11.5v9" stroke="#F5A524" stroke-width="2.4" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function navLinks(active, mobile) {
    return NAV.map(function (item) {
      var current = item.id === active;
      var base = mobile
        ? 'block rounded-md px-3 py-3 text-base font-medium '
        : 'rounded-md px-3 py-2 text-sm font-medium transition-colors ';
      var state = current
        ? 'bg-brand-soft text-navy-900'
        : 'text-slate-700 hover:bg-paper hover:text-navy-900';
      return (
        '<li><a href="' + item.href + '" class="' + base + state + '"' +
        (current ? ' aria-current="page"' : '') + '>' + item.label + '</a></li>'
      );
    }).join('');
  }

  function headerHTML(active) {
    return (
      '<a href="#noi-dung" class="skip-link">Bỏ qua menu, đến nội dung chính</a>' +
      '<header class="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">' +
        '<div class="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6">' +
          '<a href="index.html" class="flex items-center gap-2.5" aria-label="' + SITE.name + ' - về trang chủ">' +
            logo() +
            '<span class="text-lg font-bold tracking-tight text-navy-900">' + SITE.name + '</span>' +
          '</a>' +
          '<nav aria-label="Menu chính" class="hidden lg:block">' +
            '<ul class="flex items-center gap-1">' + navLinks(active, false) + '</ul>' +
          '</nav>' +
          '<div class="flex items-center gap-2">' +
            '<a href="' + SITE.zalo + '" target="_blank" rel="noopener" ' +
              'class="hidden items-center rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800 sm:inline-flex">' +
              'Nhắn Zalo</a>' +
            '<button id="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Mở menu" ' +
              'class="inline-flex h-11 w-11 items-center justify-center rounded-md text-navy-900 hover:bg-paper lg:hidden">' +
              '<svg id="icon-open" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>' +
              '<svg id="icon-close" class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div id="mobile-menu" class="hidden border-t border-line bg-white lg:hidden">' +
          '<nav aria-label="Menu di động" class="mx-auto max-w-page px-4 py-3 sm:px-6">' +
            '<ul class="space-y-1">' + navLinks(active, true) + '</ul>' +
            '<a href="' + SITE.zalo + '" target="_blank" rel="noopener" ' +
              'class="mt-3 flex items-center justify-center rounded-md bg-navy-900 px-4 py-3 text-base font-semibold text-white hover:bg-navy-800">' +
              'Nhắn Zalo ' + SITE.zaloText + '</a>' +
          '</nav>' +
        '</div>' +
      '</header>'
    );
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    var linkCls = 'inline-block py-1 text-slate-300 transition-colors hover:text-white';
    return (
      '<footer class="bg-navy-950 text-slate-300">' +
        '<div class="mx-auto max-w-page px-4 py-14 sm:px-6">' +
          '<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">' +
            '<div class="lg:col-span-2">' +
              '<a href="index.html" class="inline-flex items-center gap-2.5" aria-label="' + SITE.name + ' - về trang chủ">' +
                logo() +
                '<span class="text-lg font-bold text-white">' + SITE.name + '</span>' +
              '</a>' +
              '<p class="mt-4 max-w-sm text-sm leading-relaxed">' +
                'Chia sẻ kiến thức tự động hóa từ thực tế lắp đặt, và bán source code PLC, ESP32 đã kèm sơ đồ đấu dây để bạn dùng được ngay.' +
              '</p>' +
            '</div>' +
            '<div>' +
              '<h2 class="text-sm font-semibold text-white">Khám phá</h2>' +
              '<ul class="mt-4 space-y-2.5 text-sm">' +
                '<li><a class="' + linkCls + '" href="kien-thuc.html">Bài viết kiến thức</a></li>' +
                '<li><a class="' + linkCls + '" href="source-code.html">Source code</a></li>' +
                '<li><a class="' + linkCls + '" href="tai-lieu.html">Tài liệu miễn phí</a></li>' +
                '<li><a class="' + linkCls + '" href="gioi-thieu.html">Giới thiệu</a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<h2 class="text-sm font-semibold text-white">Liên hệ</h2>' +
              '<ul class="mt-4 space-y-2.5 text-sm">' +
                '<li><a class="' + linkCls + '" href="' + SITE.zalo + '" target="_blank" rel="noopener">Zalo: ' + SITE.zaloText + '</a></li>' +
                '<li><a class="' + linkCls + '" href="mailto:' + SITE.email + '">' + SITE.email + '</a></li>' +
                '<li><a class="' + linkCls + '" href="chinh-sach.html">Chính sách hỗ trợ</a></li>' +
                '<li><a class="' + linkCls + '" href="dieu-khoan.html">Điều khoản sử dụng source code</a></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="mt-12 border-t border-white/10 pt-6 text-sm text-slate-400">' +
            '© ' + year + ' ' + SITE.name + '. Mọi quyền được bảo lưu.' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  function initMenu() {
    var btn = document.getElementById('menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    var iconOpen = document.getElementById('icon-open');
    var iconClose = document.getElementById('icon-close');

    function setOpen(open) {
      menu.classList.toggle('hidden', !open);
      iconOpen.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
    /* Quay lại màn hình rộng thì tự đóng menu di động */
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* Trang con (vd bai-viet/ten-bai.html) khai báo data-root="../" để các liên kết nội bộ
     của Header/Footer vẫn trỏ đúng. Liên kết ngoài (https, mailto) và #neo được giữ nguyên. */
  function withRoot(html, root) {
    if (!root) return html;
    return html.replace(/href="(?!https?:|mailto:|#)([^"]+)"/g, 'href="' + root + '$1"');
  }

  function mount() {
    var h = document.getElementById('site-header');
    var f = document.getElementById('site-footer');
    var root = (h && h.getAttribute('data-root')) || (f && f.getAttribute('data-root')) || '';
    if (h) h.innerHTML = withRoot(headerHTML(h.getAttribute('data-active') || ''), root);
    if (f) f.innerHTML = withRoot(footerHTML(), root);
    initMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
