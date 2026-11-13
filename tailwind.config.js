/* Cấu hình biên dịch Tailwind (thay cho assets/js/tailwind-config.js khi dùng CDN).
   Chạy: npm run build:css  (hoặc npm run build để làm cả bài viết và CSS) */
module.exports = {
  content: [
    './*.html',
    './bai-viet/*.html',
    './assets/js/**/*.js',
    './tools/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#071B3F',
          900: '#0B2A5B',
          800: '#123775',
          700: '#1B4A9C',
        },
        brand: {
          DEFAULT: '#1F5FD6',
          dark: '#174BAA',
          soft: '#EAF1FD',
        },
        paper: '#F5F8FC',
        ink: '#0A1A33',
        line: '#D7E0EE',
        signal: '#F5A524',
      },
      maxWidth: {
        page: '72rem',
      },
    },
  },
  plugins: [],
};
