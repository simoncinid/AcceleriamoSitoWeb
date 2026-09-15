#!/usr/bin/env python3
"""Sistema definitivo del logo Acceleriamo (14/09/2026).

Il filo ingarbugliato che si distende in una freccia (simbolo 6) con il nome in Degular Display
Bold, il carattere del sito, e "IA" in arancione. Deciso con Diego il 14/09/2026:
- la riga esce dal nodo più in basso e si distende con una curva morbida (ABBASSA);
- la scritta poggia sulla riga e parte solo dove la riga è già dritta;
- la cima delle lettere arriva esattamente alla cima del nodo: né più piccola né sporgente;
- la freccia supera la scritta di un tratto breve (ARIA).

Output in companies/acceleriamo/brand/assets/logo/ (o nella cartella LOGO_OUT), una cartella per
versione: principale/ (scritta sopra la riga), compatto/ (nodo e nome), verticale/, simbolo/,
nodo/, wordmark/ in sei colorazioni; icone/ con avatar, icona app e favicon; anteprima-sistema.png
nella radice e geometria.json in src/.
Uso: python3 build_logo.py  (servono fontTools, Pillow e rsvg-convert)
La versione precedente in Anton è in brand/assets/archivio/2026-09-13-logo-con-anton/.
"""
import os, re, subprocess
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from PIL import Image

ROOT = Path("/Users/tommasorovini/agente/companies/acceleriamo/brand/assets")
SRC = ROOT / "logo/src/simbolo-06-originale.svg"   # il simbolo 6 scelto il 12/09/2026, disegno di partenza
OUT = Path(os.environ.get("LOGO_OUT", ROOT / "logo"))
OUT.mkdir(parents=True, exist_ok=True)
FONT = ROOT / "fonts/degular-display-demo-dal-sito/DegularDisplay-Bold.otf"

ORANGE, BLACK, CREAM, WHITE = "#EC5E2D", "#1C1915", "#F7F2EC", "#FFFFFF"
NOME, IA = "ACCELERIAMO", (7, 8)          # posizioni di I e A dentro ACCELERIAMO
TRACKING = -0.025                         # sul sito -3%: qui appena più aperto per le misure grandi
ABBASSA = 110.0                           # quanto scende l'asta rispetto al disegno originale (unità 2048)
GAP = 1.1                                 # distanza tra scritta e riga, in spessori del filo
ARIA = 0.12                               # tratto di freccia dopo la scritta, in frazione della scritta

# ---------- 1. il tracciato del marchio ----------
svg = re.sub(r"<metadata>.*?</metadata>", "", SRC.read_text(encoding="utf-8"), flags=re.S)
paths = re.findall(r"<path[^>]*>", svg)
d_of = lambda p: re.search(r' d="([^"]*)"', p).group(1)
fill_of = lambda p: re.search(r'fill="([^"]*)"', p).group(1)
D_MAIN = d_of([p for p in paths if fill_of(p) == "rgb(236,94,45)"][0])
D_HOLES = " ".join(d_of(h) for h in paths[2:] if fill_of(h) == "rgb(247,242,236)")
D_MARK = D_MAIN + " " + D_HOLES

nums = [float(x) for x in re.findall(r"-?\d+\.?\d*", D_MAIN)]
mx0, my0, mx1, my1 = min(nums[0::2]), min(nums[1::2]), max(nums[0::2]), max(nums[1::2])
MARK_H = my1 - my0

# spessore del filo e punto in cui il nodo diventa asta (serve al nodo da solo)
tmp = OUT / "_tmp_mark.svg"
tmp.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" width="2048" height="2048">'
               f'<rect width="2048" height="2048" fill="white"/><path fill="{ORANGE}" fill-rule="evenodd" d="{D_MARK}"/></svg>')
subprocess.run(["rsvg-convert", "-w", "2048", "-o", str(OUT / "_tmp_mark.png"), str(tmp)], check=True)
px = Image.open(OUT / "_tmp_mark.png").convert("RGB").load()
def orange_run(x):
    ys = [y for y in range(int(my0) - 5, int(my1) + 5) if px[x, y][0] > 200 and px[x, y][1] < 150]
    return (min(ys), max(ys)) if ys else None
xm = int((mx0 + mx1) * 0.55); ref = orange_run(xm); t = ref[1] - ref[0] + 1
x = xm
while x > mx0:
    r = orange_run(x)
    if r and (r[1] - r[0] + 1) > 1.6 * t:
        break
    x -= 1
x_cut = int(x + 0.55 * t); r = orange_run(x_cut); y_cut = (r[0] + r[1]) / 2
for f in (tmp, OUT / "_tmp_mark.png"): f.unlink()
KNOT_W = x_cut + t / 2 - mx0

# ---------- 2. il filo ridisegnato: asta più bassa, curva morbida, asta allungabile ----------
SHAFT_TOP, SHAFT_START, HEAD_LEFT = 998.0, 1072.79, 1687.0
TOP_OLD = "671.029 1076.4 C 741.286 1047.42 813.822 1019.52 889.011 1006.75 C 953.859 995.727 1008.23 997.615 1072.79 997.626"
BOT_OLD = "1077.6 1047.06 C 1008.46 1046.91 945.959 1046.18 877.343 1058.46 C 836.721 1066.1 796.82 1077.18 758.071 1091.57 C 729.15 1102.45 700.521 1115.27 670.986 1124.29"
assert TOP_OLD in D_MAIN and BOT_OLD in D_MAIN

def filo(allunga=0.0, dy=ABBASSA, k=0.45):
    """Il tratto tra nodo e asta diventa una curva con tangenti orizzontali; asta e punta scendono
    di dy; i punti oltre x=1400 si spostano a destra di allunga (asta più lunga)."""
    kk = k * (SHAFT_START - 671.0)
    top = f"671.029 1076.4 C {671.029 + kk:.3f} 1076.4 {SHAFT_START - kk:.3f} {997.626 + dy:.3f} {SHAFT_START} {997.626 + dy:.3f}"
    bot = f"1077.6 {1047.06 + dy:.3f} C {1077.6 - kk:.3f} {1047.06 + dy:.3f} {670.986 + kk:.3f} 1124.29 670.986 1124.29"
    d = D_MAIN.replace(TOP_OLD, "@T").replace(BOT_OLD, "@B")
    out, buf = [], []
    for tk in re.findall(r"@T|@B|[A-Za-z]|-?\d+\.?\d*", d):
        if tk in ("@T", "@B"):
            out.append(top if tk == "@T" else bot); continue
        if tk[0].isalpha():
            out.append(tk); continue
        buf.append(float(tk))
        if len(buf) == 2:
            x, y = buf; buf = []
            if x > 1072.0:
                x, y = x + (allunga if x > 1400 else 0.0), y + dy
            out.append(f"{x:.3f} {y:.3f}")
    return " ".join(out) + " " + D_HOLES

# ---------- 3. il nome in Degular, in tracciati ----------
font = TTFont(FONT); gs = font.getGlyphSet(); cmap = font.getBestCmap()
upm, capH = font["head"].unitsPerEm, font["OS/2"].sCapHeight

MIN_GAP = 14                              # distanza minima tra le forme di due lettere, unità del font

def profilo(ch, size=1000):
    """Per ogni riga del disegno: primo e ultimo pixel pieno della lettera (unità del font)."""
    from PIL import ImageFont, ImageDraw
    f = ImageFont.truetype(str(FONT), size)
    g = cmap[ord(ch)]; lsb = font["hmtx"][g][1]
    im = Image.new("L", (int(size * 1.5), int(size * 1.4)), 0)
    ImageDraw.Draw(im).text((int(size * 0.25), 0), ch, font=f, fill=255)
    bbox = im.getbbox(); px = im.load(); rows = {}
    for y in range(bbox[1], bbox[3], 4):
        xs = [x for x in range(bbox[0], bbox[2]) if px[x, y] > 128]
        if xs:
            rows[y] = (xs[0] - bbox[0] + lsb, xs[-1] - bbox[0] + lsb)
    return rows

_PROFILI = {}
def kern(a, b):
    """Spazio da aggiungere tra a e b perché le forme non si tocchino (0 se c'è già aria)."""
    for ch in (a, b):
        if ch not in _PROFILI:
            _PROFILI[ch] = profilo(ch)
    pa, pb = _PROFILI[a], _PROFILI[b]
    adv = gs[cmap[ord(a)]].width + TRACKING * upm
    gaps = [adv + pb[y][0] - pa[y][1] for y in pa if y in pb]
    return max(0.0, MIN_GAP - min(gaps)) if gaps else 0.0

def nome(cap, color, ia):
    """(tracciati, larghezza) di ACCELERIAMO con altezza delle maiuscole cap, con crenatura ottica."""
    scale = cap / capH; parts, xc = [], 0.0
    for i, ch in enumerate(NOME):
        g = cmap[ord(ch)]; pen = SVGPathPen(gs); gs[g].draw(pen)
        parts.append(f'<path fill="{ia if i in IA else color}" transform="translate({xc:.2f},0) '
                     f'scale({scale:.5f},{-scale:.5f})" d="{pen.getCommands()}"/>')
        if i + 1 < len(NOME):
            xc += (gs[g].width + TRACKING * upm + kern(ch, NOME[i + 1])) * scale
        else:
            xc += gs[g].width * scale
    return "".join(parts), xc

def svg_doc(w, h, inner, pad):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad:.2f} {-pad:.2f} {w + 2*pad:.2f} {h + 2*pad:.2f}" '
            f'width="{w + 2*pad:.0f}" height="{h + 2*pad:.0f}">{inner}</svg>')

def marchio(color, d, x=0.0, y=0.0, s=1.0):
    return (f'<path fill="{color}" fill-rule="evenodd" transform="translate({x:.2f},{y:.2f}) scale({s}) '
            f'translate({-mx0},{-my0})" d="{d}"/>')

def nodo_group(color, x=0.0, y=0.0, s=1.0):
    import hashlib
    cid = "n" + hashlib.md5(f"{x:.2f}|{y:.2f}|{s:.5f}|{color}".encode()).hexdigest()[:8]   # stabile tra un'esecuzione e l'altra
    return (f'<g transform="translate({x:.2f},{y:.2f}) scale({s})">'
            f'<clipPath id="{cid}"><rect x="0" y="0" width="{x_cut - mx0:.2f}" height="{MARK_H:.2f}"/></clipPath>'
            f'<g clip-path="url(#{cid})"><path fill="{color}" fill-rule="evenodd" transform="translate({-mx0},{-my0})" d="{D_MARK}"/></g>'
            f'<circle cx="{x_cut - mx0:.2f}" cy="{y_cut - my0:.2f}" r="{t/2:.1f}" fill="{color}"/></g>')

# ---------- 4. le composizioni ----------
def geometria():
    """Misure del logo principale in unità del disegno (servono alla pagina "come è costruito")."""
    base = SHAFT_TOP + ABBASSA - GAP * t
    cap = base - my0
    _, ww = nome(cap, BLACK, ORANGE)
    x_text = SHAFT_START + 0.6 * t
    allunga = x_text + ww * (1 + ARIA) - HEAD_LEFT
    W, H = mx1 + allunga - mx0, MARK_H
    return dict(W=W, H=H, pad=0.14 * H, cap=cap, base=base - my0, riga=SHAFT_TOP + ABBASSA - my0,
                testo_da=x_text - mx0, testo_a=x_text + ww - mx0, dritta_da=SHAFT_START - mx0,
                nodo_a=KNOT_W, filo=t, freccia_a=W)

def principale(mc, wc, ic):
    """Il logo: nome sopra la riga, dalla parte dritta, alto quanto il nodo sopra la riga."""
    base = SHAFT_TOP + ABBASSA - GAP * t
    cap = base - my0
    wd, ww = nome(cap, wc, ic)
    x_text = SHAFT_START + 0.6 * t
    allunga = x_text + ww * (1 + ARIA) - HEAD_LEFT
    W, H = mx1 + allunga - mx0, MARK_H
    inner = marchio(mc, filo(allunga)) + f'<g transform="translate({x_text - mx0:.2f},{base - my0:.2f})">{wd}</g>'
    return svg_doc(W, H, inner, pad=0.14 * H)

def simbolo(mc):
    return svg_doc(mx1 - mx0, MARK_H, marchio(mc, filo()), pad=0.12 * MARK_H)

def nodo(mc):
    return svg_doc(KNOT_W, MARK_H, nodo_group(mc), pad=0.12 * MARK_H)

def compatto(mc, wc, ic):
    """Il nodo con il nome accanto: per spazi bassi e piccoli (testata del sito, piè di pagina)."""
    cap = 0.40 * MARK_H; gap = 0.20 * MARK_H
    wd, ww = nome(cap, wc, ic)
    y = (MARK_H - cap) / 2 + cap
    inner = nodo_group(mc) + f'<g transform="translate({KNOT_W + gap:.2f},{y:.2f})">{wd}</g>'
    return svg_doc(KNOT_W + gap + ww, MARK_H, inner, pad=0.12 * MARK_H)

def verticale(mc, wc, ic):
    """Il simbolo sopra, il nome sotto largo quanto il simbolo: formati quadrati."""
    sw = mx1 - mx0
    _, w1 = nome(100, wc, ic); cap = 100 * sw / w1
    wd, ww = nome(cap, wc, ic); gap = 0.30 * MARK_H
    inner = marchio(mc, filo()) + f'<g transform="translate(0,{MARK_H + gap + cap:.2f})">{wd}</g>'
    return svg_doc(sw, MARK_H + gap + cap, inner, pad=0.12 * MARK_H)

def wordmark(wc, ic):
    wd, ww = nome(600, wc, ic)
    return svg_doc(ww, 600, f'<g transform="translate(0,600)">{wd}</g>', pad=60)

def avatar(bg, fg, size=1080, frac=0.60):
    s = frac * size / KNOT_W
    inner = f'<circle cx="{size/2}" cy="{size/2}" r="{size/2}" fill="{bg}"/>' + nodo_group(fg, (size - KNOT_W*s)/2, (size - MARK_H*s)/2, s)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">{inner}</svg>'

def icona(bg, fg, size=1024, radius=0.22, frac=0.64):
    s = frac * size / KNOT_W
    inner = f'<rect width="{size}" height="{size}" rx="{radius*size}" fill="{bg}"/>' + nodo_group(fg, (size - KNOT_W*s)/2, (size - MARK_H*s)/2, s)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">{inner}</svg>'

COLORAZIONI = {  # nome: (marchio, parola, "IA")
    "colore":       (ORANGE, BLACK, ORANGE),   # su crema o bianco
    "negativo":     (ORANGE, CREAM, ORANGE),   # su quasi nero
    "su-arancione": (CREAM, CREAM, BLACK),     # su arancione
    "nero":         (BLACK, BLACK, BLACK),     # stampa a un colore
    "crema":        (CREAM, CREAM, CREAM),     # a un colore su fondi scuri o foto
    "arancione":    (ORANGE, ORANGE, ORANGE),  # a un colore su scuro
}

CARTELLE = ("principale", "compatto", "verticale", "simbolo", "nodo", "wordmark")

def percorso(name, ext="svg"):
    """Ogni file nella cartella della sua versione; avatar, icona e favicon in icone/."""
    versione = name.split("-")[1]
    cartella = OUT / (versione if versione in CARTELLE else "icone")
    cartella.mkdir(parents=True, exist_ok=True)
    return cartella / f"{name}.{ext}"

def scrivi(files):
    for name, content in files.items():
        percorso(name).write_text(content, encoding="utf-8")
        subprocess.run(["rsvg-convert", "-w", "2400", "-o", str(percorso(name, "png")), str(percorso(name))], check=True)
    print("scritti", len(files), "svg + png in", OUT)

def main():
    files = {}
    for n, (mc, wc, ic) in COLORAZIONI.items():
        files[f"acceleriamo-principale-{n}"] = principale(mc, wc, ic)
        files[f"acceleriamo-compatto-{n}"] = compatto(mc, wc, ic)
        files[f"acceleriamo-verticale-{n}"] = verticale(mc, wc, ic)
        files[f"acceleriamo-wordmark-{n}"] = wordmark(wc, ic)
        if n != "negativo":               # senza nome il negativo sarebbe uguale a "colore"
            files[f"acceleriamo-simbolo-{n}"] = simbolo(mc)
            files[f"acceleriamo-nodo-{n}"] = nodo(mc)
    files["acceleriamo-avatar-instagram"] = avatar(ORANGE, CREAM)
    files["acceleriamo-avatar-instagram-nero"] = avatar(BLACK, ORANGE)
    files["acceleriamo-avatar-instagram-crema"] = avatar(CREAM, ORANGE)
    files["acceleriamo-icona-app"] = icona(ORANGE, CREAM)
    files["acceleriamo-favicon"] = icona(ORANGE, CREAM, size=512, radius=0.2)
    scrivi(files)
    import json
    (OUT / "src").mkdir(exist_ok=True)
    (OUT / "src" / "geometria.json").write_text(json.dumps(geometria(), indent=1))


def anteprima():
    """Tavola del sistema: principale grande, fondi scuro e arancione, compatto, verticale, avatar e favicon."""
    import tempfile
    tmpd = Path(tempfile.mkdtemp())
    def png(name, w):
        out = tmpd / f"{name}-{w}.png"
        subprocess.run(["rsvg-convert", "-w", str(w), "-o", str(out), str(percorso(name))], check=True)
        return Image.open(out).convert("RGBA")
    def pannello(w, h, bg, im, dy=0):
        p = Image.new("RGBA", (w, h), bg); p.alpha_composite(im, ((w - im.width) // 2, (h - im.height) // 2 + dy)); return p
    W, G = 1600, 20; w2 = (W - 3 * G) // 2; w3 = (W - 4 * G) // 3
    fav = png("acceleriamo-favicon", 96); comp = png("acceleriamo-compatto-colore", 380)
    piccoli = Image.new("RGBA", (w3, 420), CREAM)
    top = (420 - comp.height - 50 - fav.height) // 2
    piccoli.alpha_composite(comp, ((w3 - comp.width) // 2, top)); piccoli.alpha_composite(fav, ((w3 - fav.width) // 2, top + comp.height + 50))
    righe = [
        [pannello(W - 2 * G, 520, CREAM, png("acceleriamo-principale-colore", 1300))],
        [pannello(w2, 360, BLACK, png("acceleriamo-principale-negativo", 640)), pannello(w2, 360, ORANGE, png("acceleriamo-principale-su-arancione", 640))],
        [pannello(w3, 420, CREAM, png("acceleriamo-verticale-colore", 330)), pannello(w3, 420, CREAM, png("acceleriamo-avatar-instagram", 280)), piccoli],
    ]
    H = G + sum(r[0].height + G for r in righe)
    tav = Image.new("RGBA", (W, H), "#E3DCD2"); y = G
    for r in righe:
        x = G
        for p in r:
            tav.alpha_composite(p, (x, y)); x += p.width + G
        y += r[0].height + G
    tav.convert("RGB").save(OUT / "anteprima-sistema.png", optimize=True)
    print("anteprima", OUT / "anteprima-sistema.png")

if __name__ == "__main__":
    main()
    anteprima()
