
import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Edit2, Zap, Trash2, Users, Check, UserPlus } from 'lucide-react';
import { TimeInput, CustomSelect } from '../ui/Inputs';
import { LOCATIONS } from '../../constants';
import { ArchiveEntry, RespawnInfo } from '../../types';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Maintenance Modal
export const MaintenanceModal = ({ onClose, form, setForm, onAdd }: { onClose: () => void, form: any, setForm: (f: any) => void, onAdd: () => void }) => (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
        <div className="bg-[#111114] border border-amber-500/20 rounded-3xl p-6 sm:p-10 max-w-sm w-full relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors p-2 z-10"><X size={20}/></button>
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-500/10 rounded-xl"><ShieldAlert className="text-amber-500 w-6 h-6" /></div>
                <div>
                    <h2 className="font-black text-xl uppercase text-white italic leading-none">ТЕХ. РАБОТЫ</h2>
                    <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1">Регистрация простоя</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                        <div className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Начало работ</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-amber-500/30 transition-all block appearance-none" />
                            <TimeInput value={form.startTime} onChange={(val) => setForm({...form, startTime: val})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-amber-500/30 transition-all block appearance-none" />
                        </div>
                </div>

                <div className="space-y-2">
                        <div className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Окончание работ</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-amber-500/30 transition-all block appearance-none" />
                            <TimeInput value={form.endTime} onChange={(val) => setForm({...form, endTime: val})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-amber-500/30 transition-all block appearance-none" />
                        </div>
                </div>

                <button onClick={onAdd} className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20">
                    Зарегистрировать
                </button>
            </div>
        </div>
    </div>
);

// Edit Modal
export const EditEntryModal = ({ onClose, form, setForm, onSave, entryType }: { onClose: () => void, form: any, setForm: (f: any) => void, onSave: () => void, entryType: 'death' | 'sight' | 'maintenance' }) => (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <div className="bg-[#111114] border border-blue-500/20 rounded-3xl p-6 sm:p-10 max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors p-2 z-10"><X size={20}/></button>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-xl"><Edit2 className="text-blue-500 w-6 h-6" /></div>
                    <div>
                        <h2 className="font-black text-xl uppercase text-white italic leading-none">РЕДАКТИРОВАНИЕ</h2>
                        <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1">Изменение записи</p>
                    </div>
                </div>

                {entryType === 'maintenance' ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-[9px] font-black uppercase text-blue-500/60 ml-1">Начало</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input type="date" value={form.maintStartDate} onChange={(e) => setForm({...form, maintStartDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-blue-500/30 transition-all block appearance-none" />
                                <TimeInput value={form.maintStartTime} onChange={(val) => setForm({...form, maintStartTime: val})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-blue-500/30 transition-all block appearance-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[9px] font-black uppercase text-blue-500/60 ml-1">Окончание</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input type="date" value={form.maintEndDate} onChange={(e) => setForm({...form, maintEndDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-blue-500/30 transition-all block appearance-none" />
                                <TimeInput value={form.maintEndTime} onChange={(val) => setForm({...form, maintEndTime: val})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-blue-500/30 transition-all block appearance-none" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-[9px] font-black uppercase text-blue-500/60 ml-1">Тип события</div>
                            <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                                <button onClick={() => setForm({...form, type: 'death'})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${form.type === 'death' ? 'bg-red-500/20 text-red-400' : 'text-slate-500'}`}>Смерть</button>
                                <button onClick={() => setForm({...form, type: 'sight'})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${form.type === 'sight' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'}`}>Находка</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[9px] font-black uppercase text-blue-500/60 ml-1">Дата и Время</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-blue-500/30 transition-all block appearance-none" />
                                <TimeInput value={form.time} onChange={(val) => setForm({...form, time: val})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-blue-500/30 transition-all block appearance-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[9px] font-black uppercase text-blue-500/60 ml-1">Локация</div>
                            <CustomSelect value={form.location} onChange={(val) => setForm({...form, location: val})} options={LOCATIONS} className="!bg-white/5 !border-white/10 !py-3" />
                        </div>
                    </div>
                )}

                <button onClick={onSave} className="w-full mt-6 bg-blue-500 hover:bg-blue-400 text-black font-black py-4 rounded-xl transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                    Сохранить изменения
                </button>
            </div>
    </div>
);

// Respawn Modal
export const RespawnModal = ({ onClose, form, setForm, onSave }: { onClose: () => void, form: RespawnInfo, setForm: (f: RespawnInfo) => void, onSave: () => void }) => (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <div className="bg-[#111114] border border-green-500/20 rounded-3xl p-6 sm:p-10 max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors p-2 z-10"><X size={20}/></button>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-500/10 rounded-xl"><Zap className="text-green-500 w-6 h-6" /></div>
                    <div>
                        <h2 className="font-black text-xl uppercase text-white italic leading-none">РЕСПАУН</h2>
                        <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1">Регистрация факта</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Неизвестно</span>
                        <button 
                            onClick={() => setForm({...form, isUnknown: !form.isUnknown})}
                            className={`w-10 h-5 rounded-full relative transition-colors ${form.isUnknown ? 'bg-green-500' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.isUnknown ? 'left-6' : 'left-1'}`}></div>
                        </button>
                    </div>

                    {!form.isUnknown && (
                        <>
                            <div className="space-y-2">
                                <div className="text-[9px] font-black uppercase text-green-500/60 ml-1">Дата и Время</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-green-500/30 transition-all block appearance-none" />
                                    <TimeInput value={form.time || ""} onChange={(val) => setForm({...form as any, time: val})} className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-[10px] text-white outline-none focus:border-green-500/30 transition-all block appearance-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] font-black uppercase text-green-500/60 ml-1">Локация</div>
                                <CustomSelect value={form.location || LOCATIONS[0]} onChange={(val) => setForm({...form, location: val})} options={LOCATIONS} className="!bg-white/5 !border-white/10 !py-3" />
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-white/5">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Примерное время</span>
                                <button 
                                    onClick={() => setForm({...form, isTimeApproximate: !form.isTimeApproximate})}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${form.isTimeApproximate ? 'bg-amber-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.isTimeApproximate ? 'left-6' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </>
                    )}

                    <button onClick={onSave} className="w-full mt-6 bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-green-500/20">
                        Подтвердить
                    </button>
                </div>
            </div>
    </div>
);

// Delete Modal
export const DeleteConfirmationModal = ({ onClose, onDelete }: { onClose: () => void, onDelete: () => void }) => (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
        <div className="bg-[#111114] border border-red-500/20 rounded-3xl p-6 sm:p-10 max-w-sm w-full relative text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="font-black text-xl uppercase text-white italic leading-none mb-2">УДАЛЕНИЕ</h2>
            <p className="text-xs text-slate-400 mb-8">Вы уверены что хотите удалить эту запись? Это действие необратимо.</p>
            <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold text-xs uppercase">Отмена</button>
                <button onClick={onDelete} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs uppercase shadow-lg shadow-red-900/20">Удалить</button>
            </div>
        </div>
    </div>
);

// User Management Modal
export const UserManagementModal = ({ onClose }: { onClose: () => void }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [newUser, setNewUser] = useState({ idOrLogin: '', name: '', role: 'viewer' as 'admin' | 'viewer' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const snap = await getDocs(collection(db, "users"));
            setUsers(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
        } catch (e) {
            console.error("Failed to fetch users", e);
        }
    };

    const handleAddUser = async () => {
        if (!newUser.idOrLogin) return;
        setLoading(true);
        try {
            const rawInput = newUser.idOrLogin.trim().replace('@', ''); // Remove @ if present
            
            // Determine Document ID: If numeric only, keep as is (ID). If contains text, use lowercase (Username).
            // This logic matches App.tsx auth logic.
            const isNumeric = /^\d+$/.test(rawInput);
            const docId = isNumeric ? rawInput : rawInput.toLowerCase();

            // Construct data object. DO NOT pass undefined values to Firestore.
            const userData: any = {
                name: newUser.name || "Agent",
                role: newUser.role,
            };

            // Only add username field if it is NOT a numeric ID
            if (!isNumeric) {
                userData.username = rawInput;
            }

            await setDoc(doc(db, "users", docId), userData);
            
            setNewUser({ idOrLogin: '', name: '', role: 'viewer' });
            await fetchUsers();
        } catch (e: any) {
            console.error("Error adding user", e);
            alert("Ошибка при добавлении пользователя: " + e.message + "\n\nУбедитесь, что обновлены правила Firestore (firestore.rules).");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (docId: string) => {
        if (!window.confirm("Удалить пользователя?")) return;
        try {
            await deleteDoc(doc(db, "users", docId));
            await fetchUsers();
        } catch (e) {
            console.error("Error deleting", e);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <div className="bg-[#111114] border border-blue-500/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative h-[80vh] flex flex-col">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors p-2 z-10"><X size={20}/></button>
                <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                    <div className="p-3 bg-blue-500/10 rounded-xl"><Users className="text-blue-500 w-6 h-6" /></div>
                    <div>
                        <h2 className="font-black text-xl uppercase text-white italic leading-none">ПОЛЬЗОВАТЕЛИ</h2>
                        <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1">Управление доступом</p>
                    </div>
                </div>

                {/* Add Form */}
                <div className="flex-shrink-0 bg-white/5 p-4 rounded-xl border border-white/5 mb-6">
                    <div className="text-[9px] font-black uppercase text-blue-400 mb-3 flex items-center gap-2">
                        <UserPlus size={12} /> Добавить пользователя
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5">
                            <input 
                                type="text" 
                                placeholder="Telegram Login или ID" 
                                value={newUser.idOrLogin} 
                                onChange={(e) => setNewUser({...newUser, idOrLogin: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <input 
                                type="text" 
                                placeholder="Имя (напр. Mike)" 
                                value={newUser.name} 
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
                            />
                        </div>
                        <div className="sm:col-span-2">
                             <select 
                                value={newUser.role} 
                                onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                            >
                                <option value="viewer">Viewer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <button 
                                onClick={handleAddUser}
                                disabled={loading || !newUser.idOrLogin}
                                className="w-full h-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-2 px-1">
                        * Логины сохраняются без учета регистра. Цифровой ввод считается ID.
                    </p>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                    {users.map((u) => (
                        <div key={u.docId} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-sm text-white">{u.name}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/30 text-slate-400'}`}>{u.role}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {u.docId} {u.username ? `(@${u.username})` : ''}</div>
                            </div>
                            <button onClick={() => handleDeleteUser(u.docId)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="text-center py-10 text-slate-600 text-[10px] uppercase font-bold">Список пуст</div>
                    )}
                </div>
            </div>
        </div>
    );
};
