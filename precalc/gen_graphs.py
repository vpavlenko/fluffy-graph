import json
from collections import defaultdict

filenames = [
    'connected_4_vertices.json',    
    'connected_5_vertices.json',    
    'connected_6_vertices.json',
]

BOUNDS = {
    4: range(4, 5),
    5: range(5, 9),
    6: range(6, 13),
    7: range(7, 13),
}

def get_level(g):
    n = g['n']
    e = len(g['e'])
    if e not in BOUNDS[n]:
        # print(19, g['e'], g['n'])
        return -1
    else:
        pass
        # print(22)    
    if n == 4:
        return 0
    elif n == 5:
        return e - 4
    else:
        return e - 1


levels = defaultdict(list)

for filename in filenames:
    print('reading', filename)
    data = open(filename).read().split('\n')
    for line in data:
        try: 
            # print(line)
            g = eval(line)
            level = get_level(g)
            if level == -1:
                continue
            else:
                print('level: ', level)
                levels[level].append(g)
        except Exception as e:
            print(e)

with open('../js/graphs.js', 'w') as ouf:
    print('var levels = ' + json.dumps(levels, separators=(',',':')), file=ouf)
