"""
Модель прогноза респауна Зибо (±5 мин) — профиль вероятности с hazard-условием.

Задержка после death+6:05 (0..115 мин) многовершинна, поэтому выдаём не точку,
а ранжированные по вероятности слоты, обновляемые вживую:
  вероятность слота СЕЙЧАС = P(слот) / P(задержка >= прошло), т.е. "если ещё не видели".

CLI:
  python3 scripts/model_predict.py --death "2026-04-20 09:37" --loc "Морозная длань"
  python3 scripts/model_predict.py --backtest
"""
import json
import datetime as dt
import math
import argparse

HIST = json.load(open("data/history.json"))
BASELINE = 365
WINDOW = (0, 115)
SLOT = 10
KERNEL_SIGMA = 5.0
TRAIN_LO, TRAIN_HI = -30, 165

def parse_dt(s):
    if not s:
        return None
    for fmt in ("%Y-%m-%dT%H:%M", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S"):
        try:
            return dt.datetime.strptime(s, fmt)
        except ValueError:
            continue
    return None

def round_bad(ts):
    return ts.second in (0, None) and ts.minute % 5 == 0

def load_pairs():
    pairs, now = [], dt.datetime.now()
    for e in HIST:
        if e.get("type") != "death":
            continue
        dd = parse_dt(e.get("time"))
        r = e.get("respawn") or {}
        if dd is None or not r or not r.get("date") or not r.get("time") or r.get("isUnknown"):
            continue
        try:
            rd = dt.datetime.strptime(f"{r['date']}T{r['time']}", "%Y-%m-%dT%H:%M:%S")
        except ValueError:
            rd = dt.datetime.strptime(f"{r['date']}T{r['time']}", "%Y-%m-%dT%H:%M")
        delay = (rd - dd).total_seconds() / 60.0 - BASELINE
        ipv = dd + dt.timedelta(minutes=BASELINE)
        q = 1.0
        if r.get("isTimeApproximate") or round_bad(rd):
            q *= 0.4
        if round_bad(dd):
            q *= 0.7
        q *= 0.5 ** (((now - dd).total_seconds() / 86400.0) / 90.0)
        pairs.append({"death": dd, "ipv": ipv, "delay": delay, "q": q,
                      "death_loc": e.get("location"), "resp_loc": r.get("location"),
                      "ipv_hour": ipv.hour})
    return pairs

def gauss(x):
    return math.exp(-0.5 * (x / KERNEL_SIGMA) ** 2)

def build_profile(delays, weights):
    """Нормализованная плотность по минутам 0..115."""
    grid = list(range(WINDOW[0], WINDOW[1] + 1))
    z = sum(weights)
    out = []
    for g in grid:
        out.append(sum(w * gauss(g - d) for d, w in zip(delays, weights)))
    s = sum(out) or 1.0
    return {g: v / s for g, v in zip(grid, out)}

class Predictor:
    def __init__(self, pairs):
        self.pairs = pairs
        self.valid = [p for p in pairs if TRAIN_LO <= p["delay"] <= TRAIN_HI]
        self.profile = build_profile([p["delay"] for p in self.valid], [p["q"] for p in self.valid])
        self.by_hour = {}
        for p in self.valid:
            self.by_hour.setdefault(p["ipv_hour"], []).append(p)
        self.hour_prof = {}
        for h, ps in self.by_hour.items():
            n = len(ps)
            if n < 4:
                continue
            pr = build_profile([p["delay"] for p in ps], [p["q"] for p in ps])
            # модуль правдоподобия часа, блендаем с глобальной (0..1)
            mod = {g: pr[g] / (self.profile[g] + 1e-9) for g in pr}
            mx = max(mod.values()) or 1.0
            mod = {g: v / mx for g, v in mod.items()}
            self.hour_prof[h] = {g: (pr[g] ** 0.7) * (mod[g] ** 0.3) for g in pr}
            s = sum(self.hour_prof[h].values()) or 1.0
            self.hour_prof[h] = {g: v / s for g, v in self.hour_prof[h].items()}
        self.trans = {}
        for p in pairs:
            a, b = p["death_loc"], p["resp_loc"]
            if a and b:
                self.trans.setdefault(a, {}).setdefault(b, 0)
                self.trans[a][b] += 1
        self.zone_locs = {"early": {}, "mid": {}, "late": {}}
        for p in pairs:
            d, rl = p["delay"], p["resp_loc"]
            if not rl or not (WINDOW[0] <= d <= WINDOW[1]):
                continue
            z = "early" if d < 45 else ("mid" if d < 85 else "late")
            self.zone_locs[z][rl] = self.zone_locs[z].get(rl, 0) + 1

    def dist(self, hour):
        return self.hour_prof.get(hour, self.profile)

    def zone_ranked(self, zone, last_loc, top=4):
        counts = self.zone_locs.get(zone, {})
        total = sum(counts.values()) or 1.0
        items = sorted((((c / total), l) for l, c in counts.items() if l != last_loc), reverse=True)
        return [{"loc": l, "prob": round(p * 100)} for p, l in items[:top]]

    def zone_for_delay(self, elapsed):
        if elapsed < 45:
            return "early"
        if elapsed < 85:
            return "mid"
        return "late"

    def predict_location_zone(self, last_loc, elapsed):
        z = self.zone_for_delay(max(elapsed, 0))
        ranked = self.zone_ranked(z, last_loc)
        if not ranked:
            return {"zone": z, "locations": [{"loc": l, "prob": None} for l in self.predict_location_best(last_loc)]}
        return {"zone": z, "locations": ranked}

    def live(self, death_dt, loc=None, elapsed=None, top=3):
        """loc — последняя локация смерти (для прогноза следующей)."""
        ipv = death_dt + dt.timedelta(minutes=BASELINE)
        if elapsed is None:
            elapsed = int((dt.datetime.now() - ipv).total_seconds() / 60.0)
        prof = self.dist(ipv.hour)
        cutoff = min(max(elapsed, 0), WINDOW[1])
        rem = sum(v for g, v in prof.items() if g >= cutoff) or 1.0
        slot_g = list(range(0, WINDOW[1] + 1, SLOT))
        slots = []
        for g0 in slot_g:
            cnt = sum(prof[g] for g in range(g0, min(g0 + SLOT, WINDOW[1] + 1)) if g >= cutoff)
            slots.append((g0, cnt / rem))
        slots = sorted(slots, key=lambda x: x[1], reverse=True)
        # топ-5-минутные точки внутри доступного хвоста
        cand = sorted((prof[g] / rem, g) for g in prof if g >= cutoff)
        cand = sorted(cand, reverse=True)
        best5 = []
        for p, g in cand:
            if any(abs(g - b) <= 5 for _, b in best5):
                continue
            p5 = sum(prof[gg] / rem for gg in range(max(0, g - 5), min(115, g + 5) + 1))
            best5.append((p5, g))
            if len(best5) >= 3:
                break
        return {
            "ipv": ipv.strftime("%Y-%m-%d %H:%M"),
            "elapsed_min_since_ipv": elapsed,
            "slots": [{"window": f"+{g0}..+{g0+SLOT-1}мин  ({ (ipv + dt.timedelta(minutes=g0)).strftime('%H:%M') }-{ (ipv + dt.timedelta(minutes=g0+SLOT-1)).strftime('%H:%M') })",
                       "prob": round(p, 3)} for g0, p in slots[:top]],
            "top_5min": [[(ipv + dt.timedelta(minutes=g)).strftime("%H:%M"), round(p, 3)] for p, g in best5],
            "locations": self.predict_location_best(loc or self.pairs_last_loc()),
            "location_zone": self.predict_location_zone(loc or self.pairs_last_loc(), elapsed),
        }

    def pairs_last_loc(self):
        loc = None
        for p in sorted(self.pairs, key=lambda x: x["death"]):
            if p["death_loc"]:
                loc = p["death_loc"]
        return loc

    def predict_location(self, last_loc, top=3):
        if not last_loc:
            return []
        cnt = self.trans.get(last_loc, {})
        all_locs = sorted({l for m in self.trans.values() for l in m})
        scores = []
        for l in all_locs:
            if l != last_loc:
                scores.append(((cnt.get(l, 0) + 0.5) / (sum(cnt.values()) + 0.5 * len(all_locs)), l))
        return sorted(scores, reverse=True)[:top]

    def predict_location_best(self, last_loc):
        return [l for _, l in self.predict_location(last_loc, top=4)]

def backtest():
    pairs = load_pairs()
    full = Predictor(pairs)
    tests = [p for p in pairs if WINDOW[0] - 5 <= p["delay"] <= WINDOW[1] + 5]
    print(f"\n=== BACKTEST LOO ({len(tests)} записей) — hazard-профиль ===")
    print("Оцениваем на срезах elapsed: b=0 (сразу), 1/3, 2/3 от истинной задержки")
    agg = { "b0_t3": 0, "b0_b5": 0, "m_t3": 0, "m_b5": 0, "l_t3": 0, "l_b5": 0, "n": 0 }
    for t in tests:
        other = [p for p in full.valid if p is not t]
        sub = Predictor.__new__(Predictor)
        sub.pairs, sub.valid = full.pairs, other
        sub.profile = build_profile([p["delay"] for p in other], [p["q"] for p in other])
        sub.by_hour = {}
        for p in other:
            sub.by_hour.setdefault(p["ipv_hour"], []).append(p)
        sub.hour_prof = {}
        for h, ps in sub.by_hour.items():
            if len(ps) < 4:
                continue
            pr = build_profile([p["delay"] for p in ps], [p["q"] for p in ps])
            mod = {g: pr[g] / (sub.profile[g] + 1e-9) for g in pr}
            mx = max(mod.values()) or 1.0
            mod = {g: v / mx for g, v in mod.items()}
            hp = {g: (pr[g] ** 0.7) * (mod[g] ** 0.3) for g in pr}
            s = sum(hp.values()) or 1.0
            sub.hour_prof[h] = {g: v / s for g, v in hp.items()}
        sub.trans = full.trans
        D = t["delay"]
        for tag, el in (("b0", 0), ("m", 0.33 * D), ("l", 0.66 * D)):
            if el > D:
                continue
            prof = sub.dist(t["ipv_hour"])
            cutoff = min(max(int(el), 0), WINDOW[1])
            rem = sum(v for g, v in prof.items() if g >= cutoff)
            if rem <= 0:
                continue
            slots = []
            for g0 in range(0, WINDOW[1] + 1, SLOT):
                c = sum(prof[g] for g in range(g0, min(g0 + SLOT, WINDOW[1] + 1)) if g >= cutoff)
                slots.append((g0, c / rem))
            slots.sort(key=lambda x: x[1], reverse=True)
            intop3 = any(g0 <= D < g0 + SLOT for g0, _ in slots[:3])
            cand = sorted(((prof[g] / rem, g) for g in prof if g >= cutoff), reverse=True)
            best = []
            for p, g in cand:
                if any(abs(g - b) <= 5 for _, b in best):
                    continue
                best.append((p, g))
                if len(best) >= 3:
                    break
            b5 = min(abs(g - D) for _, g in best) <= 5
            agg[f"{tag}_t3"] += 1 if intop3 else 0
            agg[f"{tag}_b5"] += 1 if b5 else 0
        agg["n"] += 1
    n = agg["n"]
    for tag, name in (("b0", "elapsed=0"), ("m", "elapsed=33%"), ("l", "elapsed=66%")):
        print(f"{name:>10}: топ-3 слота (30мин) в правде: {agg[tag+'_t3']}/{n} = {agg[tag+'_t3']/n*100:.0f}%   топ-3 точек ±5: {agg[tag+'_b5']}/{n} = {agg[tag+'_b5']/n*100:.0f}%")

def in_three(slots, D):
    return any(g0 <= D < g0 + SLOT for g0, _ in slots[:3])

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--death")
    ap.add_argument("--loc")
    ap.add_argument("--backtest", action="store_true")
    a = ap.parse_args()
    P = Predictor(load_pairs())
    if a.backtest:
        backtest()
    elif a.death:
        d = parse_dt(a.death)
        print(json.dumps(P.live(d, a.loc), ensure_ascii=False, indent=2))
    else:
        print(f"тренировочных пар: {len(P.valid)}")