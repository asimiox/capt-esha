
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, Cpu, Award, Star, Terminal, ChevronDown, CheckCircle, Crosshair, Wifi, Heart, Map, Lock, Activity, Radio } from 'lucide-react';

// --- Theme Constants ---
const THEME = {
  bg: '#0a0f05', // Deep Black/Green
  terminal: '#0f1a0b',
  text: '#8FBC8F', // Dark Sea Green (Dimmed text)
  highlight: '#39FF14', // Neon Terminal Green
  accent: '#FFD700', // Gold
  danger: '#ff3333',
  fontHeading: "'Black Ops One', system-ui, cursive",
  fontBody: "'Courier Prime', monospace",
};

// --- Styles & Effects ---
const Styles = () => (
  <style>{`
    :root {
      --bg: ${THEME.bg};
      --term: ${THEME.terminal};
      --text: ${THEME.text};
      --neon: ${THEME.highlight};
      --gold: ${THEME.accent};
    }

    * { box-sizing: border-box; }
    
    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--text);
      font-family: ${THEME.fontBody};
      overflow-x: hidden;
    }

    /* CRT Scanline Effect */
    .crt::before {
      content: " ";
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 999;
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
    
    .crt::after {
      content: " ";
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(18, 16, 16, 0.1);
      opacity: 0;
      z-index: 999;
      pointer-events: none;
      animation: flicker 0.15s infinite;
    }

    @keyframes flicker {
      0% { opacity: 0.027951; }
      5% { opacity: 0.048234; }
      10% { opacity: 0.012351; }
      15% { opacity: 0.08251; }
      20% { opacity: 0.02351; }
      50% { opacity: 0.01351; }
      100% { opacity: 0.02351; }
    }

    /* Military HUD Styles */
    .hud-box {
      background: rgba(15, 26, 11, 0.9);
      border: 1px solid var(--text);
      box-shadow: 0 0 10px rgba(57, 255, 20, 0.1);
      position: relative;
    }

    .hud-box::before {
      content: '';
      position: absolute;
      top: -1px; left: -1px;
      width: 10px; height: 10px;
      border-top: 2px solid var(--neon);
      border-left: 2px solid var(--neon);
    }
    .hud-box::after {
      content: '';
      position: absolute;
      bottom: -1px; right: -1px;
      width: 10px; height: 10px;
      border-bottom: 2px solid var(--neon);
      border-right: 2px solid var(--neon);
    }

    .hud-btn {
      background: transparent;
      border: 1px solid var(--neon);
      color: var(--neon);
      font-family: ${THEME.fontHeading};
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .hud-btn:hover {
      background: var(--neon);
      color: #000;
      box-shadow: 0 0 15px var(--neon);
    }

    .hud-btn:active {
      transform: scale(0.98);
    }

    /* Typing Animation Cursor */
    .cursor-blink {
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }

    /* Matrix Rain Canvas */
    #matrix-canvas {
      position: fixed;
      top: 0; left: 0;
      z-index: 0;
      opacity: 0.15;
    }

    .glow-text {
      text-shadow: 0 0 5px var(--neon);
    }
    
    .gold-glow {
      text-shadow: 0 0 10px var(--gold);
    }

    .scan-line {
      width: 100%;
      height: 2px;
      background: var(--neon);
      opacity: 0.3;
      position: absolute;
      top: 0;
      animation: scan 3s linear infinite;
    }

    @keyframes scan {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0.5; }
      100% { top: 100%; opacity: 0; }
    }
    
    .fade-in { animation: fadeIn 1s forwards; opacity: 0; }
    @keyframes fadeIn { to { opacity: 1; } }
  `}</style>
);

// --- Utilities ---
const Typewriter = ({ text, delay = 50, onComplete }: { text: string, delay?: number, onComplete?: () => void }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  return <span>{currentText}<span className="cursor-blink">_</span></span>;
};

// --- Components ---

const AuthScreen = ({ onAuth }: { onAuth: () => void }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase().trim() === 'CAPTAIN') {
      onAuth();
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full hud-box p-8">
        <div className="flex justify-center mb-6">
          <Shield size={48} className={`text-[${THEME.highlight}] animate-pulse`} />
        </div>
        <h2 className="text-xl text-center mb-2 font-mono text-[#39FF14]">CLASSIFIED SYSTEM</h2>
        <p className="text-xs text-center mb-8 text-[#8FBC8F]">MINISTRY OF DEFENSE // CYBER DIVISION</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-xs uppercase tracking-widest text-[#8FBC8F]">Security Clearance Required</label>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-[#0f1a0b] border border-[#39FF14] text-[#39FF14] p-3 font-mono outline-none focus:box-shadow-[0_0_10px_#39FF14]"
            placeholder="ENTER YOUR FUTURE RANK"
            autoFocus
          />
          {error && <p className="text-[#ff3333] text-xs font-mono">ACCESS DENIED. INCORRECT RANK.</p>}
          <button type="submit" className="hud-btn py-3 mt-2">AUTHENTICATE</button>
        </form>
        <div className="mt-8 pt-4 border-t border-[#1a2b15] text-[10px] text-center opacity-50">
          <p>AUTHORIZED PERSONNEL ONLY</p>
          <p>IP LOGGED: ::1</p>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children, id, isActive, isLocked }: { title: string, children?: React.ReactNode, id: string, isActive?: boolean, isLocked?: boolean }) => {
  return (
    <div id={id} className={`min-h-screen flex flex-col items-center justify-center p-4 relative transition-all duration-700 ${isActive ? 'opacity-100 blur-0' : 'opacity-20 blur-sm pointer-events-none'}`}>
      <div className="hud-box p-6 md:p-12 w-full max-w-3xl relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Scan line for active section */}
        {isActive && <div className="scan-line"></div>}

        <div className="flex justify-between items-center border-b border-[#39FF14] pb-4 mb-6">
          <h2 className="text-2xl md:text-4xl text-[#39FF14] uppercase tracking-tighter glow-text" style={{ fontFamily: THEME.fontHeading }}>
            {title}
          </h2>
          {isLocked ? <Lock className="text-red-500" /> : <div className="text-xs font-mono text-[#39FF14] border border-[#39FF14] px-2 py-1">SECURE</div>}
        </div>
        
        <div className="relative z-10 font-mono text-[#8FBC8F]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mission1Complete, setMission1Complete] = useState(false);
  const [mission2Complete, setMission2Complete] = useState(false);
  const [mission3Complete, setMission3Complete] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [bootSequence, setBootSequence] = useState(false);

  // Matrix Rain Effect
  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "010101 CAPTAIN ESHA ARMY CS CODE 01001";
    const drops: number[] = [];
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    for (let i = 0; i < columns; i++) drops[i] = 1;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#39FF14"; // Neon Green
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  // Boot Sequence Logic
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => setBootSequence(true), 1500);
    }
  }, [isAuthenticated]);

  // Scroll Logic
  useEffect(() => {
    if (mission1Complete && !mission2Complete) {
      setTimeout(() => document.getElementById('mission-2')?.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  }, [mission1Complete]);

  useEffect(() => {
    if (mission2Complete && !mission3Complete) {
      setTimeout(() => document.getElementById('mission-3')?.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  }, [mission2Complete]);

  // Handlers
  const handleMission1 = () => {
    setMission1Complete(true);
  };

  const handleHack = () => {
    if (mission2Complete) return;
    setHackProgress(prev => {
      const next = prev + 10;
      if (next >= 100) {
        setMission2Complete(true);
        // Fire confetti manually (CSS/Canvas implementation can be complex, using simplified visual feedback instead)
        return 100;
      }
      return next;
    });
  };

  // Hack Decay
  useEffect(() => {
    if (mission2Complete) return;
    const timer = setInterval(() => {
      setHackProgress(prev => Math.max(0, prev - 1));
    }, 50);
    return () => clearInterval(timer);
  }, [mission2Complete]);

  if (!isAuthenticated) {
    return (
      <div className="crt min-h-screen bg-black">
        <Styles />
        <canvas id="matrix-canvas" />
        <AuthScreen onAuth={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="crt min-h-screen relative">
      <Styles />
      <canvas id="matrix-canvas" />
      
      {/* HUD Header */}
      <div className="fixed top-0 left-0 w-full p-2 flex justify-between items-center z-50 pointer-events-none text-[#39FF14] text-xs font-mono bg-black/50 border-b border-[#39FF14]/30">
        <div className="flex gap-4">
          <span>OP: ESHA</span>
          <span>STATUS: ACTIVE</span>
        </div>
        <div className="flex gap-4">
          <Activity size={14} className="animate-pulse" />
          <span>SECURE CONN</span>
        </div>
      </div>

      {!bootSequence ? (
         <div className="h-screen flex items-center justify-center p-8">
           <div className="font-mono text-[#39FF14]">
             <Typewriter text="INITIALIZING SYSTEM... LOADING PROFILES... DECRYPTING MISSION DATA... WELCOME CAPTAIN." onComplete={() => setBootSequence(true)} />
           </div>
         </div>
      ) : (
        <>
          {/* Landing Screen */}
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 text-center fade-in">
            <div className="mb-8 border border-[#39FF14] p-8 rounded-full relative">
              <div className="absolute inset-0 border border-[#39FF14] rounded-full animate-ping opacity-20"></div>
              <Star size={64} className="text-[#FFD700] gold-glow" />
            </div>
            
            <h1 className="text-4xl md:text-7xl mb-4 text-[#39FF14] uppercase glow-text" style={{ fontFamily: THEME.fontHeading }}>
              Mission: Captain Esha
            </h1>
            
            <div className="hud-box p-6 max-w-xl text-left mb-12">
              <p className="font-mono text-sm leading-relaxed">
                <span className="text-[#39FF14]">{`>`} TARGET:</span> Esha<br/>
                <span className="text-[#39FF14]">{`>`} OBJECTIVE:</span> Army Officer (Captain)<br/>
                <span className="text-[#39FF14]">{`>`} CURRENT ASSET:</span> Computer Science Degree<br/>
                <span className="text-[#39FF14]">{`>`} ANALYSIS:</span> <span className="text-[#FFD700]">The perfect combination.</span>
              </p>
            </div>

            <button 
              onClick={() => document.getElementById('mission-1')?.scrollIntoView({ behavior: 'smooth' })}
              className="hud-btn px-8 py-4 flex items-center gap-2"
            >
              INITIATE BRIEFING <ChevronDown size={16} />
            </button>
          </div>

          {/* Mission 1 */}
          <Section id="mission-1" title="01 // THE DILEMMA" isActive={true}>
            <p className="mb-6 text-lg">
              "I want to be a Captain. Why am I doing CS?"
            </p>
            <p className="mb-8 opacity-80 text-sm">
              INTELLIGENCE REPORT: The subject believes these two paths are conflicting. Analysis suggests otherwise.
            </p>
            
            <div className="grid grid-cols-1 gap-6 w-full">
              {!mission1Complete ? (
                <button 
                  onClick={handleMission1}
                  className="hud-btn p-6 flex items-center justify-center gap-4 group"
                >
                  <Radio className="group-hover:animate-ping" />
                  <span>REQUEST TACTICAL ANALYSIS</span>
                </button>
              ) : (
                 <div className="border border-[#39FF14] bg-[#39FF14]/10 p-4 text-center">
                   <p className="text-[#39FF14] font-bold tracking-widest">ANALYSIS COMPLETE</p>
                   <p className="text-xs mt-2">DATA TRANSMITTING TO TERMINAL 02...</p>
                 </div>
              )}
            </div>
          </Section>

          {/* Mission 2 */}
          <Section id="mission-2" title="02 // THE REALITY" isActive={mission1Complete} isLocked={!mission1Complete}>
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col items-center gap-4 mb-6 text-center">
                <Terminal className="text-[#FFD700]" size={40} />
                <p>
                  Modern warfare is not just trenches.<br/>
                  It is <span className="text-[#FFD700]">Intelligence. Cyber Defense. Signals.</span>
                </p>
                <p className="text-sm opacity-70">
                  The Army doesn't just need soldiers. They need <span className="text-white font-bold">Hackers</span>.
                </p>
              </div>

              {!mission2Complete ? (
                <div className="w-full max-w-md mt-4">
                  <div className="flex justify-between text-xs text-[#39FF14] mb-2 font-mono">
                    <span>ENCRYPTION LEVEL</span>
                    <span>{(100 - hackProgress).toFixed(0)}% INTEGRITY</span>
                  </div>
                  <div className="w-full h-6 border border-[#39FF14] p-1 mb-6">
                    <div 
                      className="h-full bg-[#39FF14] transition-all duration-75 ease-linear"
                      style={{ width: `${hackProgress}%` }}
                    ></div>
                  </div>
                  
                  <button 
                    onMouseDown={handleHack}
                    className="hud-btn w-full py-4 bg-[#39FF14]/10 active:bg-[#39FF14] active:text-black"
                  >
                    {hackProgress > 80 ? 'BREACHING FIREWALL...' : 'TAP REPEATEDLY TO DEPLOY CODE'}
                  </button>
                  <p className="text-[10px] text-center mt-2 text-red-400 animate-pulse">CONNECTION UNSTABLE... MAINTAIN STREAM</p>
                </div>
              ) : (
                <div className="text-center animate-bounce mt-4">
                   <h3 className="text-2xl font-bold text-[#FFD700] glow-text">SYSTEM OVERRIDDEN</h3>
                   <p className="mt-2 text-sm">Your CS degree is your weapon, Captain.</p>
                </div>
              )}
            </div>
          </Section>

          {/* Mission 3 */}
          <Section id="mission-3" title="03 // CLASSIFIED INTEL" isActive={mission2Complete} isLocked={!mission2Complete}>
            {!mission3Complete ? (
               <div className="text-center">
                 <p className="mb-8 text-lg">
                   Final authorization required to view personnel file.
                 </p>
                 <button 
                   onClick={() => setMission3Complete(true)}
                   className="hud-btn px-12 py-6 text-xl border-gold text-[#FFD700] hover:shadow-[0_0_20px_#FFD700]"
                 >
                   OPEN FILE: ESHA
                 </button>
               </div>
            ) : (
              <div className="text-center flex flex-col items-center fade-in">
                <div className="mb-6 relative">
                  <Award size={100} className="text-[#FFD700] relative z-10 gold-glow" />
                </div>
                
                <h2 className="text-4xl text-[#FFD700] mb-6 glow-text" style={{ fontFamily: THEME.fontHeading }}>
                  CAPTAIN ESHA
                </h2>
                
                <div className="border-l-2 border-[#FFD700] pl-6 text-left max-w-lg">
                  <p className="text-lg leading-relaxed text-[#e0e0e0] font-mono mb-4">
                    <Typewriter 
                      text="You aren't lost. You are preparing. Every line of code you write is training for the strategic mind you will need in the field. The uniform is waiting for you."
                      delay={30}
                    />
                  </p>
                  <p className="text-[#39FF14] text-sm mt-8">
                     // END TRANSMISSION<br/>
                     // P.S. I believe in you.
                  </p>
                </div>
              </div>
            )}
          </Section>

          <footer className="py-12 text-center">
            <p className="text-[10px] text-[#39FF14]/50 tracking-[0.5em] uppercase">Top Secret // Eyes Only</p>
          </footer>
        </>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
