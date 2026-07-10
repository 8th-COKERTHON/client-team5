import type { SleepTime } from '../types';

interface SleepScheduleProps {
  label: string;
  sleep: SleepTime;
  isTarget?: boolean;
}

const formatTime = (time: string) => {
  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  const period = hour >= 12 ? 'PM' : 'AM';
  const twelveHour = hour % 12 || 12;

  return `${String(twelveHour).padStart(2, '0')}:${minute} ${period}`;
};

const SleepSchedule = ({ label, sleep, isTarget = false }: SleepScheduleProps) => {
  const valueColor = isTarget ? 'text-[#0D2571]' : 'text-[#121212]';

  return (
    <section className="min-w-0">
      <span
        className={`inline-flex rounded px-2.5 py-[0.4375rem] text-[10px] leading-[10.5px] font-medium tracking-[0.7px] ${
          isTarget ? 'bg-[#E0EAFF] text-[#121212]' : 'bg-[#F3F3F3] text-[#707070]'
        }`}
      >
        {label}
      </span>
      <dl className="mt-3 space-y-3.5">
        <div>
          <dt className="text-[10px] leading-[10.5px] text-[#707070]">잠들기</dt>
          <dd
            className={`font-space-mono mt-1 text-[20px] leading-[21px] font-bold tracking-[-0.03em] ${valueColor}`}
          >
            {formatTime(sleep.bedtime)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] leading-[10.5px] text-[#707070]">기상</dt>
          <dd
            className={`font-space-mono mt-1 text-[20px] leading-[21px] font-medium tracking-[-0.03em] ${valueColor}`}
          >
            {formatTime(sleep.waketime)}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default SleepSchedule;
