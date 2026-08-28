import json, os, re, sys, time, unicodedata
from PIL import Image, ImageOps
PICKS = [1,2,3,4,5,6,7,8,9,11,12,15,16,18,19,20,21,23,
 25,27,28,32,33,34,36,37,38,43,46,47,48,49,
 53,54,58,59,62,64,66,68,69,70,73,74,
 77,78,80,82,83,84,86,88,91,92,93,94,96,97,98,99,
 100,103,104,105,112,116,119,120,121,123,
 127,128,132,133,135,138,142,144,147,149,
 151,152,154,159,161,162,163,164,166,168,169,170,171,172,174,
 177,180,182,184,185,188,189,192,194,195,199,
 201,207,210,213,217,222,
 226,227,231,232,234,236,239,240,246,247]
files = json.load(open('town-files.json'))
OUT = os.path.expanduser("~/mnt/MARIENBAD_MARKETING/_web-export/public/images/library/marianske-lazne")
SIZES=[(1600,75),(800,75)]

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii","ignore").decode()
    s = re.sub(r"\.(jpe?g|png)$","",s,flags=re.I)
    s = re.sub(r"^(COLONNADE|SPA PARKS)_","",s,flags=re.I)
    s = re.sub(r"[^a-zA-Z0-9]+","-",s).strip("-").lower()
    return re.sub(r"-+","-",s) or "photo"

def category(path):
    f = os.path.basename(path).lower(); full = path.lower()
    if 'singing fountain' in f or 'zpivajici' in f: return 'fountain'
    if any(k in f for k in ('padel','tenis','tennis','golf','kolobez','bike','cyklo','ski','lanovk','disc','strom')): return 'sport'
    if 'colonnade' in f or 'kolonada' in f: return 'colonnade'
    if 'spring' in f or 'pramen' in f: return 'springs'
    if 'park' in f or 'forest' in f or 'les' in f: return 'nature'
    return 'town'

def season(path):
    f = path.lower()
    if 'winter' in f or 'zima' in f: return 'winter'
    if 'xmas' in f or 'vanoc' in f: return 'christmas'
    return None

meta_path = os.path.expanduser("~/work/town-meta.json")
meta = json.load(open(meta_path)) if os.path.exists(meta_path) else []
done = {m['source'] for m in meta}
t0=time.time()
for idx in PICKS:
    src = files[idx]
    rel = src.split('09 Marianske Lazne/')[-1]
    if rel in done: continue
    if time.time()-t0 > 32: break
    cat = category(src); name = slugify(os.path.basename(src))
    d = os.path.join(OUT, cat); os.makedirs(d, exist_ok=True)
    im = Image.open(src); im.draft("RGB",(1600,1600)); im = ImageOps.exif_transpose(im).convert("RGB")
    w0,h0 = im.size
    for w,q in SIZES:
        im2 = im if im.width<=w else im.resize((w, round(im.height*w/im.width)), Image.LANCZOS)
        im2.save(os.path.join(d, f"{name}-{w}.webp"), "WEBP", quality=q, method=5)
    im.close()
    meta.append({"id": f"{cat}/{name}", "category": cat,
                 "base": f"/images/library/marianske-lazne/{cat}/{name}",
                 "w": w0, "h": h0, "orientation": "landscape" if w0>=h0 else "portrait",
                 "season": season(src), "source": rel})
    done.add(rel)
json.dump(meta, open(meta_path,'w'), ensure_ascii=False, indent=1)
print("done", len(meta), "of", len(PICKS), "elapsed", round(time.time()-t0,1))
