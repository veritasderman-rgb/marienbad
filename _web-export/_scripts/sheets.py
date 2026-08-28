import os, sys, json
from PIL import Image, ImageOps, ImageDraw
SRC=os.path.expanduser("~/mnt/MARIENBAD_MARKETING/MARIENBAD_MARKETING/09 Marianske Lazne")
OUT=os.path.expanduser("~/work/sheets")
files=[]
for root,dirs,fs in os.walk(SRC):
    for f in sorted(fs):
        if f.lower().endswith(('.jpg','.jpeg','.png')): files.append(os.path.join(root,f))
files.sort()
json.dump(files, open(os.path.expanduser("~/work/town-files.json"),"w"))
COLS,ROWS,TW,TH=5,5,360,260
per=COLS*ROWS
start=int(sys.argv[1]); end=int(sys.argv[2])
for sh in range(start,end):
    chunk=files[sh*per:(sh+1)*per]
    if not chunk: break
    sheet=Image.new("RGB",(COLS*TW,ROWS*TH),(20,20,20))
    dr=ImageDraw.Draw(sheet)
    for i,f in enumerate(chunk):
        try:
            im=Image.open(f); im.draft("RGB",(TW,TH)); im=ImageOps.exif_transpose(im).convert("RGB")
            im=ImageOps.fit(im,(TW-4,TH-24),Image.LANCZOS)
        except Exception: continue
        x,y=(i%COLS)*TW,(i//COLS)*TH
        sheet.paste(im,(x+2,y+2))
        dr.text((x+6,y+TH-20), f"{sh*per+i}", fill=(255,220,80))
    sheet.save(os.path.join(OUT,f"sheet-{sh:02d}.jpg"),quality=72)
    print("sheet",sh,len(chunk),flush=True)
print("total files",len(files))
