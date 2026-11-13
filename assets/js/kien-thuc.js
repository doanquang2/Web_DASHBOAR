/* Trang Kiến thức: danh sách bài, lọc theo chủ đề, tìm kiếm và đọc từng bài.
   - Danh sách lấy từ window.ARTICLES (file kien-thuc-data.js)
   - Mở bài bằng đường dẫn dạng kien-thuc.html#ten-bai (chạy được cả khi mở file trực tiếp) */
(function () {
  'use strict';

  var CATS = [
    { id: 'all', label: 'Tất cả' },
    { id: 'plc', label: 'PLC' },
    { id: 'hmi', label: 'HMI' },
    { id: 'bien-tan', label: 'Biến tần' },
    { id: 'esp32-iot', label: 'ESP32 và IoT' },
    { id: 'cam-bien', label: 'Cảm biến' },
    { id: 'dien-cong-nghiep', label: 'Điện công nghiệp' },
  ];

  var DATA = window.ARTICLES || [];
  var DEFAULT_TITLE = document.title;
  var state = { cat: 'all', q: '' };

  var els = {
    viewList: document.getElementById('view-list'),
    viewReader: document.getElementById('view-reader'),
    filters: document.getElementById('filters'),
    search: document.getElementById('search'),
    list: document.getElementById('list'),
    count: document.getElementById('result-count'),
    empty: document.getElementById('empty'),
  };

  function catLabel(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i].label;
    return id;
  }

  function normalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Danh sách ---------- */
  function renderFilters() {
    els.filters.innerHTML = CATS.map(function (c) {
      var on = c.id === state.cat;
      var cls = on
        ? 'border-navy-900 bg-navy-900 text-white'
        : 'border-line bg-white text-slate-700 hover:border-navy-900 hover:text-navy-900';
      return (
        '<button type="button" data-cat="' + c.id + '" aria-pressed="' + on + '" ' +
        'class="rounded-full border px-4 py-2 text-sm font-medium transition-colors ' + cls + '">' +
        escapeHTML(c.label) + '</button>'
      );
    }).join('');
  }

  function renderList() {
    var q = normalize(state.q.trim());
    var items = DATA.filter(function (a) {
      if (state.cat !== 'all' && a.category !== state.cat) return false;
      if (!q) return true;
      return normalize(a.title + ' ' + a.summary + ' ' + catLabel(a.category)).indexOf(q) !== -1;
    });

    els.list.innerHTML = items.map(function (a) {
      return (
        '<li>' +
          '<a href="#' + a.slug + '" class="group grid gap-1 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">' +
            '<div>' +
              '<h2 class="text-lg font-semibold text-navy-900 group-hover:text-brand">' + escapeHTML(a.title) + '</h2>' +
              '<p class="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">' + escapeHTML(a.summary) + '</p>' +
            '</div>' +
            '<p class="text-sm text-slate-500">' + escapeHTML(catLabel(a.category)) + ', ' + a.minutes + ' phút đọc</p>' +
          '</a>' +
        '</li>'
      );
    }).join('');

    els.empty.hidden = items.length !== 0;
    els.list.hidden = items.length === 0;
    els.count.textContent = items.length
      ? 'Có ' + items.length + ' bài viết'
      : '';
  }

  /* ---------- Đọc bài ---------- */
  function renderReader(a) {
    var related = DATA.filter(function (b) { return b.slug !== a.slug; })
      .sort(function (x, y) {
        return (y.category === a.category) - (x.category === a.category);
      })
      .slice(0, 2);

    els.viewReader.innerHTML =
      '<div class="mx-auto max-w-page px-4 py-10 sm:px-6 lg:py-14">' +
        '<a href="#danh-sach" class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark hover:underline">' +
          '<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 11-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clip-rule="evenodd"/></svg>' +
          'Tất cả bài viết</a>' +
        '<p class="mt-8 text-sm font-medium text-brand">' + escapeHTML(catLabel(a.category)) + ', ' + a.minutes + ' phút đọc</p>' +
        '<h1 id="reader-title" tabindex="-1" class="mt-2 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-4xl">' + escapeHTML(a.title) + '</h1>' +
        '<p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">' + escapeHTML(a.summary) + '</p>' +
        '<div class="article-body mt-8 border-t border-line pt-2">' + a.body + '</div>' +

        '<div class="mt-14 max-w-2xl rounded-lg border border-line bg-paper p-6">' +
          '<h2 class="text-lg font-semibold text-navy-900">Muốn có sẵn chương trình chạy được?</h2>' +
          '<p class="mt-2 text-sm leading-relaxed text-slate-600">Các gói source code đều kèm sơ đồ đấu dây và hướng dẫn cài đặt. Cần chỉnh theo máy của bạn thì nhắn Zalo để được hỗ trợ.</p>' +
          '<div class="mt-4 flex flex-col gap-3 sm:flex-row">' +
            '<a href="source-code.html" class="inline-flex items-center justify-center rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800">Xem source code</a>' +
            '<a href="https://zalo.me/0971048764" target="_blank" rel="noopener" class="inline-flex items-center justify-center rounded-md border border-navy-900/30 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900">Nhắn Zalo</a>' +
          '</div>' +
        '</div>' +

        (related.length
          ? '<div class="mt-14"><h2 class="text-xl font-bold text-navy-900">Đọc tiếp</h2>' +
            '<ul class="mt-4 max-w-3xl divide-y divide-line border-y border-line">' +
            related.map(function (b) {
              return (
                '<li><a href="#' + b.slug + '" class="group block py-5">' +
                  '<p class="text-sm text-slate-500">' + escapeHTML(catLabel(b.category)) + ', ' + b.minutes + ' phút đọc</p>' +
                  '<p class="mt-1 text-base font-semibold text-navy-900 group-hover:text-brand">' + escapeHTML(b.title) + '</p>' +
                '</a></li>'
              );
            }).join('') +
            '</ul></div>'
          : '') +
      '</div>';
  }

  /* ---------- Định tuyến theo #hash ---------- */
  function route() {
    var slug = decodeURIComponent(location.hash.replace(/^#/, ''));
    var art = null;
    for (var i = 0; i < DATA.length; i++) if (DATA[i].slug === slug) art = DATA[i];

    if (art) {
      renderReader(art);
      els.viewList.hidden = true;
      els.viewReader.hidden = false;
      document.title = art.title + ' | Automation DQ';
      window.scrollTo(0, 0);
      var h = document.getElementById('reader-title');
      if (h) h.focus({ preventScroll: true });
    } else {
      els.viewReader.hidden = true;
      els.viewList.hidden = false;
      document.title = DEFAULT_TITLE;
    }
  }

  function init() {
    /* Chủ đề từ đường dẫn, ví dụ kien-thuc.html?danh-muc=plc (từ các ô ở trang chủ) */
    try {
      var cat = new URLSearchParams(location.search).get('danh-muc');
      if (cat && CATS.some(function (c) { return c.id === cat; })) state.cat = cat;
    } catch (e) { /* bỏ qua */ }

    renderFilters();
    renderList();

    els.filters.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      state.cat = btn.getAttribute('data-cat');
      renderFilters();
      renderList();
    });

    els.search.addEventListener('input', function () {
      state.q = els.search.value;
      renderList();
    });

    window.addEventListener('hashchange', route);
    route();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
