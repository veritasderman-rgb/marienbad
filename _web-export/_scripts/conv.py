import json, os, time, sys
from PIL import Image, ImageOps
OUT=os.path.expanduser("~/mnt/MARIENBAD_MARKETING/_web-export/public/images/hotels")
SIZES=[(1600,75),(800,75),(400,72)]
plan=json.load(open(os.path.expanduser("~/work/plan.json")))
t0=time.time(); done=0; skipped=0
for it in plan:
    d=os.path.join(OUT,it["slug"],it["cat"]); target=os.path.join(d,f"{it['name']}-400.webp")
    if os.path.exists(target): skipped+=1; continue
    if time.time()-t0>33: break
    os.makedirs(d,exist_ok=True)
    im=Image.open(it["src"]); im.draft("RGB",(1600,1600))
    im=ImageOps.exif_transpose(im).convert("RGB")
    for w,q in SIZES:
        im2=im if im.width<=w else im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
        im2.save(os.path.join(d,f"{it['name']}-{w}.webp"),"WEBP",quality=q,method=5)
    im.close(); done+=1
print("converted",done,"already",skipped,"of",len(plan),"elapsed",round(time.time()-t0,1))
