
import React from 'react';
import { 
  FlaskConical, 
  Search, 
  Timer, 
  Table2, 
  Activity, 
  Sparkles, 
  Dices, 
  History,
  Users
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  isSimulationActive: boolean;
  userRole: UserRole;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  setShowRetroModal: (v: boolean) => void;
  setShowChainModal: (v: boolean) => void;
  setShowVtpModal: (v: boolean) => void;
  setShowMasterTableModal: (v: boolean) => void;
  setShowSummaryModal: (v: boolean) => void;
  setShowFrankenModal: (v: boolean) => void;
  setShowCasinoModal: (v: boolean) => void;
  setShowArchiveModal: (v: boolean) => void;
  setShowUserModal: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSimulationActive,
  userRole,
  isOpen,
  setIsOpen,
  setShowRetroModal,
  setShowChainModal,
  setShowVtpModal,
  setShowMasterTableModal,
  setShowSummaryModal,
  setShowFrankenModal,
  setShowCasinoModal,
  setShowArchiveModal,
  setShowUserModal
}) => {
  return (
    <>
        {/* Mobile Backdrop */}
        <div 
            className={`fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 bottom-0 z-50 bg-black/90 backdrop-blur-3xl border-r border-white/5 flex flex-col items-center py-6 gap-3 shadow-2xl w-14 sm:w-16 transition-transform duration-300 lg:translate-x-0 ${isSimulationActive ? 'border-amber-500/20' : ''} ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Retro Analysis Button (Large) */}
        <button 
            onClick={() => { setShowRetroModal(true); setIsOpen(false); }}
            className={`p-3 rounded-xl transition-all ${isSimulationActive ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-white/5 text-amber-500 hover:bg-white/10'}`}
        >
            <FlaskConical size={20} />
        </button>

        {/* Separator */}
        <div className="w-8 h-[1px] bg-white/5 rounded-full my-1"></div>

        {/* Tools (Compact) */}
        <div className="flex flex-col gap-2 w-full px-2 items-center">
            <button onClick={() => { setShowChainModal(true); setIsOpen(false); }} className="p-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/50 transition-all"><Search size={18}/></button>
            <button onClick={() => { setShowVtpModal(true); setIsOpen(false); }} className="p-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/50 transition-all"><Timer size={18}/></button>
            <button onClick={() => { setShowMasterTableModal(true); setIsOpen(false); }} title="Мастер Таблица" className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/20 hover:border-rose-500/50 transition-all"><Table2 size={18}/></button>
            <button onClick={() => { setShowSummaryModal(true); setIsOpen(false); }} title="Цепи Маркова" className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50 transition-all"><Activity size={18}/></button>
            <button onClick={() => { setShowFrankenModal(true); setIsOpen(false); }} title="Франкенштейн" className="p-2.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/20 hover:border-amber-500/50 transition-all"><Sparkles size={18}/></button>
            <button onClick={() => { setShowCasinoModal(true); setIsOpen(false); }} className="p-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-xl text-yellow-400 border border-yellow-500/20 hover:border-yellow-500/50 transition-all"><Dices size={18}/></button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Admin Tools */}
        {userRole === 'admin' && (
            <div className="flex flex-col gap-2 mb-20 sm:mb-4 w-full px-2 items-center">
                <button 
                    onClick={() => { setShowUserModal(true); setIsOpen(false); }}
                    className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-500 transition-all border border-blue-500/20 hover:border-blue-500/50"
                >
                    <Users size={20} />
                </button>

                <button 
                    onClick={() => { setShowArchiveModal(true); setIsOpen(false); }}
                    className="p-3 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-xl text-fuchsia-500 transition-all border border-fuchsia-500/20 hover:border-fuchsia-500/50"
                >
                    <History size={20} />
                </button>
            </div>
        )}

        </aside>
    </>
  );
};
