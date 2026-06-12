import React, { useState } from 'react';
import Splash from './components/Splash';
import Selector from './components/Selector';
import TerminalInterface from './components/TerminalInterface';
import MacOSInterface from './components/MacOSInterface';
import Switcher from './components/Switcher';
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
    <div className="app-container">
      {renderActiveInterface()}
      
      {/* Global Floating Switcher pill overlay */}
      <Switcher 
        currentInterface={currentInterface} 
        onSwitch={(target) => setCurrentInterface(target)} 
      />
    </div>
  );
}

export default App;
