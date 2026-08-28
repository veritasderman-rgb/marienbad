import os, re, json, unicodedata, time
from PIL import Image, ImageOps
SRC = os.path.expanduser("~/mnt/MARIENBAD_MARKETING/MARIENBAD_MARKETING")
CAP, CAP_SMALL = 60, 30
HOTELS = [("01 Nové lázně","nove-lazne",CAP),("02 Centrální lázně","centralni-lazne",CAP),
 ("03 Maria Spa","maria-spa",CAP_SMALL),("04 Hvezda","hvezda",CAP),("05 Grandhotel Pacifik","pacifik",CAP),
 ("06 Butterfly","butterfly",CAP),("07 Vltava","vltava",CAP),("08 Svoboda","svoboda",CAP)]
PRIORITY = ["highlights","exterior","rooms","interior","dining","pool","spa","mice","other"]
def cat_of(f):
    f=f.lower()
    if "best of" in f: return "highlights"
    if "exterior" in f: return "exterior"
    if "apartm" in f or "room" in f: return "rooms"
    if "interior" in f or "fitness" in f: return "interior"
    if f.startswith("restaurant"): return "dining"
    if "swimming" in f or "pool" in f: return "pool"
    if "treatment" in f: return "spa"
    if "mice" in f: return "mice"
    return "other"
def slugify(s):
    s=unicodedata.normalize("NFKD",s).encode("ascii","ignore").decode()
    s=re.sub(r"\.(jpe?g|png|tiff?)$","",s,flags=re.I); s=re.sub(r"^hotel[ _-]+","",s,flags=re.I)
    s=re.sub(r"[^a-zA-Z0-9]+","-",s).strip("-").lower(); return re.sub(r"-+","-",s) or "photo"
def probe(p):
    im=Image.open(p); w,h=im.size; o=im.getexif().get(274,1) if im.format=="JPEG" else 1
    if o>=5: w,h=h,w
    im.draft("RGB",(160,160)); im=ImageOps.exif_transpose(im).convert("L").resize((8,8),Image.LANCZOS)
    px=list(im.tobytes()); avg=sum(px)/64
    return w,h,sum(1<<i for i,v in enumerate(px) if v>avg)
def cands(hd):
    out=[]; base=os.path.join(SRC,hd)
    for root,dirs,files in os.walk(base):
        rel=os.path.relpath(root,base)
        if rel==".": continue
        c=cat_of(rel.split(os.sep)[0])
        for fn in sorted(files):
            if fn.lower().endswith((".jpg",".jpeg",".png")): out.append((c,os.path.join(root,fn),fn))
    return out
def extra(slug):
    out=[]
    if slug=="nove-lazne":
        d=os.path.join(SRC,"RomanBaths")
        out+= [("spa",os.path.join(d,f),f) for f in sorted(os.listdir(d)) if f.lower().endswith((".jpg",".jpeg"))]
    m={"centralni-lazne":"CL","hvezda":"HV","pacifik":"Pa","svoboda":"SV","vltava":"Vl"}
    if slug in m:
        d=os.path.join(SRC,"LazneML - fotky",m[slug])
        for f in sorted(os.listdir(d)):
            if not f.lower().endswith((".jpg",".jpeg")): continue
            fl=f.lower(); c="exterior" if "exterior" in fl else "pool" if "pool" in fl else "dining" if "restaurant" in fl else "interior"
            out.append((c,os.path.join(d,f),f))
    return out
plan=[]; t0=time.time()
for hd,slug,cap in HOTELS:
    by={}
    for c,p,fn in cands(hd)+extra(slug): by.setdefault(c,[]).append((p,fn))
    order=[c for c in PRIORITY if c in by]; idx={c:0 for c in order}; picked=[]; hashes=[]; seen=set()
    while len(picked)<cap:
        prog=False
        for c in order:
            if len(picked)>=cap: break
            lst=by[c]
            while idx[c]<len(lst):
                p,fn=lst[idx[c]]; idx[c]+=1; prog=True
                try: w,h,ah=probe(p)
                except Exception: continue
                if w<900 or h<600: continue
                if any(bin(ah^o).count("1")<=4 for o in hashes): continue
                hashes.append(ah)
                n=slugify(fn); base=n; k=2
                while (c,n) in seen: n=f"{base}-{k}"; k+=1
                seen.add((c,n)); picked.append({"slug":slug,"cat":c,"name":n,"src":p,"w":w,"h":h})
                break
        if not prog: break
    plan+=picked; print(slug,len(picked),round(time.time()-t0,1),flush=True)
json.dump(plan,open(os.path.expanduser("~/work/plan.json"),"w"))
print("TOTAL",len(plan))
