import { Routes, Route } from 'react-router-dom';
import JetLagCalculatorPage from '@/pages/JetLagCalculator/JetLagCalculatorPage';

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <h1 className="text-2xl font-bold">Client Team 5</h1>
          </main>
        }
      />
      <Route path="/jetlag" element={<JetLagCalculatorPage />} />
    </Routes>
  );
};

export default App;
