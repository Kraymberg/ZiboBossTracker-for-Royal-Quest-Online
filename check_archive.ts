
import { INITIAL_CHAT_HISTORY, CYCLE_MAP } from './constants';
import { parseISO, isBefore, differenceInMinutes } from 'date-fns';

function checkDiscrepancies() {
  console.log('--- Checking INITIAL_CHAT_HISTORY for discrepancies ---');
  
  const history = [...INITIAL_CHAT_HISTORY].sort((a, b) => 
    parseISO(a.time).getTime() - parseISO(b.time).getTime()
  );

  const timeMap = new Map();
  const seenEntries = new Set<string>();
  const transitions = new Map<string, Map<string, number>>();
  let prevEntry: any = null;

  history.forEach((entry, index) => {
    const time = entry.time;
    
    // 0. Exact Duplicates
    const key = `${entry.time}-${entry.location}-${entry.respawn?.time}-${entry.respawn?.location}`;
    if (seenEntries.has(key)) {
      console.log(`[EXACT DUPLICATE] Entry ${index}: Identical to a previous entry (ID: ${entry.id})`);
    }
    seenEntries.add(key);

    // 1. Duplicate Timestamps
    if (timeMap.has(time)) {
      console.log(`[DUPLICATE TIME] Entry ${index}: ${time} (ID: ${entry.id}) matches previous entry`);
    }
    timeMap.set(time, true);

    // 2. Chronological Order (already sorted, but check for same-time entries)
    if (prevEntry && time === prevEntry.time) {
      console.log(`[SAME TIME] Entry ${index} and ${index-1} have identical time: ${time}`);
    }

    // 3. Rotation Mismatch (Death -> Respawn)
    if (entry.type === 'death' && entry.respawn && !entry.respawn.isUnknown) {
      const from = entry.location;
      const to = entry.respawn.location;
      
      if (!transitions.has(from)) transitions.set(from, new Map());
      const fromMap = transitions.get(from)!;
      const toStr = to || 'Unknown';
      fromMap.set(toStr, (fromMap.get(toStr) || 0) + 1);

      const expectedRespawnLoc = CYCLE_MAP[from];
      if (expectedRespawnLoc && to !== expectedRespawnLoc) {
        console.log(`[ROTATION MISMATCH] Entry ${index} (${entry.time}): Death at ${from} -> Respawn at ${to} (Expected: ${expectedRespawnLoc})`);
      }

      // 4. Impossible Respawn Time
      const deathTime = parseISO(entry.time);
      // Respawn time is just HH:mm:ss, we need to handle date wrap
      const respawnTimeStr = entry.respawn?.time || '00:00:00';
      const [rh, rm, rs] = respawnTimeStr.split(':').map(Number);
      let respawnTime = new Date(deathTime);
      respawnTime.setHours(rh, rm, rs || 0, 0);
      
      if (isBefore(respawnTime, deathTime)) {
        respawnTime.setDate(respawnTime.getDate() + 1);
      }

      const diff = differenceInMinutes(respawnTime, deathTime);
      if (isNaN(diff)) {
        console.log(`[NaN OFFSET] Entry ${index} (ID: ${entry.id}): Respawn ${entry.respawn.time} or Death ${entry.time} is invalid`);
      } else {
        if (diff < 0) {
          console.log(`[IMPOSSIBLE TIME] Entry ${index} (ID: ${entry.id}): Respawn ${entry.respawn.time} is before death ${entry.time}`);
        }
        if (diff > 1440) { // More than 24 hours
           console.log(`[LONG DURATION] Entry ${index} (ID: ${entry.id}): Respawn is ${diff} minutes after death`);
        }
      }
    }

    prevEntry = entry;
  });

  console.log('--- Check Complete ---');

  // 5. Offset Analysis
  console.log("\n--- Transition Analysis ---");
  transitions.forEach((toMap, from) => {
    console.log(`${from} ->`);
    toMap.forEach((count, to) => {
      console.log(`  ${to}: ${count}`);
    });
  });

  console.log("\n--- Offset Distribution ---");
  const offsets = history
    .filter(e => e.respawn && !e.respawn.isUnknown)
    .map(e => {
      const death = parseISO(e.time);
      const respTimeStr = e.respawn?.time || '00:00:00';
      const [h, m, s] = respTimeStr.split(':').map(Number);
      let respawn = new Date(death);
      respawn.setHours(h, m, s || 0, 0);
      if (isBefore(respawn, death)) respawn.setDate(respawn.getDate() + 1);
      const diff = differenceInMinutes(respawn, death) - 360;
      if (isNaN(diff)) {
         console.log(`DEBUG: NaN for ID ${e.id}`);
      }
      return diff;
    });

  const offsetCounts: Record<number, number> = {};
  offsets.forEach(o => offsetCounts[o] = (offsetCounts[o] || 0) + 1);
  Object.entries(offsetCounts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .forEach(([offset, count]) => {
      console.log(`Offset ${offset}: ${count} times`);
    });
}

checkDiscrepancies();
