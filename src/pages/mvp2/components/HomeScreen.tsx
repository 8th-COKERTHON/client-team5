import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import settingIcon from '@/assets/icons/setting.svg';
import homeEarth from '@/assets/images/home_earth.svg';

const actionButtonClass =
  'flex h-[3.5625rem] w-[8.125rem] items-center justify-center border-[0.1875rem] border-[#cbdaf8] bg-[#121212] text-[1.4375rem] font-light text-[#cbdaf8]';

const menuItemClass =
  'block w-full text-center font-["Pretendard"] text-[1.0625rem] font-medium leading-[1.00975rem] text-white';

const BACKGROUND_MUSIC_CONSENT_KEY = 'backgroundMusicConsent';
const BACKGROUND_MUSIC_TOGGLE_EVENT = 'backgroundMusicToggle';

const MUSIC_DIALOG_TEXT = {
  messageLine1: '\uBC30\uACBD\uC74C\uC545\uC744',
  messageSuffix: ' \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?',
  cancel: '\uCDE8\uC18C',
} as const;

type MusicDialogAction = 'on' | 'off';

interface HomeScreenProps {
  children?: ReactNode;
  isSheetOpen?: boolean;
  onCloseSheet?: () => void;
  onOpenFriends: () => void;
}

export const HomeScreen = ({
  children,
  isSheetOpen = false,
  onCloseSheet,
  onOpenFriends,
}: HomeScreenProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isMusicDialogOpen, setMusicDialogOpen] = useState(false);
  const [musicDialogAction, setMusicDialogAction] =
    useState<MusicDialogAction>('on');
  const [isLoggedIn, setLoggedIn] = useState(() =>
    Boolean(localStorage.getItem('accessToken')),
  );

  const handleStartTrip = () => {
    navigate('/jetlag/onboarding');
  };

  const handleReturnTrip = () => {
    navigate('/mvp3');
  };

  const handleToggleMenu = () => {
    setMenuOpen((currentIsMenuOpen) => !currentIsMenuOpen);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleAuthMenuClick = () => {
    if (isLoggedIn) {
      setMenuOpen(false);
      setLogoutDialogOpen(true);
      return;
    }

    navigate('/login');
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('grantType');
    setLoggedIn(false);
    setLogoutDialogOpen(false);
  };

  const handleToggleMusic = () => {
    const storedConsent = localStorage.getItem(BACKGROUND_MUSIC_CONSENT_KEY);
    const nextAction = storedConsent === 'yes' ? 'off' : 'on';

    setMenuOpen(false);
    setMusicDialogAction(nextAction);
    setMusicDialogOpen(true);
  };

  const handleCancelMusicDialog = () => {
    setMusicDialogOpen(false);
  };

  const handleConfirmMusicDialog = () => {
    const nextConsent = musicDialogAction === 'on' ? 'yes' : 'no';

    localStorage.setItem(BACKGROUND_MUSIC_CONSENT_KEY, nextConsent);
    window.dispatchEvent(new Event(BACKGROUND_MUSIC_TOGGLE_EVENT));
    setMusicDialogOpen(false);
  };

  return (
    <main className="h-full w-full bg-[#050814]">
      <section className="relative h-full w-full overflow-hidden bg-[#0d2571] text-white">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-[2.8125rem] items-center justify-between px-8 text-[0.9375rem] font-semibold">
          <span>9:41</span>
          <span className="text-xs tracking-[0.08em]" aria-hidden="true">
            현지 시간
          </span>
        </div>

        <div className="absolute left-1/2 top-[4.3125rem] z-10 flex w-[21.375rem] -translate-x-1/2 items-center justify-between">
          <button
            type="button"
            className="flex size-[2.125rem] items-center justify-center text-[2.125rem] leading-none text-[#cbdaf8]"
            aria-label="동행 추가 보기"
            onClick={onOpenFriends}
          >
            +
          </button>
          <button
            type="button"
            className="flex size-[1.875rem] items-center justify-center"
            aria-label="설정"
            onClick={handleToggleMenu}
          >
            <img src={settingIcon} alt="" className="size-[1.875rem]" />
          </button>
        </div>

        {isMenuOpen && (
          <>
            <button
              type="button"
              className="absolute inset-0 z-20 cursor-default"
              aria-label="메뉴 닫기"
              onClick={handleCloseMenu}
            />
            <nav className="absolute right-[1.5625rem] top-[4.3125rem] z-40 flex h-[8.875rem] w-[10.0625rem] flex-col items-start gap-[1.125rem] rounded-[0.9375rem] border border-white/20 bg-[#b7b7b7]/50 px-[1.3125rem] py-[1.4375rem] backdrop-blur-sm">
              <button
                type="button"
                className={menuItemClass}
                onClick={handleAuthMenuClick}
              >
                {isLoggedIn ? '로그아웃' : '로그인하기'}
              </button>
              <button
                type="button"
                className={menuItemClass}
                onClick={handleToggleMusic}
              >
              음악 on/off
              </button>
              <button type="button" className={menuItemClass}>
                개인정보
              </button>
            </nav>
          </>
        )}

        <img
          src={homeEarth}
          alt=""
          className="absolute left-1/2 top-[11.0625rem] size-[18.8125rem] -translate-x-1/2 object-contain opacity-90"
        />

        <div className="absolute left-1/2 top-[38.875rem] flex w-[18.75rem] -translate-x-1/2 items-center justify-between">
          <button
            type="button"
            className={actionButtonClass}
            onClick={handleStartTrip}
          >
            여행하기
          </button>
          <button
            type="button"
            className={actionButtonClass}
            onClick={handleReturnTrip}
          >
            귀국하기
          </button>
        </div>

        {isSheetOpen && (
          <button
            type="button"
            className="absolute inset-0 z-20 cursor-default"
            aria-label="시트 닫기"
            onClick={onCloseSheet}
          />
        )}

        {isLogoutDialogOpen && (
          <div className="absolute inset-0 z-50 bg-[#b7b7b7]/50">
            <section className="absolute left-1/2 top-[20.6875rem] h-[10.5625rem] w-[21.5rem] -translate-x-1/2 rounded-[0.9375rem] bg-white px-[2.1875rem] py-[2.1875rem] text-[#121212]">
              <p className="text-center text-[1.25rem] font-medium leading-6">
                로그아웃 하시겠습니까?
              </p>
              <div className="mt-[1.875rem] flex gap-[1.0625rem]">
                <button
                  type="button"
                  className="h-9 w-[8.0625rem] rounded-lg bg-[#f3f3f3] text-[0.9375rem] font-medium text-[#707070]"
                  onClick={handleCancelLogout}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="h-9 w-[8.0625rem] rounded-lg bg-[#6483d3] text-[0.9375rem] font-medium text-white"
                  onClick={handleConfirmLogout}
                >
                  로그아웃
                </button>
              </div>
            </section>
          </div>
        )}

        {isMusicDialogOpen && (
          <div className="absolute inset-0 z-50 bg-[rgba(18,18,18,0.5)] backdrop-blur-[2.5px]">
            <section className="absolute left-1/2 top-[21.4375rem] h-[10.5625rem] w-[21.5rem] -translate-x-1/2 rounded-[0.9375rem] border border-[#cbdaf8] bg-white px-[2.1875rem] py-[2.125rem] text-[#121212] shadow-[0_0.25rem_1.25rem_rgba(254,215,165,0.05)]">
              <p className="text-center text-[1.125rem] font-medium leading-6">
                {MUSIC_DIALOG_TEXT.messageLine1}
                <br />
                {musicDialogAction}
                {MUSIC_DIALOG_TEXT.messageSuffix}
              </p>

              <div className="mt-[1.0625rem] flex gap-[1.0625rem]">
                <button
                  type="button"
                  className="h-9 w-[8.0625rem] rounded-[0.4375rem] border border-[#e6e6e6] bg-white text-[0.9375rem] font-medium leading-6 text-[#707070]"
                  onClick={handleCancelMusicDialog}
                >
                  {MUSIC_DIALOG_TEXT.cancel}
                </button>
                <button
                  type="button"
                  className="h-9 w-[8.0625rem] rounded-[0.4375rem] bg-[#0d2571] text-[0.9375rem] font-medium leading-6 text-white"
                  onClick={handleConfirmMusicDialog}
                >
                  {musicDialogAction}
                </button>
              </div>
            </section>
          </div>
        )}

        {children}
      </section>
    </main>
  );
};
