import { useState } from 'react';
import backIcon from '@/assets/icons/back.svg';
import closeIcon from '@/assets/icons/close.svg';
import shareIcon from '@/assets/icons/share.svg';
import barcodeImage from '@/assets/images/barcode.svg';
import ticketBackground from '@/assets/images/ticket_bg.svg';
import { FLAG_URLS } from '../mocks/flagUrls';
import FlagIcon from './FlagIcon';
import MobileStatusBar from './MobileStatusBar';
import SleepSchedule from './SleepSchedule';

interface ReturnTicketPageProps {
  onBack: () => void;
  onClose: () => void;
  onPrepare: () => void;
}

const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${source}`));
    image.src = source;
  });

const ReturnTicketPage = ({ onBack, onClose, onPrepare }: ReturnTicketPageProps) => {
  const [isSaving, setSaving] = useState(false);

  const handleSaveTicket = async () => {
    setSaving(true);

    try {
      await document.fonts.ready;
      const [background, barcode] = await Promise.all([
        loadImage(ticketBackground),
        loadImage(barcodeImage),
      ]);
      const canvas = document.createElement('canvas');
      canvas.width = 764;
      canvas.height = 1052;
      const context = canvas.getContext('2d');

      if (!context) return;

      context.scale(2, 2);
      context.drawImage(background, 0, 0, 382, 526);
      context.textBaseline = 'middle';

      context.fillStyle = '#8490ab';
      context.font = '12px "Pretendard Variable", Pretendard, sans-serif';
      context.fillText('DATE', 36, 58);
      context.fillStyle = '#17223e';
      context.font = '700 13px ui-monospace, monospace';
      context.fillText('2026.07.10 · FRI', 84, 58);
      context.font = '34px sans-serif';

      context.fillStyle = '#102c7c';
      context.font = '900 66px ui-monospace, monospace';
      context.fillText('DHAKA', 36, 132);
      context.fillStyle = '#7180a1';
      context.font = '14px "Pretendard Variable", Pretendard, sans-serif';
      context.fillText('방글라데시 다카', 36, 184);

      context.fillStyle = '#173485';
      context.beginPath();
      context.roundRect(36, 201, 52, 38, 8);
      context.fill();
      context.fillStyle = '#ffffff';
      context.font = '900 15px ui-monospace, monospace';
      context.fillText('DAC', 47, 220);

      const drawSleepSchedule = (
        x: number,
        label: string,
        bedtime: string,
        waketime: string,
        isTarget: boolean,
      ) => {
        context.fillStyle = isTarget ? '#E0EAFF' : '#F3F3F3';
        context.beginPath();
        context.roundRect(x, 251, 132, 25, 4);
        context.fill();
        context.fillStyle = isTarget ? '#121212' : '#707070';
        context.font = '500 10px "Pretendard Variable", Pretendard, sans-serif';
        context.fillText(label, x + 10, 263.5);
        context.fillStyle = '#707070';
        context.font = '10px "Pretendard Variable", Pretendard, sans-serif';
        context.fillText('잠들기', x, 296);
        context.fillText('기상', x, 342);
        context.fillStyle = isTarget ? '#0D2571' : '#121212';
        context.font = '700 20px "Space Mono", monospace';
        context.fillText(bedtime, x, 316);
        context.fillText(waketime, x, 362);
      };

      drawSleepSchedule(36, 'CURRENT SLEEP', '03:00 AM', '10:00 AM', false);
      drawSleepSchedule(204, 'TARGET SLEEP', '02:30 PM', '09:30 AM', true);
      context.drawImage(barcode, 48, 410, 286, 66);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'return-route-dhaka-2026-07-10.png';
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="h-full w-full overflow-hidden bg-white text-[#101522]">
      <div className="mvp3-screen">
        <MobileStatusBar />
        <header className="mvp3-navbar">
          <button
            type="button"
            aria-label="전체 귀국 루트로 돌아가기"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#f2f5fb]"
          >
            <img src={backIcon} alt="" className="h-5 w-5" />
          </button>
          <h1 className="text-center text-[16px] leading-[27px] font-medium text-[#0D2571]">
            오늘 귀국 루트
          </h1>
          <button
            type="button"
            aria-label="귀국 루트 닫기"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f2f5fb]"
          >
            <img src={closeIcon} alt="" className="h-3 w-3" />
          </button>
        </header>

        <section className="mt-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[13px] leading-[20px] text-[#707070]">해당 귀국 루트로</p>
            <h2 className="mt-2 text-[20px] leading-[27px] font-semibold text-[#121212]">
              서울까지 <span className="text-[#3A55A9]">30분 앞당겨요.</span>
            </h2>
          </div>
        </section>

        <article className="relative mt-7 h-[486px] w-[342px] max-w-none shrink-0 self-center">
          <img
            src={ticketBackground}
            alt=""
            className="pointer-events-none absolute -top-4 -left-5 h-[526px] w-[382px] max-w-none"
          />
          <div className="absolute inset-x-7 top-8 bottom-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-[15px] leading-[12px] tracking-[1.2px] text-[#8A97B0]">
                DATE{' '}
                <strong className="font-space-mono ml-2 text-[15px] leading-[13.5px] font-bold tracking-normal text-[#0D2571]">
                  2026.07.10 · FRI
                </strong>
              </p>
              <FlagIcon
                src={FLAG_URLS.bangladesh}
                alt="방글라데시 국기"
                className="h-[2.2rem] w-[3.3rem]"
              />
            </div>
            <h3 className="font-oswald mt-3 text-[70px] leading-[76px] font-bold tracking-[0.9px] text-[#0D2571]">
              DHAKA
            </h3>
            <p className="font-noto-sans-kr mt-3 text-[15px] leading-[18px] text-[#5A6A8A]">
              방글라데시 다카
            </p>
            <span className="font-oswald mt-3 inline-flex w-fit items-center justify-center rounded-[6px] bg-[#0D2571] px-[9px] py-[4px] text-[16.287px] leading-[24.431px] font-bold tracking-[0.977px] text-white">
              DAC
            </span>

            <div className="mt-1 grid grid-cols-2 gap-[2.3rem]">
              <SleepSchedule
                label="CURRENT SLEEP"
                sleep={{ bedtime: '03:00', waketime: '10:00' }}
              />
              <SleepSchedule
                label="TARGET SLEEP"
                sleep={{ bedtime: '14:30', waketime: '09:30' }}
                isTarget
              />
            </div>

            <img
              src={barcodeImage}
              alt="항공권 바코드"
              className="mt-auto h-[5.2rem] w-full object-fill"
            />
          </div>
        </article>

        <div className="mt-auto grid w-[353px] max-w-none shrink-0 grid-cols-2 gap-3 self-center pt-6">
          <button
            type="button"
            onClick={handleSaveTicket}
            disabled={isSaving}
            className="flex h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[#0D2571] px-3 text-[14px] leading-[21px] font-medium text-white shadow-[0_4px_20px_rgba(18,18,18,0.05)] transition hover:bg-[#102b77]"
          >
            <img src={shareIcon} alt="" className="h-[1.1rem] w-[1.1rem] brightness-0 invert" />
            {isSaving ? '티켓 저장 중' : '결과 공유하기'}
          </button>
          <button
            type="button"
            onClick={onPrepare}
            className="h-[52px] rounded-[8px] border border-[#E6E6E6] bg-white px-3 text-[14px] leading-[21px] font-medium text-[#121212] shadow-[0_4px_20px_rgba(18,18,18,0.05)]"
          >
            탑승 수속 준비하기
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReturnTicketPage;
