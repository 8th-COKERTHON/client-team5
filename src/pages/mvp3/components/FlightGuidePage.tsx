import backIcon from '@/assets/icons/back.svg';
import closeIcon from '@/assets/icons/close.svg';
import airplaneBackgroundIcon from '@/assets/images/airplane_bg.svg';
import { FLAG_URLS } from '../mocks/flagUrls';
import FlagIcon from './FlagIcon';
import MobileStatusBar from './MobileStatusBar';

interface FlightGuidePageProps {
  onBack: () => void;
  onClose: () => void;
  onStart: () => void;
}

interface GuideItem {
  eyebrow: string;
  title: string;
  time: string;
  timeEnd?: string;
  color: string;
}

const GUIDE_ITEMS: GuideItem[] = [
  { eyebrow: 'FLIGHT GUIDE', title: '카페인 마감', time: '18:30', color: '#CBDAF8' },
  { eyebrow: 'BOARDING', title: '취침 준비 시작', time: '01:30', color: '#99B6EF' },
  {
    eyebrow: 'DEPARTURE',
    title: '잠자리에 들기',
    time: '02:10',
    timeEnd: '02:40',
    color: '#6483D3',
  },
  { eyebrow: 'ARRIVAL', title: '목표 시간에 일어나기', time: '09:30', color: '#3A55A9' },
];

const FlightGuidePage = ({ onBack, onClose, onStart }: FlightGuidePageProps) => {
  return (
    <main className="h-full w-full overflow-hidden bg-white text-[#101522]">
      <div className="mvp3-screen">
        <MobileStatusBar />
        <header className="mvp3-navbar">
          <button
            type="button"
            aria-label="오늘 귀국 루트로 돌아가기"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#f2f5fb]"
          >
            <img src={backIcon} alt="" className="h-5 w-5" />
          </button>
          <h1 className="text-center text-[16px] leading-[27px] font-medium text-[#0D2571]">
            오늘의 비행 가이드
          </h1>
          <button
            type="button"
            aria-label="비행 가이드 닫기"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f2f5fb]"
          >
            <img src={closeIcon} alt="" className="h-3 w-3" />
          </button>
        </header>

        <section className="mt-7">
          <p className="text-sm text-[#888]">총 8일 중</p>
          <span className="mt-3 inline-flex items-center justify-center rounded-[28px] bg-[#3A55A9] px-[20px] py-[6px] text-[16px] leading-[27px] font-medium text-white">
            DAY 1
          </span>
        </section>

        <article className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-[1.1rem] bg-white px-6 py-6 shadow-[0_0.7rem_1.8rem_rgba(27,43,83,0.07)]">
          <div>
            <p className="text-[10px] tracking-[0.1em] text-[#9aa5bd]">FROM</p>
            <p className="font-oswald mt-2 flex items-center gap-1 text-[16px] font-bold whitespace-nowrap text-[#112757]">
              <FlagIcon src={FLAG_URLS.india} alt="인도 국기" /> NEW DELHI
            </p>
            <p className="mt-1 text-[10px] text-[#8b96ad]">DEL</p>
          </div>
          <div className="relative flex h-10 w-[3.4rem] items-center justify-center">
            <img
              src={airplaneBackgroundIcon}
              alt=""
              className="absolute inset-x-0 bottom-0 w-full"
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.1em] text-[#9aa5bd]">TO</p>
            <p className="font-oswald mt-2 flex items-center justify-end gap-1 text-[16px] font-bold whitespace-nowrap text-[#112757]">
              DHAKA <FlagIcon src={FLAG_URLS.bangladesh} alt="방글라데시 국기" />
            </p>
            <p className="mt-1 text-[10px] text-[#8b96ad]">DAC</p>
          </div>
        </article>

        <h2 className="mt-8 text-[19.2px] font-bold">오늘의 비행 계획</h2>

        <ol className="mt-5 flex h-[281px] w-[341px] shrink-0 flex-col justify-center self-center rounded-[15px] bg-white px-[25px] py-[24px] shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
          {GUIDE_ITEMS.map((item, index) => (
            <li
              key={item.eyebrow}
              className="grid h-[58px] shrink-0 grid-cols-[28px_1fr_auto] items-center gap-3"
            >
              <div className="relative flex h-[58px] items-center justify-center">
                {index < GUIDE_ITEMS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 h-[58px] border-l border-dashed border-[#b8caef]"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="relative z-[1] h-[14px] w-[14px] rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <div>
                <p className="text-[8.8px] tracking-[0.12em] text-[#b3b3b3]">{item.eyebrow}</p>
                <p className="mt-1 text-[15.68px] font-semibold">{item.title}</p>
              </div>
              <div className="font-space-mono text-right">
                <strong
                  className="text-[15px] leading-[15.4px] font-bold"
                  style={{ color: item.color }}
                >
                  {item.time}
                </strong>
                {item.timeEnd && (
                  <p className="mt-1 text-[10px] text-[#b5b5b5]">- {item.timeEnd}</p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onStart}
          className="mt-auto h-[52px] w-full shrink-0 rounded-[8px] bg-[#0D2571] px-5 text-[15px] leading-[22.5px] font-medium text-white shadow-[0_4px_20px_rgba(18,18,18,0.05)] transition hover:bg-[#102b77]"
        >
          탑승 준비 시작
        </button>
      </div>
    </main>
  );
};

export default FlightGuidePage;
