import { useMemo } from 'react';
import { addMinutes, addHours, differenceInMinutes, isValid, format } from 'date-fns';
import { ArchiveEntry, ScheduleData } from '../types';

export type ZoneKey = 'early' | 'mid' | 'late';

export interface ZoneLoc {
  loc: string;
  prob: number;
}

export interface RespawnZoneModel {
  ready: boolean;
  sampleCount: number;
  currentDelayMin: number | null;
  currentZone: ZoneKey | null;
  currentTopLocations: ZoneLoc[];
  topCandidateTimes: { delay: number; time: Date; probability: number }[];
  slotProbabilities: number[];
  slotZoneProbs: Record<number, Record<string, number>>;
}

const BASELINE = 365;
const WINDOW = 115;
const KD = 5;
const MIN_HOUR = 6;

const zoneOf = (delayMin: number): ZoneKey => (delayMin < 45 ? 'early' : delayMin < 85 ? 'mid' : 'late');

const density = (values: number[]): number[] => {
  const prof = new Array(WINDOW + 1).fill(0);
  values.forEach(v => {
    for (let g = 0; g <= WINDOW; g++) {
      prof[g] += Math.exp(-0.5 * Math.pow((g - v) / KD, 2));
    }
  });
  const total = prof.reduce((a, b) => a + b, 0) || 1;
  return prof.map(x => x / total);
};

export const useRespawnZoneModel = (
  events: ArchiveEntry[],
  effectiveNow: Date,
  lastDeath: { time: string; location: string } | null,
  schedule: ScheduleData | null
): RespawnZoneModel => {
  return useMemo(() => {
    const empty: RespawnZoneModel = {
      ready: false,
      sampleCount: 0,
      currentDelayMin: null,
      currentZone: null,
      currentTopLocations: [],
      topCandidateTimes: [],
      slotProbabilities: schedule ? schedule.slots.map(() => 0) : [],
      slotZoneProbs: {}
    };

    if (!lastDeath) return empty;

    const samples = events
      .filter(e => e.type === 'death')
      .map(e => {
        const r = e.respawn;
        if (!r || r.isUnknown || !r.time || !r.location) return null;
        const deathDt = new Date(e.time);
        if (!isValid(deathDt)) return null;
        const ipv = addMinutes(addHours(deathDt, 6), 5);
        const respDate = r.date || format(deathDt, "yyyy-MM-dd");
        const respDt = new Date(`${respDate}T${r.time}`);
        if (!isValid(respDt)) return null;
        const delay = differenceInMinutes(respDt, ipv);
        if (delay < 0 || delay > WINDOW) return null;
        return { delay, rloc: r.location, hour: ipv.getHours() };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    const zoneCounts: Record<ZoneKey, Record<string, number>> = { early: {}, mid: {}, late: {} };
    samples.forEach(s => {
      const z = zoneOf(s.delay);
      zoneCounts[z][s.rloc] = (zoneCounts[z][s.rloc] || 0) + 1;
    });

    const rankedZoneLocations = (zone: ZoneKey, excludeLoc: string): ZoneLoc[] => {
      const counts = zoneCounts[zone];
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (total === 0) return [];
      return Object.entries(counts)
        .filter(([l]) => l !== excludeLoc)
        .map(([loc, c]) => ({ loc, prob: Math.round((c / total) * 100) }))
        .sort((a, b) => b.prob - a.prob || a.loc.localeCompare(b.loc));
    };

    const globalDens = density(samples.map(s => s.delay));
    const hourCounts: Record<number, number> = {};
    samples.forEach(s => { hourCounts[s.hour] = (hourCounts[s.hour] || 0) + 1; });
    const hourDens: Record<number, number[]> = {};
    samples.forEach(s => { if ((hourCounts[s.hour] || 0) >= MIN_HOUR && !hourDens[s.hour]) { hourDens[s.hour] = density(samples.filter(x => x.hour === s.hour).map(x => x.delay)); } });

    const lastDt = new Date(lastDeath.time);
    const nkd = isValid(lastDt) ? addMinutes(addHours(lastDt, 6), 5) : null;
    const lastHour = nkd ? nkd.getHours() : null;

    const blended = (hour: number | null): number[] => {
      if (hour !== null && hourDens[hour]) {
        return hourDens[hour].map((v, i) => v * 0.7 + globalDens[i] * 0.3);
      }
      return globalDens;
    };

    const activeDens = blended(lastHour);

    const totalMass = activeDens.reduce((a, b) => a + b, 0) || 1;

    const topCandidateTimes = ((): { delay: number; time: Date; probability: number }[] => {
      if (!nkd) return [];
      const rankedDelays = Array.from({ length: WINDOW + 1 }, (_, i) => i).sort((a, b) => activeDens[b] - activeDens[a]);
      const picked: number[] = [];
      for (const d of rankedDelays) {
        if (picked.some(p => Math.abs(p - d) <= 5)) continue;
        picked.push(d);
        if (picked.length >= 5) break;
      }
      return picked.map(d => ({ delay: d, time: addMinutes(nkd, d), probability: Math.round((activeDens[d] / totalMass) * 1000) / 10 }));
    })();

    const slotProbabilities = schedule ? schedule.slots.map(slot => {
      if (!nkd) return 0;
      const lo = Math.max(0, Math.min(WINDOW, differenceInMinutes(slot.start, nkd)));
      const hi = Math.max(0, Math.min(WINDOW, differenceInMinutes(slot.end, nkd)));
      if (hi <= lo) return 0;
      let mass = 0;
      for (let g = lo; g < hi; g++) mass += activeDens[g];
      return Math.round((mass / totalMass) * 100);
    }) : [];

    const slotZoneProbs: Record<number, Record<string, number>> = {};
    if (schedule && nkd) {
      schedule.slots.forEach((slot, i) => {
        const lo = differenceInMinutes(slot.start, nkd);
        const hi = differenceInMinutes(slot.end, nkd);
        const mid = Math.max(0, Math.min(WINDOW, (lo + hi) / 2));
        const zone = zoneOf(mid);
        const ranked = rankedZoneLocations(zone, lastDeath.location);
        const map: Record<string, number> = {};
        ranked.forEach(r => { map[r.loc] = r.prob; });
        slotZoneProbs[i] = map;
      });
    }

    const currentDelayMin = nkd ? Math.round(differenceInMinutes(effectiveNow, nkd)) : null;
    let currentZone: ZoneKey | null = null;
    if (currentDelayMin !== null && currentDelayMin >= 0 && currentDelayMin <= WINDOW) {
      currentZone = zoneOf(currentDelayMin);
    }
    const currentTopLocations = currentZone ? rankedZoneLocations(currentZone, lastDeath.location).slice(0, 4) : [];

    return {
      ready: samples.length >= 6,
      sampleCount: samples.length,
      currentDelayMin,
      currentZone,
      currentTopLocations,
      topCandidateTimes,
      slotProbabilities,
      slotZoneProbs
    };
  }, [events, effectiveNow, lastDeath, schedule]);
};