/**
 * Project: Vintage Vinyl Player - Golden Era Edition (v2.3.3)
 * Feature: Default Song "MY BABE" & Default MP3 Auto-load
 */

import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sePlayRef = useRef<HTMLAudioElement | null>(null); 
  const seStopRef = useRef<HTMLAudioElement | null>(null); 
  const discRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);
  const speedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Default title set to "MY BABE" and default URL to the local public file
  const [audioUrl, setAudioUrl] = useState<string | null>("/my-babe.mp3");
  const [isPlaying, setIsPlaying] = useState(false);
  const [bandName, setBandName] = useState("DROP DOWN MAMA");
  const [songTitle, setSongTitle] = useState("MY BABE");
  const [selectedLabel, setSelectedLabel] = useState("2120");

  const TARGET_RPM = 12.0; 
  const TARGET_DEG_PER_SEC = (TARGET_RPM * 360) / 60;
  const VINTAGE_GOLD = "#e2c27b";

  const labelStyles: Record<string, any> = {
    "2120": { color: "#2a4058", textColor: VINTAGE_GOLD, bottomBg: "#f2f0e4", parodyName: "2120", subText: "2120 S. MICHIGAN AVE. • CHICAGO, ILL." },
    "Red-Chkr": { color: "#a52a2a", textColor: "white", parodyName: "RED CHECKER", subText: "RECORDING CO. • CHICAGO, ILL." },
    "Vee-Jay": { color: "#1a1a1a", textColor: "white", parodyName: "DDM CRITERION", subText: "CHICAGO-YOKOHAMA" },
    "Rsg-Sun": { color: "#facc15", textColor: "#3f2b1d", parodyName: "RISING SUN", subText: "MEMPHIS, TENNESSEE" },
  };

  useEffect(() => {
    let lastTs = 0;
    const tick = (ts: number) => {
      if (!lastTs) { lastTs = ts; rafRef.current = requestAnimationFrame(tick); return; }
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const accel = 80;
      const target = isPlaying ? TARGET_DEG_PER_SEC : 0;
      const diff = target - speedRef.current;
      const step = Math.sign(diff) * Math.min(Math.abs(diff), accel * dt);
      speedRef.current += step;
      rotationRef.current = (rotationRef.current + speedRef.current * dt) % 360;
      if (discRef.current) {
        discRef.current.style.transform = `rotate(${rotationRef.current.toFixed(4)}deg) translateZ(0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying]);

  const playBriefly = (audioEl: HTMLAudioElement | null, duration: number) => {
    if (!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play();
    setTimeout(() => audioEl.pause(), duration * 1000);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    if (!isPlaying) {
      setIsPlaying(true); 
      setTimeout(() => playBriefly(sePlayRef.current, 0.2), 400); 
      setTimeout(() => audio.play(), 1000); 
    } else {
      audio.pause(); 
      setTimeout(() => {
        setIsPlaying(false); 
        playBriefly(seStopRef.current, 0.2); 
      }, 130); 
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#050505] text-zinc-400 p-3 md:p-6 font-sans select-none overflow-x-hidden pb-10">
      
      <div className="relative w-[92vw] h-[92vw] max-w-[400px] max-h-[400px] flex items-center justify-center bg-zinc-900 rounded-[40px] md:rounded-[50px] shadow-[0_30px_60px_rgba(0,0,0,0.9)] mt-4 mb-8 border border-white/5 overflow-visible">
        
        <div ref={discRef} className="relative w-[88%] h-[88%] rounded-full shadow-[0_0_50px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden will-change-transform z-10"
          style={{ background: `radial-gradient(circle at center, transparent 37.8%, rgba(0,0,0,0.8) 38.2%, transparent 39%), repeating-radial-gradient(circle at center, #080808 0px, #080808 1px, #141414 1.5px, #080808 2px), radial-gradient(circle at center, #1c1c1c 0%, #000 100%)` }}>
          <div className="absolute inset-0 rounded-full opacity-[0.08] pointer-events-none z-10" style={{ background: "conic-gradient(from 25deg, transparent, #fff 50deg, transparent 120deg, #fff 210deg, transparent)" }} />
          
          <div className="relative w-[37.5%] h-[37.5%] rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] border-t border-white/10 overflow-hidden"
            style={{ backgroundColor: labelStyles[selectedLabel].color }}>
            
            <div className="absolute inset-0 pointer-events-none">
              {selectedLabel === "2120" && (
                <div className="absolute top-0 w-full h-full">
                  <div className="absolute bottom-0 w-full h-[48%] bg-[#f2f0e4]" />
                  <div className="absolute top-0 w-full h-[52%] flex flex-col items-center justify-end pb-[8%] z-10 text-white">
                      <span className="text-[10px] md:text-[12px] mb-0.5">♛</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] md:text-[16px]">†</span>
                        <div className="flex flex-col items-center">
                          <div className="text-[16px] md:text-[18px] font-black tracking-tighter leading-none">2120</div>
                          <div className="text-[3px] md:text-[3.5px] font-bold tracking-[0.15em] mt-0.5 uppercase opacity-90">RECORD CORP.</div>
                        </div>
                        <span className="text-[14px] md:text-[16px]">♘</span>
                      </div>
                  </div>
                </div>
              )}
              {selectedLabel === "Red-Chkr" && (
                <div className="absolute top-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 w-full h-[55%] opacity-25 border-b border-white/20" 
                    style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '10px 10px', borderRadius: '50% 50% 0 0' }} 
                  />
                  <div className="absolute top-[12%] w-full text-center text-white font-serif italic font-black text-[13px] md:text-[15px] tracking-tighter scale-y-125">Red Checker</div>
                  <div className="absolute w-full text-center text-white text-[2.5px] md:text-[3px] font-bold tracking-[0.25em]" style={{ top: "40%" }}>RECORDING CO.</div>
                </div>
              )}
              {selectedLabel === "Vee-Jay" && (
                <div className="absolute top-0 w-full h-full pointer-events-none flex flex-col items-center">
                  <div className="absolute inset-[5%] rounded-full border border-white/30" />
                  <div className="absolute top-[8%] flex flex-col items-center">
                    <div className="w-8 h-7 md:w-10 md:h-8 border-[1.2px] border-white/60 rounded-t-full flex flex-col items-center justify-end pb-0.5 overflow-hidden">
                      <span className="text-white text-[13px] md:text-[15px] font-black italic tracking-tighter leading-none">DDM</span>
                    </div>
                    <div className="text-[6px] md:text-[8px] font-black tracking-[0.2em] text-white mt-1 uppercase">CRITERION</div>
                  </div>
                </div>
              )}
              {selectedLabel === "Rsg-Sun" && (
                <div className="absolute top-0 w-full h-full pointer-events-none flex flex-col items-center">
                  <div className="absolute top-0 w-full h-full opacity-[0.18]" style={{ background: "repeating-conic-gradient(from 270deg, #3f2b1d 0deg 7.5deg, transparent 7.5deg 20deg)", maskImage: "linear-gradient(to bottom, black 50%, transparent 55%)" }} />
                  <div className="absolute top-[5%] w-[84%] h-[38%] rounded-t-full border-[1px] border-[#3f2b1d]/60 flex flex-col items-center overflow-hidden pt-1 text-[#3f2b1d]">
                      <div className="text-[4px] md:text-[5px] font-bold tracking-[0.3em] leading-none">RISING</div>
                      <div className="text-[18px] md:text-[22px] font-black italic tracking-tighter leading-[0.8] mt-0.5">SUN</div>
                  </div>
                  <div className="absolute top-[42%] text-[3.5px] md:text-[4px] font-black tracking-[0.2em] text-[#3f2b1d]">RECORDING COMPANY</div>
                </div>
              )}
            </div>

            {/* Label Text Layer (Fixed spacers for 1st-2nd-3rd lines) */}
            <div className="z-10 flex flex-col items-center justify-end w-full h-full pb-[14%] px-1">
              <div className="font-black tracking-tight whitespace-nowrap overflow-hidden w-[90%] text-center mb-1" 
                style={{ 
                  color: selectedLabel === "2120" ? "#111" : labelStyles[selectedLabel].textColor,
                  fontSize: songTitle.length > 20 ? '5px' : '6px' 
                }}>
                {selectedLabel === "2120" ? songTitle : `"${songTitle}"`}
              </div>
              <div className="font-bold uppercase text-center mb-1.5"
                style={{ 
                  color: selectedLabel === "2120" ? VINTAGE_GOLD : (labelStyles[selectedLabel].textColor === "white" ? "rgba(255,255,255,0.9)" : "rgba(63,43,29,0.9)"),
                  fontSize: '5.2px'
                }}>
                {bandName}
              </div>
              <div className="text-[2.2px] md:text-[3px] font-black tracking-[0.22em] uppercase text-center opacity-85" 
                style={{ color: labelStyles[selectedLabel].textColor === "white" ? "rgba(255,255,255,0.85)" : "rgba(63,43,29,0.85)" }}>
                {labelStyles[selectedLabel].subText}
              </div>
            </div>

            <div className="absolute w-[8%] h-[8%] rounded-full bg-[#050505] border border-black/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] z-20" />
          </div>
        </div>

        <div className="absolute w-10 h-10 md:w-16 md:h-16 rounded-full bg-zinc-800 border border-zinc-700 z-20 shadow-xl" style={{ top: "6%", right: "6%" }}>
          <div className="w-full h-full flex items-center justify-center">
             <div className="w-[60%] h-[60%] rounded-full bg-zinc-900 shadow-inner" />
          </div>
        </div>

        <div className="absolute transition-transform duration-1000 z-30 flex items-center justify-end"
          style={{ top: "10.5%", right: "10.5%", width: "75%", height: "8px", transformOrigin: "center right", transform: `rotate(${isPlaying ? -77 : -90}deg)` }}>
          <div className="h-1 md:h-1.5 w-full bg-gradient-to-l from-zinc-600 via-zinc-300 to-zinc-500 rounded-full shadow-md" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-5 md:w-16 md:h-8 bg-zinc-950 rounded-sm shadow-xl border-r border-zinc-800 flex items-center justify-start pl-2" style={{ transform: "rotate(22deg)", transformOrigin: "center right" }}> 
              <div className="absolute -bottom-1 left-2 w-0.5 h-2 md:w-1 md:h-3 bg-zinc-400 rounded-full opacity-80" /> 
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4 bg-zinc-900/60 p-5 md:p-7 rounded-[35px] border border-white/5 shadow-2xl relative z-40 backdrop-blur-xl">
        <div className="flex justify-center">
          <button onClick={togglePlay} className={`w-14 h-14 md:w-16 md:h-16 rounded-full font-black text-[10px] active:scale-95 transition-all uppercase tracking-widest ${isPlaying ? 'bg-red-500 text-white' : 'bg-zinc-100 text-black'}`}>
            {isPlaying ? "STOP" : "PLAY"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(labelStyles).map((style) => (
            <button key={style} onClick={() => setSelectedLabel(style)} className={`py-2.5 rounded-xl text-[8px] md:text-[9px] font-black border transition-all uppercase tracking-tight flex flex-col items-center justify-center ${selectedLabel === style ? 'bg-white text-black border-white' : 'bg-black/40 text-zinc-600 border-zinc-800 hover:border-zinc-500'}`}>
              <span className="opacity-50 text-[6px] mb-0.5">Parody of</span>
              {style === "2120" ? "2120" : style === "Red-Chkr" ? "RED CHECKER" : style === "Vee-Jay" ? "DDM" : "RISING SUN"}
            </button>
          ))}
        </div>
        <div className="space-y-2 pt-2 border-t border-white/5">
          <input type="text" value={bandName} onChange={(e) => setBandName(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3 rounded-xl text-zinc-100 text-[11px] w-full outline-none focus:border-zinc-500" placeholder="BAND NAME" />
          <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3 rounded-xl text-zinc-100 text-[11px] w-full outline-none focus:border-zinc-500" placeholder="SONG TITLE" />
          <label className={`w-full h-12 md:h-14 rounded-xl flex items-center justify-center cursor-pointer text-[10px] font-black shadow-xl transition-all ${audioUrl === "/my-babe.mp3" ? 'bg-zinc-100 text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
            {audioUrl === "/my-babe.mp3" ? "LOAD NEW MUSIC" : "CUSTOM MUSIC LOADED"}
            <input type="file" accept="audio/mpeg, audio/mp3, audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setAudioUrl(URL.createObjectURL(f)); }} />
          </label>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl ?? undefined} onEnded={() => setIsPlaying(false)} />
      <audio ref={sePlayRef} src="/needle-drop.mp3" preload="auto" />
      <audio ref={seStopRef} src="/needle-up.mp3" preload="auto" />
    </div>
  );
}