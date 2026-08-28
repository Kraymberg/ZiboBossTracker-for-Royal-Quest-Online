import json
import collections
import datetime as dt
import math
import statistics

HIST = json.load(open("data/history.json"))
USERS = json.load(open("data/users.json"))

BASELINE = 365  # 6h05m in minutes

def parse_dt(s):
    if not s:
        return None
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M"):
        try:
            return dt.datetime.strptime(s, fmt)
        except ValueError:
            continue
    return None

def respawn_dt(e):
    r = e.get("respawn") or {}
    if not r.get("date") or not r.get("time"):
        return None
    try:
        return dt.datetime.strptime(f"{r['date']}T{r['time']}", "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        return None

def quality_bad(ts):
    """Круглое время (00/05/10...) -> вероятно оценка."""
    return (ts.minute % 5 == 0) and ts.second == 0

report = []
P = report.append

P("=" * 70)
P("EDA отчёт — Zibo Boss Tracker")
P(f"history={len(HIST)}, users={len(USERS)}, отчёт: {dt.datetime.now()}")
P("=" * 70)

P("\n[1] Типы записей")
for k, v in collections.Counter(e.get("type") for e in HIST).items():
    P(f"  {k}: {v}")

deaths = sorted([e for e in HIST if e.get("type") == "death" and parse_dt(e.get("time"))], key=lambda e: parse_dt(e["time"]))
maint = sorted([e for e in HIST if e.get("type") == "maintenance" and parse_dt(e.get("time"))], key=lambda e: parse_dt(e["time"]))
sights = sorted([e for e in HIST if e.get("type") == "sight" and parse_dt(e.get("time"))], key=lambda e: parse_dt(e["time"]))

# ---------- [2] Sequence of death locations: adjacent repeats? ----------
P("\n[2] Последовательность локаций смертей (подряд)")
seq = [e["location"] for e in deaths]
P(f"  deaths total={len(seq)}")
repeats = [(i, seq[i]) for i in range(1, len(seq)) if seq[i] == seq[i-1]]
P(f"  повтор подряд: {len(repeats)}")
if repeats:
    for i, loc in repeats[:10]:
        P(f"    {deaths[i]['time']} {loc} после {deaths[i-1]['time']}")
from collections import Counter
trans = Counter((seq[i-1], seq[i]) for i in range(1, len(seq)))
P("  переходы (из->в):")
for (a, b), c in trans.most_common():
    P(f"    {a} -> {b}: {c}")

# ---------- [3] Death -> respawn pairs ----------
P("\n[3] Пары смерть -> респаун")
pairs = []
for e in deaths:
    r = e.get("respawn")
    rd = respawn_dt(e)
    if not r or not rd:
        continue
    if r.get("isUnknown"):
        continue
    dd = parse_dt(e["time"])
    delay = (rd - dd).total_seconds() / 60.0
    ipv = dd + dt.timedelta(minutes=BASELINE)
    delay365 = (rd - ipv).total_seconds() / 60.0
    pairs.append({
        "id": e["id"], "death": dd, "respawn": rd,
        "death_loc": e.get("location"), "resp_loc": r.get("location"),
        "delay": delay, "delay365": delay365,
        "ipv_hour": ipv.hour,
        "death_hour": dd.hour,
        "death_approx": quality_bad(dd),
        "resp_approx": quality_bad(rd),
        "isApprox": bool(r.get("isTimeApproximate")),
        "author": e.get("addedBy"),
    })
P(f"  пар с известным респауном: {len(pairs)}")

d365 = [p["delay365"] for p in pairs]
P(f"  delay365 (респаун за вычетом смерти+6:05): min={min(d365):.1f} max={max(d365):.1f} (мин)")
P(f"  в окне 0..115: {sum(1 for x in d365 if 0 <= x <= 115)} / {len(d365)}")
outs = [(p["death"].isoformat(), round(p["delay365"], 1)) for p in pairs if not (0 <= p["delay365"] <= 115)]
P(f"  вне окна ({len(outs)}):")
for o in outs[:25]:
    P(f"    {o}")

P("\n  минутная часть времени респауна (детекшн-байес):")
mc = Counter(p["respawn"].minute for p in pairs)
for m in sorted(mc):
    bar = "#" * mc[m]
    P(f"    {m:02d}: {mc[m]:>3} {bar}")
P("\n  минутная часть времени смерти:")
mc = Counter(p["death"].minute for p in pairs)
for m in sorted(mc):
    bar = "#" * mc[m]
    P(f"    {m:02d}: {mc[m]:>3} {bar}")

# ---------- [4] Histogram of delay365 ----------
P("\n[4] Гистограмма delay365 (по 5 мин)")
bins = collections.Counter(int(x // 5) * 5 for x in d365)
for b in range(0, 121, 5):
    c = sum(1 for x in d365 if b <= x < b + 5)
    P(f"  {b:3d}-{b+4:3d}: {c:>2} {'#' * c}")

P("\n  Точные минуты delay365 (топ-15):")
for v, c in Counter(round(x) for x in d365).most_common(15):
    P(f"    {v:+d} мин x{c}")

# ---------- [5] Detection-bias: only clean pairs ----------
P("\n[5] Чистые пары (смерть и респаун НЕ круглые+isApprox=False)")
clean = [p for p in pairs if not p["death_approx"] and not p["resp_approx"] and not p["isApprox"]]
P(f"  чиcтых: {len(clean)}")
cd = [p["delay365"] for p in clean]
if cd:
    P(f"  mean={statistics.mean(cd):.1f} median={statistics.median(cd):.1f} std={statistics.stdev(cd):.1f}")
    bins = collections.Counter(int(x // 5) * 5 for x in cd)
    for b in range(0, 121, 5):
        c = sum(1 for x in cd if b <= x < b + 5)
        P(f"    {b:3d}-{b+4:3d}: {c:>2} {'#' * c}")

# ---------- [6] By hour-of-ipv ----------
P("\n[6] delay365 по часу IPV (death+6:05)")
by_ipv = collections.defaultdict(list)
for p in pairs:
    by_ipv[p["ipv_hour"]].append(p["delay365"])
for h in sorted(by_ipv):
    vals = by_ipv[h]
    P(f"  {h:02d}: n={len(vals):>2} mean={statistics.mean(vals):6.1f} med={statistics.median(vals):6.1f} min={min(vals):6.1f} max={max(vals):6.1f}")

# ---------- [7] By death hour ----------
P("\n[7] delay365 по часу смерти")
by_dh = collections.defaultdict(list)
for p in pairs:
    by_dh[p["death_hour"]].append(p["delay365"])
for h in sorted(by_dh):
    vals = by_dh[h]
    P(f"  {h:02d}: n={len(vals):>2} mean={statistics.mean(vals):6.1f} med={statistics.median(vals):6.1f}")

# ---------- [8] Location transition death->respawn ----------
P("\n[8] Переходы death_loc -> respawn_loc")
lt = Counter((p["death_loc"], p["resp_loc"]) for p in pairs)
same = sum(c for (a, b), c in lt.items() if a == b)
P(f"  переходов всего={sum(lt.values())}, из них ЖЕ в ту же локацию: {same}")
for (a, b), c in lt.most_common():
    mark = " <-- ПОВТОР" if a == b else ""
    P(f"    {a} -> {b}: {c}{mark}")

# ---------- [9] Uptime since last maintenance ----------
P("\n[9] Аптайм сервера на момент смерти (мин с последней техработы)")
up = []
for p in pairs:
    prev = None
    for m in maint:
        mt = parse_dt(m["time"])
        if mt < p["death"]:
            prev = mt
        else:
            break
    if prev:
        up.append(((p["death"] - prev).total_seconds() / 60.0, p["delay365"]))
P(f"  пар с известным аптаймом: {len(up)}")
deciles = [int(len(up) * q) for q in (0.2, 0.4, 0.6, 0.8)]
up_s = sorted(up)
if len(up) > 4:
    for i, q in enumerate((0.2, 0.4, 0.6, 0.8)):
        bucket = [x[1] for x in up_s[:int(len(up)*q)]] if q < 0.5 else [x[1] for x in up_s if x[0] >= (up_s[-1][0] - (up_s[-1][0]-up_s[0][0])*(1-q))]
    # корреляция
    us = [x[0] for x in up]; ds = [x[1] for x in up]
    if len(us) > 2:
        mean_u, mean_d = statistics.mean(us), statistics.mean(ds)
        cov = sum((a-mean_u)*(b-mean_d) for a,b in zip(us,ds))
        sdu = statistics.stdev(us); sdd = statistics.stdev(ds)
        r = cov/((len(us)-1)*sdu*sdd) if sdu and sdd else float('nan')
        P(f"  корреляция аптайм vs delay: r={r:.2f}")

# ---------- [10] tests on rounded respawn ----------
P("\n[10] delay365 для приблизительных телов")
approx_pairs = [p for p in pairs if p["resp_approx"]]
exact_pairs = [p for p in pairs if not p["resp_approx"]]
for name, grp in (("resp_approx (круглые)", approx_pairs), ("resp_rounded (точные)", exact_pairs)):
    v = [p["delay365"] for p in grp]
    if v:
        P(f"  {name}: n={len(v)} mean={statistics.mean(v):.1f} med={statistics.median(v):.1f}")

# ---------- [11] Chain: consecutive offsets ----------
P("\n[11] Марков-1 по задержкам (тек/след)")
groups = sorted(pairs, key=lambda p: p["death"])
prev365 = None
twos = []
for p in groups:
    cur = round(p["delay365"] / 5) * 5
    if prev365 is not None:
        twos.append((prev365, cur))
    prev365 = cur
if twos:
    P("  пар соседних смертей (офсет текущей -> офсет след.):")
    for a, b in twos[:40]:
        P(f"    {a:+d} -> {b:+d}")

with open("reports/eda_report.txt", "w") as f:
    f.write("\n".join(report))
print("\n".join(report))
print("\n>>> сохранено в reports/eda_report.txt")