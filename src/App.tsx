/**
 * Project: Vintage Vinyl Player
 * Feature: Restored Stripe Payment and Centered Layout (Golden Era Edition)
 */

import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sePlayRef = useRef<HTMLAudioElement | null>(null); 
  const seStopRef = useRef<HTMLAudioElement | null>(null); 
  const discRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null); 
  const rotationRef = useRef(0);
  const speedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>("/my_babe.mp3");
  const [isPlaying, setIsPlaying] = useState(false);
  const [bandName, setBandName] = useState("DROP DOWN MAMA");
  const [songTitle, setSongTitle] = useState("MY BABE");
  const [selectedLabel, setSelectedLabel] = useState("2120");
  
  const [showHelp, setShowHelp] = useState(false);

  const IMMERSIVE_OPACITY = 0.4;
  const IMMERSIVE_HOVER_OPACITY = 0.8; 

  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [recordSize, setRecordSize] = useState(400);
  const [grooveSize, setGrooveSize] = useState(2); 

  const TARGET_RPM = 12.0; 
  const TARGET_DEG_PER_SEC = (TARGET_RPM * 360) / 60;
  const VINTAGE_GOLD = "#e2c27b";

  const labelStyles: Record<string, any> = {
    "2120": { color: "#2a4058", textColor: VINTAGE_GOLD, subText: "2120 S. MICHIGAN AVE. • CHICAGO, ILL." },
    "Red-Chkr": { color: "#a52a2a", textColor: "white", subText: "RECORDING CO. • CHICAGO, ILL." },
    "Vee-Jay": { color: "#1a1a1a", textColor: "white", subText: "CHICAGO-YOKOHAMA" },
    "Rsg-Sun": { color: "#facc15", textColor: "#3f2b1d", subText: "MEMPHIS, TENNESSEE" },
  };

  // Stripeリンクを復元
  const handleDonation = () => {
    const paymentLink = "https://buy.stripe.com/eVq5kD034glf4eFgWpdIA00"; 
    if (paymentLink && paymentLink.startsWith("https://buy.stripe.com")) {
      window.location.href = paymentLink;
    }
  };

  useEffect(() => {
    const checkLayout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isLand = w > h;
      const isMobLand = isLand && h < 600;
      
      setIsLandscape(isLand);
      setIsMobileLandscape(isMobLand);

      if (!wrapperRef.current) {
        let size = 400;
        if (isMobLand) size = Math.min(h * 1.01, w - 180);
        else if (isLand) size = Math.min(h * 0.9, w - 450);
        else size = w * 0.9;
        setRecordSize(size);
      }

      const isMobile = w < 768 || isMobLand;
      setGrooveSize(isMobile ? 2 : 5);
      setIsLargeScreen(!isMobile);
    };
    
    window.addEventListener("resize", checkLayout);
    checkLayout(); 
    return () => window.removeEventListener("resize", checkLayout);
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = (entry.target as HTMLDivElement).offsetWidth;
        if (width > 0) {
          setRecordSize(width);
        }
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const FONT_SCALE = recordSize / 400;

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
    }
  }, [audioUrl]);

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

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true); 
      setTimeout(() => { 
        if (sePlayRef.current) { 
          sePlayRef.current.currentTime = 0; 
          sePlayRef.current.play().catch(()=>{}); 
          setTimeout(() => {
            if (sePlayRef.current) sePlayRef.current.pause();
          }, 300);
        } 
      }, 700); 
      setTimeout(() => { 
        if (audioRef.current) {
          audioRef.current.currentTime = 0; 
          audioRef.current.play().catch(e => console.log("Play error:", e)); 
        }
      }, 1300); 
    } else {
      if (audioRef.current) audioRef.current.pause(); 
      if (seStopRef.current) { 
        seStopRef.current.currentTime = 0; 
        seStopRef.current.play().catch(()=>{}); 
        setTimeout(() => {
          if (seStopRef.current) seStopRef.current.pause();
        }, 300);
      }
      setIsPlaying(false); 
    }
  };

  const displaySongTitle = selectedLabel === "Red-Chkr" ? `"${songTitle}"` : songTitle;

  const getDynamicFontSize = (text: string, baseSize: number) => {
    const len = text.length;
    let ratio = 1;
    if (len <= 10) ratio = 1;
    else if (len <= 15) ratio = 0.85;
    else if (len <= 20) ratio = 0.7;
    else ratio = 0.55;
    
    return `${baseSize * ratio * FONT_SCALE}px`;
  };

  // レコードを中央に配置（translateXを削除）
  const getRecordTransform = () => {
    const transforms = [];
    if (isPlaying && !isLandscape) transforms.push('scale(1.05)');
    if (isPlaying && isLandscape) transforms.push('scale(1.02)');
    return transforms.length > 0 ? transforms.join(' ') : 'none';
  };

  return (
    <div className={`flex items-center min-h-screen bg-[#050505] text-zinc-400 font-sans select-none overflow-x-hidden relative transition-all duration-1000
      ${isLandscape ? 'flex-row justify-between px-6 md:px-16' : 'flex-col justify-center p-3 md:p-6'}
    `}>

      <style>{`
        @media (hover: hover) {
          .immersive-btn-playing:hover {
            background-color: rgba(0, 0, 0, 0.4) !important;
            color: #d4d4d8 !important; 
            border-color: rgba(161, 161, 170, 0.6) !important; 
            opacity: ${IMMERSIVE_HOVER_OPACITY} !important;
          }
        }
      `}</style>

      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 rounded-[30px] p-6 w-full max-w-md max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button 
              onClick={() => setShowHelp(false)} 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all pointer-events-auto"
            >
              ✕
            </button>
            <h2 className="text-lg md:text-xl font-black text-white mb-5 tracking-tight flex items-center gap-2">
              <span>📻</span> 使い方ガイド
            </h2>
            <div className="space-y-5 text-[11px] md:text-xs leading-relaxed text-zinc-300">
              <div>
                <h3 className="font-bold text-white border-b border-zinc-800 pb-1.5 mb-2">🎵 基本的な遊び方</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong className="text-zinc-100">PLAY / STOP:</strong> レコードの再生・停止を操作します。</li>
                  <li><strong className="text-zinc-100">マルチデバイス横画面:</strong> 横画面にすると、専用のフルスクリーンプレイヤーになります。</li>
                </ul>
              </div>
            </div>
            <button 
              onClick={() => setShowHelp(false)} 
              className="mt-7 w-full py-3.5 rounded-xl bg-white text-black font-black text-xs tracking-widest uppercase active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {isLandscape && (
        <button 
          onClick={togglePlay} 
          className={`shrink-0 z-50 w-24 h-24 md:w-32 md:h-32 rounded-full font-black text-sm md:text-xl active:scale-95 transition-all duration-700 uppercase tracking-widest flex items-center justify-center backdrop-blur-sm
            ${isPlaying 
              ? 'bg-black/20 text-zinc-500/50 border border-zinc-500/40 shadow-none immersive-btn-playing scale-100' 
              : 'bg-zinc-100 text-black border border-white/10 shadow-2xl hover:bg-white scale-[1.05]'}
          `}
          style={{ opacity: isPlaying ? IMMERSIVE_OPACITY : 1 }}
        >
          {isPlaying ? "STOP" : "PLAY"}
        </button>
      )}

      <div 
        ref={wrapperRef}
        className={`relative flex items-center justify-center bg-zinc-900 rounded-[40px] md:rounded-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.95)] border border-white/5 overflow-visible z-10 transition-all duration-1000 shrink-0
          ${isMobileLandscape 
            ? 'w-[101vh] aspect-square max-w-[calc(100vw-180px)] m-0' 
            : isLandscape 
              ? 'w-[90vh] aspect-square max-w-[calc(100vw-450px)] m-0' 
              : 'w-[90vw] aspect-square mt-4 mb-8'}
        `}
        style={{ transform: getRecordTransform() }}
      >
        <div ref={discRef} className="absolute w-[88%] h-[88%] rounded-full shadow-[0_0_60px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden will-change-transform z-10"
          style={{ background: `radial-gradient(circle at center, transparent 37.8%, rgba(0,0,0,0.92) 38.2%, transparent 40%), repeating-radial-gradient(circle at center, #020202 0px, #020202 ${grooveSize / 2}px, rgba(255,255,255,0.06) ${grooveSize * 0.75}px, #020202 ${grooveSize}px), radial-gradient(circle at center, #2a2a2a 0%, #000 100%)` }}>
          
          <div className="absolute inset-0 rounded-full opacity-[0.20] pointer-events-none z-10" 
               style={{ 
                 background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.15) 15deg, rgba(0,0,0,0.5) 35deg, transparent 60deg, rgba(255,255,255,0.05) 85deg, rgba(0,0,0,0.4) 110deg, transparent 140deg, rgba(255,255,255,0.1) 170deg, rgba(0,0,0,0.6) 200deg, transparent 230deg, rgba(255,255,255,0.15) 260deg, rgba(0,0,0,0.5) 290deg, transparent 320deg, rgba(255,255,255,0.05) 340deg, transparent 360deg)",
                 WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,0.1) 24.3%, black 24.4%)",
                 maskImage: "radial-gradient(circle at center, rgba(0,0,0,0.1) 24.3%, black 24.4%)"
               }} />

          <div className="relative w-[37.5%] h-[37.5%] rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_22px_rgba(0,0,0,0.95)] border-t border-white/10 overflow-hidden"
            style={{ backgroundColor: labelStyles[selectedLabel].color }}>
            
            <div className="absolute inset-0 pointer-events-none">
              {selectedLabel === "2120" && (
                <div className="absolute top-0 w-full h-full">
                  <div className="absolute bottom-0 w-full h-[48%] bg-[#f2f0e4]" />
                  <div className="absolute top-0 w-full h-[52%] flex flex-col items-center justify-end pb-[10%] z-10 text-white">
                      <span style={{ fontSize: `${12 * FONT_SCALE}px` }} className="mb-0.5">♛</span>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: `${16 * FONT_SCALE}px` }}>†</span>
                        <div className="flex flex-col items-center">
                          <div style={{ fontSize: `${18 * FONT_SCALE}px`, lineHeight: 1 }} className="font-black tracking-tighter">2120</div>
                          <div style={{ fontSize: `${3.5 * FONT_SCALE}px` }} className="font-bold tracking-[0.15em] mt-0.5 uppercase">RECORD CORP.</div>
                        </div>
                        <span style={{ fontSize: `${16 * FONT_SCALE}px` }}>♘</span>
                      </div>
                  </div>
                </div>
              )}
              {selectedLabel === "Red-Chkr" && (
                <div className="absolute top-0 w-full h-full">
                  <div className="absolute top-0 w-full h-[55%] opacity-25 border-b border-white/20" 
                    style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '12px 12px', borderRadius: '50% 50% 0 0' }} 
                  />
                  <div style={{ fontSize: `${13 * FONT_SCALE}px` }} className="absolute top-[14%] w-full text-center text-white font-serif italic font-black tracking-tighter scale-y-125">Red Checker</div>
                  <div style={{ fontSize: `${2.8 * FONT_SCALE}px`, top: "42%" }} className="absolute w-full text-center text-white font-bold tracking-[0.25em]">RECORDING CO.</div>
                </div>
              )}
            </div>

            <div className="z-10 flex flex-col items-center justify-end w-full h-full pb-[16%] px-1">
              <div style={{ color: selectedLabel === "2120" ? "#111" : labelStyles[selectedLabel].textColor, fontSize: getDynamicFontSize(displaySongTitle, isLargeScreen ? 9.18 : 6) }} className={`${isLargeScreen ? 'font-serif font-bold tracking-normal' : 'font-black tracking-tight'} whitespace-nowrap overflow-hidden w-[90%] text-center mb-1`}>{displaySongTitle}</div>
              <div style={{ color: selectedLabel === "2120" ? VINTAGE_GOLD : "rgba(255,255,255,0.9)", fontSize: getDynamicFontSize(bandName, isLargeScreen ? 8.84 : 5.2) }} className="font-bold uppercase text-center mb-1.5">{bandName}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: `${3 * FONT_SCALE}px` }} className="font-black tracking-[0.22em] uppercase text-center opacity-85">{labelStyles[selectedLabel].subText}</div>
            </div>
            
            <div className="absolute w-[8%] h-[8%] rounded-full bg-[#050505] border border-black/50 z-20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]" />
          </div>
        </div>

        <div className="absolute rounded-full bg-zinc-800 z-20 shadow-xl" style={{ top: "6%", right: "6%", width: "9%", height: "9%" }} />
        
        <div className="absolute transition-transform duration-1000 z-30 flex items-center justify-end"
          style={{ 
            top: "10.5%", right: "10.5%", width: "75%", height: "2%", 
            transformOrigin: "center right", 
            transform: `rotate(${isPlaying ? -80.5 : -90}deg)`,
            filter: "drop-shadow(-8px 12px 6px rgba(0,0,0,0.6))"
          }}>
          <div className="w-full bg-gradient-to-l from-zinc-600 via-zinc-300 to-zinc-500 rounded-full" style={{ height: "40%" }} />
        </div>
      </div>

      <div className={`transition-all duration-700 z-40
        ${!isLandscape 
          ? `relative w-full max-w-sm space-y-4 bg-zinc-900/60 p-5 md:p-7 rounded-[35px] border border-white/5 shadow-2xl backdrop-blur-xl` 
          : 'fixed bottom-6 right-6 w-80 bg-zinc-900/30 hover:bg-zinc-900/90 p-5 rounded-[25px] border border-white/10 shadow-2xl backdrop-blur-md space-y-3'}
        ${isMobileLandscape ? 'hidden' : ''}
      `}>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(labelStyles).map((style) => (
            <button key={style} onClick={() => setSelectedLabel(style)} className={`py-2.5 rounded-xl text-[8px] md:text-[9px] font-black border transition-all uppercase tracking-tight flex flex-col items-center justify-center ${selectedLabel === style ? 'bg-white text-black border-white' : 'bg-black/40 text-zinc-600 border-zinc-800 hover:bg-black/60'}`}>
              {style}
            </button>
          ))}
        </div>
        <div className="space-y-2 pt-2 border-t border-white/5">
          <input type="text" value={bandName} onChange={(e) => setBandName(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3 rounded-xl text-zinc-100 text-[11px] w-full outline-none focus:border-zinc-500" />
          <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3 rounded-xl text-zinc-100 text-[11px] w-full outline-none focus:border-zinc-500" />
          <div className="flex gap-2">
            <label className="flex-1 h-12 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-xl flex items-center justify-center cursor-pointer text-[9px] font-black shadow-xl hover:bg-zinc-700">
              LOAD MUSIC
              <input type="file" accept="audio/*" className="hidden" onChange={(e) => { 
                  const f = e.target.files?.[0]; 
                  if (f) { 
                    const newUrl = URL.createObjectURL(f);
                    setAudioUrl(newUrl); 
                    setSongTitle(f.name.replace(/\.[^/.]+$/, "").toUpperCase()); 
                  } 
                }} 
              />
            </label>
            <button onClick={handleDonation} className="flex-1 h-12 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl flex flex-col items-center justify-center text-amber-500 transition-all active:scale-95">
              <span className="text-[9px] font-black tracking-widest uppercase">Buy Me a Coffee</span>
              <span className="text-[6.5px] font-normal opacity-70 tracking-widest mt-0.5">缶コーヒーを奢る(投げ銭)</span>
            </button>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={audioUrl || undefined} preload="auto" playsInline crossOrigin="anonymous" onEnded={() => setIsPlaying(false)} />
      <audio ref={sePlayRef} src="/needle-drop.mp3" preload="auto" />
      <audio ref={seStopRef} src="/needle-up.mp3" preload="auto" />
    </div>
  );
}