import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import cockpitPanelImage from '@/assets/icons/Container.svg';
import goIcon from '@/assets/icons/go.svg';
import homeBackImage from '@/assets/icons/home_back.svg';
import returnIcon from '@/assets/icons/return.svg';
import settingIcon from '@/assets/icons/setting.svg';
import GlobeBackground from '@/pages/JetLagCalculator/components/GlobeBackground';

const BACKGROUND_MUSIC_CONSENT_KEY = 'backgroundMusicConsent';
const BACKGROUND_MUSIC_TOGGLE_EVENT = 'backgroundMusicToggle';

const menuItemClass =
  'block w-full text-left font-["Pretendard"] text-[1.0625rem] font-medium leading-[1.5rem] text-white';

const HOME_GLOBE_POINTS = [
  { lat: 28.6139, lng: 77.209, color: '#CBDAF8', radius: 0.34 },
  { lat: 37.5665, lng: 126.978, color: '#FCD080', radius: 0.3 },
] satisfies Array<{ lat: number; lng: number; color: string; radius: number }>;

const HOME_GLOBE_ARCS = [
  {
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 37.5665,
    endLng: 126.978,
    color: ['rgba(203,218,248,0.15)', '#CBDAF8', '#FCD080'],
  },
] satisfies Array<{
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
}>;

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
    const storedResultId =
      sessionStorage.getItem('resultId') ?? localStorage.getItem('resultId');

    if (!storedResultId) {
      navigate('/mvp3');
      return;
    }

    navigate(`/mvp3?resultId=${encodeURIComponent(storedResultId)}`);
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
    <main className="h-full w-full bg-[#121212]">
      <section className="relative z-0 h-full w-full overflow-hidden bg-[#121212] text-white">
        <GlobeBackground
          altitude={2.85}
          focusLat={32}
          focusLng={102}
          autoRotate
          className="absolute inset-0 z-0 overflow-hidden"
          atmosphereColor="#cbdaff"
          atmosphereAltitude={0.12}
          overlayColor={null}
          pointsData={[...HOME_GLOBE_POINTS]}
          arcsData={[...HOME_GLOBE_ARCS]}
        />

        <StatusBar />

        <div className="absolute left-1/2 top-[4.3125rem] z-20 flex w-[min(21.375rem,calc(100%-3rem))] -translate-x-1/2 items-center justify-between">
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
              className="absolute inset-0 z-30 cursor-default"
              aria-label="메뉴 닫기"
              onClick={handleCloseMenu}
            />
            <nav className="absolute right-[1.6875rem] top-[4.3125rem] z-40 flex h-[8.875rem] w-[10.0625rem] flex-col items-start justify-center gap-[0.875rem] rounded-[0.9375rem] border border-white/25 bg-[#b7b7b7]/50 px-[1.3125rem] backdrop-blur-sm">
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
                앱 정보
              </button>
            </nav>
          </>
        )}

        <img
          src={homeBackImage}
          alt=""
          className="pointer-events-none absolute left-1/2 top-[30.5rem] z-20 h-[24.5rem] w-[34.625rem] -translate-x-1/2 object-fill"
        />

        <CockpitPanel />

        <div className="absolute bottom-[2rem] left-1/2 z-40 flex h-[8.75rem] w-[18.75rem] -translate-x-1/2 items-end justify-between">
          <button
            type="button"
            className="flex h-[8.75rem] w-[9rem] items-end justify-center transition duration-200 hover:scale-[1.03] active:scale-95"
            aria-label="여행가기"
            onClick={handleStartTrip}
          >
            <img src={goIcon} alt="" className="h-[8.75rem] w-[9rem] max-w-none" />
          </button>
          <button
            type="button"
            className="flex h-[8.75rem] w-[9rem] items-end justify-center transition duration-200 hover:scale-[1.03] active:scale-95"
            aria-label="귀국하기"
            onClick={handleReturnTrip}
          >
            <img src={returnIcon} alt="" className="h-[8.75rem] w-[8.75rem] max-w-none" />
          </button>
        </div>

        {isSheetOpen && (
          <button
            type="button"
            className="absolute inset-0 z-30 cursor-default"
            aria-label="시트 닫기"
            onClick={onCloseSheet}
          />
        )}

        {isLogoutDialogOpen && (
          <ConfirmDialog
            message="濡쒓렇?꾩썐 ?섏떆寃좎뒿?덇퉴?"
            confirmLabel="濡쒓렇?꾩썐"
            onCancel={handleCancelLogout}
            onConfirm={handleConfirmLogout}
          />
        )}

        {isMusicDialogOpen && (
          <ConfirmDialog
            message={`諛곌꼍?뚯븙??n${musicDialogAction} ?섏떆寃좎뒿?덇퉴?`}
            confirmLabel={musicDialogAction}
            onCancel={handleCancelMusicDialog}
            onConfirm={handleConfirmMusicDialog}
          />
        )}

        {children}
      </section>
    </main>
  );
};

const StatusBar = () => (
  <div className="absolute inset-x-0 top-0 z-20 flex h-[2.8125rem] items-center justify-between px-[1.3125rem] text-[0.9375rem] font-semibold">
    <span>9:41</span>
    <span className="flex items-center gap-1" aria-hidden="true">
      <span className="flex h-3.5 items-end gap-[0.125rem]">
        <span className="h-1.5 w-[0.1875rem] rounded-full bg-white" />
        <span className="h-2 w-[0.1875rem] rounded-full bg-white" />
        <span className="h-2.5 w-[0.1875rem] rounded-full bg-white" />
        <span className="h-3 w-[0.1875rem] rounded-full bg-white" />
      </span>
      <span className="h-2.5 w-3.5 rounded-[0.1875rem] border border-white">
        <span className="ml-[0.125rem] mt-[0.125rem] block h-1.5 w-2 rounded-[0.125rem] bg-white" />
      </span>
      <span className="h-[0.6875rem] w-[1.5625rem] rounded-[0.1875rem] border border-white p-[0.0625rem]">
        <span className="block h-full w-[1.125rem] rounded-[0.125rem] bg-white" />
      </span>
    </span>
  </div>
);

const CockpitPanel = () => (
  <div className="absolute bottom-[7.875rem] left-1/2 z-30 flex w-full -translate-x-1/2 flex-col items-center">
    <div className="relative h-[6.375rem] w-[24.375rem] max-w-none">
      <img
        src={cockpitPanelImage}
        alt=""
        className="absolute inset-0 h-full w-full"
      />
    </div>
    <ThrottleControl />
  </div>
);

const ThrottleControl = () => (
  <div className="mt-[-0.625rem] flex h-[7.625rem] w-[2.125rem] flex-col items-center">
    <span className="font-['Pretendard'] text-[0.375rem] leading-[0.53625rem] tracking-[0.08415rem] text-[#1a4070]">
      UP
    </span>
    <div className="relative mt-[0.1875rem] h-[6.0625rem] w-[0.757rem] rounded-[0.37875rem] border border-[rgba(15,40,90,0.6)] bg-gradient-to-b from-[#010608] to-[#030c16] shadow-[inset_0_0.126rem_0.336rem_rgba(0,0,30,0.9)]">
      <span className="absolute left-1/2 top-0 h-full w-[0.084rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-[#0a3060] to-transparent" />
      <span className="absolute left-1/2 top-[0.5625rem] h-[1.09375rem] w-[1.6875rem] -translate-x-1/2 rounded-[0.2945rem] bg-gradient-to-br from-[#2e2e42] to-[#131318] shadow-[0_0.168rem_0.421rem_rgba(0,0,0,0.9),inset_0_0.042rem_0.042rem_rgba(120,120,160,0.18)]">
        <span className="absolute left-[0.235rem] top-[0.35rem] h-[0.084rem] w-[1.212rem] rounded-full bg-[rgba(70,70,100,0.45)]" />
        <span className="absolute left-[0.235rem] top-[0.634rem] h-[0.084rem] w-[1.212rem] rounded-full bg-[rgba(70,70,100,0.45)]" />
      </span>
    </div>
    <span className="mt-[0.1875rem] font-['Pretendard'] text-[0.375rem] leading-[0.53625rem] tracking-[0.08415rem] text-[#1a4070]">
      DN
    </span>
  </div>
);

interface ConfirmDialogProps {
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => (
  <div className="absolute inset-0 z-50 bg-[rgba(18,18,18,0.5)] backdrop-blur-[2.5px]">
    <section className="absolute left-1/2 top-[21.4375rem] h-[10.5625rem] w-[21.5rem] -translate-x-1/2 rounded-[0.9375rem] border border-[#cbdaf8] bg-white px-[2.1875rem] py-[2.125rem] text-[#121212] shadow-[0_0.25rem_1.25rem_rgba(254,215,165,0.05)]">
      <p className="whitespace-pre-line text-center text-[1.125rem] font-medium leading-6">
        {message}
      </p>
      <div className="mt-[1.0625rem] flex gap-[1.0625rem]">
        <button
          type="button"
          className="h-9 w-[8.0625rem] rounded-[0.4375rem] border border-[#e6e6e6] bg-white text-[0.9375rem] font-medium leading-6 text-[#707070]"
          onClick={onCancel}
        >
          痍⑥냼
        </button>
        <button
          type="button"
          className="h-9 w-[8.0625rem] rounded-[0.4375rem] bg-[#0d2571] text-[0.9375rem] font-medium leading-6 text-white"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </section>
  </div>
);
