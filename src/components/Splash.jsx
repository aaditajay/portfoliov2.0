import React, { useState, useEffect } from 'react';
import './Splash.css';

export default function Splash({ onEnter }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const duration = 5000; // 5 seconds auto-transition
  const intervalTime = 50;

  useEffect(() => {
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const nextProgress = (currentStep / totalSteps) * 100;
      setProgress(nextProgress);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        handleEnter();
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    setIsFading(true);
    setTimeout(() => {
      onEnter();
    }, 600); // match CSS fade-out animation length
  };

  return (
    <div className={`splash-container ${isFading ? 'splash-fade-out' : ''}`}>
      <div className="splash-bg-glow" />
      
      <div className="splash-content">
        <div className="monogram-ring" onClick={handleEnter}>
          <span className="monogram-text">AA</span>
        </div>
        
        <h1 className="splash-name">Aadit Ajay</h1>
        <p className="splash-tagline">
          Bridging engineering, product strategy, and community building.
        </p>
        
        <button className="enter-button" onClick={handleEnter}>
          Enter System
        </button>
      </div>
      
      <div className="splash-progress-container">
        <div 
          className="splash-progress-bar" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
