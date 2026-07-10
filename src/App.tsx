import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

import MobileFrame from './components/layout/MobileFrame';
import SleepCountryLoadingScreen from './pages/JetLagCalculator/SleepCountryLoadingScreen';
import ResultScreen from '@/pages/JetLagCalculator/ResultScreen';

import { Mvp2Page } from '@/pages/mvp2/Mvp2Page';
import ReturnRoutePage from '@/pages/mvp3/ReturnRoutePage';

const OnboardingScreen = lazy(() => import('@/pages/JetLagCalculator/OnboardingScreen'));
const CurrentSleepTimeScreen = lazy(
  () => import('@/pages/JetLagCalculator/CurrentSleepTimeScreen'),
);
const DesiredSleepTimeScreen = lazy(
  () => import('./pages/JetLagCalculator/DesiredSleepTimeScreen'),
);
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));

const MainRoutes = () => (
  <MobileFrame>
    <RouteTransition />
  </MobileFrame>
);

const App = () => <MainRoutes />;
export default App;

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

          <Route path="/jetlag/sleep-country-loading" element={<SleepCountryLoadingScreen />} />
          <Route path="/jetlag/onboarding" element={<OnboardingScreen />} />
          <Route path="/jetlag/current-sleep-time" element={<CurrentSleepTimeScreen />} />
          <Route path="/jetlag/desired-sleep-time" element={<DesiredSleepTimeScreen />} />
          <Route path="/jetlag/result" element={<ResultScreen />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Suspense>
    </motion.div>
  );
};
