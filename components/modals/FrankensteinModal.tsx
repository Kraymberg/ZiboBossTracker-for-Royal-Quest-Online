
import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface FrankensteinModalProps {
  onClose: () => void;
  frankResData: any;
}

export const FrankensteinModal: React.FC<FrankensteinModalProps> = ({ onClose, frankResData }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
        <div className="bg-[#0f0f11] border border-amber-500/20 rounded-[2rem] p-5 max-w-sm w-full relative shadow-[0_0_50px_rgba(245,158,11,0.1)] overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
            
            <div className="flex flex-col gap-1 mb-5 relative z-10">
                <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/10">
                            <Sparkles className="text-amber-400 w-4 h-4" />
                        </div>
                        <h2 className="font-black text-lg uppercase text-white italic tracking-tighter">FRANKENSTEIN</h2>
                </div>
                <p className="text-[8px] text-amber-500/60 font-black tracking-[0.2em] uppercase pl-10">Глубокий анализ паттернов</p>
            </div>
            
            {frankResData ? (
                <div className="relative z-10">
                    {/* Jackpot Indicator */}
                    {frankResData.isJackpot && (
                        <div className="w-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/50 rounded-lg p-2 flex items-center justify-center gap-2 mb-4 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Sparkles className="text-amber-400" size={12} />
                            <span className="text-amber-400 font-black tracking-widest text-[8px] uppercase">СИНХРОНИЗАЦИЯ ПОДТВЕРЖДЕНА</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
                                <div className="text-[8px] font-black uppercase text-amber-500/60 mb-1 tracking-[0.2em] relative z-10">Вероятная локация</div>
                                <div className="text-xl font-black text-white uppercase leading-none relative z-10 break-words">{frankResData.topLoc}</div>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <div className="flex-1 p-2 bg-[#1a1a1e] rounded-xl border border-white/5 flex flex-col items-center justify-center w-full">
                            <div className="text-[7px] font-black uppercase text-slate-500 mb-0.5">Точность</div>
                            <div className="text-sm font-black text-amber-400">{frankResData.confidence}%</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                            <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-1 h-1 rounded-full bg-amber-500" />
                            <div className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Магнитные точки</div>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                {frankResData.magneticPoints.map((pt: any, idx: number) => {
                                    return (
                                    <div key={idx} className="flex-shrink-0 p-2 bg-[#1a1a1e] rounded-xl border border-white/5 min-w-[80px] flex flex-col items-center justify-center group hover:border-amber-500/30 transition-all">
                                        <div className="text-lg font-black text-white mb-0.5 group-hover:text-amber-400 transition-colors">
                                        {pt.offset > 0 ? '+' : ''}{pt.offset}
                                        </div>
                                        <div className="text-[7px] font-bold text-slate-600 uppercase tracking-wider">Шанс: {pt.weight}%</div>
                                    </div>
                                )})}
                            </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 relative z-10">
                    <p className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Нет данных для анализа</p>
                </div>
            )}

            <button onClick={onClose} className="w-full mt-4 bg-amber-950/30 hover:bg-amber-900/30 text-amber-200/50 hover:text-amber-200 font-black py-3 rounded-xl transition-all text-[8px] uppercase tracking-[0.2em] border border-amber-500/10 hover:border-amber-500/30 relative z-10">Закрыть окно</button>
        </div>
    </div>
  );
};
