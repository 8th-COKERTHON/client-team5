import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

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
    <Suspense fallback={null}>
      <Routes>
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
  </MobileFrame>
);

const App = () => <MainRoutes />;
export default App;
