import type { ReactNode } from 'react';
import settingIcon from '@/assets/icons/setting.svg';
import homeEarth from '@/assets/images/home_earth.svg';

const actionButtonClass =
  'flex h-[3.5625rem] w-[8.125rem] items-center justify-center border-[0.1875rem] border-[#cbdaf8] bg-[#121212] text-[1.4375rem] font-light text-[#cbdaf8]';

interface HomeScreenProps {
  children?: ReactNode;
}

export const HomeScreen = ({ children }: HomeScreenProps) => {
  return (
    <main className="min-h-screen bg-[#050814] px-4 py-6">
      <section className="relative mx-auto min-h-[52.75rem] w-full max-w-[24.375rem] overflow-hidden bg-[#0d2571] text-white shadow-2xl">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-[2.8125rem] items-center justify-between px-8 text-[0.9375rem] font-semibold">
          <span>9:41</span>
          <span className="text-xs tracking-[0.08em]" aria-hidden="true">
            ▮▮ ᯤ ▱
          </span>
        </div>

        <div className="absolute left-1/2 top-[4.3125rem] z-10 flex w-[21.375rem] -translate-x-1/2 items-center justify-between">
          <button
            type="button"
            className="flex size-[2.125rem] items-center justify-center text-[2.125rem] leading-none text-[#cbdaf8]"
            aria-label="동행자 추가"
          >
            +
          </button>
          <button
            type="button"
            className="flex size-[1.875rem] items-center justify-center"
            aria-label="설정"
          >
            <img src={settingIcon} alt="" className="size-[1.875rem]" />
          </button>
        </div>

        <img
          src={homeEarth}
          alt=""
          className="absolute left-1/2 top-[11.0625rem] size-[18.8125rem] -translate-x-1/2 object-contain opacity-90"
        />

        <div className="absolute left-1/2 top-[38.875rem] flex w-[18.75rem] -translate-x-1/2 items-center justify-between">
          <button type="button" className={actionButtonClass}>
            여행가기
          </button>
          <button type="button" className={actionButtonClass}>
            귀국하기
          </button>
        </div>

        {children}
      </section>
    </main>
  );
};
