
import { useMemo, useCallback } from 'react';
import { addMinutes, addHours, addSeconds, differenceInSeconds, isValid, differenceInMinutes, differenceInDays, isBefore, format } from 'date-fns';
import { ArchiveEntry, ScheduleData } from '../types';
import { LOCATIONS, ROTATION_DATA, CYCLE_MAP, MASTER_CD_OFFSETS, VTP_OFFSETS } from '../constants';
import { isLazyEntry } from '../utils';

export const useZiboAnalysis = (
    events: ArchiveEntry[],
    currentTime: Date,
    isSimulationActive: boolean,
    simulationDate: string,
    simulationTimeStr: string,
    isVirtualDeathEnabled: boolean,
    simulationLocation: string,
    virtualDeathDate: string,
    virtualDeathTime: string
) => {

    const effectiveNow = useMemo(() => {
        if (!isSimulationActive) return currentTime;
        const simDt = new Date(`${simulationDate}T${simulationTimeStr}`);
        return isValid(simDt) ? simDt : currentTime;
      }, [isSimulationActive, simulationDate, simulationTimeStr, currentTime]);
    
      const effectiveEvents = useMemo(() => {
        return events.filter(e => {
          const eTime = new Date(e.time);
          // Allow events up to 5 minutes in the future to account for clock skew/manual entry speed
          const bufferNow = addMinutes(effectiveNow, 5);
          return isBefore(eTime, bufferNow);
        });
      }, [events, effectiveNow]);

      const lastDeath = useMemo(() => {
        if (isSimulationActive && isVirtualDeathEnabled) {
          const vDt = `${virtualDeathDate}T${virtualDeathTime}`;
          return { time: vDt, location: simulationLocation, addedBy: 'Simulation' };
        }
        const deathsOnly = effectiveEvents.filter(e => e.type === 'death');
        if (deathsOnly.length === 0) return null;
        return { 
            time: deathsOnly[0].time, 
            location: deathsOnly[0].location,
            addedBy: deathsOnly[0].addedBy 
        };
      }, [isSimulationActive, isVirtualDeathEnabled, virtualDeathDate, virtualDeathTime, simulationLocation, effectiveEvents]);

      const lastMaintenance = useMemo(() => {
        const maints = effectiveEvents.filter(e => e.type === 'maintenance');
        return maints.length > 0 ? maints[0] : null;
      }, [effectiveEvents]);
    
      const currentUptimeDays = useMemo(() => {
        if (!lastMaintenance) return 0;
        return differenceInDays(effectiveNow, new Date(lastMaintenance.maintEnd!));
      }, [lastMaintenance, effectiveNow]);
    
      const getEventUptimeDays = useCallback((eventTimeStr: string) => {
        const eventTime = new Date(eventTimeStr);
        const precedingMaint = effectiveEvents.find(m => m.type === 'maintenance' && new Date(m.time) < eventTime);
        return precedingMaint ? differenceInDays(eventTime, new Date(precedingMaint.time)) : 999;
      }, [effectiveEvents]);
    
      const uptimeFilteredEvents = useMemo(() => {
        if (!lastMaintenance) return effectiveEvents;
        return effectiveEvents.filter(e => {
          const eUptime = getEventUptimeDays(e.time);
          return Math.abs(eUptime - currentUptimeDays) <= 2;
        });
      }, [effectiveEvents, lastMaintenance, currentUptimeDays, getEventUptimeDays]);
    
      const cleanUptimeEvents = useMemo(() => {
        return uptimeFilteredEvents.filter(ev => !isLazyEntry(ev));
      }, [uptimeFilteredEvents]);
    
      const predictionEvents = useMemo(() => {
        return cleanUptimeEvents.filter(ev => {
          const deathHasZeroSec = ev.time.endsWith(':00');
          const respawnHasZeroSec = ev.respawn?.time ? ev.respawn.time.endsWith(':00') : false;
          return !deathHasZeroSec && !respawnHasZeroSec;
        });
      }, [cleanUptimeEvents]);
    
      const driftFactor = useMemo(() => {
        if (!lastMaintenance) return "unknown";
        if (currentUptimeDays <= 2) return "low";
        if (currentUptimeDays >= 7) return "high";
        return "medium";
      }, [lastMaintenance, currentUptimeDays]);
    
      const calibratedOffsetsMap = useMemo(() => {
        const results: Record<string, { totalCd: number, count: number, avgCd: number }> = {};
        MASTER_CD_OFFSETS.forEach(offset => {
          results[offset.label] = { totalCd: 0, count: 0, avgCd: offset.cd };
        });
    
        predictionEvents.forEach(ev => {
          if (ev.type === 'death' && ev.respawn && !ev.respawn.isUnknown && ev.respawn.time) {
            const deathDt = new Date(ev.time);
            const ipv = addMinutes(addHours(deathDt, 6), 5);
            const ipvHour = ipv.getHours();
            const offsetDef = MASTER_CD_OFFSETS.find(o => ipvHour >= o.range[0] && ipvHour < o.range[1]);
            if (offsetDef) {
              const respDate = ev.respawn!.date || format(deathDt, "yyyy-MM-dd");
              const actualResp = new Date(`${respDate}T${ev.respawn!.time}`);
              if (isValid(actualResp)) {
                const actualDiff = differenceInMinutes(actualResp, ipv);
                if (actualDiff >= -30 && actualDiff <= 180) {
                  results[offsetDef.label].totalCd += actualDiff;
                  results[offsetDef.label].count += 1;
                }
              }
            }
          }
        });
    
        Object.keys(results).forEach(key => {
          if (results[key].count > 0) results[key].avgCd = Math.round(results[key].totalCd / results[key].count);
        });
        return results;
      }, [cleanUptimeEvents]);

      // --- ACTIVITY WEIGHT ANALYSIS (Day/Night) ---
      const activityAnalysis = useMemo(() => {
        // Night: 00:00 - 09:00 (Less load, usually faster)
        // Day: 09:00 - 00:00 (High load, standard or slower)
        const isNight = (h: number) => h >= 0 && h < 9;

        const calculateAvgOffset = (filteredEvents: ArchiveEntry[]) => {
            let total = 0;
            let count = 0;
            filteredEvents.forEach(ev => {
                if (!ev.respawn?.time || ev.respawn.isUnknown || !ev.respawn.date) return;
                const deathDt = new Date(ev.time);
                const ipv = addMinutes(addHours(deathDt, 6), 5);
                const respTime = new Date(`${ev.respawn.date}T${ev.respawn.time}`);
                if (isValid(respTime)) {
                    const diff = differenceInMinutes(respTime, ipv);
                    if (diff >= -30 && diff <= 120) { // Filter extreme outliers
                        total += diff;
                        count++;
                    }
                }
            });
            return count > 0 ? Math.round(total / count) : null;
        };

        const nightEvents = predictionEvents.filter(e => e.respawn?.time && isNight(new Date(`${e.respawn.date}T${e.respawn.time}`).getHours()));
        const dayEvents = predictionEvents.filter(e => e.respawn?.time && !isNight(new Date(`${e.respawn.date}T${e.respawn.time}`).getHours()));

        return {
            nightAvg: calculateAvgOffset(nightEvents),
            dayAvg: calculateAvgOffset(dayEvents),
            nightCount: nightEvents.length,
            dayCount: dayEvents.length
        };
      }, [cleanUptimeEvents]);
    
      const masterTableData = useMemo(() => {
        if (!lastDeath) return null;
        const dt = new Date(lastDeath.time);
        const ipv = addSeconds(addMinutes(addHours(dt, 6), 5), 0);
        const ipvHour = ipv.getHours();
        const baseOffset = MASTER_CD_OFFSETS.find(o => ipvHour >= o.range[0] && ipvHour < o.range[1]);
        if (!baseOffset) return null;
        
        const calibration = calibratedOffsetsMap[baseOffset.label];

        // --- ACTIVITY CORRECTION ---
        // Determine if the PREDICTED spawn is Night or Day
        const isNextNight = ipvHour >= 0 && ipvHour < 9;
        
        let usedCd = baseOffset.cd;
        let isCalibrated = false;
        let activityLabel = "Стандарт";
        let activityColor = "text-slate-500";

        // Priority 1: Activity Weight (if statistically significant > 2 samples)
        if (isNextNight && activityAnalysis.nightAvg !== null && activityAnalysis.nightCount > 2) {
            usedCd = activityAnalysis.nightAvg;
            isCalibrated = true;
            activityLabel = `Ночь (Быстро)`;
            activityColor = "text-indigo-400";
        } else if (!isNextNight && activityAnalysis.dayAvg !== null && activityAnalysis.dayCount > 2) {
            usedCd = activityAnalysis.dayAvg;
            isCalibrated = true;
            activityLabel = `День (Нагрузка)`;
            activityColor = "text-amber-400";
        } 
        // Priority 2: Standard Bucket Calibration
        else if (calibration.count > 0) {
            usedCd = calibration.avgCd;
            isCalibrated = true;
            activityLabel = "История слота";
            activityColor = "text-rose-400";
        }
        
        return { 
            ipv, 
            activeOffset: baseOffset, 
            predictedAppearance: addMinutes(ipv, usedCd), 
            isCalibrated, 
            calibratedCd: usedCd, 
            samples: calibration.count,
            activityLabel,
            activityColor
        };
      }, [lastDeath, calibratedOffsetsMap, activityAnalysis]);
    
      const tableAccuracy = useMemo(() => {
        const totalSlots = MASTER_CD_OFFSETS.length;
        const values = Object.values(calibratedOffsetsMap) as { count: number }[];
        const slotsWithData = values.filter(v => v.count > 0).length;
        return {
          percent: totalSlots > 0 ? Math.round((slotsWithData / totalSlots) * 100) : 0
        };
      }, [calibratedOffsetsMap]);
    
      const schedule = useMemo((): ScheduleData | null => {
        if (!lastDeath) return null;
        try {
          const dt = new Date(lastDeath.time);
          const nkd = addMinutes(addHours(dt, 6), 5); // 6 hours 5 minutes base
          
          const vtp1Min = dt.getHours() + dt.getMinutes() + dt.getSeconds();
          const vtp2Min = dt.getMinutes() * 2;
          const vtp6OffsetSeconds = ((vtp1Min + vtp2Min) / 2) * 60;
          const vtp6OffsetSecondsFinal = vtp6OffsetSeconds > 0 ? vtp6OffsetSeconds : 0;
          const vtp5OffsetSeconds = vtp6OffsetSecondsFinal - (dt.getMinutes() * 60);
          
          const vtp5 = addSeconds(nkd, vtp5OffsetSeconds);
          const vtp6 = addSeconds(nkd, vtp6OffsetSecondsFinal);
          
          let currentOffset = 0;
          
          // Use standard rotation without calibration shift for the main schedule
          const slots = ROTATION_DATA.map((item, idx) => {
            const start = addMinutes(nkd, currentOffset);
            const end = addMinutes(nkd, currentOffset + item.duration);
            currentOffset += item.duration;
            const hasVtp5 = vtp5 >= start && vtp5 < end;
            const hasVtp6 = vtp6 >= start && vtp6 < end;
            const isVtpWindow = (start < vtp6 && end > vtp5);
            return { ...item, label: (idx + 1).toString(), start, end, hasVtp5, hasVtp6, isVtpWindow };
          });

          return { nkd, vtp5, vtp6, slots };
        } catch (e) { return null; }
      }, [lastDeath]);
    
      const transitionsMatrix = useMemo(() => {
        const matrix: Record<string, Record<string, number>> = {};
        const sorted = [...effectiveEvents]
          .filter(e => e.type === 'death' && e.respawn && !e.respawn.isUnknown && e.respawn.location)
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        for (const ev of sorted) {
          const cur = ev.location;
          const nxt = ev.respawn!.location!;
          if (!matrix[cur]) matrix[cur] = {};
          matrix[cur][nxt] = (matrix[cur][nxt] || 0) + 1;
        }
        return matrix;
      }, [effectiveEvents]);
    
      const advancedAnalytics = useMemo(() => {
        if (!effectiveEvents.length || !lastDeath) return null;
        const filteredDeaths = predictionEvents.filter(e => e.type === 'death' && e.respawn && !e.respawn.isUnknown);
        const reliability = filteredDeaths.length === 0 ? 0 : Math.min(100, Math.round((filteredDeaths.length / 10) * 100));
        const lastLoc = lastDeath.location;
        const candidates = LOCATIONS.filter(l => l !== lastLoc).map(loc => {
          const transitions = transitionsMatrix[lastLoc]?.[loc] || 0;
          const totalOccurrences = predictionEvents.filter(e => e.location === loc).length;
          return { loc, weight: (transitions * 5) + totalOccurrences, count: transitions };
        });
        const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
        const topCandidates = candidates.map(c => ({ loc: c.loc, probability: totalWeight > 0 ? Math.round((c.weight / totalWeight) * 100) : 0, count: c.count }))
          .sort((a, b) => b.probability - a.probability).slice(0, 4);
        return { reliability, topCandidates };
      }, [effectiveEvents, cleanUptimeEvents, lastDeath, transitionsMatrix]);
    
      const chainAnalytics = useMemo(() => {
        if (!lastDeath) return null;
        const dt = new Date(lastDeath.time);
        const usedCd = masterTableData?.calibratedCd ?? 60;
        return [1, 2, 3, 4].map(i => {
          const baseNkd = addMinutes(addHours(dt, 6 * i), 5 * i);
          const tres = addMinutes(baseNkd, usedCd); 
          return { label: `${i}-я цепочка`, from: format(addMinutes(tres, -20), "HH:mm"), tres: format(tres, "HH:mm"), to: format(addMinutes(tres, 20), "HH:mm") };
        });
      }, [lastDeath, masterTableData]);
    
      const vtpAnalysis = useMemo(() => {
        if (!schedule || !lastDeath) return [];

        // Fix: Use Base IPV for VTP calculation, NOT the calibrated NKD.
        // If masterTableData is available, use its IPV. Otherwise calculate from lastDeath.
        const baseIpv = masterTableData?.ipv || addSeconds(addMinutes(addHours(new Date(lastDeath.time), 6), 5), 0);

        return VTP_OFFSETS.map(offsetMin => {
          const targetTime = addMinutes(baseIpv, offsetMin);
          const activeSlotIndex = schedule.slots.findIndex(s => targetTime >= s.start && targetTime < s.end);
          const activeSlot = activeSlotIndex !== -1 ? schedule.slots[activeSlotIndex] : null;
          const rotationLocs = activeSlot ? activeSlot.locations : [];
          const archiveMatches = predictionEvents.filter(ev => {
            if (ev.type !== 'death' || !ev.respawn || ev.respawn.isUnknown || !ev.respawn.time) return false;
            const deathDt = new Date(ev.time);
            const evNkd = addMinutes(addHours(deathDt, 6), 5);
            const respDate = ev.respawn.date || format(deathDt, "yyyy-MM-dd");
            const actualResp = new Date(`${respDate}T${ev.respawn.time}`);
            if (!isValid(actualResp)) return false;
            const diffMin = differenceInSeconds(actualResp, evNkd) / 60;
            return Math.abs(diffMin - offsetMin) <= (ev.respawn.isTimeApproximate ? 15 : 5);
          });
          const scores: Record<string, number> = {};
          rotationLocs.forEach(loc => { if (loc !== lastDeath.location) scores[loc] = (scores[loc] || 0) + 15; });
          archiveMatches.forEach(match => {
            const loc = match.respawn?.location;
            if (loc && loc !== lastDeath.location) scores[loc] = (scores[loc] || 0) + (match.respawn?.isTimeApproximate ? 30 : 100); 
          });
          const sortedPredictions = Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([loc]) => loc);
          return { offset: offsetMin, time: targetTime, prediction: sortedPredictions[0] || (rotationLocs.find(l => l !== lastDeath.location) || "Неизвестно"), historyWeight: archiveMatches.length };
        });
      }, [schedule, cleanUptimeEvents, lastDeath, masterTableData]);

      const frankResData = useMemo(() => {
        if (!lastDeath || !schedule) return null;
        
        // --- 2. ALGORITHMIC IMPROVEMENTS ---
        
        // Data Preparation
        const deaths = effectiveEvents
            .filter(e => e.type === 'death')
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
            
        // Identify Penultimate Death for Chain Analysis
        const penultimateDeath = deaths.length > 1 ? deaths[1] : null;
    
        // Filter useful history
        const history = predictionEvents.filter(e => 
            e.type === 'death' && 
            e.respawn && 
            !e.respawn.isUnknown
        );
    
        // Voting System
        const locScores: Record<string, number> = {};
        let totalWeight = 0;
    
        // Recency Decay Function (weight halves every ~30 days)
        const getRecencyWeight = (dateStr: string): number => {
            const days = differenceInDays(effectiveNow, new Date(dateStr));
            return Math.max(0.2, 1 - (days * 0.02)); 
        };
    
        history.forEach((ev, idx) => {
            // Markov Chain Order 1: Current -> Next
            if (ev.location === lastDeath.location && ev.respawn?.location) {
                let weight = getRecencyWeight(ev.time);
    
                // Markov Chain Order 2: Prev -> Current -> Next
                const prevEv = history[idx + 1];
                if (penultimateDeath && prevEv && prevEv.location === penultimateDeath.location) {
                    // Chain match found! Boost weight significantly.
                    weight *= 2.5; 
                }
    
                const target = ev.respawn.location;
                const currentScore = locScores[target] || 0;
                locScores[target] = currentScore + weight;
                totalWeight += weight;
            }
        });

        // --- HYBRID PREDICTION (Point 1) ---
        // Add Cycle Map Weight
        const cycleLoc = CYCLE_MAP[lastDeath.location];
        if (cycleLoc) {
            locScores[cycleLoc] = (locScores[cycleLoc] || 0) + 2.0;
            totalWeight += 2.0;
        }

        // Add VTP Analysis Weight
        vtpAnalysis.forEach(vtp => {
            if (vtp.prediction && vtp.prediction !== "Неизвестно") {
                const weight = 0.5 + (vtp.historyWeight * 0.2);
                locScores[vtp.prediction] = (locScores[vtp.prediction] || 0) + weight;
                totalWeight += weight;
            }
        });
    
        // Fallback to Rotation if no history
        if (totalWeight === 0) {
            const nextRot = CYCLE_MAP[lastDeath.location];
            locScores[nextRot] = 1;
            totalWeight = 1;
        }
    
        const candidates = Object.entries(locScores)
            .map(([loc, w]) => ({ loc, prob: Math.round((w / totalWeight) * 100) }))
            .sort((a, b) => b.prob - a.prob);
    
        const topPrediction = candidates[0];
        const rotationPrediction = CYCLE_MAP[lastDeath.location];
        
        // --- 3. FUNCTIONAL ADDITIONS (Comparison) ---
        const isJackpot = topPrediction && topPrediction.loc === rotationPrediction;
    
        // Time Analysis (Magnetic Points)
        const offsetWeights: Record<number, number> = {};
        
        // Context-aware filtering: Location + Time of Day (Day/Night)
        const currentNkd = addMinutes(addHours(new Date(lastDeath.time), 6), 5);
        const currentIsNight = currentNkd.getHours() >= 0 && currentNkd.getHours() < 9;
        
        const contextHistory = history.filter(ev => {
            const evNkd = addMinutes(addHours(new Date(ev.time), 6), 5);
            const evIsNight = evNkd.getHours() >= 0 && evNkd.getHours() < 9;
            return ev.location === lastDeath.location && evIsNight === currentIsNight;
        });
        
        const locHistory = history.filter(ev => ev.location === lastDeath.location);
        // Fallback: Exact Context -> Location Only -> All History
        const historyToUse = contextHistory.length >= 3 ? contextHistory : (locHistory.length >= 3 ? locHistory : history);

        historyToUse.forEach(ev => {
            if (!ev.respawn?.time || ev.respawn.isTimeApproximate) return;
            const deathDt = new Date(ev.time);
            const nkd = addMinutes(addHours(deathDt, 6), 5);
            const respDate = ev.respawn.date || format(deathDt, "yyyy-MM-dd");
            const actual = new Date(`${respDate}T${ev.respawn.time}`);
            if (!isValid(actual)) return;
            
            const diff = differenceInMinutes(actual, nkd);
            const w = getRecencyWeight(ev.time);
            
            const currentOffsetWeight = offsetWeights[diff] || 0;
            offsetWeights[diff] = currentOffsetWeight + w;
        });
    
        // --- SMART CLUSTERING (Point 4) ---
        const clusters: Record<number, { totalWeight: number, peakOffset: number, peakWeight: number }> = {};
        const CLUSTER_SIZE = 5;

        Object.entries(offsetWeights).forEach(([offStr, w]) => {
            const off = parseInt(offStr);
            const clusterId = Math.floor(off / CLUSTER_SIZE);
            if (!clusters[clusterId]) {
                clusters[clusterId] = { totalWeight: 0, peakOffset: off, peakWeight: w };
            }
            clusters[clusterId].totalWeight += w;
            if (w > clusters[clusterId].peakWeight) {
                clusters[clusterId].peakWeight = w;
                clusters[clusterId].peakOffset = off;
            }
        });

        const totalMagneticWeight = Object.values(clusters).reduce((sum, c) => sum + c.totalWeight, 0);

        const magneticPoints = Object.values(clusters)
            .map(c => ({ 
                offset: c.peakOffset, 
                weight: totalMagneticWeight > 0 ? Math.round((c.totalWeight / totalMagneticWeight) * 100) : 0 
            }))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 5);
    
        return { 
            topLoc: topPrediction ? topPrediction.loc : "Unknown", 
            confidence: topPrediction ? topPrediction.prob : 0,
            driftStatus: driftFactor === 'low' ? 'Стабильный' : driftFactor === 'high' ? 'Нестабильный' : 'Норма',
            magneticPoints,
            isJackpot,
            candidates
        };
      }, [cleanUptimeEvents, lastDeath, schedule, driftFactor, effectiveNow, effectiveEvents, vtpAnalysis]);
    
      const currentStatus = useMemo(() => {
        if (!schedule) return { state: 'no_data', text: 'ОФФЛАЙН', label: 'СТАТУС ПОИСКА' };
        const { nkd, slots } = schedule;
        const windowEnd = slots[slots.length - 1].end;
        
        // Fix: Determine start of search window from slots, not NKD (which might include drift/prediction)
        // This ensures that if the prediction (NKD) is later than the actual start of the first slot,
        // we still switch to 'Active' state as soon as the first location opens.
        const searchStart = slots.length > 0 ? slots[0].start : nkd;

        if (effectiveNow < searchStart) {
          const diff = differenceInSeconds(nkd, effectiveNow);
          const absDiff = Math.abs(diff);
          const hh = Math.floor(absDiff / 3600), mm = Math.floor((absDiff % 3600) / 60), ss = absDiff % 60;
          return { state: 'waiting', text: `${diff < 0 ? '-' : ''}${hh}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`, label: 'ДО РЕСПАУНА' };
        } else if (effectiveNow < windowEnd) {
          const activeSlot = slots.find(s => effectiveNow >= s.start && effectiveNow < s.end);
          return { state: 'searching', text: 'АКТИВЕН', label: 'АКТИВНЫЕ ЛОКАЦИИ', locations: activeSlot?.locations || [] };
        } else return { state: 'closed', text: 'ОКНО ЗАКРЫТО', label: 'СТАТУС ПОИСКА' };
      }, [schedule, effectiveNow]);

      return {
          effectiveNow,
          effectiveEvents,
          lastDeath,
          lastMaintenance,
          schedule,
          currentStatus,
          frankResData,
          vtpAnalysis,
          masterTableData,
          tableAccuracy,
          calibratedOffsetsMap,
          advancedAnalytics,
          chainAnalytics,
          cleanUptimeEvents,
          transitionsMatrix
      };
}
