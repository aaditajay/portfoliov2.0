import React, { useState } from 'react';
import Splash from './components/Splash';
import Selector from './components/Selector';
import TerminalInterface from './components/TerminalInterface';
import MacOSInterface from './components/MacOSInterface';
import { AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [currentInterface, setCurrentInterface] = useState('splash');

  const renderActiveInterface = () => {
    switch (currentInterface) {
      case 'splash':
        return <Splash key="splash" onEnter={() => setCurrentInterface('selector')} />;
      case 'selector':
        return <Selector key="selector" onSelectInterface={(type) => setCurrentInterface(type)} />;
      case 'terminal':
        return <TerminalInterface key="terminal" onExit={() => setCurrentInterface('selector')} />;
      case 'macos':
        return <MacOSInterface key="macos" onExit={() => setCurrentInterface('selector')} />;
      default:
        return <Splash key="splash" onEnter={() => setCurrentInterface('selector')} />;
    }
  };

  return (
    <div className="app-container" style={{ background: '#000000', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {renderActiveInterface()}
      </AnimatePresence>
    </div>
  );
}

export default App;
