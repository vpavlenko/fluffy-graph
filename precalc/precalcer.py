#!/usr/bin/env python

from __future__ import print_function
import networkx as nx
import sys
import json

inp_filename = sys.argv[1]
graph6 = open(inp_filename).read().split()

out_filename = inp_filename.split('.')[0] + '.json'

with open(out_filename, 'w') as ouf:
    for graph in graph6:
        g = nx.parse_graph6(graph)

        gr = {
            'n': len(g.nodes()),
            'e': g.edges(),
            't': sum(nx.triangles(g).values()) / 3,  # number of triangles
            'b': len(list(nx.biconnected_components(g))),  # number of biconnected components
        }

        print(json.dumps(gr, separators=(',',':')), file=ouf)
