import React, { useState } from 'react';
import Splash from './components/Splash';
import Selector from './components/Selector';
import TerminalInterface from './components/TerminalInterface';
import MacOSInterface from './components/MacOSInterface';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

function App() {
  const [currentInterface, setCurrentInterface] = useState('splash');

  const renderActiveInterface = () => {
    switch (currentInterface) {
      case 'splash':
        return <Splash onEnter={() => setCurrentInterface('selector')} />;
      case 'selector':
        return <Selector onSelectInterface={(type) => setCurrentInterface(type)} />;
      case 'terminal':
        return <TerminalInterface onExit={() => setCurrentInterface('selector')} />;
      case 'macos':
        return <MacOSInterface onExit={() => setCurrentInterface('selector')} />;
      default:
        return <Splash onEnter={() => setCurrentInterface('selector')} />;
    }
  };

  return (
    <div className="app-container" style={{ background: '#000000', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentInterface}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          {renderActiveInterface()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
