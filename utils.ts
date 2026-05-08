import { format, differenceInSeconds, isValid } from 'date-fns';
import { ArchiveEntry } from './types';

export const getMoscowTime = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 3));
};

export const isLazyEntry = (ev: ArchiveEntry): boolean => {
  if (ev.type !== 'death' || !ev.respawn || !ev.respawn.time) return false;
  // Не зачеркивать, если неизвестно (выделяем желтым вместо страйка)
  if (ev.respawn.isUnknown) return false;
  const deathDt = new Date(ev.time);
  const respDate = ev.respawn.date || format(deathDt, "yyyy-MM-dd");
  const respDt = new Date(`${respDate}T${ev.respawn.time}`);
  if (!isValid(respDt)) return false;
  return differenceInSeconds(respDt, deathDt) === 21600;
};