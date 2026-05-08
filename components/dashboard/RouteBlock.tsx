
import React, { useRef, useState } from 'react';
import { Route as RouteIcon, Copy, Check, Activity, Snowflake } from 'lucide-react';
import { format } from 'date-fns';
import { ScheduleData, UserRole } from '../../types';

interface RouteBlockProps {
  isSimulationActive: boolean;
  schedule: ScheduleData | null;
  effectiveNow: Date;
  lastDeath: { time: string; location: string } | null;
  userRole?: UserRole;
  transitionsMatrix?: Record<string, Record<string, number>>;
}

export const RouteBlock: React.FC<RouteBlockProps> = ({ isSimulationActive, schedule, effectiveNow, lastDeath, userRole, transitionsMatrix }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [routeMode, setRouteMode] = useState<'standard' | 'frost'>('standard');

  // Helper to add unicode strikethrough chars
  const toStrikethrough = (text: string) => {
    return text.split('').map(char => char + '\u0336').join('');
  };

  const getProbabilities = () => {
    if (!lastDeath || !transitionsMatrix) return {};
    const transitions = transitionsMatrix[lastDeath.location] || {};
    const total = Object.values(transitions).reduce((sum, count) => sum + count, 0);
    if (total === 0) return {};
    
    const probs: Record<string, number> = {};
    for (const [loc, count] of Object.entries(transitions)) {
      probs[loc] = Math.round((count / total) * 100);
    }
    return probs;
  };

  const probs = getProbabilities();

  const handleCopyRoute = async () => {
    if (!schedule) return;

    try {
        const textLines = schedule.slots.map((slot, slotIndex) => {
            const start = format(slot.start, "HH:mm");
            const end = format(slot.end, "HH:mm");
            
            // Sort by probability, but lastDeath always at the end
            let sortedLocations = [...slot.locations].sort((a, b) => {
                const isA = a === lastDeath?.location;
                const isB = b === lastDeath?.location;
                if (isA && !isB) return 1;
                if (!isA && isB) return -1;
                
                const probA = probs[a] || 0;
                const probB = probs[b] || 0;
                return probB - probA;
            });

            if (routeMode === 'frost' && slotIndex === 0) {
                sortedLocations = sortedLocations.filter(loc => loc !== 'Морозная длань');
                sortedLocations.unshift('Морозная длань');
            }

            const locsText = sortedLocations.map(l => {
                const upperLoc = l.toUpperCase();
                const isDead = l === lastDeath?.location && !(routeMode === 'frost' && slotIndex === 0 && l === 'Морозная длань');
                
                let text = upperLoc;
                if (isDead) {
                    text = toStrikethrough(upperLoc);
                }
                return text;
            }).join(', ');

            return `${start} - ${end} | ${locsText}`;
        });

        const fullText = textLines.join('\n');

        await navigator.clipboard.writeText(fullText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        
        // Optional: Telegram Haptic Feedback if available
        if ((window as any).Telegram?.WebApp?.HapticFeedback) {
            (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }

    } catch (e) {
        console.error("Copy error:", e);
        alert("Не удалось скопировать текст");
    }
  };

  return (
    <div ref={containerRef} className={`lg:col-span-4 border rounded-[2rem] p-5 shadow-2xl relative overflow-hidden transition-all duration-700 h-[400px] lg:h-[600px] flex flex-col ${isSimulationActive ? 'bg-amber-950/5 border-amber-500/20' : 'bg-[#111114] border-white/5'}`}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isSimulationActive ? 'bg-amber-500/10' : 'bg-amber-500/10'}`}><RouteIcon className="text-amber-400 w-4 h-4" /></div>
                <h3 className="font-black text-base uppercase tracking-tight text-white italic">Маршрут</h3>
            </div>
            
            <div className="flex items-center gap-2">
                {/* Frost Toggle Button */}
                <button 
                    onClick={() => setRouteMode(prev => prev === 'standard' ? 'frost' : 'standard')} 
                    className={`p-1.5 rounded-lg transition-colors active:scale-95 ${routeMode === 'frost' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'}`}
                    title="Включить маршрут +Морозка"
                >
                    <Snowflake size={16} />
                </button>

                {/* Copy Button (Text) - Available to all */}
                <button 
                    onClick={handleCopyRoute} 
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors active:scale-95"
                    title="Скопировать маршрут текстом"
                >
                    {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 gap-1 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {(() => {
                const displayedProbsRender = new Set<string>();
                return schedule && schedule.slots.map((slot, i) => {
                    const isNow = effectiveNow >= slot.start && effectiveNow < slot.end;
                    const isPeak = slot.hasVtp5 || slot.hasVtp6 || slot.isVtpWindow;
                    
                    // Sort locations: crossed out (lastDeath location) goes to the end, others by probability
                    let sortedLocations = [...slot.locations].sort((a, b) => {
                        const isA = a === lastDeath?.location;
                        const isB = b === lastDeath?.location;
                        if (isA && !isB) return 1;
                        if (!isA && isB) return -1;
                        
                        const probA = probs[a] || 0;
                        const probB = probs[b] || 0;
                        return probB - probA;
                    });

                    if (routeMode === 'frost' && i === 0) {
                        sortedLocations = sortedLocations.filter(l => l !== 'Морозная длань');
                        sortedLocations.unshift('Морозная длань');
                    }

                    return (
                    <div key={i} className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2.5 rounded-xl border transition-all duration-300 ${
                        isPeak 
                        ? 'border-cyan-500/20 bg-cyan-500/5' 
                        : isNow 
                            ? (isSimulationActive ? 'border-amber-500/40 bg-amber-500/10' : 'border-green-500/40 bg-green-500/10') 
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                    }`}>
                        {/* Active State Glow & Indicator */}
                        {isNow && (
                            <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full ${isSimulationActive ? 'bg-amber-500' : 'bg-green-500'} shadow-[0_0_15px_currentColor]`} />
                        )}
                        
                        {/* Time */}
                        <div className="flex items-center gap-2 min-w-[110px] pl-1.5 sm:pl-0">
                            <div className={`w-1 h-1 rounded-full flex-shrink-0 ${slot.hasVtp6 ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]' : slot.hasVtp5 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,1)]' : 'bg-slate-700'}`} />
                            <span className={`font-mono text-xs font-black tracking-tight ${slot.hasVtp6 ? 'text-purple-400' : slot.hasVtp5 ? 'text-cyan-400' : isNow ? 'text-white' : 'text-slate-400'}`}>
                                {format(slot.start, "HH:mm")}
                                <span className="text-white/10 mx-1.5">|</span>
                                {format(slot.end, "HH:mm")}
                            </span>
                        </div>

                        {/* Locations */}
                        <div className="flex flex-wrap items-center gap-1 pl-1.5 sm:pl-0">
                            {sortedLocations.map((locName, idx) => {
                                const isDead = locName === lastDeath?.location && !(routeMode === 'frost' && i === 0 && locName === 'Морозная длань');
                                const prob = probs[locName] || 0;
                                
                                return (
                                    <div key={idx} className="flex items-center gap-1">
                                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md transition-colors ${
                                            isDead 
                                            ? 'text-red-500/30 line-through decoration-red-500/30 bg-red-500/5' 
                                            : isNow 
                                                ? 'text-white bg-white/10' 
                                                : (routeMode === 'frost' && i === 0 && locName === 'Морозная длань')
                                                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                                                    : 'text-slate-500 group-hover:text-slate-400 bg-white/5'
                                        }`}>
                                            {locName}
                                        </span>
                                    </div>
                                );
                            })}
                            {sortedLocations.every(locName => locName === lastDeath?.location && !(routeMode === 'frost' && i === 0 && locName === 'Морозная длань')) && (
                                <div className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
                                    <Activity size={10} className="text-emerald-400" />
                                    <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">
                                        Проверьте Цепи Маркова
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    );
                });
            })()}
        </div>
    </div>
  );
};
