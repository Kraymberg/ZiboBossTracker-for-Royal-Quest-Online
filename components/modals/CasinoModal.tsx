import React, { useMemo, useEffect } from 'react';
import { X, Dices, Coins, Trophy, RotateCw, Gamepad2 } from 'lucide-react';
import { CustomSelect } from '../ui/Inputs';
import { LOCATIONS } from '../../constants';

interface CasinoModalProps {
  onClose: () => void;
  casinoBalance: number;
  casinoBet: string;
  setCasinoBet: (val: string) => void;
  casinoTarget: string;
  setCasinoTarget: (val: string) => void;
  casinoResult: string | null;
  isSpinning: boolean;
  spinningLoc: string;
  handleCasinoSpin: () => void;
  quickBet: (amt: number | 'max') => void;
}

export const CasinoModal: React.FC<CasinoModalProps> = ({
  onClose,
  casinoBalance,
  casinoBet,
  setCasinoBet,
  casinoTarget,
  setCasinoTarget,
  casinoResult,
  isSpinning,
  spinningLoc,
  handleCasinoSpin,
  quickBet
}) => {
    
  const availableCasinoLocs = useMemo(() => LOCATIONS, []);

  // Initialize target if needed
  useEffect(() => {
      if (availableCasinoLocs.length > 0 && !casinoTarget) {
          setCasinoTarget(availableCasinoLocs[0]);
      }
  }, [availableCasinoLocs, casinoTarget, setCasinoTarget]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
        <div className="bg-[#0f0f11] border border-yellow-500/20 rounded-[2.5rem] p-8 max-w-sm w-full relative shadow-[0_0_50px_rgba(234,179,8,0.15)] overflow-visible">
            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute -top-4 -right-4 bg-[#1a1a1e] border border-white/10 rounded-full p-3 text-slate-400 hover:text-white hover:bg-white/10 transition-all z-[100] shadow-xl"
            >
                <X size={20}/>
            </button>

            <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none rounded-[2.5rem]" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                            <Dices className="text-yellow-400 w-6 h-6" />
                        </div>
                        <div>
                        <h2 className="font-black text-2xl uppercase text-white italic tracking-tighter leading-none">CASINO</h2>
                        <p className="text-[9px] text-yellow-500/60 font-black tracking-[0.2em] uppercase mt-1">ZIBO BET</p>
                        </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                        <Coins className="text-yellow-400 w-3 h-3" />
                        <span className="text-xs font-mono font-black text-white">{casinoBalance.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 space-y-6">
                {/* Slot Display */}
                <div className={`h-40 bg-black rounded-3xl border-4 border-[#2a2a2e] flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300 ${casinoResult && casinoResult === casinoTarget ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : isSpinning ? 'border-yellow-500/30' : ''}`}>
                    
                    {/* Background Effect */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10 opacity-80" />
                    
                    {/* Central Line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-red-500/30 z-0"></div>

                    {/* Content */}
                    <div className={`relative z-20 flex flex-col items-center w-full`}>
                        {isSpinning ? (() => {
                            const currentSpinIdx = availableCasinoLocs.indexOf(spinningLoc);
                            const prevSpinLoc = currentSpinIdx !== -1 ? availableCasinoLocs[(currentSpinIdx - 1 + availableCasinoLocs.length) % availableCasinoLocs.length] : "---";
                            const nextSpinLoc = currentSpinIdx !== -1 ? availableCasinoLocs[(currentSpinIdx + 1) % availableCasinoLocs.length] : "---";
                            return (
                                <div className="flex flex-col gap-2 items-center justify-center h-full w-full py-4 blur-[0.5px]">
                                    <div className="text-slate-600 font-bold text-[10px] uppercase opacity-40 scale-75 blur-[1px] transition-all">{prevSpinLoc}</div>
                                    <div className="text-yellow-400 font-black text-2xl uppercase scale-110 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] my-1 transition-all">{spinningLoc}</div>
                                    <div className="text-slate-600 font-bold text-[10px] uppercase opacity-40 scale-75 blur-[1px] transition-all">{nextSpinLoc}</div>
                                </div>
                            )
                        })() : casinoResult ? (
                            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                <span className={`text-2xl font-black uppercase text-center px-4 leading-tight ${casinoResult === casinoTarget ? 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'text-white'}`}>
                                    {casinoResult}
                                </span>
                                {casinoResult === casinoTarget && (
                                    <div className="mt-2 flex items-center gap-2 text-yellow-400 font-black text-xs tracking-widest uppercase bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 animate-bounce">
                                        <Trophy size={12} /> Победа!
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-slate-600 text-xs font-black uppercase tracking-widest flex flex-col items-center gap-2">
                                <Gamepad2 size={24} className="opacity-50"/>
                                Сделайте ставку
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Bet Amount */}
                    <div className="space-y-2">
                        <label className="text-[9px] text-slate-500 uppercase font-black ml-1">Ставка</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                placeholder="0" 
                                value={casinoBet}
                                onChange={(e) => setCasinoBet(e.target.value)}
                                disabled={isSpinning}
                                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl pl-3 pr-2 py-3 text-sm font-black text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-slate-700"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {[100, 500, 1000].map(amt => (
                                <button key={amt} onClick={() => quickBet(amt)} disabled={isSpinning} className="bg-white/5 hover:bg-white/10 rounded-lg py-1 text-[9px] font-bold text-slate-400 transition-all border border-white/5">+{amt}</button>
                            ))}
                            <button onClick={() => quickBet('max')} disabled={isSpinning} className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg py-1 text-[9px] font-bold transition-all border border-yellow-500/20">MAX</button>
                        </div>
                    </div>

                    {/* Target Selection */}
                    <div className="space-y-2">
                        <label className="text-[9px] text-slate-500 uppercase font-black ml-1">Цель</label>
                        <CustomSelect 
                            value={casinoTarget} 
                            onChange={setCasinoTarget} 
                            options={availableCasinoLocs} 
                            className="!bg-[#1a1a1e] !border-white/10 !py-3 !text-xs !h-[46px]"
                        />
                        <div className="text-[9px] text-slate-600 font-mono text-center pt-1">Шанс: 20% | Выплата: x5</div>
                    </div>
                </div>

                {/* Result Feedback */}
                {casinoResult && !isSpinning && casinoResult !== casinoTarget && (
                    <div className="text-center py-2 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-[10px] text-red-400 font-black uppercase tracking-widest">Вы проиграли {parseInt(casinoBet)} монет</span>
                    </div>
                )}
                {casinoResult && !isSpinning && casinoResult === casinoTarget && (
                    <div className="text-center py-2 bg-green-500/10 border border-green-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">Выигрыш: +{parseInt(casinoBet) * 5} монет!</span>
                    </div>
                )}

                <button 
                    onClick={handleCasinoSpin}
                    disabled={isSpinning || !casinoTarget || !casinoBet}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg relative overflow-hidden group ${isSpinning ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black shadow-yellow-900/30'}`}
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {isSpinning ? <RotateCw className="animate-spin w-4 h-4" /> : <Dices className="w-4 h-4" />}
                        {isSpinning ? 'КРУТИМ...' : 'СДЕЛАТЬ СТАВКУ'}
                    </div>
                    {!isSpinning && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                </button>
            </div>
        </div>
    </div>
  );
};
