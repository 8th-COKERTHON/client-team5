import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import MobileFrame from './components/layout/MobileFrame';

import { Mvp2Page } from '@/pages/mvp2/Mvp2Page';

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

const PendingJetLagScreen = () => null;

const App = () => {
  return (
    <MobileFrame>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/jetlag/onboarding" element={<OnboardingScreen />} />
          <Route
            path="/jetlag/current-sleep-time"
            element={<CurrentSleepTimeScreen />}
          />
          <Route
            path="/jetlag/desired-sleep-time"
            element={<DesiredSleepTimeScreen />}
          />
          <Route path="/jetlag/loading" element={<PendingJetLagScreen />} />
          <Route path="/jetlag/result" element={<PendingJetLagScreen />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Mvp2Page />} />
          <Route path="/mvp2" element={<Mvp2Page />} />
        </Routes>
      </Suspense>
    </MobileFrame>
  );
};
export default App;
