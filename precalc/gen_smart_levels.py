#!/usr/bin/env python3
import json
from collections import defaultdict

MIN_LEVEL_SIZE = 5

filenames = [
    'connected_4_vertices.json',    
    'connected_5_vertices.json',    
    'connected_6_vertices.json',
    'connected_7_vertices.json',
]

BOUNDS = {
    4: range(4, 5),
    5: range(5, 9),
    6: range(6, 13),
    7: range(7, 13),
}


def good(g):
    n = g['n']
    e = len(g['e'])
    return e in BOUNDS[n]


class CantDivideError(Exception):
    pass


def average(a):
    return sum(a) / len(a)


def invdiff(a):
    return -(max(a) - min(a))


FEATURES = ['m', 'mind', 'maxd', 'b', 't']
SORT_FEATURES = ['n', 'm', 'mind', 'maxd', 'b', 't']
FUNCTIONS = [average, average, invdiff, invdiff, invdiff, invdiff]


def partition(level, feature, value):
    a = [g for g in level if g[feature] <= value]
    b = [g for g in level if g[feature] > value]
    return a, b


def divide(level):
    for feature in FEATURES:
        values = {g[feature] for g in level}
        for value in values:
            a, b = partition(level, feature, value)
            if len(a) >= MIN_LEVEL_SIZE and len(b) >= MIN_LEVEL_SIZE:
                print('partition into', len(a), 'and', len(b), 'by', feature, '<=', value)
                return a, b
    raise CantDivideError


def smart_division(old_levels):
    new_levels = old_levels
    while True:
        old_levels = new_levels
        new_levels = []
        for level in old_levels:
            try:
                a, b = divide(level)
                new_levels.append(a)
                new_levels.append(b)
                # print('append', len(new_levels), len(old_levels))
            except CantDivideError:
                new_levels.append(level)
        assert len(new_levels) >= len(old_levels)
        if len(new_levels) == len(old_levels):
            print('stop growing')
            return new_levels
        else:
            print('growth from', len(old_levels), 'to', len(new_levels))


def stupid_division(old_levels):
    new_levels = []
    for level in old_levels:
        while len(level) >= 2 * MIN_LEVEL_SIZE:
            new_levels.append(level[-MIN_LEVEL_SIZE:])
            level = level[:-MIN_LEVEL_SIZE]
        new_levels.append(level)
    return new_levels


def collect_level_info(level):
    info = []
    info.append('len = ' + str(len(level)))
    info.append('n = ' + str(level[0]['n']))
    for feature in FEATURES:
        values = {g[feature] for g in level}
        info.append('{0} = {1}..{2}'.format(feature, min(values), max(values)))
    return ', '.join(info)


def get_features_key(level):
    return [f([g[feature] for g in level]) for f, feature in zip(FUNCTIONS, SORT_FEATURES)]


levels = []



for filename in filenames:
    print('reading', filename)
    data = open(filename).read().split('\n')
    level = []
    for line in data:
        try: 
            g = eval(line)
            if not good(g):
                continue            
            level.append(g)
        except Exception as e:
            print(e)
    levels.append(level)

levels = stupid_division(smart_division(levels))

levels = [level for level in levels if len(level) >= MIN_LEVEL_SIZE]

levels.sort(key=get_features_key)

for level in levels:
    print(collect_level_info(level))


# for k, v in levels.items():
#     print('At level', k, ':', len(v), 'graphs')


with open('../js/graphs.js', 'w') as ouf:
    print('var levels = ' + json.dumps(levels, separators=(',',':')), file=ouf)
