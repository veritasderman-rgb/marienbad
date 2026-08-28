import sys, json, os, time
exec(open('plan.py').read().split('plan=[]; t0')[0])
i=int(sys.argv[1]); hd,slug,cap=HOTELS[i]; t0=time.time()
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
            hashes.append(ah); n=slugify(fn); b=n; k=2
            while (c,n) in seen: n=f"{b}-{k}"; k+=1
            seen.add((c,n)); picked.append({"slug":slug,"cat":c,"name":n,"src":p,"w":w,"h":h})
            break
    if not prog: break
json.dump(picked,open(f"plan-{slug}.json","w"))
print(slug,len(picked),"in",round(time.time()-t0,1),"s")
