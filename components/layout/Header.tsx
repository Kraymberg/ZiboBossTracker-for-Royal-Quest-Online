
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MIMIC_LOGO } from '../../constants';
import { Menu } from 'lucide-react';

interface HeaderProps {
  isSimulationActive: boolean;
  effectiveNow: Date;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSimulationActive, effectiveNow, onToggleSidebar }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className={`border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-40 transition-all duration-500 flex-shrink-0 ${isSimulationActive ? 'border-amber-500/40 bg-amber-950/20' : ''}`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
      <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button onClick={onToggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
              <Menu size={24} />
          </button>

          <div className="relative group">
            <div className={`absolute inset-0 blur-lg opacity-20 group-hover:opacity-40 transition-opacity ${isSimulationActive ? 'bg-amber-500' : 'bg-purple-600'}`}></div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center relative shadow-xl overflow-hidden bg-[#0d0d0f] border border-white/10 group-hover:border-purple-500/50 transition-all">
                {!logoError ? (
                <img src={MIMIC_LOGO} alt="Zibo Searcher" className="w-full h-full object-contain p-1" onError={() => setLogoError(true)} />
                ) : (
                <div className={`flex items-center justify-center w-full h-full bg-purple-500/10 animate-pulse font-black text-lg ${isSimulationActive ? 'text-amber-500' : 'text-purple-500'}`}>Z</div>
                )}
            </div>
          </div>
          <div>
            <h1 className="text-sm sm:text-base lg:text-xl font-black tracking-tight text-white uppercase italic leading-none flex items-center gap-2">
                ZIBO <span className={isSimulationActive ? 'text-amber-500' : 'text-purple-500'}>{isSimulationActive ? 'ПЕСОЧНИЦА' : 'SEARCHER'}</span>
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-1">
                <span>by Asap</span>
            </div>
          </div>
      </div>
      
      <div className="flex flex-col items-end">
          <div className={`text-sm sm:text-base lg:text-xl font-black font-mono transition-colors ${isSimulationActive ? 'text-amber-500' : 'text-white'}`}>{format(effectiveNow, "HH:mm:ss")}</div>
          <div className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase">{format(effectiveNow, "dd MMMM yyyy", { locale: ru })}</div>
      </div>
      </div>
    </header>
  );
};
