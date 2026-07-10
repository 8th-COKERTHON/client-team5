import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

import MobileFrame from './components/layout/MobileFrame';
import SleepCountryLoadingScreen from './pages/JetLagCalculator/SleepCountryLoadingScreen';
import ResultScreen from '@/pages/JetLagCalculator/ResultScreen';
import { Mvp2Page } from '@/pages/mvp2/Mvp2Page';
import ReturnRoutePage from '@/pages/mvp3/ReturnRoutePage';

const OnboardingScreen = lazy(
  () => import('@/pages/JetLagCalculator/OnboardingScreen'),
);
const CurrentSleepTimeScreen = lazy(
  () => import('@/pages/JetLagCalculator/CurrentSleepTimeScreen'),
);
const DesiredSleepTimeScreen = lazy(
  () => import('./pages/JetLagCalculator/DesiredSleepTimeScreen'),
);
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));

const BACKGROUND_MUSIC_SRC = '/audio/background.mp3';
const BACKGROUND_MUSIC_CONSENT_KEY = 'backgroundMusicConsent';
const BACKGROUND_MUSIC_TOGGLE_EVENT = 'backgroundMusicToggle';

const MUSIC_PROMPT_TEXT = {
  messageLine1: '\uBC30\uACBD\uC74C\uC545\uC744',
  messageLine2: 'on \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?',
  cancel: '\uCDE8\uC18C',
  confirm: 'on',
} as const;

type BackgroundMusicConsent = 'yes' | 'no' | null;

const isHomeRoute = (pathname: string) => {
  return pathname === '/' || pathname === '/mvp2';
};

const routeTransitionVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -12,
  },
};

const App = () => (
  <MobileFrame>
    <BackgroundMusicController />
    <RouteTransition />
  </MobileFrame>
);

const RouteTransition = () => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      className="absolute inset-0 h-full w-full"
      variants={routeTransitionVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <Suspense fallback={null}>
        <Routes location={location}>
          <Route path="/" element={<Mvp2Page />} />
          <Route path="/mvp2" element={<Mvp2Page />} />
          <Route path="/mvp3" element={<ReturnRoutePage />} />

          <Route
            path="/jetlag/sleep-country-loading"
            element={<SleepCountryLoadingScreen />}
          />
          <Route path="/jetlag/onboarding" element={<OnboardingScreen />} />
          <Route
            path="/jetlag/current-sleep-time"
            element={<CurrentSleepTimeScreen />}
          />
          <Route
            path="/jetlag/desired-sleep-time"
            element={<DesiredSleepTimeScreen />}
          />
          <Route path="/jetlag/result" element={<ResultScreen />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Suspense>
    </motion.div>
  );
};

const BackgroundMusicController = () => {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [consent, setConsent] = useState<BackgroundMusicConsent>(() => {
    const storedConsent = localStorage.getItem(BACKGROUND_MUSIC_CONSENT_KEY);

    return storedConsent === 'yes' || storedConsent === 'no'
      ? storedConsent
      : null;
  });

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(BACKGROUND_MUSIC_SRC);
      audio.loop = true;
      audio.preload = 'auto';
      audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (consent === 'yes') {
      void audio.play().catch(() => {});
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }, [consent]);

  useEffect(() => {
    const handleBackgroundMusicToggle = () => {
      const audio = audioRef.current;
      const storedConsent = localStorage.getItem(BACKGROUND_MUSIC_CONSENT_KEY);
      const nextConsent = storedConsent === 'yes' ? 'yes' : 'no';

      if (audio) {
        if (nextConsent === 'yes') {
          void audio.play().catch(() => {});
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      }

      setConsent(nextConsent);
    };

    window.addEventListener(
      BACKGROUND_MUSIC_TOGGLE_EVENT,
      handleBackgroundMusicToggle,
    );

    return () => {
      window.removeEventListener(
        BACKGROUND_MUSIC_TOGGLE_EVENT,
        handleBackgroundMusicToggle,
      );
    };
  }, []);

  const handleCancelClick = () => {
    localStorage.setItem(BACKGROUND_MUSIC_CONSENT_KEY, 'no');
    setConsent('no');
  };

  const handleConfirmClick = async () => {
    const audio = audioRef.current;

    localStorage.setItem(BACKGROUND_MUSIC_CONSENT_KEY, 'yes');
    setConsent('yes');

    if (!audio) {
      return;
    }

    try {
      await audio.play();
    } catch {
      // Some browsers can still block playback depending on the PWA state.
    }
  };

  const isPromptVisible = isHomeRoute(location.pathname) && consent === null;

  if (!isPromptVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-[60] bg-[rgba(18,18,18,0.5)] backdrop-blur-[2.5px]">
      <section className="absolute left-1/2 top-[21.4375rem] h-[10.5625rem] w-[21.5rem] -translate-x-1/2 rounded-[0.9375rem] border border-[#cbdaf8] bg-white px-[2.1875rem] py-[2.125rem] text-[#121212] shadow-[0_0.25rem_1.25rem_rgba(254,215,165,0.05)]">
        <p className="text-center text-[1.125rem] font-medium leading-6">
          {MUSIC_PROMPT_TEXT.messageLine1}
          <br />
          {MUSIC_PROMPT_TEXT.messageLine2}
        </p>

        <div className="mt-[1.0625rem] flex gap-[1.0625rem]">
          <button
            type="button"
            className="h-9 w-[8.0625rem] rounded-[0.4375rem] border border-[#e6e6e6] bg-white text-[0.9375rem] font-medium leading-6 text-[#707070]"
            onClick={handleCancelClick}
          >
            {MUSIC_PROMPT_TEXT.cancel}
          </button>
          <button
            type="button"
            className="h-9 w-[8.0625rem] rounded-[0.4375rem] bg-[#0d2571] text-[0.9375rem] font-medium leading-6 text-white"
            onClick={handleConfirmClick}
          >
            {MUSIC_PROMPT_TEXT.confirm}
          </button>
        </div>
      </section>
    </div>
  );
};

export default App;
