import { useState } from 'react';
import AppContent from './components/AppContent';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';

function App() {
  const [showApp, setShowApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  setTimeout(() => setIsLoading(false), 1000);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return showApp ? (
    <AppContent onReturnHome={() => setShowApp(false)} />
  ) : (
    <Home onEnterApp={() => setShowApp(true)} />
  );
}

export default App;