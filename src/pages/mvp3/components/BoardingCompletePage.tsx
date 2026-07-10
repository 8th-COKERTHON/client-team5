import { useState } from 'react';
import backIcon from '@/assets/icons/back.svg';
import closeIcon from '@/assets/icons/close.svg';
import airplaneBackgroundIcon from '@/assets/images/airplane_bg.svg';
import ticketBackground from '@/assets/images/ticket_bg2.svg';
import { FLAG_URLS } from '../mocks/flagUrls';
import FlagIcon from './FlagIcon';
import MobileStatusBar from './MobileStatusBar';

interface BoardingCompletePageProps {
  onBack: () => void;
  onClose: () => void;
}

const INITIAL_CHECKLIST = [
  { itemId: 1, title: '조명 낮추기', isChecked: true },
  { itemId: 2, title: '스트레칭 10분 하기', isChecked: true },
  { itemId: 3, title: '휴대폰 충전하기', isChecked: false },
  { itemId: 4, title: '알람 설정하기', isChecked: false },
];

const BoardingCompletePage = ({ onBack, onClose }: BoardingCompletePageProps) => {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  const handleChecklistClick = (itemId: number) => {
    setChecklist((items) =>
      items.map((item) =>
        item.itemId === itemId ? { ...item, isChecked: !item.isChecked } : item,
      ),
    );
  };

  return (
    <main className="h-full w-full overflow-hidden bg-white text-[#101522]">
      <div className="mvp3-screen">
        <MobileStatusBar />
        <header className="mvp3-navbar">
          <button
            type="button"
            aria-label="비행 가이드로 돌아가기"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#f2f5fb]"
          >
            <img src={backIcon} alt="" className="h-5 w-5" />
          </button>
          <h1 className="text-center text-[16px] leading-[27px] font-medium text-[#0D2571]">탑승 완료</h1>
          <button
            type="button"
            aria-label="탑승 화면 닫기"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f2f5fb]"
          >
            <img src={closeIcon} alt="" className="h-3 w-3" />
          </button>
        </header>

        <section className="mt-7">
          <h2 className="text-[20px] leading-[29px] font-bold">
            <span className="text-[#3159b6]">다카행 탑승</span>을<br />
            시작할 시간이에요.
          </h2>
          <p className="mt-2 text-xs text-[#888]">DEL → DAC · DAY 1</p>
        </section>

        <article className="relative mt-6 aspect-[381/305] w-full">
          <img src={ticketBackground} alt="" className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-[10.5%] top-[12%] bottom-[16%] flex flex-col">
            <p className="text-[8px] tracking-[0.13em] text-[#9299aa]">BOARDING PASS</p>
            <div className="mt-2 grid w-[68%] grid-cols-[1fr_auto_1fr] items-center gap-2">
              <p className="font-oswald flex items-center gap-1 text-[15.2px] font-bold text-[#112757]">
                <FlagIcon src={FLAG_URLS.india} alt="인도 국기" /> DEL
              </p>
              <div className="relative flex h-6 w-9 items-center justify-center">
                <img
                  src={airplaneBackgroundIcon}
                  alt=""
                  className="absolute inset-x-0 bottom-0 w-full"
                />
              </div>
              <p className="font-oswald flex items-center justify-end gap-1 text-right text-[15.2px] font-bold text-[#112757]">
                DAC <FlagIcon src={FLAG_URLS.bangladesh} alt="방글라데시 국기" />
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[8px] text-[#999]">목표 출발</p>
                <strong className="mt-1 block font-mono text-[28.8px] leading-none text-[#102c7c]">
                  02:30
                </strong>
                <p className="mt-1 text-[8px] text-[#888]">오전 (AM)</p>
              </div>
              <div>
                <p className="text-[8px] text-[#999]">출발 가능 시간</p>
                <strong className="mt-2 block font-mono text-[14.4px] text-[#777]">
                  02:10 - 02:40
                </strong>
              </div>
            </div>
          </div>
        </article>

        <section className="mt-1 rounded-[1.1rem] bg-white px-6 py-5 shadow-[0_0.7rem_1.8rem_rgba(27,43,83,0.07)]">
          <h2 className="text-sm font-bold">탑승 전 체크리스트</h2>
          <ul className="mt-4 space-y-3">
            {checklist.map((item) => (
              <li key={item.itemId}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.isChecked}
                  onClick={() => handleChecklistClick(item.itemId)}
                  className="flex w-full items-center gap-3 text-left text-xs"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${item.isChecked ? 'bg-[#173485] text-white' : 'bg-[#e5e5e5] text-transparent'}`}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          className="mt-auto h-[52px] w-full shrink-0 rounded-[8px] bg-[#0D2571] px-5 text-[15px] leading-[22.5px] font-medium text-white shadow-[0_4px_20px_rgba(18,18,18,0.05)] transition hover:bg-[#102b77]"
        >
          이제 잘게요
        </button>
      </div>
    </main>
  );
};

export default BoardingCompletePage;
