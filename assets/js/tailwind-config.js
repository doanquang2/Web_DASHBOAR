/* Cấu hình Tailwind dùng chung cho mọi trang.
   Nạp ngay sau dòng nạp Tailwind CDN. */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#071B3F',
          900: '#0B2A5B', // xanh dương đậm chủ đạo
          800: '#123775',
          700: '#1B4A9C',
        },
        brand: {
          DEFAULT: '#1F5FD6', // xanh nhấn cho liên kết, focus
          dark: '#174BAA',
          soft: '#EAF1FD',
        },
        paper: '#F5F8FC', // nền xanh xám rất nhạt
        ink: '#0A1A33',
        line: '#D7E0EE',
        signal: '#F5A524', // màu hổ phách: chỉ dùng cho "có dòng điện"
      },
      maxWidth: {
        page: '72rem',
      },
    },
  },
};
