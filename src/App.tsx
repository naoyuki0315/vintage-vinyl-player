/**
 * Project: Vintage Vinyl Player - Golden Era Edition (v2.2.7)
 * Restore: RISING SUN Sunburst Logic (No more accidental changes)
 * Focus: Song Title Auto-scaling/Fitting only
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

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bandName, setBandName] = useState("DROP DOWN MAMA");
  const [songTitle, setSongTitle] = useState("YOKOHAMA CHICAGO BLUES");
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
    <div className="flex flex-col items-center min-h-screen bg-[#050505] text-zinc-400 p-4 font-sans select-none overflow-y-auto pb-24">
      <div className="relative w-[94vw] h-[94vw] max-w-[450px] max-h-[450px] flex items-center justify-center bg-zinc-900 rounded-[50px] shadow-[0_50px_100px_rgba(0,0,0,0.9)] mb-10 border border-white/5 overflow-visible">
        
        <div ref={discRef} className="relative w-[85%] h-[85%] rounded-full shadow-[0_0_70px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden will-change-transform z-10"
          style={{ background: `radial-gradient(circle at center, transparent 37.8%, rgba(0,0,0,0.8) 38.2%, transparent 39%), repeating-radial-gradient(circle at center, #080808 0px, #080808 1px, #141414 1.5px, #080808 2px), radial-gradient(circle at center, #1c1c1c 0%, #000 100%)` }}>
          <div className="absolute inset-0 rounded-full opacity-[0.08] pointer-events-none z-10" style={{ background: "conic-gradient(from 25deg, transparent, #fff 50deg, transparent 120deg, #fff 210deg, transparent)" }} />
          
          <div className="relative w-[37.5%] h-[37.5%] rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] border-t border-white/10 overflow-hidden"
            style={{ backgroundColor: labelStyles[selectedLabel].color }}>
            
            {/* 2120 (CHESS) */}
            {selectedLabel === "2120" && (
              <div className="absolute top-0 w-full h-full">
                <div className="absolute bottom-0 w-full h-[48%] bg-[#f2f0e4]" />
                <div className="absolute top-0 w-full h-[52%] flex flex-col items-center justify-end pb-3 z-10 text-white">
                    <span className="text-[14px] mb-1 text-white">♛</span>
                    <div className="flex items-center gap-3.5">
                      <span className="text-[19px] text-white">†</span>
                      <div className="flex flex-col items-center">
                        <div className="text-[21px] font-black tracking-tighter leading-none text-white">2120</div>
                        <div className="text-[4.2px] font-bold tracking-[0.15em] mt-0.5 uppercase text-white/90">RECORD CORP.</div>
                      </div>
                      <span className="text-[19px] text-white">♘</span>
                    </div>
                </div>
              </div>
            )}

            {/* RED CHECKER */}
            {selectedLabel === "Red-Chkr" && (
              <div className="absolute top-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 w-full h-[55%] opacity-25 border-b border-white/20" 
                  style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '14px 14px', borderRadius: '50% 50% 0 0' }} 
                />
                <div className="absolute top-5 w-full text-center text-white font-serif italic font-black text-[17px] tracking-tighter scale-y-125">Red Checker</div>
                <div className="absolute w-full text-center text-white text-[3.5px] font-bold tracking-[0.25em]" style={{ top: "46px" }}>RECORDING CO.</div>
              </div>
            )}

            {/* DDM CRITERION */}
            {selectedLabel === "Vee-Jay" && (
              <div className="absolute top-0 w-full h-full pointer-events-none flex flex-col items-center justify-center">
                <div className="absolute inset-[3%] rounded-full border border-white/30" />
                <div className="absolute inset-[5%] rounded-full border-[0.5px] border-white/20" />
                <div className="absolute top-2 flex flex-col items-center">
                  <div className="w-12 h-10 border-[1.2px] border-white/60 rounded-t-full flex flex-col items-center justify-end pb-1 overflow-hidden relative">
                    <div className="absolute inset-0 flex flex-col items-center pt-1 opacity-20">
                      <div className="w-[1px] h-full bg-white" />
                      <div className="absolute top-0 w-full h-[1px] bg-white" />
                    </div>
                    <span className="text-white text-[18px] font-black italic tracking-tighter z-10 leading-none">DDM</span>
                  </div>
                  <div className="text-[10px] font-black tracking-[0.25em] text-white mt-1 uppercase">CRITERION</div>
                </div>
              </div>
            )}

            {/* RISING SUN (元通りのデザインに復旧) */}
            {selectedLabel === "Rsg-Sun" && (
              <div className="absolute top-0 w-full h-full pointer-events-none flex flex-col items-center">
                <div className="absolute top-0 w-full h-full opacity-[0.18]" style={{ background: "repeating-conic-gradient(from 270deg, #3f2b1d 0deg 7.5deg, transparent 7.5deg 20deg)", maskImage: "linear-gradient(to bottom, black 50%, transparent 55%)" }} />
                <div className="absolute top-1.5 w-[84%] h-[40%] rounded-t-full border-[1.2px] border-[#3f2b1d]/60 flex flex-col items-center overflow-hidden pt-2 text-[#3f2b1d]">
                   <div className="text-[6px] font-bold tracking-[0.4em] opacity-80 leading-none">RISING</div>
                   <div className="text-[26px] font-black italic tracking-tighter opacity-90 leading-[0.8] mt-1">SUN</div>
                   <svg viewBox="0 0 100 100" className="w-7 h-7 mt-0.5 opacity-80" fill="currentColor">
                     <path d="M50 15c-3 0-6 2-7 5-2 0-4 1-5 3-2 0-3 2-3 4s1 4 3 4c1 4 5 7 9 7h6c4 0 8-3 9-7 2 0 3-2 3-4s-1-4-3-4c-1-2-3-3-5-3-1-3-4-5-7-5zM45 40l-5 15h20l-5-15h-10z" />
                   </svg>
                   <div className="absolute bottom-0 w-full border-t-[1.2px] border-[#3f2b1d]/60" />
                </div>
                <div className="absolute top-[42%] text-[4.5px] font-black tracking-[0.35em] text-[#3f2b1d]">RECORDING COMPANY</div>
              </div>
            )}

            <div className="absolute inset-0 opacity-15 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />

            <div className={`z-10 text-center px-1 flex flex-col items-center w-full ${selectedLabel === "2120" ? "mt-[45%]" : "mt-[55%]"}`}>
              <div className="font-black tracking-tight leading-none whitespace-nowrap overflow-hidden w-[92%]" 
                style={{ 
                  color: selectedLabel === "2120" ? "#111" : labelStyles[selectedLabel].textColor,
                  fontSize: songTitle.length > 20 ? '7.2px' : '9px' 
                }}>
                {selectedLabel === "2120" ? songTitle : `"${songTitle}"`}
              </div>
              <div className="text-[8px] font-bold mt-1.5 uppercase" style={{ color: selectedLabel === "2120" ? VINTAGE_GOLD : (labelStyles[selectedLabel].textColor === "white" ? "rgba(255,255,255,0.9)" : "rgba(63,43,29,0.9)") }}>
                {bandName}
              </div>
              <div className="text-[3px] mt-2 opacity-60 font-black tracking-widest uppercase leading-none" style={{ color: labelStyles[selectedLabel].textColor === "white" ? "rgba(255,255,255,0.7)" : "rgba(63,43,29,0.7)" }}>
                {labelStyles[selectedLabel].subText}
              </div>
            </div>

            <div className="absolute w-[8%] h-[8%] rounded-full bg-[#050505] border border-black/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] z-20" />
          </div>
        </div>

        <div className="absolute w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 z-20" style={{ top: "4%", right: "4%" }}>
          <div className="w-10 h-10 rounded-full bg-zinc-900 shadow-inner" />
        </div>
        <div className="absolute transition-transform duration-1000 z-30 flex items-center justify-end"
          style={{ top: "4%", right: "4%", width: "78%", height: "40px", marginTop: "12px", marginRight: "12px", transformOrigin: "center right", transform: `rotate(${isPlaying ? -77 : -90}deg)` }}>
          <div className="h-1.5 w-full bg-gradient-to-l from-zinc-600 via-zinc-300 to-zinc-500 rounded-full shadow-md" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-8 bg-zinc-950 rounded-sm shadow-xl border-r border-zinc-800 flex items-center justify-start pl-2" style={{ transform: "rotate(22deg)", transformOrigin: "center right" }}> 
             <div className="absolute -bottom-1 left-2 w-1 h-3 bg-zinc-300 rounded-full opacity-80" /> 
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-6 bg-zinc-900/50 p-7 rounded-[40px] border border-white/5 shadow-2xl relative z-40 backdrop-blur-md">
        <div className="flex justify-center mb-2">
          <button onClick={togglePlay} disabled={!audioUrl} className="w-16 h-16 rounded-full bg-zinc-100 text-black font-black text-[10px] active:scale-95 transition-all uppercase tracking-widest">{isPlaying ? "STOP" : "PLAY"}</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(labelStyles).map((style) => (
            <button key={style} onClick={() => setSelectedLabel(style)} className={`py-3 rounded-2xl text-[9px] font-black border transition-all uppercase tracking-widest flex flex-col items-center justify-center ${selectedLabel === style ? 'bg-white text-black border-white' : 'bg-black/40 text-zinc-600 border-zinc-800 hover:border-zinc-500'}`}>
              <span className="opacity-50 text-[6px]">Parody of</span>
              {style === "2120" ? "2120" : style === "Red-Chkr" ? "RED CHECKER" : style === "Vee-Jay" ? "DDM" : "RISING SUN"}
            </button>
          ))}
        </div>
        <div className="space-y-3 pt-2 border-t border-white/5">
          <input type="text" value={bandName} onChange={(e) => setBandName(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3.5 rounded-2xl text-zinc-100 text-xs w-full outline-none" />
          <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3.5 rounded-2xl text-zinc-100 text-xs w-full outline-none" />
          <label className="w-full h-14 bg-zinc-100 rounded-2xl flex items-center justify-center cursor-pointer text-black text-[10px] font-black shadow-xl">
            Load Music
            <input type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setAudioUrl(URL.createObjectURL(f)); }} />
          </label>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl ?? undefined} onEnded={() => setIsPlaying(false)} />
      <audio ref={sePlayRef} src="/needle-drop.mp3" preload="auto" />
      <audio ref={seStopRef} src="/needle-up.mp3" preload="auto" />
    </div>
  );
}