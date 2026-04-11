import os
for d in ['.git', 'backend/node_modules', 'backend/uploads', 'backend/server.log']:
    total = 0
    if os.path.isfile(d):
        total = os.path.getsize(d)
    else:
        for dirpath, dirnames, filenames in os.walk(d):
            for f in filenames:
                try: total += os.path.getsize(os.path.join(dirpath, f))
                except: pass
    print(d, round(total/1024/1024, 1), 'MB')
