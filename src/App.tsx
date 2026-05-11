/**
 * プロジェクト: Vintage Vinyl Player
 * 変更点: Stripe決済バージョンへの切り戻しとレイアウトの復元
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

  // Stripeの決済リンクに戻す
  const handleDonation = () => {
    // 以前使用していたStripeのリンクをここに貼り付けてください
    const paymentLink = "https://buy.stripe.com/your_original_stripe_link"; 
    if (paymentLink && paymentLink !== "https://buy.stripe.com/your_original_stripe_link") {
      window.location.href = paymentLink;
    } else {
      // リンクが未設定の場合はダミーの警告（実際は本物のURLを入れる）
      console.log("Stripe link not set");
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

      let size = 400;
      if (isMobLand) size = Math.min(h * 1.01, w - 180);
      else if (isLand) size = Math.min(h * 0.9, w - 450);
      else size = w * 0.9;
      setRecordSize(size);

      const isMobile = w < 768 || isMobLand;
      setGrooveSize(isMobile ? 2 : 5);
      setIsLargeScreen(!isMobile);
    };
    
    window.addEventListener("resize", checkLayout);
    checkLayout(); 
    return () => window.removeEventListener("resize", checkLayout);
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
          audioRef.current.play().catch(e => console.log("再生エラー:", e)); 
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

  return (
    <div className={`flex items-center min-h-screen bg-[#050505] text-zinc-400 font-sans select-none overflow-hidden relative
      ${isLandscape ? 'flex-row justify-between px-6 md:px-16' : 'flex-col justify-center p-3 md:p-6'}
    `}>

      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-[30px] p-6 w-full max-w-md max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
            <h2 className="text-lg font-black text-white mb-5">📻 使い方ガイド</h2>
            <div className="space-y-5 text-xs text-zinc-300">
              <div>
                <h3 className="font-bold text-white mb-1">🎵 再生/停止</h3>
                <p>レコードの再生・停止を操作します。再生中はズームモードになります。</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">🎧 音楽の読み込み</h3>
                <p>「LOAD MUSIC」からお手持ちのファイルを選択できます。</p>
              </div>
            </div>
            <button onClick={() => setShowHelp(false)} className="mt-7 w-full py-3.5 rounded-xl bg-white text-black font-black uppercase tracking-widest">閉じる</button>
          </div>
        </div>
      )}

      {isLandscape && (
        <button 
          onClick={togglePlay} 
          className={`shrink-0 z-50 w-24 h-24 md:w-32 md:h-32 rounded-full font-black text-sm md:text-xl transition-all duration-700 uppercase tracking-widest flex items-center justify-center
            ${isPlaying ? 'bg-black/20 text-zinc-500/50 border border-zinc-500/40' : 'bg-zinc-100 text-black shadow-2xl'}
          `}
        >
          {isPlaying ? "STOP" : "PLAY"}
        </button>
      )}

      <div 
        ref={wrapperRef}
        className={`relative flex items-center justify-center bg-zinc-900 rounded-[40px] md:rounded-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.95)] border border-white/5 transition-all duration-1000 shrink-0
          ${isMobileLandscape ? 'w-[101vh]' : isLandscape ? 'w-[90vh]' : 'w-[90vw]'} aspect-square
        `}
        style={{ transform: isPlaying ? 'scale(1.05)' : 'scale(1)' }}
      >
        <div ref={discRef} className="absolute w-[88%] h-[88%] rounded-full shadow-[0_0_60px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden will-change-transform z-10"
          style={{ background: `radial-gradient(circle at center, transparent 37.8%, rgba(0,0,0,0.92) 38.2%, transparent 40%), repeating-radial-gradient(circle at center, #020202 0px, #020202 ${grooveSize / 2}px, rgba(255,255,255,0.06) ${grooveSize * 0.75}px, #020202 ${grooveSize}px), radial-gradient(circle at center, #2a2a2a 0%, #000 100%)` }}>
          <div className="relative w-[37.5%] h-[37.5%] rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_22px_rgba(0,0,0,0.95)] overflow-hidden"
            style={{ backgroundColor: labelStyles[selectedLabel].color }}>
            
            {selectedLabel === "2120" && (
              <div className="absolute top-0 w-full h-full">
                <div className="absolute bottom-0 w-full h-[48%] bg-[#f2f0e4]" />
                <div className="absolute top-0 w-full h-[52%] flex flex-col items-center justify-end pb-[10%] text-white">
                    <span style={{ fontSize: `${12 * FONT_SCALE}px` }}>♛</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: `${16 * FONT_SCALE}px` }}>†</span>
                      <div className="flex flex-col items-center">
                        <div style={{ fontSize: `${18 * FONT_SCALE}px` }} className="font-black tracking-tighter">2120</div>
                        <div style={{ fontSize: `${3.5 * FONT_SCALE}px` }} className="font-bold tracking-[0.15em] mt-0.5">RECORD CORP.</div>
                      </div>
                      <span style={{ fontSize: `${16 * FONT_SCALE}px` }}>♘</span>
                    </div>
                </div>
              </div>
            )}

            <div className="z-10 flex flex-col items-center justify-end w-full h-full pb-[16%] px-1">
              <div style={{ color: selectedLabel === "2120" ? "#111" : labelStyles[selectedLabel].textColor, fontSize: getDynamicFontSize(displaySongTitle, 7) }} className="font-black tracking-tight whitespace-nowrap overflow-hidden w-[90%] text-center mb-1">{displaySongTitle}</div>
              <div style={{ color: selectedLabel === "2120" ? VINTAGE_GOLD : "white", fontSize: getDynamicFontSize(bandName, 6) }} className="font-bold uppercase text-center mb-1">{bandName}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: `${3 * FONT_SCALE}px` }} className="font-black tracking-[0.2em] uppercase text-center">{labelStyles[selectedLabel].subText}</div>
            </div>
            <div className="absolute w-[8%] h-[8%] rounded-full bg-[#050505] z-20" />
          </div>
        </div>

        <div className="absolute w-[88%] h-[88%] rounded-full opacity-[0.4] pointer-events-none z-20" 
             style={{ 
               background: "conic-gradient(from 0deg, transparent 9deg, rgba(255,255,255,0.5) 45deg, transparent 81deg, transparent 189deg, rgba(255,255,255,0.5) 225deg, transparent 261deg)",
               WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,0.1) 24.3%, black 24.4%)"
             }} />

        <div className="absolute transition-transform duration-1000 z-30"
          style={{ 
            top: "10.5%", right: "10.5%", width: "75%", height: "2%", 
            transformOrigin: "center right", 
            transform: `rotate(${isPlaying ? -80.5 : -90}deg)`,
            filter: "drop-shadow(-8px 12px 6px rgba(0,0,0,0.6))"
          }}>
          <div className="w-full h-full bg-gradient-to-l from-zinc-600 via-zinc-300 to-zinc-500 rounded-full" />
        </div>
      </div>

      <div className={`transition-all duration-700 z-40 space-y-4
        ${!isLandscape ? 'relative w-full max-w-sm bg-zinc-900/60 p-5 rounded-[35px] border border-white/5 shadow-2xl backdrop-blur-xl' : 'fixed bottom-6 right-6 w-80 bg-zinc-900/30 p-5 rounded-[25px] border border-white/10 shadow-2xl backdrop-blur-md'}
        ${isMobileLandscape ? 'hidden' : ''}
      `}>
        {!isLandscape && (
          <div className="flex justify-center items-center h-16 mb-2 gap-4">
            <button onClick={togglePlay} className="w-16 h-16 rounded-full font-black text-[10px] bg-zinc-100 text-black shadow-lg">
              {isPlaying ? "STOP" : "PLAY"}
            </button>
            <button onClick={() => setShowHelp(true)} className="w-11 h-11 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-300">？</button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {Object.keys(labelStyles).map((style) => (
            <button key={style} onClick={() => setSelectedLabel(style)} className={`py-2.5 rounded-xl text-[9px] font-black border transition-all uppercase ${selectedLabel === style ? 'bg-white text-black border-white' : 'bg-black/40 text-zinc-600 border-zinc-800'}`}>
              {style}
            </button>
          ))}
        </div>

        <div className="space-y-2 pt-2 border-t border-white/5">
          <input type="text" value={bandName} onChange={(e) => setBandName(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3 rounded-xl text-zinc-100 text-[11px] w-full outline-none" />
          <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3 rounded-xl text-zinc-100 text-[11px] w-full outline-none" />
          
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
            <button onClick={handleDonation} className="flex-1 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col items-center justify-center text-amber-500">
              <span className="text-[9px] font-black uppercase">Buy Me a Coffee</span>
              <span className="text-[6.5px] font-normal opacity-70 mt-0.5">缶コーヒーを奢る（投げ銭）</span>
            </button>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={audioUrl || undefined} preload="auto" playsInline onEnded={() => setIsPlaying(false)} />
      <audio ref={sePlayRef} src="/needle-drop.mp3" preload="auto" />
      <audio ref={seStopRef} src="/needle-up.mp3" preload="auto" />
    </div>
  );
}