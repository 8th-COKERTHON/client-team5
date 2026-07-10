import type { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
}

/**
 * 모든 화면의 최상위 레이아웃.
 *
 * - 모바일 뷰포트(<= sm breakpoint)에서는 화면을 100% 꽉 채운다.
 * - 웹/가로가 긴 디바이스(> sm breakpoint)에서는 390x844 사이즈로 고정하고,
 *   나머지 영역은 여백(바깥 배경)으로 남긴다.
 *
 * breakpoint 기준값은 tailwind.config.ts 의 `screens.sm` 과 일치해야 한다.
 */
export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#fff]">
      <div className="bg-White relative h-dvh w-full overflow-hidden sm:h-[844px] sm:w-[390px] sm:rounded-[40px] sm:shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        {/* 실제 화면 콘텐츠는 이 안에서만 그려진다 */}
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
