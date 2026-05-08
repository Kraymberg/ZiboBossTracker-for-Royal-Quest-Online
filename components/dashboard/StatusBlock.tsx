
import React from 'react';
import { MapPin } from 'lucide-react';

interface StatusBlockProps {
  isSimulationActive: boolean;
  currentStatus: {
    state: string;
    text: string;
    label: string;
    locations?: string[];
  };
  lastDeath: { time: string; location: string } | null;
}

export const StatusBlock: React.FC<StatusBlockProps> = ({ isSimulationActive, currentStatus, lastDeath }) => {
  const isSearching = currentStatus.state === 'searching';
  const isClosed = currentStatus.state === 'closed';
  const isWaiting = currentStatus.state === 'waiting';
  const isNoData = currentStatus.state === 'no_data';

  const reverseLayout = isClosed || isWaiting || isNoData;

  return (
    <div className={`lg:col-span-5 border rounded-[2rem] p-5 shadow-2xl relative overflow-hidden flex flex-col justify-center pt-0 min-h-[300px] lg:h-[600px] group transition-all duration-700 ${isSimulationActive ? 'bg-amber-950/10 border-amber-500/30' : 'bg-[#0a0a0c] border-white/10'}`}>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isSearching ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-gradient-to-r from-${isSimulationActive ? 'amber' : 'green'}-500/5 to-transparent`}></div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${isSimulationActive ? 'amber' : 'green'}-500/20 animate-pulse`}></div>
        </div>
        
        <div className={`relative z-10 flex flex-col ${reverseLayout ? 'flex-col-reverse' : 'flex-col'} gap-4 mb-2 items-center text-center`}>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-mono tracking-tighter transition-all break-words ${isSearching ? (isSimulationActive ? 'text-amber-400' : 'text-green-400') : 'text-white'}`}>
                {currentStatus.text}
            </h2>

            <div className="flex items-center gap-2 justify-center">
                <div className={`w-2.5 h-2.5 rounded-full ${
                    isSearching 
                        ? (isSimulationActive ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]') + ' animate-pulse' 
                        : (isClosed || isNoData)
                            ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse'
                            : isWaiting
                                ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse'
                                : 'bg-slate-700'
                }`}></div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">{currentStatus.label}</p>
            </div>
        </div>

        {isSearching && (
            <div className="flex flex-wrap gap-2 mt-2 relative z-10 justify-center">
                {[...(currentStatus.locations || [])].sort((a, b) => {
                    const isA = a === lastDeath?.location;
                    const isB = b === lastDeath?.location;
                    if (isA && !isB) return 1;
                    if (!isA && isB) return -1;
                    return 0;
                }).map((loc) => {
                    const isDead = loc === lastDeath?.location;
                    // We need to get probabilities here too. 
                    // Since StatusBlock doesn't have transitionsMatrix, we'll just show the locations.
                    // Wait, if I want to show probabilities, I need to pass them.
                    return (
                        <div key={loc} className={`group/loc flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black border transition-all ${isDead ? 'bg-red-500/10 border-red-500/20 text-red-400/30 line-through' : (isSimulationActive ? 'bg-amber-500/5 border-amber-500/40 text-amber-100' : 'bg-cyan-500/5 border-cyan-500/40 text-cyan-100')}`}>
                            <MapPin size={10} className={isDead ? 'text-red-900' : (isSimulationActive ? 'text-amber-400' : 'text-cyan-400')} />
                            {loc.toUpperCase()}
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
};
