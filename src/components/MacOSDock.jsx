import React, { useState, useRef, useCallback, useEffect } from 'react';

const MacOSDock = ({ 
  apps, 
  onAppClick, 
  openApps = [],
  className = ''
}) => {
  const [mouseX, setMouseX] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentScales, setCurrentScales] = useState(apps.map(() => 1));
  const [currentPositions, setCurrentPositions] = useState([]);
  const dockRef = useRef(null);
  const iconRefs = useRef([]);
  const animationFrameRef = useRef(undefined);
  const lastMouseMoveTime = useRef(0);

  // Responsive size calculations based on viewport
  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { baseIconSize: 64, maxScale: 1.6, effectWidth: 240 };
    }

    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    
    if (smallerDimension < 480) {
      return {
        baseIconSize: Math.max(40, smallerDimension * 0.08),
        maxScale: 1.4,
        effectWidth: smallerDimension * 0.4
      };
    } else if (smallerDimension < 768) {
      return {
        baseIconSize: Math.max(48, smallerDimension * 0.07),
        maxScale: 1.5,
        effectWidth: smallerDimension * 0.35
      };
    } else if (smallerDimension < 1024) {
      return {
        baseIconSize: Math.max(56, smallerDimension * 0.06),
        maxScale: 1.6,
        effectWidth: smallerDimension * 0.3
      };
    } else {
      return {
        baseIconSize: Math.max(64, Math.min(80, smallerDimension * 0.05)),
        maxScale: 1.8,
        effectWidth: 300
      };
    }
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(4, baseIconSize * 0.08);

  useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  const calculateTargetMagnification = useCallback((mousePosition) => {
    if (mousePosition === null) {
      return apps.map(() => minScale);
    }

    return apps.map((_, index) => {
      const normalIconCenter = (index * (baseIconSize + baseSpacing)) + (baseIconSize / 2);
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);
      
      if (normalIconCenter < minX || normalIconCenter > maxX) {
        return minScale;
      }
      
      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      
      return minScale + (scaleFactor * (maxScale - minScale));
    });
  }, [apps, baseIconSize, baseSpacing, effectWidth, maxScale, minScale]);

  const calculatePositions = useCallback((scales) => {
    let currentX = 0;
    return scales.map((scale) => {
      const scaledWidth = baseIconSize * scale;
      const centerX = currentX + (scaledWidth / 2);
      currentX += scaledWidth + baseSpacing;
      return centerX;
    });
  }, [baseIconSize, baseSpacing]);

  useEffect(() => {
    const initialScales = apps.map(() => minScale);
    const initialPositions = calculatePositions(initialScales);
    setCurrentScales(initialScales);
    setCurrentPositions(initialPositions);
  }, [apps, calculatePositions, minScale, config]);

  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.2 : 0.12;

    setCurrentScales(prevScales => {
      return prevScales.map((currentScale, index) => {
        const diff = targetScales[index] - currentScale;
        return currentScale + (diff * lerpFactor);
      });
    });

    setCurrentPositions(prevPositions => {
      return prevPositions.map((currentPos, index) => {
        const diff = targetPositions[index] - currentPos;
        return currentPos + (diff * lerpFactor);
      });
    });

    const scalesNeedUpdate = currentScales.some((scale, index) => 
      Math.abs(scale - targetScales[index]) > 0.002
    );
    const positionsNeedUpdate = currentPositions.some((pos, index) => 
      Math.abs(pos - targetPositions[index]) > 0.1
    );
    
    if (scalesNeedUpdate || positionsNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions]);

  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateToTarget);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateToTarget]);

  const handleMouseMove = useCallback((e) => {
    const now = performance.now();
    if (now - lastMouseMoveTime.current < 16) {
      return;
    }
    lastMouseMoveTime.current = now;
    
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const padding = Math.max(8, baseIconSize * 0.12);
      setMouseX(e.clientX - rect.left - padding);
    }
  }, [baseIconSize]);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const createBounceAnimation = (element) => {
    if (!element) return;
    const bounceHeight = Math.max(-8, -baseIconSize * 0.15);
    element.style.transition = 'transform 0.15s ease-out';
    element.style.transform = `translateY(${bounceHeight}px)`;
    
    setTimeout(() => {
      element.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.transform = 'translateY(0px)';
    }, 150);
  };
  const handleAppClick = (appId, index, e) => {
    if (iconRefs.current[index]) {
      if (typeof window !== 'undefined' && window.gsap) {
        const gsap = window.gsap;
        const bounceHeight = currentScales[index] > 1.3 ? -baseIconSize * 0.2 : -baseIconSize * 0.15;
        
        gsap.to(iconRefs.current[index], {
          y: bounceHeight,
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          transformOrigin: 'bottom center'
        });
      } else {
        createBounceAnimation(iconRefs.current[index]);
      }
    }
    onAppClick(appId, e);
  };
  const contentWidth = currentPositions.length > 0 
    ? Math.max(...currentPositions.map((pos, index) => 
        pos + (baseIconSize * currentScales[index]) / 2
      ))
    : (apps.length * (baseIconSize + baseSpacing)) - baseSpacing;

  const padding = Math.max(8, baseIconSize * 0.12);

  return (
    <div 
      ref={dockRef}
      className={className}
      style={{
        width: `${contentWidth + padding * 2}px`,
        borderRadius: `${Math.max(12, baseIconSize * 0.4)}px`,
        border: '1.5px solid rgba(255, 255, 255, 0.35)',
        padding: `${padding}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        background: 'transparent'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Volumetric Liquid Shadow Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: `${Math.max(12, baseIconSize * 0.4)}px`,
          boxShadow: `
            0 0 8px rgba(0,0,0,0.03),
            0 2px 6px rgba(0,0,0,0.08),
            inset 3px 3px 0.5px -3.5px rgba(255,255,255,0.09),
            inset -3px -3px 0.5px -3.5px rgba(255,255,255,0.85),
            inset 1px 1px 1px -0.5px rgba(255,255,255,0.6),
            inset -1px -1px 1px -0.5px rgba(255,255,255,0.6),
            inset 0 0 6px 6px rgba(255,255,255,0.12),
            inset 0 0 2px 2px rgba(255,255,255,0.06),
            0 0 12px rgba(0,0,0,0.15)
          `,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      {/* Backdrop Filter Distortion Layer */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: `${Math.max(12, baseIconSize * 0.4)}px`,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.15) 50.5%, rgba(255, 255, 255, 0.2) 100%)',
          backdropFilter: 'url("#container-glass") blur(10px)',
          WebkitBackdropFilter: 'url("#container-glass") blur(10px)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      <div 
        style={{
          height: `${baseIconSize}px`,
          width: `${contentWidth}px`,
          position: 'relative',
          zIndex: 10
        }}
      >
        {apps.map((app, index) => {
          const scale = currentScales[index] || 1;
          const position = currentPositions[index] || 0;
          const scaledSize = baseIconSize * scale;
          
          return (
            <div
              key={app.id}
              ref={(el) => { iconRefs.current[index] = el; }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => handleAppClick(app.id, index, e)}
              style={{
                position: 'absolute',
                left: `${position - scaledSize / 2}px`,
                bottom: '0px',
                width: `${scaledSize}px`,
                height: `${scaledSize}px`,
                transformOrigin: 'bottom center',
                zIndex: Math.round(scale * 10),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                cursor: 'pointer'
              }}
            >
              {/* Custom Tooltip */}
              {hoveredIndex === index && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '-32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                    color: '#1f2937',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '3px 12px',
                    borderRadius: '50px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.05)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 99999
                  }}
                >
                  {app.name}
                </div>
              )}
              <img
                src={app.icon}
                alt={app.name}
                style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'contain',
                  filter: `drop-shadow(0 ${scale > 1.2 ? Math.max(2, baseIconSize * 0.05) : Math.max(1, baseIconSize * 0.03)}px ${scale > 1.2 ? Math.max(4, baseIconSize * 0.1) : Math.max(2, baseIconSize * 0.06)}px rgba(0,0,0,${0.2 + (scale - 1) * 0.15}))`
                }}
              />
              
              {/* App Indicator Dot */}
              {openApps.includes(app.id) && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: `${Math.max(-2, -baseIconSize * 0.05)}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: `${Math.max(3, baseIconSize * 0.06)}px`,
                    height: `${Math.max(3, baseIconSize * 0.06)}px`,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MacOSDock;
