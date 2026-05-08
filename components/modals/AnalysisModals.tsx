
import React from 'react';
import { X, Search, Timer, Table2, Activity, FlaskConical, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { CustomSelect, TimeInput } from '../ui/Inputs';
import { LOCATIONS } from '../../constants';

// --- CHAIN MODAL ---
export const ChainModal = ({ onClose, chainAnalytics }: { onClose: () => void, chainAnalytics: any }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
            <div className="bg-[#0f0f11] border border-cyan-500/20 rounded-[2rem] p-5 max-w-sm w-full relative shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none" />
                
                <div className="flex flex-col gap-1 mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                         <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                             <Search className="text-cyan-400 w-4 h-4" />
                         </div>
                         <h2 className="font-black text-lg uppercase text-white italic tracking-tighter">ЦЕПОЧКИ</h2>
                    </div>
                    <p className="text-[8px] text-cyan-500/60 font-black tracking-[0.2em] uppercase pl-10">Прогноз таймингов</p>
                </div>
                
                {chainAnalytics ? (
                    <div className="space-y-2 relative z-10">
                        {chainAnalytics.map((item: any, idx: number) => (
                            <div key={idx} className="group flex items-center justify-between p-3 bg-[#1a1a1e] rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/20 group-hover:bg-cyan-500 transition-colors" />
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-black/50 flex items-center justify-center border border-white/10 text-cyan-500 font-black text-[10px] shadow-inner">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div className="text-[8px] font-black uppercase text-slate-500 mb-0.5 tracking-wider">{item.label}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-mono font-bold text-slate-600">{item.from}</span>
                                            <div className="w-4 h-[1px] bg-cyan-900/50 relative">
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-cyan-900 rounded-full" />
                                            </div>
                                            <span className="text-sm font-black text-white font-mono tracking-tight">{item.tres}</span>
                                            <div className="w-4 h-[1px] bg-cyan-900/50 relative">
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-cyan-900 rounded-full" />
                                            </div>
                                            <span className="text-[9px] font-mono font-bold text-slate-600">{item.to}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 relative z-10">
                        <p className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Нет данных для анализа</p>
                    </div>
                )}

                <button onClick={onClose} className="w-full mt-6 bg-cyan-950/30 hover:bg-cyan-900/30 text-cyan-200/50 hover:text-cyan-200 font-black py-3 rounded-xl transition-all text-[8px] uppercase tracking-[0.2em] border border-cyan-500/10 hover:border-cyan-500/30 relative z-10">Закрыть окно</button>
            </div>
    </div>
);

// --- VTP MODAL ---
export const VtpModal = ({ onClose, vtpAnalysis }: { onClose: () => void, vtpAnalysis: any }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
            <div className="bg-[#0f0f11] border border-indigo-500/20 rounded-[2rem] p-5 max-w-md w-full relative shadow-[0_0_50px_rgba(99,102,241,0.1)] overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
                
                <div className="flex flex-col gap-1 mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                         <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                             <Timer className="text-indigo-400 w-4 h-4" />
                         </div>
                         <h2 className="font-black text-lg uppercase text-white italic tracking-tighter">VTP АНАЛИЗ</h2>
                    </div>
                    <p className="text-[8px] text-indigo-500/60 font-black tracking-[0.2em] uppercase pl-10">Вероятностные точки появления</p>
                </div>

                {vtpAnalysis.length > 0 ? (
                    <div className="relative z-10 space-y-1.5 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                         <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-white/5 rounded-lg text-[7px] font-black uppercase text-slate-500 mb-1">
                             <div className="col-span-3">Время / Смещение</div>
                             <div className="col-span-6">Локация</div>
                             <div className="col-span-3 text-right">Вес (История)</div>
                         </div>
                         {vtpAnalysis.map((item: any, idx: number) => (
                             <div key={idx} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-[#1a1a1e] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group">
                                 <div className="col-span-3">
                                     <div className="text-xs font-black text-white font-mono leading-none mb-0.5">{format(item.time, "HH:mm")}</div>
                                     <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider">+{item.offset} мин</div>
                                 </div>
                                 <div className="col-span-6">
                                     <div className="text-[8px] font-black uppercase text-slate-300 group-hover:text-white transition-colors">{item.prediction}</div>
                                 </div>
                                 <div className="col-span-3 text-right">
                                     <div className="inline-flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                                        <div className="w-1 h-1 rounded-full bg-indigo-500" />
                                        <span className="text-[9px] font-mono font-bold text-white">{item.historyWeight}</span>
                                     </div>
                                 </div>
                             </div>
                         ))}
                    </div>
                ) : (
                    <div className="text-center py-8 relative z-10">
                        <p className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Требуется последнее событие смерти</p>
                    </div>
                )}

                <button onClick={onClose} className="w-full mt-6 bg-indigo-950/30 hover:bg-indigo-900/30 text-indigo-200/50 hover:text-indigo-200 font-black py-3 rounded-xl transition-all text-[8px] uppercase tracking-[0.2em] border border-indigo-500/10 hover:border-indigo-500/30 relative z-10">Закрыть окно</button>
            </div>
    </div>
);

// --- MASTER TABLE MODAL ---
export const MasterTableModal = ({ onClose, masterTableData, tableAccuracy, calibratedOffsetsMap }: { onClose: () => void, masterTableData: any, tableAccuracy: any, calibratedOffsetsMap: any }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
            <div className="bg-[#0f0f11] border border-rose-500/20 rounded-[2rem] p-5 max-w-md w-full relative shadow-[0_0_50px_rgba(244,63,94,0.1)] overflow-hidden">
                <div className="absolute inset-0 bg-rose-500/5 pointer-events-none" />
                
                <div className="flex flex-col gap-1 mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                         <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 shadow-lg shadow-rose-500/10">
                             <Table2 className="text-rose-400 w-4 h-4" />
                         </div>
                         <h2 className="font-black text-lg uppercase text-white italic tracking-tighter">МАСТЕР-ТАБЛИЦА</h2>
                    </div>
                    <p className="text-[8px] text-rose-500/60 font-black tracking-[0.2em] uppercase pl-10">Калибровка кулдаунов</p>
                </div>

                {masterTableData ? (
                    <div className="space-y-4 relative z-10">
                        <div className="grid grid-cols-2 gap-3">
                             <div className="p-4 bg-[#1a1a1e] rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                                 <div className="absolute inset-0 bg-rose-500/5" />
                                 <div className="text-[8px] font-black uppercase text-slate-500 mb-1 relative z-10">Точность таблицы</div>
                                 <div className="text-2xl font-black text-white relative z-10">{tableAccuracy.percent}%</div>
                             </div>
                             <div className="p-4 bg-[#1a1a1e] rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                                 <div className="absolute inset-0 bg-rose-500/5" />
                                 <div className="text-[8px] font-black uppercase text-slate-500 mb-1 relative z-10">Режим активности</div>
                                 <div className={`text-lg font-black relative z-10 ${masterTableData.activityColor || 'text-rose-400'}`}>{masterTableData.activityLabel || 'Обычный'}</div>
                             </div>
                        </div>
                        
                        {/* Current Slot Info */}
                         <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {masterTableData.activityLabel?.includes('Ночь') ? <Moon size={12} className="text-rose-400" /> : <Sun size={12} className="text-rose-400" />}
                                <div className="text-[9px] font-black uppercase text-rose-200">Текущий оффсет {masterTableData.activeOffset.label}</div>
                            </div>
                            <div className="text-sm font-mono font-black text-white">{masterTableData.calibratedCd} мин</div>
                        </div>

                        <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                             <div className="flex items-center justify-between text-[7px] font-black uppercase text-slate-500 px-4 pb-1">
                                 <span>Оффсет</span>
                                 <span>Кулдаун (Мин)</span>
                             </div>
                             {Object.entries(calibratedOffsetsMap).map(([label, data]: [string, any]) => {
                                 const isActive = label === masterTableData.activeOffset.label;
                                 return (
                                     <div key={label} className={`flex items-center justify-between p-2.5 rounded-xl border transition-all relative overflow-hidden ${isActive ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-900/20' : 'bg-[#1a1a1e] border-white/5 hover:bg-white/5'}`}>
                                         {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rose-500" />}
                                         <div className="flex items-center gap-3 pl-1">
                                             <span className={`text-[10px] font-black ${isActive ? 'text-white' : 'text-slate-500'}`}>{label}</span>
                                         </div>
                                         <div className="flex items-center gap-3">
                                             {data.count > 0 && <span className="text-[7px] font-bold text-slate-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">записей: {data.count}</span>}
                                             <span className={`text-sm font-mono font-black ${isActive ? 'text-rose-400' : 'text-slate-300'}`}>{data.avgCd}</span>
                                         </div>
                                     </div>
                                 )
                             })}
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center relative z-10">
                        <p className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Нет данных для калибровки</p>
                    </div>
                )}

                <button onClick={onClose} className="w-full mt-6 bg-rose-950/30 hover:bg-rose-900/30 text-rose-200/50 hover:text-rose-200 font-black py-3 rounded-xl transition-all text-[8px] uppercase tracking-[0.2em] border border-rose-500/10 hover:border-rose-500/30 relative z-10">Закрыть окно</button>
            </div>
    </div>
);

// --- SUMMARY MODAL ---
export const SummaryModal = ({ onClose, transitionsMatrix, lastDeathLocation, effectiveEventsCount }: { onClose: () => void, transitionsMatrix: Record<string, Record<string, number>> | undefined, lastDeathLocation: string | undefined, effectiveEventsCount: number }) => {
    const transitions = (lastDeathLocation && transitionsMatrix) ? transitionsMatrix[lastDeathLocation] || {} : {};
    const total = Object.values(transitions).reduce((sum, count) => sum + count, 0);
    
    const candidates = LOCATIONS
        .filter(loc => loc !== lastDeathLocation)
        .map(loc => {
            const count = transitions[loc] || 0;
            return {
                loc,
                probability: total > 0 ? Math.round((count / total) * 100) : 0,
                count
            };
        })
        .sort((a, b) => b.probability - a.probability || b.count - a.count);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
                <div className="bg-[#0f0f11] border border-emerald-500/20 rounded-[2rem] p-5 max-w-sm w-full relative shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                    
                    <div className="flex flex-col gap-1 mb-5 relative z-10">
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                 <Activity className="text-emerald-400 w-4 h-4" />
                             </div>
                             <h2 className="font-black text-lg uppercase text-white italic tracking-tighter">ЦЕПИ МАРКОВА</h2>
                        </div>
                        <p className="text-[8px] text-emerald-500/60 font-black tracking-[0.2em] uppercase pl-10">Вероятности переходов после: {lastDeathLocation || 'Неизвестно'}</p>
                    </div>
                    
                    {candidates.length > 0 ? (
                        <div className="relative z-10">
                            <div className="mb-4 p-4 bg-[#1a1a1e] border border-emerald-500/20 rounded-2xl flex items-center justify-between relative overflow-hidden">
                                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                                 <div>
                                     <div className="text-[8px] font-black uppercase text-emerald-500/60 mb-1">Всего переходов</div>
                                     <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">На основе {effectiveEventsCount} записей</div>
                                 </div>
                                 <div className="text-3xl font-black text-white">{total}</div>
                            </div>

                            <div className="space-y-2">
                                {candidates.map((item, idx) => (
                                    <div key={idx} className="group relative h-10 bg-[#1a1a1e] rounded-xl border border-white/5 overflow-hidden">
                                        <div className="absolute top-0 bottom-0 left-0 bg-emerald-500/10 transition-all duration-1000 group-hover:bg-emerald-500/20" style={{width: `${item.probability}%`}}></div>
                                        <div className="absolute inset-0 flex items-center justify-between px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center text-[9px] font-black text-slate-500 border border-white/5">#{idx + 1}</div>
                                                <span className="text-[9px] font-black text-white uppercase tracking-wider">{item.loc}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-bold text-slate-500">{item.count} раз</span>
                                                <span className="font-mono font-black text-sm text-emerald-400">{item.probability}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 relative z-10">
                            <p className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Недостаточно данных</p>
                        </div>
                    )}

                    <button onClick={onClose} className="w-full mt-6 bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-200/50 hover:text-emerald-200 font-black py-3 rounded-xl transition-all text-[8px] uppercase tracking-[0.2em] border border-emerald-500/10 hover:border-emerald-500/30 relative z-10">Закрыть окно</button>
                </div>
        </div>
    );
};

// --- RETRO ANALYSIS MODAL ---
export const RetroModal = ({ 
    onClose, 
    isSimulationActive, 
    setIsSimulationActive,
    simulationDate, setSimulationDate,
    simulationTimeStr, setSimulationTimeStr,
    isVirtualDeathEnabled, setIsVirtualDeathEnabled,
    simulationLocation, setSimulationLocation,
    virtualDeathDate, setVirtualDeathDate,
    virtualDeathTime, setVirtualDeathTime
}: any) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-10 max-w-md w-full relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors p-2"><X size={20}/></button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <FlaskConical className="text-amber-500 w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-xl uppercase text-white italic leading-none">РЕТРО-АНАЛИЗ</h2>
                <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1">Симуляция времени</p>
              </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[9px] text-slate-500 uppercase font-black ml-1">Дата симуляции (Часы)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input 
                            type="date" 
                            value={simulationDate} 
                            onChange={(e) => setSimulationDate(e.target.value)} 
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-[11px] text-white outline-none focus:border-amber-500/50 transition-all block appearance-none"
                        />
                        <TimeInput 
                            value={simulationTimeStr} 
                            onChange={setSimulationTimeStr} 
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-[11px] text-white outline-none focus:border-amber-500/50 transition-all block appearance-none"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-white/5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Имитировать смерть</span>
                    <button 
                        onClick={() => setIsVirtualDeathEnabled(!isVirtualDeathEnabled)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${isVirtualDeathEnabled ? 'bg-amber-500' : 'bg-white/10'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isVirtualDeathEnabled ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>

                {isVirtualDeathEnabled && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <CustomSelect 
                            value={simulationLocation} 
                            onChange={setSimulationLocation} 
                            options={LOCATIONS} 
                            className="!bg-amber-500/10 !border-amber-500/30 !py-3 !text-[10px]"
                        />
                         <div className="space-y-2">
                            <label className="text-[9px] text-slate-500 uppercase font-black ml-1">Время смерти (фиксированное)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input 
                                    type="date" 
                                    value={virtualDeathDate} 
                                    onChange={(e) => setVirtualDeathDate(e.target.value)} 
                                    className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3 py-3 text-[11px] text-white outline-none focus:border-amber-500/50 transition-all block appearance-none"
                                />
                                <TimeInput 
                                    value={virtualDeathTime} 
                                    onChange={setVirtualDeathTime} 
                                    className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3 py-3 text-[11px] text-white outline-none focus:border-amber-500/50 transition-all block appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={() => setIsSimulationActive(!isSimulationActive)}
                    className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg ${isSimulationActive ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    {isSimulationActive ? 'ОСТАНОВИТЬ ТЕСТ' : 'ЗАПУСТИТЬ ТЕСТ'}
                </button>
            </div>
          </div>
    </div>
);
