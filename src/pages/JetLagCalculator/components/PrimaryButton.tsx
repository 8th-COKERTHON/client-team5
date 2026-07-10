// components/PrimaryButton.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrimaryButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'children'
> {
  /** 버튼 클릭 시 이동할 경로 (사용처에서 직접 정의) */
  navigateTo: string;
  /** 버튼 내부에 표시할 텍스트 (사용처에서 직접 정의) */
  children: ReactNode;
  /** 텍스트 옆에 표시할 아이콘 (예: 화살표 등, 선택사항) */
  icon?: ReactNode;
  /** 페이지 이동 전에 실행할 로직 (예: 유효성 검사, 로그 전송 등) */
  onBeforeNavigate?: () => void;
  /** 바깥 wrapper에 추가로 적용할 className */
  wrapperClassName?: string;
  /** 버튼 자체에 추가로 적용할 className */
  buttonClassName?: string;
}

export const PrimaryButton = ({
  navigateTo,
  children,
  icon,
  onBeforeNavigate,
  wrapperClassName = '',
  buttonClassName = '',
  ...rest
}: PrimaryButtonProps) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    onBeforeNavigate?.();
    navigate(navigateTo);
  };

  return (
    <div className={wrapperClassName}>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`flex w-[21.25rem] items-center justify-center gap-[0.5rem] rounded-lg bg-[#0D2571] px-[1.25rem] py-[0.875rem] text-center font-['Pretendard'] text-[0.9375rem] leading-[1.40625rem] font-medium tracking-[0.009375rem] text-white ${buttonClassName}`}
        {...rest}
      >
        {children}
        {icon && <span aria-hidden>{icon}</span>}
      </button>
    </div>
  );
};
