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
    { id: 'kien-thuc', label: 'Kiến thức', href: 'kien-thuc.html', icon: 'book' },
    { id: 'source-code', label: 'Source code', href: 'source-code.html', icon: 'code' },
    { id: 'tai-lieu', label: 'Tài liệu miễn phí', href: 'tai-lieu.html', icon: 'file' },
    { id: 'gioi-thieu', label: 'Giới thiệu', href: 'gioi-thieu.html', icon: 'user' },
    { id: 'lien-he', label: 'Liên hệ', href: 'lien-he.html', icon: 'message' },
  ];

  var ICONS = {
    book: '<path d="M12 7v14m0-14C10.7 5.9 8.9 5 7 5H3v14h4c1.9 0 3.7.9 5 2m0-14c1.3-1.1 3.1-2 5-2h4v14h-4c-1.9 0-3.7.9-5 2"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6m5-16-2 20"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.7 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2.5z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    external: '<path d="M15 3h6v6m-11 5L21 3"/><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    circuit: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M12 7V3m0 18v-4M7 12H3m18 0h-4M7 7 4 4m16 16-3-3m0-10 3-3M4 20l3-3"/>',
    screen: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    wifi: '<path d="M5 12.5a11 11 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0M12 20h.01"/><path d="M2 9a16 16 0 0 1 20 0"/>',
    sensor: '<circle cx="12" cy="12" r="3"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8m12.8 0a9 9 0 0 0 0-12.8M2.8 2.8a13 13 0 0 0 0 18.4m18.4 0a13 13 0 0 0 0-18.4"/>',
    bolt: '<path d="m13 2-3 8h7l-6 12 1-9H5l8-11z"/>',
    play: '<path d="m8 5 12 7-12 7V5z"/>',
    cart: '<path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    location: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    graduation: '<path d="m2 10 10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3.5 3 8.5 3 12 0v-5m4-2v6"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    wrench: '<path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 13l-3-3 3.7-3.7z"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/>',
  };

  function icon(name, className, strokeWidth) {
    if (!ICONS[name]) throw new Error('Icon không được khai báo: ' + name);
    return '<svg class="' + (className || 'h-5 w-5') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (strokeWidth || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  window.ADQIcon = icon;

  function logo(root) {
    return '<img src="' + root + 'assets/img/dq-automation-logo.png" alt="DQ Automation — Giải pháp tự động hóa, nâng tầm sản xuất" class="h-[50px] w-[203px] shrink-0 object-contain sm:h-[58px] sm:w-[236px]">';
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
        (mobile ? ' flex items-center gap-2.5' : ' group inline-flex items-center gap-2.5') +
        (current ? ' aria-current="page"' : '') + '>' +
        '<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white shadow-sm transition-colors group-hover:bg-brand">' +
        icon(item.icon, 'h-5 w-5', 2) + '</span>' +
        item.label + '</a></li>'
      );
    }).join('');
  }

  function headerHTML(active, root) {
    return (
      '<a href="#noi-dung" class="skip-link">Bỏ qua menu, đến nội dung chính</a>' +
      '<header class="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">' +
        '<div class="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6">' +
          '<a href="index.html" class="flex min-w-0 items-center gap-2" aria-label="DQ Automation - về trang chủ">' +
            logo(root) +
          '</a>' +
          '<nav aria-label="Menu chính" class="hidden lg:block">' +
            '<ul class="flex items-center gap-1">' + navLinks(active, false) + '</ul>' +
          '</nav>' +
          '<div class="flex items-center gap-2">' +
            '<a href="' + SITE.zalo + '" target="_blank" rel="noopener" ' +
              'class="hidden items-center gap-2 rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800 sm:inline-flex">' +
              '<span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">' + icon('message', 'h-5 w-5', 2) + '</span>Nhắn Zalo</a>' +
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
              'class="mt-3 flex items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 text-base font-semibold text-white hover:bg-navy-800">' +
              icon('message', 'h-5 w-5') +
              'Nhắn Zalo ' + SITE.zaloText + '</a>' +
          '</nav>' +
        '</div>' +
      '</header>'
    );
  }

  function footerHTML(root) {
    var year = new Date().getFullYear();
    var linkCls = 'py-1 text-slate-300 transition-colors hover:text-white';
    return (
      '<footer class="bg-navy-950 text-slate-300">' +
        '<div class="mx-auto max-w-page px-4 py-14 sm:px-6">' +
          '<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">' +
            '<div class="lg:col-span-2">' +
              '<a href="index.html" class="inline-flex items-center gap-2.5 rounded bg-white" aria-label="DQ Automation - về trang chủ">' +
                logo(root) +
              '</a>' +
              '<p class="mt-4 max-w-sm text-sm leading-relaxed">' +
                'Chia sẻ kiến thức tự động hóa từ thực tế lắp đặt, và bán source code PLC, ESP32 đã kèm sơ đồ đấu dây để bạn dùng được ngay.' +
              '</p>' +
            '</div>' +
            '<div>' +
              '<h2 class="text-sm font-semibold text-white">Khám phá</h2>' +
              '<ul class="mt-4 space-y-2.5 text-sm">' +
                '<li><a class="' + linkCls + ' inline-flex items-center gap-2" href="kien-thuc.html"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-cyan-300">' + icon('book', 'h-4 w-4', 2) + '</span>Bài viết kiến thức</a></li>' +
                '<li><a class="' + linkCls + ' inline-flex items-center gap-2" href="source-code.html"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-cyan-300">' + icon('code', 'h-4 w-4', 2) + '</span>Source code</a></li>' +
                '<li><a class="' + linkCls + ' inline-flex items-center gap-2" href="tai-lieu.html"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-cyan-300">' + icon('file', 'h-4 w-4', 2) + '</span>Tài liệu miễn phí</a></li>' +
                '<li><a class="' + linkCls + ' inline-flex items-center gap-2" href="gioi-thieu.html"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-cyan-300">' + icon('user', 'h-4 w-4', 2) + '</span>Giới thiệu</a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<h2 class="text-sm font-semibold text-white">Liên hệ</h2>' +
              '<ul class="mt-4 space-y-2.5 text-sm">' +
                '<li><a class="' + linkCls + ' inline-flex items-center gap-2" href="' + SITE.zalo + '" target="_blank" rel="noopener"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-cyan-300">' + icon('message', 'h-4 w-4', 2) + '</span>Zalo: ' + SITE.zaloText + '</a></li>' +
                '<li><a class="' + linkCls + ' inline-flex items-center gap-2" href="mailto:' + SITE.email + '"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-cyan-300">' + icon('mail', 'h-4 w-4', 2) + '</span>' + SITE.email + '</a></li>' +
                '<li><a class="' + linkCls + ' inline-flex items-center gap-2" href="chinh-sach.html"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-cyan-300">' + icon('shield', 'h-4 w-4', 2) + '</span>Chính sách hỗ trợ</a></li>' +
                '<li><a class="' + linkCls + ' inline-flex items-center gap-2" href="dieu-khoan.html"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-cyan-300">' + icon('file', 'h-4 w-4', 2) + '</span>Điều khoản sử dụng source code</a></li>' +
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
    if (h) h.innerHTML = withRoot(headerHTML(h.getAttribute('data-active') || '', root), root);
    if (f) f.innerHTML = withRoot(footerHTML(root), root);
    initMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
