import { Routes, Route } from 'react-router-dom';
import OnboardingScreen from '@/pages/JetLagCalculator/OnboardingScreen';
import CurrentSleepTimeScreen from '@/pages/JetLagCalculator/CurrentSleepTimeScreen';

import MobileFrame from './components/layout/MobileFrame';
import DesiredSleepTimeScreen from './pages/JetLagCalculator/DesiredSleepTimeScreen';

const App = () => {
  return (
    <MobileFrame>
      <Routes>
        <Route
          path="/"
          element={
            <main className="flex min-h-screen items-center justify-center bg-gray-100">
              <h1 className="text-2xl font-bold">Client Team 5</h1>
            </main>
          }
        />
        <Route path="/jetlag/onboarding" element={<OnboardingScreen />} />
        <Route path="/jetlag/current-sleep-time" element={<CurrentSleepTimeScreen />} />
        <Route path="/jetlag/desired-sleep-time" element={<DesiredSleepTimeScreen />} />
      </Routes>
    </MobileFrame>
  );
};

export default App;
