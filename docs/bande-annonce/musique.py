# Musique d'ambiance de la bande-annonce (64 s), fabriquée ici : nappe douce, basse, notes égrenées.
import numpy as np, wave
SR = 44100; DUREE = 64.0
t = np.arange(int(SR * DUREE)) / SR
L = np.zeros_like(t); R = np.zeros_like(t)
def hz(n): return 440.0 * 2 ** ((n - 69) / 12)
# la mineur, fa, do, sol : 4 s chacun
ACC = [[45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [48, 55, 60, 64, 67], [43, 50, 55, 59, 62]]
ARP = [[69, 72, 76, 72], [65, 69, 72, 69], [67, 72, 76, 72], [67, 71, 74, 71]]
def enveloppe(x, a, r, longueur):
    e = np.clip(x / a, 0, 1) * np.clip((longueur - x) / r, 0, 1)
    return e * (x >= 0) * (x <= longueur)
for k in range(16):
    debut = k * 4.0
    acc = ACC[k % 4]
    i0 = int(debut * SR); i1 = min(len(t), int((debut + 6.0) * SR))
    x = t[i0:i1] - debut
    env = enveloppe(x, 1.6, 2.2, 6.0)
    for j, n in enumerate(acc):
        f = hz(n)
        son = np.sin(2 * np.pi * f * x) + 0.25 * np.sin(2 * np.pi * 2 * f * x) + 0.08 * np.sin(2 * np.pi * 3 * f * x)
        son2 = np.sin(2 * np.pi * (f + 0.18) * x + 1.3)
        g = 0.05 if j else 0.07
        L[i0:i1] += g * env * (son + 0.6 * son2 * (j % 2))
        R[i0:i1] += g * env * (son + 0.6 * son2 * ((j + 1) % 2))
    # basse ronde
    fb = hz(acc[0] - 12)
    L[i0:i1] += 0.10 * env * np.sin(2 * np.pi * fb * x); R[i0:i1] += 0.10 * env * np.sin(2 * np.pi * fb * x)
    # notes égrenées à partir du logo (10 s), plus présentes après 15 s
    if debut >= 8:
        croche = 60 / 96 / 2
        for m in range(int(4 / croche)):
            n = ARP[k % 4][m % 4] + (12 if (m // 4) % 2 and debut >= 20 else 0)
            td = debut + m * croche
            if td < 10.2 or td > 61: continue
            a = int(td * SR); b = min(len(t), a + int(1.6 * SR))
            y = t[a:b] - td
            f = hz(n)
            pl = (np.sin(2 * np.pi * f * y) + 0.3 * np.sin(2 * np.pi * 2 * f * y)) * np.exp(-y * 3.2) * np.clip(y / 0.004, 0, 1)
            vol = 0.035 if td < 15 else 0.05
            pan = 0.5 + 0.35 * np.sin(m * 1.7)
            L[a:b] += vol * pl * (1 - pan) * 2; R[a:b] += vol * pl * pan * 2
# coups sourds : logo (10,2 s) et fin (58,2 s)
for td in (10.2, 58.2):
    a = int(td * SR); b = a + int(2.5 * SR); y = t[a:b] - td
    boum = np.sin(2 * np.pi * (55 - 15 * y) * y) * np.exp(-y * 2.2) * 0.35
    L[a:b] += boum; R[a:b] += boum
# fondu d'entrée et de sortie
fondu = np.clip(t / 3.0, 0, 1) * np.clip((DUREE - t) / 3.5, 0, 1)
L *= fondu; R *= fondu
m = max(np.abs(L).max(), np.abs(R).max())
st = (np.stack([L, R], 1) / m * 0.8 * 32767).astype(np.int16)
with wave.open("musique-brute.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
print("ok")
