
import React, { useMemo } from 'react';
import { Skull, MapPin, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ZIBO_GIFS, LOCATIONS } from '../../constants';
import { CustomSelect, TimeInput } from '../ui/Inputs';
import { UserRole } from '../../types';

interface LastDeathBlockProps {
  isSimulationActive: boolean;
  isVirtualDeathEnabled: boolean;
  userRole: UserRole;
  lastDeath: { time: string; location: string; addedBy?: string } | null;
  inputType: 'death' | 'sight' | 'maintenance';
  setInputType: (val: 'death' | 'sight' | 'maintenance') => void;
  inputDate: string;
  setInputDate: (val: string) => void;
  inputTime: string;
  setInputTime: (val: string) => void;
  inputLocation: string;
  setInputLocation: (val: string) => void;
  addEntry: () => void;
}

export const LastDeathBlock: React.FC<LastDeathBlockProps> = ({
  isSimulationActive,
  isVirtualDeathEnabled,
  userRole,
  lastDeath,
  inputType,
  setInputType,
  inputDate,
  setInputDate,
  inputTime,
  setInputTime,
  inputLocation,
  setInputLocation,
  addEntry
}) => {
  const currentZiboGif = useMemo(() => ZIBO_GIFS[Math.floor(Math.random() * ZIBO_GIFS.length)], []);

  return (
    <div className="lg:col-span-3 flex flex-col gap-4 h-auto lg:h-[600px]">
        {/* Last Death */}
        <div className={`border-2 rounded-[2rem] p-5 shadow-xl relative overflow-hidden group min-h-[160px] flex-1 transition-all duration-700 flex flex-col ${isSimulationActive ? 'bg-amber-950/20 border-amber-500/30' : 'bg-[#111114] border-red-500/20'}`}>
            <div className="relative z-10 w-full flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <Skull size={14} className={isSimulationActive ? 'text-amber-500' : 'text-red-500'} />
                    <span className="text-[9px] text-slate-500 uppercase font-black">
                        {isVirtualDeathEnabled ? 'ВИРТУАЛЬНАЯ СМЕРТЬ' : 'Последняя смерть'}
                    </span>
                </div>
                {lastDeath ? (
                <div className="flex flex-row lg:flex-col items-center lg:items-start flex-1 w-full">
                    <div className="flex flex-col shrink-0">
                        <div className={`text-3xl lg:text-4xl font-black font-mono tracking-tight mb-3 transition-colors ${isVirtualDeathEnabled ? 'text-amber-400' : 'text-white'}`}>
                        {format(new Date(lastDeath.time), "HH:mm:ss")}
                        </div>
                        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-fit transition-all ${isVirtualDeathEnabled ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5'}`}>
                            <MapPin size={10} className={isSimulationActive ? 'text-amber-500' : 'text-red-500'} />
                            <span className={`text-[9px] font-bold uppercase ${isVirtualDeathEnabled ? 'text-amber-200' : 'text-slate-300'}`}>{lastDeath.location}</span>
                        </div>
                        <div className="mt-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                            Запись от: <span className="text-slate-500">{lastDeath.addedBy || 'Asap'}</span>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center lg:mt-auto lg:w-full py-0 lg:py-4">
                        <img src={currentZiboGif} alt="Mimic" className="w-20 h-20 sm:w-28 sm:h-28 object-contain animate-pulse opacity-90 mix-blend-screen" />
                    </div>
                </div>
                ) : (
                <div className="text-slate-600 text-[10px] italic">Ожидание первого сигнала...</div>
                )}
            </div>
        </div>

        {/* Record Data - Available to ALL */}
        <div className={`bg-[#111114] border-2 rounded-[2rem] p-5 shadow-xl transition-all duration-500 ${inputType === 'death' ? 'border-red-500/20' : 'border-cyan-500/20'}`}>
            <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg transition-colors ${inputType === 'death' ? 'bg-red-500/10' : 'bg-cyan-500/10'}`}><Plus size={14} className={inputType === 'death' ? 'text-red-400' : 'text-cyan-400'} /></div>
                <h2 className="font-black text-xs uppercase tracking-[0.2em]">Записать</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-row gap-2 mb-1 p-1 bg-black/40 rounded-xl">
                    <button onClick={() => setInputType('death')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase ${inputType === 'death' ? 'bg-red-500/20 text-red-400' : 'text-slate-600'}`}>Смерть</button>
                    <button onClick={() => setInputType('sight')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase ${inputType === 'sight' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-600'}`}>Находка</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-2 outline-none text-[9px] text-white font-mono focus:border-purple-500/40 block appearance-none" />
                    <TimeInput required value={inputTime} onChange={setInputTime} className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-2 outline-none text-[9px] text-white font-mono focus:border-purple-500/40 block appearance-none" />
                </div>
                <CustomSelect value={inputLocation} onChange={setInputLocation} options={LOCATIONS} className="py-2 text-[10px]" />
                <button onClick={addEntry} className={`w-full bg-gradient-to-r ${inputType === 'death' ? 'from-red-600 to-rose-600' : 'from-cyan-600 to-blue-600'} hover:opacity-90 text-white font-black py-3 rounded-xl transition-all shadow-lg text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 group`}>Записать</button>
            </div>
        </div>
    </div>
  );
};
