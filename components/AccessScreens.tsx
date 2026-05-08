
import React from 'react';
import { Lock, ShieldAlert, Send } from 'lucide-react';
import { MIMIC_LOGO } from '../constants';

export const AccessDeniedScreen = ({ userId }: { userId: number }) => (
  <div className="h-screen w-full bg-[#0d0d0f] flex flex-col items-center justify-center p-6 text-center">
    <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-pulse">
      <Lock className="text-red-500 w-10 h-10" />
    </div>
    <h1 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Доступ Запрещен</h1>
    <p className="text-sm text-slate-400 max-w-xs mb-8">
      Ваш ID <span className="font-mono text-white bg-white/10 px-1 rounded">{userId}</span> не авторизован.
      <br /><br />
      Для приобретения доступа напиши на ник <span className="text-white font-bold">Asap</span> на фениксе или жми кнопку ниже.
    </p>
    <a 
      href="https://t.me/dexmichael" 
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-6 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-slate-200 transition-all"
    >
      <Send size={14} />
      Запросить доступ
    </a>
  </div>
);

export const InvalidPlatformScreen = () => (
  <div className="h-screen w-full bg-[#0d0d0f] flex flex-col items-center justify-center p-6 text-center">
    <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
      <ShieldAlert className="text-amber-500 w-10 h-10" />
    </div>
    <h1 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Ошибка Протокола</h1>
    <p className="text-sm text-slate-400 max-w-xs mb-8">
      Доступ через браузер заблокирован в целях безопасности. Используйте защищенный канал Telegram.
    </p>
    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
      <img src={MIMIC_LOGO} className="w-4 h-4 opacity-50" />
      System Locked
    </div>
  </div>
);

export const LoadingScreen = () => (
  <div className="h-screen w-full bg-[#0d0d0f] flex flex-col items-center justify-center">
    <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div className="mt-6 text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] animate-pulse">
        Идентификация...
    </div>
  </div>
);
