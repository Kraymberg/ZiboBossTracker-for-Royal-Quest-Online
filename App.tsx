
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { format, subDays, differenceInHours, differenceInMinutes, getHours } from 'date-fns';
import { LOCATIONS } from './constants';
import { ArchiveEntry, RespawnInfo, UserProfile, UserRole } from './types';
import { getMoscowTime } from './utils';

// Firebase Integration
import { db, migrateLocalData } from './firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  getDoc,
  getDocs,
  where,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatusBlock } from './components/dashboard/StatusBlock';
import { RouteBlock } from './components/dashboard/RouteBlock';
import { LastDeathBlock } from './components/dashboard/LastDeathBlock';
import { AccessDeniedScreen, InvalidPlatformScreen, LoadingScreen } from './components/AccessScreens';

// Modals
import { CasinoModal } from './components/modals/CasinoModal';
import { FrankensteinModal } from './components/modals/FrankensteinModal';
import { ArchiveModal } from './components/modals/ArchiveModal';
import { RetroModal, ChainModal, VtpModal, MasterTableModal, SummaryModal } from './components/modals/AnalysisModals';
import { MaintenanceModal, EditEntryModal, RespawnModal, DeleteConfirmationModal, UserManagementModal } from './components/modals/ActionModals';

// Logic Hook
import { useZiboAnalysis } from './hooks/useZiboAnalysis';

const tg = (window as any).Telegram?.WebApp;

export const App: React.FC = () => {
  // --- AUTH STATE ---
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authorized' | 'denied' | 'invalid_platform'>('loading');

  // --- FIREBASE DATA ---
  const [events, setEvents] = useState<ArchiveEntry[]>([]);

  // --- LOCAL STATE ---
  const [currentTime, setCurrentTime] = useState(getMoscowTime());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Simulation State
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [isVirtualDeathEnabled, setIsVirtualDeathEnabled] = useState(false);
  const [simulationDate, setSimulationDate] = useState(format(getMoscowTime(), "yyyy-MM-dd"));
  const [simulationTimeStr, setSimulationTimeStr] = useState(format(getMoscowTime(), "HH:mm:ss"));
  const [simulationLocation, setSimulationLocation] = useState(LOCATIONS[0]);
  const [virtualDeathDate, setVirtualDeathDate] = useState(format(getMoscowTime(), "yyyy-MM-dd"));
  const [virtualDeathTime, setVirtualDeathTime] = useState(format(getMoscowTime(), "HH:mm:ss"));

  // --- SWIPE LOGIC ---
  const touchStartRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    // Swipe Left (Close)
    if (diff > 50) {
       setIsSidebarOpen(false);
    }
    // Swipe Right (Open) - only if starting near edge or menu logic permits
    if (diff < -50) {
       setIsSidebarOpen(true);
    }
    touchStartRef.current = null;
  };

  // --- INITIALIZATION & AUTH ---
  useEffect(() => {
    // 1. Check Platform
    if (tg) {
        tg.expand();
        tg.ready();
    }

    const checkAuth = async () => {
        try {
            // Determine Environment
            // @ts-ignore
            const isDevEnv = import.meta.env?.DEV || false;
            
            // Get User ID from Telegram
            const tgUser = tg?.initDataUnsafe?.user;
            const hasInitData = !!tg?.initData;

            // STRICT PRODUCTION CHECK: 
            // If not in Dev mode (localhost), we MUST have initData (Telegram Context).
            // If opened in browser directly, initData is empty string.
            if (!isDevEnv && !hasInitData) {
                setAuthStatus('invalid_platform');
                return;
            }
            
            // Mock ID for development if no user present
            const userId = tgUser ? tgUser.id : (isDevEnv ? 123456789 : null);

            if (!userId) {
                setAuthStatus('invalid_platform');
                return;
            }
            
            const username = tgUser ? tgUser.username : undefined;
            
            // 1. Check by ID (Priority)
            let userData = null;
            
            // Try ID first
            const userRef = doc(db, "users", userId.toString());
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                userData = userSnap.data();
            } else if (username) {
                // 2. Check by Username (Case Insensitive)
                const lowerUsername = username.toLowerCase();
                
                // A. Try direct Doc ID lookup (lowercase) - Fastest/Common
                const userRefByUsername = doc(db, "users", lowerUsername);
                const userSnapByUsername = await getDoc(userRefByUsername);
                
                if (userSnapByUsername.exists()) {
                    userData = userSnapByUsername.data();
                } else {
                    // B. Fallback: Scan collection for case-insensitive match
                    // This handles cases where DocID is mixed case (e.g. "Asap") or 'username' field matches
                    const usersSnap = await getDocs(collection(db, "users"));
                    for (const docSnap of usersSnap.docs) {
                        const data = docSnap.data() as any;
                        const docIdMatch = docSnap.id.toLowerCase() === lowerUsername;
                        const fieldMatch = data.username && data.username.toLowerCase() === lowerUsername;
                        
                        if (docIdMatch || fieldMatch) {
                            userData = data;
                            break;
                        }
                    }
                }
            }

            if (userData) {
                setUserProfile({
                    id: userId,
                    first_name: tgUser?.first_name || "Agent",
                    name: userData.name || tgUser?.first_name || "Agent", // Use DB name or TG first_name
                    role: userData.role as UserRole,
                    username: tgUser?.username
                });
                setAuthStatus('authorized');
            } else {
                // Not found
                // For Dev convenience, if it's the mock ID, make admin
                if (isDevEnv && userId === 123456789) {
                     setUserProfile({ id: 123, first_name: "Dev", name: "Dev", role: 'admin' });
                     setAuthStatus('authorized');
                } else {
                    setUserProfile({ id: userId, first_name: "", name: "Guest", role: 'viewer' } as any); // Temp holder for ID display
                    setAuthStatus('denied');
                }
            }
        } catch (e) {
            console.error("Auth error:", e);
            setAuthStatus('denied');
        }
    };

    checkAuth();
  }, []);

  // --- FIREBASE SUBSCRIPTION (Only if authorized) ---
  useEffect(() => {
    if (authStatus !== 'authorized') return;

    const timer = setInterval(() => setCurrentTime(getMoscowTime()), 1000);

    // 1. Setup Live Listener Immediately
    const q = query(collection(db, "history"), orderBy("time", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        const uniqueMap = new Map<string, ArchiveEntry>();
        snapshot.docs.forEach((doc) => {
            const data = doc.data() as any;
            const key = `${data.time}_${data.location}_${data.type}`;
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, { id: doc.id, ...data } as ArchiveEntry);
            }
        });
        setEvents(Array.from(uniqueMap.values()));
    }, (error) => {
        console.error("Firestore Listener Error:", error);
    });

    // 2. Trigger Migration
    migrateLocalData().catch(err => {
        console.error("Migration check failed:", err);
    });

    return () => {
        clearInterval(timer);
        unsubscribe(); // Cleanup listener on unmount
    };
  }, [authStatus]);

  // --- USE ANALYSIS HOOK ---
  const {
      effectiveNow,
      effectiveEvents,
      lastDeath,
      schedule,
      currentStatus,
      respawnModel,
      frankResData,
      vtpAnalysis,
      masterTableData,
      tableAccuracy,
      calibratedOffsetsMap,
      advancedAnalytics,
      chainAnalytics,
      transitionsMatrix
  } = useZiboAnalysis(
      events, 
      currentTime, 
      isSimulationActive, 
      simulationDate, 
      simulationTimeStr, 
      isVirtualDeathEnabled, 
      simulationLocation, 
      virtualDeathDate, 
      virtualDeathTime
  );

  const [inputTime, setInputTime] = useState(format(getMoscowTime(), "HH:mm:ss"));
  const [inputDate, setInputDate] = useState(format(getMoscowTime(), "yyyy-MM-dd"));
  const [inputLocation, setInputLocation] = useState(LOCATIONS[0]);
  const [inputType, setInputType] = useState<'death' | 'sight'| 'maintenance'>('death');
  
  // Set default input time to last death time when it loads or changes
  useEffect(() => {
    if (lastDeath) {
        const dt = new Date(lastDeath.time);
        setInputDate(format(dt, "yyyy-MM-dd"));
        setInputTime(format(dt, "HH:mm:ss"));
    } else {
        // Fallback for first load if no data
        const now = getMoscowTime();
        setInputDate(format(now, "yyyy-MM-dd"));
        setInputTime(format(now, "HH:mm:ss"));
    }
  }, [lastDeath?.time]);

  const handleInputTimeChange = (val: string) => {
    setInputTime(val);
  };

  const handleInputDateChange = (val: string) => {
    setInputDate(val);
  };
  
  // Archive States
  const [archiveFilter, setArchiveFilter] = useState<'all' | 'death' | 'sight' | 'maintenance'>('all');
  const [visibleCount, setVisibleCount] = useState(9);
  
  const [selectedEntryForRespawn, setSelectedEntryForRespawn] = useState<ArchiveEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<ArchiveEntry | null>(null);
  const [entryToEdit, setEntryToEdit] = useState<ArchiveEntry | null>(null);
  
  // Modals Visibility
  const [showChainModal, setShowChainModal] = useState(false);
  const [showVtpModal, setShowVtpModal] = useState(false);
  const [showMasterTableModal, setShowMasterTableModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showFrankenModal, setShowFrankenModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showRetroModal, setShowRetroModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCasinoModal, setShowCasinoModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Casino State
  const [casinoBalance, setCasinoBalance] = useState(10000);
  const [casinoBet, setCasinoBet] = useState('');
  const [casinoTarget, setCasinoTarget] = useState('');
  const [casinoResult, setCasinoResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningLoc, setSpinningLoc] = useState('???');
  const availableCasinoLocs = useMemo(() => LOCATIONS, []);

  // Forms
  const [maintenanceForm, setMaintenanceForm] = useState({
    startDate: format(getMoscowTime(), "yyyy-MM-dd"),
    startTime: "10:00:00",
    endDate: format(getMoscowTime(), "yyyy-MM-dd"),
    endTime: "16:00:00"
  });

  const [respawnForm, setRespawnForm] = useState<RespawnInfo>({
    date: format(getMoscowTime(), "yyyy-MM-dd"),
    time: format(getMoscowTime(), "HH:mm:ss"),
    location: LOCATIONS[0],
    isTimeApproximate: false,
    isUnknown: false
  });

  const [editForm, setEditForm] = useState({ 
    date: "", 
    time: "", 
    location: "", 
    type: 'death' as 'death' | 'sight' | 'maintenance',
    maintStartDate: "",
    maintStartTime: "",
    maintEndDate: "",
    maintEndTime: ""
  });


  // --- CASINO LOGIC ---
  const handleCasinoSpin = () => {
    if (isSpinning) return;
    const betVal = parseInt(casinoBet);
    if (isNaN(betVal) || betVal <= 0) return alert("Введите ставку");
    if (betVal > casinoBalance) return alert("Недостаточно средств");

    setCasinoBalance(prev => prev - betVal);
    setIsSpinning(true);
    setCasinoResult(null);
    
    let currentIdx = Math.floor(Math.random() * availableCasinoLocs.length);
    const winningIdx = Math.floor(Math.random() * availableCasinoLocs.length);
    const fullRotations = 5 + Math.floor(Math.random() * 3); 
    const totalSteps = (fullRotations * availableCasinoLocs.length) + ((winningIdx - currentIdx + availableCasinoLocs.length) % availableCasinoLocs.length);
    
    let step = 0;
    const minDelay = 60; 
    const maxDelay = 500; 
    
    const spin = () => {
        step++;
        currentIdx = (currentIdx + 1) % availableCasinoLocs.length;
        setSpinningLoc(availableCasinoLocs[currentIdx]);

        if (step < totalSteps) {
            let delay = minDelay;
            const remaining = totalSteps - step;
            if (remaining < 20) {
                const t = (20 - remaining) / 20; 
                delay = minDelay + (maxDelay - minDelay) * (t * t);
            }
            setTimeout(spin, delay);
        } else {
            setIsSpinning(false);
            const result = availableCasinoLocs[currentIdx];
            setCasinoResult(result);
            if (result === casinoTarget) {
                setCasinoBalance(prev => prev + (betVal * 5)); 
            }
        }
    };
    spin();
  };

  const quickBet = (amount: number | 'max') => {
      if (amount === 'max') {
          setCasinoBet(casinoBalance.toString());
      } else {
          setCasinoBet(amount.toString());
      }
  };

  // --- FILTERS ---
  const filteredEvents = useMemo(() => {
    let result = effectiveEvents;
    if (archiveFilter !== 'all') result = effectiveEvents.filter(e => e.type === archiveFilter);
    return result;
  }, [effectiveEvents, archiveFilter]);

  // --- FIREBASE ACTIONS ---
  const addEntry = useCallback(async () => {
    // Note: removed admin check to allow everyone to record
    
    let finalDate = inputDate;
    
    // Smart Date Logic:
    // If the entered time (combined with input date) is significantly ahead of "now" (e.g. user enters 23:50 when it's 00:05),
    // assume they mean the previous day to avoid creating "future" events.
    const combinedInput = new Date(`${inputDate}T${inputTime}`);
    const diffHours = differenceInHours(combinedInput, currentTime);
    
    if (diffHours > 12) {
       // If the input is more than 12 hours ahead, assume it's yesterday
       finalDate = format(subDays(new Date(inputDate), 1), "yyyy-MM-dd");
    }

    const fullTime = `${finalDate}T${inputTime}`;
    
    const newEntry: Omit<ArchiveEntry, 'id'> = { 
        type: inputType, 
        time: fullTime, 
        location: inputLocation,
        source: 'manual',
        addedBy: userProfile?.name || userProfile?.first_name || "Asap" // Record user
    };
    try {
        await addDoc(collection(db, "history"), newEntry);
        setInputType('death');
        // No auto-sync reset needed as we removed isManualInput
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Ошибка добавления: " + e);
    }
  }, [inputDate, inputTime, inputLocation, inputType, userProfile, currentTime]);

  const addMaintenance = async () => {
    if (userProfile?.role !== 'admin') return;
    const start = `${maintenanceForm.startDate}T${maintenanceForm.startTime}`;
    const end = `${maintenanceForm.endDate}T${maintenanceForm.endTime}`;
    const newMaint: Omit<ArchiveEntry, 'id'> = { 
        type: 'maintenance', 
        time: end, 
        location: 'Сервер', 
        maintStart: start, 
        maintEnd: end,
        source: 'manual',
        addedBy: userProfile?.name || "Asap"
    };
    try {
        await addDoc(collection(db, "history"), newMaint);
        setShowMaintenanceModal(false);
    } catch (e) {
        console.error("Error adding maintenance", e);
    }
  };

  const deleteDeath = async () => { 
      if (!entryToDelete || userProfile?.role !== 'admin') return; 
      try {
          await deleteDoc(doc(db, "history", entryToDelete.id));
          setEntryToDelete(null);
      } catch (e) {
          console.error("Error deleting", e);
      }
  };

  const saveEdit = async () => {
    if (!entryToEdit || userProfile?.role !== 'admin') return;
    let updatedEntry: Partial<ArchiveEntry>;
    if (entryToEdit.type === 'maintenance') {
      const newStart = `${editForm.maintStartDate}T${editForm.maintStartTime}`;
      const newEnd = `${editForm.maintEndDate}T${editForm.maintEndTime}`;
      updatedEntry = {
        time: newEnd,
        maintStart: newStart,
        maintEnd: newEnd,
        location: 'Сервер'
      };
    } else {
      const newTime = `${editForm.date}T${editForm.time}`;
      updatedEntry = { 
        time: newTime, 
        location: editForm.location, 
        type: editForm.type
      };
    }
    try {
        await updateDoc(doc(db, "history", entryToEdit.id), updatedEntry);
        setEntryToEdit(null);
    } catch (e) {
        console.error("Error updating", e);
    }
  };

  const saveRespawn = async () => {
    if (!selectedEntryForRespawn || userProfile?.role !== 'admin') return;
    
    // Clear other fields if respawn is set to unknown
    const newRespawnInfo: RespawnInfo = respawnForm.isUnknown 
      ? {
        isUnknown: true,
        isTimeApproximate: false
      }
      : {
        date: respawnForm.date,
        time: respawnForm.time,
        location: respawnForm.location,
        isTimeApproximate: respawnForm.isTimeApproximate,
        isUnknown: false
    };

    try {
        await updateDoc(doc(db, "history", selectedEntryForRespawn.id), {
            respawn: newRespawnInfo
        });
        setSelectedEntryForRespawn(null);
    } catch (e) {
        console.error("Error saving respawn", e);
    }
  };

  const copyArchiveAsCode = () => {
    const code = `export const INITIAL_CHAT_HISTORY: ArchiveEntry[] = ${JSON.stringify(events, null, 2)};`;
    navigator.clipboard.writeText(code).then(() => alert("Массив архива скопирован!"));
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + 9);

  // --- RENDER SCREENS ---
  if (authStatus === 'loading') return <LoadingScreen />;
  if (authStatus === 'invalid_platform') return <InvalidPlatformScreen />;
  if (authStatus === 'denied') return <AccessDeniedScreen userId={userProfile?.id || 0} />;

  return (
    <>
    <div 
        className={`h-screen overflow-hidden selection:bg-purple-500/30 text-slate-200 transition-all duration-700 ${isSimulationActive ? 'bg-[#1a160d]' : 'bg-[#0d0d0f]'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >
      
      <Sidebar 
        isSimulationActive={isSimulationActive}
        userRole={userProfile?.role || 'viewer'}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        setShowRetroModal={setShowRetroModal}
        setShowChainModal={setShowChainModal}
        setShowVtpModal={setShowVtpModal}
        setShowMasterTableModal={setShowMasterTableModal}
        setShowSummaryModal={setShowSummaryModal}
        setShowFrankenModal={setShowFrankenModal}
        setShowCasinoModal={setShowCasinoModal}
        setShowArchiveModal={setShowArchiveModal}
        setShowUserModal={setShowUserModal}
      />

      {/* Main Content Area */}
      <div className={`h-full transition-all duration-300 flex flex-col lg:pl-16`}>
        <Header 
            isSimulationActive={isSimulationActive}
            effectiveNow={effectiveNow}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
            <div className="max-w-[1920px] mx-auto space-y-6">
                
                {/* MAIN DASHBOARD: 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <StatusBlock 
                        isSimulationActive={isSimulationActive}
                        currentStatus={currentStatus}
                        lastDeath={lastDeath}
                        respawnModel={respawnModel}
                    />

                    <RouteBlock 
                        isSimulationActive={isSimulationActive}
                        schedule={schedule}
                        effectiveNow={effectiveNow}
                        lastDeath={lastDeath}
                        userRole={userProfile?.role || 'viewer'}
                        transitionsMatrix={transitionsMatrix}
                        respawnModel={respawnModel}
                    />

                    <LastDeathBlock 
                        isSimulationActive={isSimulationActive}
                        isVirtualDeathEnabled={isVirtualDeathEnabled}
                        userRole={userProfile?.role || 'viewer'}
                        lastDeath={lastDeath}
                        inputType={inputType}
                        setInputType={setInputType}
                        inputDate={inputDate}
                        setInputDate={handleInputDateChange}
                        inputTime={inputTime}
                        setInputTime={handleInputTimeChange}
                        inputLocation={inputLocation}
                        setInputLocation={setInputLocation}
                        addEntry={addEntry}
                    />
                </div>
            </div>
        </main>
      </div>

      {/* MODALS */}
      {showRetroModal && (
        <RetroModal 
            onClose={() => setShowRetroModal(false)}
            isSimulationActive={isSimulationActive}
            setIsSimulationActive={setIsSimulationActive}
            simulationDate={simulationDate} setSimulationDate={setSimulationDate}
            simulationTimeStr={simulationTimeStr} setSimulationTimeStr={setSimulationTimeStr}
            isVirtualDeathEnabled={isVirtualDeathEnabled} setIsVirtualDeathEnabled={setIsVirtualDeathEnabled}
            simulationLocation={simulationLocation} setSimulationLocation={setSimulationLocation}
            virtualDeathDate={virtualDeathDate} setVirtualDeathDate={setVirtualDeathDate}
            virtualDeathTime={virtualDeathTime} setVirtualDeathTime={setVirtualDeathTime}
        />
      )}

      {showChainModal && <ChainModal onClose={() => setShowChainModal(false)} chainAnalytics={chainAnalytics} />}
      {showVtpModal && <VtpModal onClose={() => setShowVtpModal(false)} vtpAnalysis={vtpAnalysis} />}
      {showMasterTableModal && <MasterTableModal onClose={() => setShowMasterTableModal(false)} masterTableData={masterTableData} tableAccuracy={tableAccuracy} calibratedOffsetsMap={calibratedOffsetsMap} />}
      {showSummaryModal && <SummaryModal onClose={() => setShowSummaryModal(false)} transitionsMatrix={transitionsMatrix} lastDeathLocation={lastDeath?.location} effectiveEventsCount={effectiveEvents.length} />}
      
      {showFrankenModal && (
        <FrankensteinModal 
            onClose={() => setShowFrankenModal(false)} 
            frankResData={frankResData}
        />
      )}

      {showCasinoModal && (
        <CasinoModal 
            onClose={() => setShowCasinoModal(false)}
            casinoBalance={casinoBalance}
            casinoBet={casinoBet}
            setCasinoBet={setCasinoBet}
            casinoTarget={casinoTarget}
            setCasinoTarget={setCasinoTarget}
            casinoResult={casinoResult}
            isSpinning={isSpinning}
            spinningLoc={spinningLoc}
            handleCasinoSpin={handleCasinoSpin}
            quickBet={quickBet}
        />
      )}

      {showArchiveModal && (
        <ArchiveModal 
            onClose={() => setShowArchiveModal(false)}
            userRole={userProfile?.role || 'viewer'}
            filteredEvents={filteredEvents}
            visibleCount={visibleCount}
            handleLoadMore={handleLoadMore}
            archiveFilter={archiveFilter}
            setArchiveFilter={setArchiveFilter}
            setShowMaintenanceModal={setShowMaintenanceModal}
            copyArchiveAsCode={copyArchiveAsCode}
            setSelectedEntryForRespawn={setSelectedEntryForRespawn}
            setRespawnForm={setRespawnForm}
            setEntryToEdit={setEntryToEdit}
            setEditForm={setEditForm}
            setEntryToDelete={setEntryToDelete}
        />
      )}

      {showUserModal && (
          <UserManagementModal onClose={() => setShowUserModal(false)} />
      )}

      {showMaintenanceModal && <MaintenanceModal onClose={() => setShowMaintenanceModal(false)} form={maintenanceForm} setForm={setMaintenanceForm} onAdd={addMaintenance} />}
      
      {entryToEdit && <EditEntryModal onClose={() => setEntryToEdit(null)} form={editForm} setForm={setEditForm} onSave={saveEdit} entryType={entryToEdit.type} />}

      {selectedEntryForRespawn && <RespawnModal onClose={() => setSelectedEntryForRespawn(null)} form={respawnForm} setForm={setRespawnForm} onSave={saveRespawn} />}

      {entryToDelete && <DeleteConfirmationModal onClose={() => setEntryToDelete(null)} onDelete={deleteDeath} />}
    </div>
    </>
  );
};
