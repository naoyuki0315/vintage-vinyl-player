/**
 * Project: Vintage Vinyl Player (v3.0.2 - Immersive Perfected)
 * Feature: Restored normal layout, added exclusive landscape layout
 * Fix: Used CSS media queries to completely separate normal and landscape controls
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

  const [audioUrl, setAudioUrl] = useState<string | null>("/my_babe.mp3");
  const [isPlaying, setIsPlaying] = useState(false);
  const [bandName, setBandName] = useState("DROP DOWN MAMA");
  const [songTitle, setSongTitle] = useState("MY BABE");
  const [selectedLabel, setSelectedLabel] = useState("2120");
  
  const [showHelp, setShowHelp] = useState(false);

  const TARGET_RPM = 12.0; 
  const TARGET_DEG_PER_SEC = (TARGET_RPM * 360) / 60;
  const VINTAGE_GOLD = "#e2c27b";

  const labelStyles: Record<string, any> = {
    "2120": { color: "#2a4058", textColor: VINTAGE_GOLD, subText: "2120 S. MICHIGAN AVE. • CHICAGO, ILL." },
    "Red-Chkr": { color: "#a52a2a", textColor: "white", subText: "RECORDING CO. • CHICAGO, ILL." },
    "Vee-Jay": { color: "#1a1a1a", textColor: "white", subText: "CHICAGO-YOKOHAMA" },
    "Rsg-Sun": { color: "#facc15", textColor: "#3f2b1d", subText: "MEMPHIS, TENNESSEE" },
  };

  const handleDonation = () => {
    const paymentLink = "https://buy.stripe.com/eVq5kD034glf4eFgWpdIA00"; 
    if (paymentLink && paymentLink.startsWith("https://buy.stripe.com")) {
      window.location.href = paymentLink;
    } else {
      alert("Stripeの支払いリンクを正しく設定してください。");
    }
  };

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
      }, 400); 
      setTimeout(() => { 
        if (audioRef.current) {
          audioRef.current.currentTime = 0; 
          audioRef.current.play().catch(e => console.log("Play error:", e)); 
        }
      }, 1000); 
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
    if (len <= 10) return `${baseSize}px`; 
    if (len <= 15) return `${baseSize * 0.85}px`; 
    if (len <= 20) return `${baseSize * 0.7}px`; 
    return `${baseSize * 0.55}px`; 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-zinc-400 p-3 md:p-6 font-sans select-none overflow-x-hidden relative">
      
      {/* ★ 没入ズームと横画面切り替えのためのCSS */}
      <style>{`
        .immersive-panel {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* 縦画面（通常）再生時はパネルを下にフェードアウトさせる */
        .immersive-panel.playing {
          opacity: 0;
          transform: translateY(30px);
          pointer-events: none;
        }

        .record-wrapper {
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* 縦画面（通常）再生時は少しだけズーム */
        .record-wrapper.playing {
          transform: scale(1.05);
        }
        
        /* ★ スマホ横画面（ランドスケープ）専用レイアウト */
        @media screen and (max-height: 500px) and (orientation: landscape) {
          .landscape-controls {
            display: flex !important;
          }
          .immersive-panel {
            display: none !important; /* 横画面時はメインパネルを完全に消す */
          }
          .record-wrapper {
            margin-bottom: 0 !important;
            margin-top: 0 !important;
          }
          /* 横画面時はさらに大きくズーム！ */
          .record-wrapper.playing {
            transform: scale(1.15); 
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
                  <li><strong className="text-zinc-100">PLAY / STOP:</strong> レコードの再生・停止を操作します。再生中はレコードがズームして没入モードになります。</li>
                  <li><strong className="text-zinc-100">スマホ横画面対応:</strong> スマホを横に向けると、パネルが消えて専用のフルスクリーンプレイヤーになります。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white border-b border-zinc-800 pb-1.5 mb-2">🎧 自分の曲をセットする</h3>
                <p className="mb-3">「LOAD MUSIC」ボタンから、スマホやPC内の音楽・動画ファイルを選べます。</p>
                <div className="bg-red-500/10 border border-red-500/20 p-3 md:p-4 rounded-2xl text-red-200 shadow-inner">
                  <strong className="text-red-400 block mb-2 text-sm">⚠️ アップロード時のご注意</strong>
                  <p className="mb-2">ブラウザがフリーズするのを防ぐため、ファイルの容量に<strong className="text-white">【20MBまで】</strong>の制限を設けています。</p>
                  <ul className="list-disc pl-4 space-y-1.5 mt-2">
                    <li><strong className="text-red-300">音声ファイル（mp3, m4a等）:</strong><br/>約8分〜10分程度の曲をセットできます。</li>
                    <li><strong className="text-red-300">動画ファイル（mp4, mov等）:</strong><br/>映像データは重いため、数十秒〜1分程度に限られます。※映像は出ず<strong className="text-white">「音声のみ」</strong>が抽出されて流れます。</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white border-b border-zinc-800 pb-1.5 mb-2">☕️ 開発者を応援する</h3>
                <p>気に入っていただけたら、「TIP 100 JPY」ボタンから缶コーヒー代の投げ銭（100円）をお待ちしています！深夜のブルースの糧になります。</p>
              </div>

            </div>
            
            <button 
              onClick={() => setShowHelp(false)} 
              className="mt-7 w-full py-3.5 rounded-xl bg-white text-black font-black text-xs tracking-widest uppercase active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] pointer-events-auto"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* ★ スマホ横画面（ランドスケープ）になった時だけ現れる専用のボタン */}
      <div className="landscape-controls fixed inset-0 z-50 pointer-events-none hidden items-center justify-between px-8 md:px-16 w-full h-full">
        <button 
          onClick={togglePlay} 
          className={`pointer-events-auto w-16 h-16 md:w-20 md:h-20 rounded-full font-black text-sm active:scale-95 transition-all duration-300 uppercase tracking-widest shadow-2xl border border-white/10 flex items-center justify-center
            ${isPlaying ? 'bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'bg-zinc-100 text-black hover:bg-white'}
          `}>
          {isPlaying ? "STOP" : "PLAY"}
        </button>
        <button 
          onClick={() => setShowHelp(true)} 
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 bg-zinc-800/80 backdrop-blur-md border border-zinc-700 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all active:scale-95 shadow-xl"
          aria-label="使い方を開く"
        >
          <span className="text-xl font-black font-sans">？</span>
        </button>
      </div>

      {/* レコード全体（再生中はクラスがついてズームします） */}
      <div className={`record-wrapper relative w-[88vmin] h-[88vmin] max-w-[400px] max-h-[400px] flex items-center justify-center bg-zinc-900 rounded-[40px] md:rounded-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.95)] mt-4 mb-8 border border-white/5 overflow-visible z-10 ${isPlaying ? 'playing' : ''}`}>
        
        {/* レコード盤面 */}
        <div ref={discRef} className="absolute w-[88%] h-[88%] rounded-full shadow-[0_0_60px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden will-change-transform z-10"
          style={{ background: `radial-gradient(circle at center, transparent 37.8%, rgba(0,0,0,0.92) 38.2%, transparent 40%), repeating-radial-gradient(circle at center, #020202 0px, #020202 1px, rgba(255,255,255,0.06) 1.5px, #020202 2px), radial-gradient(circle at center, #2a2a2a 0%, #000 100%)` }}>
          
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
                      <span className="text-[10px] md:text-[12px] mb-0.5">♛</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] md:text-[16px]">†</span>
                        <div className="flex flex-col items-center">
                          <div className="text-[16px] md:text-[18px] font-black tracking-tighter leading-none">2120</div>
                          <div className="text-[3px] md:text-[3.5px] font-bold tracking-[0.15em] mt-0.5 uppercase">RECORD CORP.</div>
                        </div>
                        <span className="text-[14px] md:text-[16px]">♘</span>
                      </div>
                  </div>
                </div>
              )}
              {selectedLabel === "Red-Chkr" && (
                <div className="absolute top-0 w-full h-full">
                  <div className="absolute top-0 w-full h-[55%] opacity-25 border-b border-white/20" 
                    style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '12px 12px', borderRadius: '50% 50% 0 0' }} 
                  />
                  <div className="absolute top-[14%] w-full text-center text-white font-serif italic font-black text-[11px] md:text-[13px] tracking-tighter scale-y-125">Red Checker</div>
                  <div className="absolute w-full text-center text-white text-[2.5px] md:text-[2.8px] font-bold tracking-[0.25em]" style={{ top: "42%" }}>RECORDING CO.</div>
                </div>
              )}
              {selectedLabel === "Vee-Jay" && (
                <div className="absolute top-0 w-full h-full flex flex-col items-center">
                  <div className="absolute inset-[5%] rounded-full border border-white/30" />
                  <div className="absolute top-[7%] flex flex-col items-center">
                    <div className="w-7 h-6 md:w-10 md:h-8 border-[1.2px] border-white/60 rounded-t-full flex flex-col items-center justify-end pb-0.5 overflow-hidden">
                      <span className="text-white text-[11px] md:text-[13px] font-black italic tracking-tighter leading-none">DDM</span>
                    </div>
                    <div className="text-[5px] md:text-[7px] font-black tracking-[0.2em] text-white mt-1 uppercase">CRITERION</div>
                  </div>
                </div>
              )}
              {selectedLabel === "Rsg-Sun" && (
                <div className="absolute top-0 w-full h-full flex flex-col items-center">
                  <div className="absolute top-0 w-full h-full opacity-[0.18]" style={{ background: "repeating-conic-gradient(from 270deg, #3f2b1d 0deg 7.5deg, transparent 7.5deg 20deg)", maskImage: "linear-gradient(to bottom, black 50%, transparent 55%)" }} />
                  <div className="absolute top-[5%] w-[84%] h-[38%] rounded-t-full border-[1px] border-[#3f2b1d]/60 flex flex-col items-center pt-1 text-[#3f2b1d]">
                      <div className="text-[4px] md:text-[5px] font-bold tracking-[0.3em] leading-none">RISING</div>
                      <div className="text-[18px] md:text-[22px] font-black italic tracking-tighter leading-[0.8] mt-0.5">SUN</div>
                  </div>
                  <div className="absolute top-[42%] text-[3.5px] md:text-[4px] font-black tracking-[0.2em] text-[#3f2b1d]">RECORDING COMPANY</div>
                </div>
              )}
            </div>

            <div className="z-10 flex flex-col items-center justify-end w-full h-full pb-[16%] px-1">
              <div className="font-black tracking-tight whitespace-nowrap overflow-hidden w-[90%] text-center mb-1" style={{ color: selectedLabel === "2120" ? "#111" : labelStyles[selectedLabel].textColor, fontSize: getDynamicFontSize(displaySongTitle, 6) }}>{displaySongTitle}</div>
              <div className="font-bold uppercase text-center mb-1.5" style={{ color: selectedLabel === "2120" ? VINTAGE_GOLD : "rgba(255,255,255,0.9)", fontSize: getDynamicFontSize(bandName, 5.2) }}>{bandName}</div>
              <div className="text-[2.2px] md:text-[3px] font-black tracking-[0.22em] uppercase text-center opacity-85" style={{ color: "rgba(255,255,255,0.85)" }}>{labelStyles[selectedLabel].subText}</div>
            </div>
            
            <div className="absolute w-[8%] h-[8%] rounded-full bg-[#050505] border border-black/50 z-20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]" />
          </div>
        </div>

        <div className="absolute w-[88%] h-[88%] rounded-full opacity-[0.45] md:opacity-[0.4] pointer-events-none z-20" 
             style={{ 
               background: "conic-gradient(from 0deg, transparent 9deg, rgba(255,255,255,0.5) 45deg, transparent 81deg, transparent 189deg, rgba(255,255,255,0.5) 225deg, transparent 261deg)",
               WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,0.1) 24.3%, black 24.4%)",
               maskImage: "radial-gradient(circle at center, rgba(0,0,0,0.1) 24.3%, black 24.4%)"
             }} />

        <div className="absolute w-[1.4%] h-[1.4%] rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.8)] pointer-events-none" />

        <div className="absolute w-10 h-10 md:w-11 md:h-11 rounded-full bg-zinc-800 z-20 shadow-xl" style={{ top: "6%", right: "6%" }} />
        
        <div className="absolute transition-transform duration-1000 z-30 flex items-center justify-end"
          style={{ 
            top: "10.5%", right: "10.5%", width: "75%", height: "8px", 
            transformOrigin: "center right", 
            transform: `rotate(${isPlaying ? -81 : -90}deg)`,
            filter: "drop-shadow(-8px 12px 6px rgba(0,0,0,0.6))"
          }}>
          <div className="h-1 md:h-1.5 w-full bg-gradient-to-l from-zinc-600 via-zinc-300 to-zinc-500 rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-5 md:w-16 md:h-8 bg-zinc-950 rounded-sm" style={{ transform: "rotate(22deg)", transformOrigin: "center right" }} />
        </div>
      </div>

      {/* ★ 通常時のメインパネル（横画面になるとCSSで非表示になります） */}
      <div className={`immersive-panel w-full max-w-sm space-y-4 bg-zinc-900/60 p-5 md:p-7 rounded-[35px] border border-white/5 shadow-2xl relative z-40 backdrop-blur-xl ${isPlaying ? 'playing' : ''}`}>
        
        {/* 元通りの配置に戻ったPLAY/STOPと？ボタン */}
        <div className="relative flex justify-center items-center h-16">
          <button onClick={togglePlay} className={`absolute z-10 w-14 h-14 md:w-16 md:h-16 rounded-full font-black text-[10px] active:scale-95 transition-all uppercase tracking-widest shadow-lg ${isPlaying ? 'bg-red-500 text-white' : 'bg-zinc-100 text-black'}`}>
            {isPlaying ? "STOP" : "PLAY"}
          </button>
          
          <button 
            onClick={() => setShowHelp(true)} 
            className="absolute right-2 md:right-4 w-10 h-10 md:w-11 md:h-11 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all active:scale-95 shadow-md"
            aria-label="使い方を開く"
          >
            <span className="text-base md:text-lg font-black font-sans">？</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.keys(labelStyles).map((style) => (
            <button key={style} onClick={() => setSelectedLabel(style)} className={`py-2.5 rounded-xl text-[8px] md:text-[9px] font-black border transition-all uppercase tracking-tight flex flex-col items-center justify-center ${selectedLabel === style ? 'bg-white text-black border-white' : 'bg-black/40 text-zinc-600 border-zinc-800 hover:bg-black/60'}`}>
              <span className="opacity-50 text-[6px] mb-0.5">Parody of</span>
              {style === "2120" ? "2120" : style === "Red-Chkr" ? "RED CHECKER" : style === "Vee-Jay" ? "DDM" : "RISING SUN"}
            </button>
          ))}
        </div>
        <div className="space-y-2 pt-2 border-t border-white/5">
          <input type="text" value={bandName} onChange={(e) => setBandName(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3 rounded-xl text-zinc-100 text-[11px] w-full outline-none focus:border-zinc-500" />
          <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value.toUpperCase())} className="bg-black/60 border border-zinc-800 p-3 rounded-xl text-zinc-100 text-[11px] w-full outline-none focus:border-zinc-500" />
          <div className="flex gap-2">
            
            <label className="flex-1 h-12 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-xl flex items-center justify-center cursor-pointer text-[9px] font-black shadow-xl hover:bg-zinc-700 transition-colors">
              LOAD MUSIC
              <input 
                type="file" 
                accept="audio/*, video/*, .mp3, .wav, .m4a, .mp4, .mov" 
                className="hidden" 
                onChange={(e) => { 
                  const f = e.target.files?.[0]; 
                  if (f) { 
                    const maxSize = 20 * 1024 * 1024;
                    if (f.size > maxSize) {
                      alert("ファイルが大きすぎます！20MB以下（8分くらいを想定）のファイルを選んでください。");
                      return;
                    }
                    const isMedia = f.type.startsWith('audio/') || f.type.startsWith('video/') || f.name.toLowerCase().endsWith('.m4a');
                    if (!isMedia) {
                      alert("音声または動画ファイルのみセット可能です！");
                      return;
                    }
                    if (isPlaying) {
                      setIsPlaying(false);
                      if (audioRef.current) audioRef.current.pause();
                    }
                    const newUrl = URL.createObjectURL(f);
                    setAudioUrl(newUrl); 
                    setSongTitle(f.name.replace(/\.[^/.]+$/, "").toUpperCase()); 
                  } 
                }} 
              />
            </label>
            
            <button onClick={handleDonation} className="flex-1 h-12 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl flex flex-col items-center justify-center text-amber-500 transition-all active:scale-95">
              <span className="text-[9px] font-black tracking-widest">TIP 100 JPY</span>
              <span className="text-[7px] opacity-70">缶コーヒーをおごる</span>
            </button>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={audioUrl || undefined} preload="auto" onEnded={() => setIsPlaying(false)} />
      <audio ref={sePlayRef} src="/needle-drop.mp3" preload="auto" />
      <audio ref={seStopRef} src="/needle-up.mp3" preload="auto" />
    </div>
  );
}