import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../data/portfolioData';
import './TerminalInterface.css';

const BOOT_LINES = [
  "Initializing Aadit-OS v2.0...",
  "Loading kernel modules...",
  "Loading profile datasets...",
  "Mounting filesystems...",
  "  - /bin [read-only] ... OK",
  "  - /home/aadit [read-write] ... OK",
  "  - /assets/documents ... OK",
  "Reading experience logs...",
  "Caching project structures...",
  "System configuration verified successfully.",
  "Starting shell interpreter...",
  "=========================================",
  "Aadit Ajay - Interactive Portfolio Terminal",
  "Type 'help' to see list of available commands.",
  "========================================="
];

export default function TerminalInterface({ onExit }) {
  const [bootComplete, setBootComplete] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const [displayedBootLines, setDisplayedBootLines] = useState([]);
  
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startTime] = useState(Date.now());
  
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // 1. Boot sequence simulation
  useEffect(() => {
    if (bootIndex < BOOT_LINES.length) {
      const timer = setTimeout(() => {
        setDisplayedBootLines(prev => [...prev, BOOT_LINES[bootIndex]]);
        setBootIndex(prev => prev + 1);
      }, bootIndex === 0 ? 100 : Math.random() * 200 + 50);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        setBootComplete(true);
        // Add welcome message to terminal history
        setHistory([
          {
            type: 'output',
            content: (
              <div>
                <p>Welcome to Aadit-OS v2.0. Host system ready.</p>
                <p>Type <span style={{color: '#10b981', fontWeight: 'bold'}}>help</span> to list commands.</p>
              </div>
            )
          }
        ]);
      }, 500);
      return () => clearTimeout(finishTimer);
    }
  }, [bootIndex]);

  const skipBoot = () => {
    setBootComplete(true);
    setHistory([
      {
        type: 'output',
        content: (
          <div>
            <p>Boot sequence skipped. Welcome to Aadit-OS v2.0.</p>
            <p>Type <span style={{color: '#10b981', fontWeight: 'bold'}}>help</span> to list commands.</p>
          </div>
        )
      }
    ]);
  };

  // 2. Scroll to bottom on history change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history, displayedBootLines, bootComplete]);

  // 3. Keep input focused on clicking anywhere in terminal
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (bootComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [bootComplete]);

  // 4. Command Interpreter Engine
  const executeCommand = (cmdRaw) => {
    const trimmed = cmdRaw.trim();
    if (!trimmed) return;

    // Add command to history array
    const newCommandHistory = [...commandHistory, trimmed];
    setCommandHistory(newCommandHistory);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputContent = null;

    switch (commandName) {
      case 'clear':
        setHistory([]);
        setInputValue("");
        return;

      case 'help':
        outputContent = (
          <table className="help-table">
            <tbody>
              <tr className="help-row">
                <td className="help-cell-cmd">whoami</td>
                <td className="help-cell-desc">Display identity, current role, and summary bio.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">experience</td>
                <td className="help-cell-desc">List professional internships, leadership and volunteering history.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">expertise</td>
                <td className="help-cell-desc">List skill categories and technical/management strengths.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">projects</td>
                <td className="help-cell-desc">List key portfolio project names and tags.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">open [name]</td>
                <td className="help-cell-desc">Examine project specifics (e.g., 'open dev-hub').</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">achievements</td>
                <td className="help-cell-desc">Show awards and notable recognitions.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">neofetch</td>
                <td className="help-cell-desc">Render custom system specifications and visual ASCII brand logo.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">sudo hire aadit</td>
                <td className="help-cell-desc">Unlock secret privileges to hire Aadit Ajay.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">contact</td>
                <td className="help-cell-desc">Display email, phone, and professional profiles.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">resume</td>
                <td className="help-cell-desc">Open resume PDF document in a new window tab.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">history</td>
                <td className="help-cell-desc">List previously run console commands in this session.</td>
              </tr>
              <tr className="help-row">
                <td className="help-cell-cmd">exit</td>
                <td className="help-cell-desc">Go back to the Interface Selector menu.</td>
              </tr>
            </tbody>
          </table>
        );
        break;

      case 'whoami':
        outputContent = (
          <div>
            <p style={{color: '#fff', fontWeight: 'bold', fontSize: '1.1rem'}}>{portfolioData.profile.name}</p>
            <p style={{color: '#a78bfa', margin: '4px 0 10px'}}>{portfolioData.profile.title}</p>
            <p>{portfolioData.profile.bio}</p>
          </div>
        );
        break;

      case 'experience':
        outputContent = (
          <div className="exp-list">
            {portfolioData.experience.map(exp => (
              <div key={exp.id} className="exp-item">
                <div className="exp-header">
                  <div>
                    <span className="exp-title">{exp.role}</span>
                    <span style={{color: '#6b7280'}}> @ </span>
                    <span className="exp-org">{exp.organization}</span>
                  </div>
                  <span className="exp-duration">{exp.duration}</span>
                </div>
                <div className="exp-body">
                  <p>• {exp.description}</p>
                  <p style={{fontSize: '0.8rem', color: '#6b7280', marginTop: '2px'}}>Category: {exp.category}</p>
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'expertise':
        outputContent = (
          <div className="skills-grid">
            {portfolioData.expertise.map((expGroup, idx) => (
              <div key={idx} className="skills-category">
                <div className="skills-category-title">{expGroup.category}</div>
                <div style={{ color: '#f8f8f2', lineHeight: '1.4', marginBottom: '8px' }}>{expGroup.description}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        outputContent = (
          <div>
            <p style={{color: '#fff', marginBottom: '8px'}}>Available Projects (type "open [project-id]" to view details):</p>
            <table className="help-table">
              <tbody>
                {portfolioData.projects.map(proj => (
                  <tr key={proj.id} className="help-row">
                    <td className="help-cell-cmd" style={{width: 120}}>{proj.id}</td>
                    <td className="help-cell-desc">
                      <span style={{fontWeight: 'bold', color: '#fff'}}>{proj.name}</span> - {proj.tagline}
                      <div style={{fontSize: '0.8rem', color: '#6b7280', marginTop: '2px'}}>
                        Stack: {proj.techStack.join(', ')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;

      case 'open':
        if (args.length === 0) {
          outputContent = <p style={{color: '#ef4444'}}>Error: Please specify a project name. Usage: open [project-id] (e.g. 'open dev-hub')</p>;
        } else {
          const targetId = args[0].toLowerCase();
          const proj = portfolioData.projects.find(p => p.id.toLowerCase() === targetId);
          if (proj) {
            outputContent = (
              <div className="project-details-cli">
                <div className="project-details-title">{proj.name}</div>
                <div className="project-details-section">
                  <div className="project-details-label">Tagline</div>
                  <div className="project-details-value">{proj.tagline}</div>
                </div>
                {proj.description ? (
                  <div className="project-details-section">
                    <div className="project-details-label">Description</div>
                    <div className="project-details-value" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{proj.description}</div>
                  </div>
                ) : (
                  <>
                    <div className="project-details-section">
                      <div className="project-details-label">Problem</div>
                      <div className="project-details-value">{proj.problem}</div>
                    </div>
                    <div className="project-details-section">
                      <div className="project-details-label">Solution</div>
                      <div className="project-details-value">{proj.solution}</div>
                    </div>
                    <div className="project-details-section">
                      <div className="project-details-label">Impact & Metrics</div>
                      <div className="project-details-value" style={{color: '#10b981'}}>{proj.impact}</div>
                    </div>
                    <div className="project-details-section">
                      <div className="project-details-label">Key Learnings</div>
                      <div className="project-details-value">{proj.learnings}</div>
                    </div>
                  </>
                )}
                <div className="project-details-section">
                  <div className="project-details-label">Technology Stack</div>
                  <div className="project-details-value">{proj.techStack.join(', ')}</div>
                </div>
                {proj.website && (
                  <div className="project-details-section">
                    <div className="project-details-label">Visit Live</div>
                    <a href={proj.website} target="_blank" rel="noreferrer" style={{textDecoration: 'underline'}} className="project-details-value">{proj.website}</a>
                  </div>
                )}
                {proj.github && (
                  <div className="project-details-section">
                    <div className="project-details-label">GitHub</div>
                    <a href={proj.github} target="_blank" rel="noreferrer" style={{textDecoration: 'underline'}} className="project-details-value">{proj.github}</a>
                  </div>
                )}
              </div>
            );
          } else {
            outputContent = <p style={{color: '#ef4444'}}>Error: Project '{targetId}' not found. Run 'projects' to view valid options.</p>;
          }
        }
        break;

      case 'contact':
        outputContent = (
          <div>
            <p><span style={{color: '#10b981', fontWeight: 'bold'}}>Email:</span> <a href={`mailto:${portfolioData.profile.email}`}>{portfolioData.profile.email}</a></p>
            <p><span style={{color: '#10b981', fontWeight: 'bold'}}>LinkedIn:</span> <a href={portfolioData.profile.linkedin} target="_blank" rel="noreferrer">{portfolioData.profile.linkedin}</a></p>
            <p><span style={{color: '#10b981', fontWeight: 'bold'}}>GitHub:</span> <a href={portfolioData.profile.github} target="_blank" rel="noreferrer">{portfolioData.profile.github}</a></p>
            {portfolioData.profile.phone && (
              <p><span style={{color: '#10b981', fontWeight: 'bold'}}>Phone:</span> {portfolioData.profile.phone}</p>
            )}
            {portfolioData.profile.location && (
              <p><span style={{color: '#10b981', fontWeight: 'bold'}}>Location:</span> {portfolioData.profile.location}</p>
            )}
          </div>
        );
        break;

      case 'resume':
        outputContent = <p style={{color: '#10b981'}}>Opening resume document in a new window tab...</p>;
        window.open(portfolioData.profile.resumeUrl, '_blank');
        break;

      case 'history':
        outputContent = (
          <div style={{color: '#6b7280'}}>
            {newCommandHistory.map((cmd, idx) => (
              <p key={idx}>{idx + 1}  {cmd}</p>
            ))}
          </div>
        );
        break;

      case 'achievements':
        outputContent = (
          <div>
            {portfolioData.achievements.map((ach, idx) => (
              <p key={idx}>
                <span style={{color: '#f59e0b', fontWeight: 'bold'}}>🏆 {ach.title}</span> - {ach.organization} ({ach.year})
              </p>
            ))}
          </div>
        );
        break;

      case 'neofetch':
        const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(uptimeSec / 60);
        const secs = uptimeSec % 60;
        const uptimeStr = `${mins}m ${secs}s`;

        outputContent = (
          <div className="neofetch-container">
            <div className="neofetch-logo">
{`   /\\
  /  \\
 /____\\
/      \\

   /\\
  /  \\
 /____\\
/      \\`}
            </div>
            <div className="neofetch-info">
              <p style={{color: '#a78bfa', fontWeight: 'bold', borderBottom: '1px solid rgba(16, 185, 129, 0.25)', paddingBottom: 4, marginBottom: 4}}>
                visitor@aadit-os v2.0
              </p>
              <div className="neofetch-info-row">
                <span className="neofetch-key">OS:</span>
                <span className="neofetch-val">Aadit-OS Kernel v2.0.0</span>
              </div>
              <div className="neofetch-info-row">
                <span className="neofetch-key">Uptime:</span>
                <span className="neofetch-val">{uptimeStr}</span>
              </div>
              <div className="neofetch-info-row">
                <span className="neofetch-key">Shell:</span>
                <span className="neofetch-val">React-CustomJS Command Shell</span>
              </div>
              <div className="neofetch-info-row">
                <span className="neofetch-key">Target User:</span>
                <span className="neofetch-val">{portfolioData.profile.name} (TPM & Dev)</span>
              </div>
              <div className="neofetch-info-row">
                <span className="neofetch-key">Focus Areas:</span>
                <span className="neofetch-val">Agile PM, Strategy, Community, Filmmaking</span>
              </div>
              <div className="neofetch-colors">
                <div className="neofetch-color-block" style={{backgroundColor: '#ef4444'}} />
                <div className="neofetch-color-block" style={{backgroundColor: '#f59e0b'}} />
                <div className="neofetch-color-block" style={{backgroundColor: '#10b981'}} />
                <div className="neofetch-color-block" style={{backgroundColor: '#3b82f6'}} />
                <div className="neofetch-color-block" style={{backgroundColor: '#8b5cf6'}} />
                <div className="neofetch-color-block" style={{backgroundColor: '#06b6d4'}} />
              </div>
            </div>
          </div>
        );
        break;

      case 'sudo':
        if (args.join(' ').toLowerCase() === 'hire aadit') {
          outputContent = (
            <div style={{color: '#10b981'}}>
              <p style={{fontWeight: 'bold', animation: 'blink 1.5s infinite'}}>*** ACCESS GRANTED ***</p>
              <p>Hiring protocol authorized. Launching your email client to offer Aadit a contract...</p>
              <p style={{color: '#fff', fontSize: '0.85rem', marginTop: 4}}>Redirecting to: mailto:aaditajay.work@gmail.com</p>
            </div>
          );
          setTimeout(() => {
            window.location.href = `mailto:${portfolioData.profile.email}?subject=Hiring Aadit Ajay&body=Hello Aadit, I visited your portfolio and would love to discuss a project/role with you.`;
          }, 1500);
        } else {
          outputContent = <p style={{color: '#ef4444'}}>Permission denied. Did you mean 'sudo hire aadit'?</p>;
        }
        break;

      case 'exit':
        onExit();
        return;

      default:
        outputContent = <p style={{color: '#ef4444'}}>Command not found: '{commandName}'. Type 'help' to see available commands.</p>;
        break;
    }

    setHistory(prev => [
      ...prev,
      { type: 'input', content: trimmed },
      { type: 'output', content: outputContent }
    ]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue("");
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <div className="terminal-container" onClick={handleTerminalClick}>
      <div className="terminal-scanline" />
      
      {/* Top Header Bar */}
      {/* Top Header Bar — replace existing terminal-header div */}
<div className="terminal-header">
  <div className="terminal-traffic-lights">
    <span className="tl tl-red" onClick={onExit} />
    <span className="tl tl-yellow" onClick={onExit} />
    <span className="tl tl-green" />
  </div>
  <span className="terminal-header-title">bash — 80×24</span>
  <div style={{ width: 52 }} /> {/* spacer to centre title */}
</div>

      {/* Boot Screen */}
      {!bootComplete && (
        <div className="terminal-boot-container">
          <div className="terminal-boot-lines" ref={bodyRef}>
            {displayedBootLines.map((line, idx) => (
              <div key={idx} className="terminal-boot-line">{line}</div>
            ))}
            {bootIndex < BOOT_LINES.length && (
              <div className="terminal-boot-line">
                <span>_</span>
                <span className="term-cursor"></span>
              </div>
            )}
          </div>
          <button className="boot-skip-btn" onClick={skipBoot}>
            Skip Boot Sequence [Enter]
          </button>
        </div>
      )}

      {/* Active Shell Area */}
      {bootComplete && (
        <>
          <div className="terminal-body" ref={bodyRef}>
            {history.map((line, idx) => {
              if (line.type === 'input') {
                return (
                  <div key={idx} className="terminal-line-entry">
                    <div className="terminal-prompt-line">
                      <span className="prompt-user">aaditajay@Aadits-MacBook-Air</span>
                      <span className="prompt-sep"> </span>
                      <span className="prompt-path">~</span>
                      <span className="prompt-sep"> % </span>
                      <span className="terminal-input-text">{line.content}</span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="terminal-output-text">
                    {line.content}
                  </div>
                );
              }
            })}
          </div>

          <div className="terminal-input-container">
            <div className="terminal-prompt-line">
              <span className="prompt-user">aaditajay@Aadits-MacBook-Air</span>
              <span className="prompt-sep"> </span>
              <span className="prompt-path">~</span>
              <span className="prompt-sep"> % </span>
            </div>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input-field"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>
        </>
      )}
    </div>
  );
}
