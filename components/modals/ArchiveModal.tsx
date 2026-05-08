
import React, { useState } from 'react';
import { X, History, Filter, Layers, Skull, Eye, ShieldAlert, Copy, ArrowRight, Zap, Edit2, Trash2 } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MIMIC_LOGO, LOCATIONS } from '../../constants';
import { ArchiveEntry, RespawnInfo, UserRole } from '../../types';
import { isLazyEntry } from '../../utils';

interface ArchiveModalProps {
  onClose: () => void;
  userRole: UserRole;
  filteredEvents: ArchiveEntry[];
  visibleCount: number;
  handleLoadMore: () => void;
  archiveFilter: string;
  setArchiveFilter: (val: any) => void;
  setShowMaintenanceModal: (val: boolean) => void;
  copyArchiveAsCode: () => void;
  setSelectedEntryForRespawn: (entry: ArchiveEntry) => void;
  setRespawnForm: (form: RespawnInfo) => void;
  setEntryToEdit: (entry: ArchiveEntry) => void;
  setEditForm: (form: any) => void;
  setEntryToDelete: (entry: ArchiveEntry) => void;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({
  onClose,
  userRole,
  filteredEvents,
  visibleCount,
  handleLoadMore,
  archiveFilter,
  setArchiveFilter,
  setShowMaintenanceModal,
  copyArchiveAsCode,
  setSelectedEntryForRespawn,
  setRespawnForm,
  setEntryToEdit,
  setEditForm,
  setEntryToDelete
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-3xl h-[85vh] flex flex-col relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors p-2 z-10"><X size={20}/></button>
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                    <History className="text-purple-500 w-6 h-6" />
                </div>
                <div>
                    <h2 className="font-black text-xl uppercase text-white italic leading-none">АРХИВ СОБЫТИЙ</h2>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <div className="relative">
                    <button 
                        onClick={() => setShowFilterMenu(!showFilterMenu)} 
                        className={`p-2 rounded-xl border transition-all flex items-center gap-2 ${archiveFilter !== 'all' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
                    >
                        <Filter size={14}/>
                        <span className="text-[10px] font-black uppercase hidden sm:inline">{archiveFilter === 'all' ? 'Фильтр' : archiveFilter}</span>
                    </button>
                    {showFilterMenu && (
                        <div className="absolute left-0 top-full mt-2 w-32 bg-[#1a1a1e] border border-white/10 rounded-xl shadow-xl z-50 flex flex-col p-1">
                            {[ { id: 'all', icon: Layers, label: 'ВСЕ' }, { id: 'death', icon: Skull, label: 'СМЕРТЬ' }, { id: 'sight', icon: Eye, label: 'НАХОДКА' }, { id: 'maintenance', icon: ShieldAlert, label: 'ТЕХ. РАБ.' } ].map(f => (
                                <button 
                                    key={f.id} 
                                    onClick={() => { setArchiveFilter(f.id as any); setShowFilterMenu(false); }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-white/5 ${archiveFilter === f.id ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400'}`}
                                >
                                    <f.icon size={12} /> {f.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
                {userRole === 'admin' && (
                    <button onClick={() => setShowMaintenanceModal(true)} className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/20 transition-all">
                        <ShieldAlert size={14} />
                        <span className="text-[9px] font-black uppercase hidden sm:inline">Тех. работы</span>
                    </button>
                )}
                <button onClick={copyArchiveAsCode} className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/20 transition-all">
                    <Copy size={14}/>
                    <span className="text-[9px] font-black uppercase hidden sm:inline">Копировать</span>
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {filteredEvents.slice(0, visibleCount).map((ev) => {
                const isLazy = isLazyEntry(ev);
                return (
                    <div key={ev.id} className={`group/item flex flex-col p-3 rounded-xl border transition-all ${ev.type === 'maintenance' ? 'bg-amber-900/5 border-amber-500/20' : ev.type === 'sight' ? 'bg-cyan-900/5 border-cyan-500/10' : 'bg-white/[0.02] border-transparent hover:border-white/5'} ${isLazy ? 'opacity-40 grayscale' : ''}`}>
                        <div className="flex items-start justify-between">
                            {/* Left Side: Icon & Main Event */}
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 mt-0.5 flex-shrink-0 ${ev.type === 'maintenance' ? 'bg-amber-500/10' : ev.type === 'death' ? 'bg-black/60' : 'bg-cyan-900/20'}`}>
                                    {ev.type === 'maintenance' ? <ShieldAlert className="text-amber-500" size={14} /> : <img src={MIMIC_LOGO} className={`w-4 h-4 object-contain transition-all group-hover/item:scale-110 ${ev.type === 'sight' ? 'opacity-80' : 'opacity-40 group-hover/item:opacity-100'}`} />}
                                </div>
                                <div className="flex flex-col">
                                    {/* Main Event Row */}
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono text-[11px] text-white font-black ${isLazy ? 'line-through decoration-red-500/50' : ''}`}>
                                            {format(new Date(ev.time), "HH:mm:ss", { locale: ru })}
                                        </span>
                                        <span className="text-white/20 text-[10px]">|</span>
                                        <span className={`text-[10px] font-black uppercase ${ev.type === 'sight' ? 'text-cyan-500' : 'text-red-400'} ${isLazy ? 'line-through' : ''}`}>
                                            {ev.location}
                                        </span>
                                    </div>
                                    
                                    {/* Date & Author Subtitle */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">
                                            {format(new Date(ev.time), "dd MMM", { locale: ru })}
                                        </span>
                                        <span className="text-[8px] text-slate-700 font-bold uppercase tracking-wider">•</span>
                                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                                            Запись от: {ev.addedBy || 'Asap'}
                                        </span>
                                    </div>

                                    {/* Respawn Row (Connected) */}
                                    {ev.respawn && (
                                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 relative">
                                            <div className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-3 h-[1px] bg-white/10"></div>
                                            <div className="absolute -left-[19px] top-0 bottom-0 w-[1px] bg-white/10 -mt-3 h-6"></div>
                                            <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 ${
                                                ev.respawn.isUnknown 
                                                ? 'bg-amber-500/10 text-amber-500' 
                                                : 'bg-white/5 border border-white/5 text-slate-300'
                                            }`}>
                                                <ArrowRight size={10} className={ev.respawn.isUnknown ? 'text-amber-500' : 'text-slate-500'} />
                                                {ev.respawn.isUnknown ? (
                                                    <span>НЕИЗВЕСТНО</span>
                                                ) : (
                                                    <>
                                                        <span className="font-mono text-white">
                                                            {ev.respawn.isTimeApproximate && <span className="text-amber-500 mr-1">~</span>}
                                                            {ev.respawn.time}
                                                        </span>
                                                        <span className="opacity-20 text-slate-500">|</span>
                                                        <span className="text-green-400">{ev.respawn.location}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions (Admin Only) */}
                            {userRole === 'admin' && (
                                <div className="flex gap-1">
                                    {ev.type === 'death' && (
                                        <button 
                                            onClick={() => { const deathDt = new Date(ev.time); setSelectedEntryForRespawn(ev); setRespawnForm({ date: ev.respawn?.date || format(addHours(deathDt, 6), "yyyy-MM-dd"), time: ev.respawn?.time || format(addHours(deathDt, 6), "HH:mm:ss"), location: ev.respawn?.location || LOCATIONS[0], isTimeApproximate: ev.respawn?.isTimeApproximate || false, isUnknown: ev.respawn?.isUnknown || false }); }} 
                                            className={`p-1.5 rounded transition-all ${
                                                ev.respawn 
                                                ? (ev.respawn.isTimeApproximate ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20')
                                                : 'bg-green-500/5 text-green-600/50 hover:bg-green-500/10 hover:text-green-500'
                                            }`}
                                        >
                                            <Zap size={12}/>
                                        </button>
                                    )}
                                    <button onClick={() => { 
                                    setEntryToEdit(ev); 
                                    if (ev.type === 'maintenance' && ev.maintStart && ev.maintEnd) {
                                        const start = new Date(ev.maintStart);
                                        const end = new Date(ev.maintEnd);
                                        setEditForm({
                                            type: 'maintenance',
                                            maintStartDate: format(start, "yyyy-MM-dd"),
                                            maintStartTime: format(start, "HH:mm:ss"),
                                            maintEndDate: format(end, "yyyy-MM-dd"),
                                            maintEndTime: format(end, "HH:mm:ss"),
                                            date: "", time: "", location: ""
                                        });
                                    } else {
                                        const dt = new Date(ev.time); 
                                        setEditForm({ 
                                            date: format(dt, "yyyy-MM-dd"), 
                                            time: format(dt, "HH:mm:ss"), 
                                            location: ev.location, 
                                            type: ev.type,
                                            maintStartDate: "", maintStartTime: "", maintEndDate: "", maintEndTime: ""
                                        }); 
                                    }
                                    }} className="p-1.5 bg-white/5 text-slate-500 rounded hover:text-blue-400 transition-all"><Edit2 size={12}/></button>
                                    <button onClick={() => setEntryToDelete(ev)} className="p-1.5 bg-red-500/5 text-red-900/50 rounded hover:bg-red-600 hover:text-white transition-all"><Trash2 size={12}/></button>
                                </div>
                            )}
                        </div>
                    </div>
                );
                })}
                {visibleCount < filteredEvents.length && (
                  <button onClick={handleLoadMore} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-[9px] font-black uppercase text-slate-300">
                    Показать еще ({filteredEvents.length - visibleCount})
                  </button>
                )}
            </div>
        </div>
    </div>
  );
};
