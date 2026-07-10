import { Route, Routes } from 'react-router-dom';
import JetLagCalculatorPage from '@/pages/JetLagCalculator/JetLagCalculatorPage';
import { Mvp2Page } from '@/pages/mvp2/Mvp2Page';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mvp2Page />} />
      <Route path="/mvp2" element={<Mvp2Page />} />
      <Route path="/jetlag" element={<JetLagCalculatorPage />} />
    </Routes>
  );
};

export default App;
