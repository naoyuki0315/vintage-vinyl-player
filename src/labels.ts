/**
 * labels.ts - 各ラベルのデザイン辞書
 */

export interface LabelStyle {
  id: string;
  displayName: string;
  color: string;
  textColor: string;
  bottomBg?: string;
  parodyName: string;
  subText: string;
  songTitleSize: string;
  songTitleTracking: string;
  bandNameSize: string;
  bandNameTracking: string;
  subTextSize: string;
  subTextTracking: string;
  subTextMargin: string;
  showQueen: boolean;
  centerLayoutOffset: string;
}

export const labelStyles: Record<string, LabelStyle> = {
  "2120": {
    id: "2120",
    displayName: "CHESS",
    color: "#2a4058",
    textColor: "white",
    bottomBg: "#f2f0e4",
    parodyName: "2120",
    subText: "2120 S. MICHIGAN AVE. • CHICAGO, ILL.",
    songTitleSize: "10px",
    songTitleTracking: "tracking-tight",
    bandNameSize: "8.5px",
    bandNameTracking: "tracking-normal",
    subTextSize: "2.8px",
    subTextTracking: "tracking-widest",
    subTextMargin: "mt-2",
    showQueen: true,
    centerLayoutOffset: "mt-[45%]"
  },
  "Red-Chkr": {
    id: "Red-Chkr",
    displayName: "CHECKER",
    color: "#a52a2a", // 渋い赤
    textColor: "white",
    parodyName: "Checker",
    subText: "RECORDING CO. • CHICAGO, ILL.",
    songTitleSize: "11px",
    songTitleTracking: "tracking-normal",
    bandNameSize: "9px",
    bandNameTracking: "tracking-tight",
    subTextSize: "3px",
    subTextTracking: "tracking-widest",
    subTextMargin: "mt-auto mb-3",
    showQueen: false,
    centerLayoutOffset: "mt-[55%]"
  },
  "Vee-Drop": {
    id: "Vee-Drop",
    displayName: "VEE-JAY",
    color: "#111",
    textColor: "white",
    parodyName: "Vee-Drop",
    subText: "CHICAGO-YOKOHAMA",
    songTitleSize: "10px",
    songTitleTracking: "tracking-tighter",
    bandNameSize: "8.5px",
    bandNameTracking: "tracking-widest",
    subTextSize: "3.5px",
    subTextTracking: "tracking-widest",
    subTextMargin: "mt-3",
    showQueen: false,
    centerLayoutOffset: "mt-2"
  },
  "Rsg-Sun": {
    id: "Rsg-Sun",
    displayName: "SUN",
    color: "#facc15",
    textColor: "black",
    parodyName: "Rising-Sun",
    subText: "MEMPHIS, TENNESSEE",
    songTitleSize: "11px",
    songTitleTracking: "tracking-normal",
    bandNameSize: "9px",
    bandNameTracking: "tracking-normal",
    subTextSize: "3.5px",
    subTextTracking: "tracking-widest",
    subTextMargin: "mt-3",
    showQueen: false,
    centerLayoutOffset: "mt-2"
  }
};