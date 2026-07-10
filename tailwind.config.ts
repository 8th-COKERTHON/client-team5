import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      height: {
        dvh: '100dvh',
      },
      screens: {
        // 이 값 이하: 모바일(풀스크린) / 이 값 초과: 웹(390x844 고정 + 여백)
        sm: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config;
