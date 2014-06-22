#!/usr/bin/env python

from __future__ import print_function
import networkx as nx
import sys
import json
import random



height = 400;
width = 400;
border = 30;
delta = 25;
EPSILON = 1e-6;
MIN_CROSS_PRODUCT = height * width / 50;

def random_with_grid(limit, border, delta):
    # Generates random number in [border; border + delta; border + 2 * delta; ... ; limit - border)
    return random.randrange((limit - 2 * border) / delta) * delta + border;


def generate_grid(num_vertices):
    coords = [];
    for i in range(num_vertices):
        coords.append([random_with_grid(width, border, delta),
                       random_with_grid(height, border, delta)]);
    return coords;


def geom_eq(a, b):
    return abs(a - b) < EPSILON;


def geom_ge(a, b):
    return a + EPSILON > b;


def dot_product(u, v):
    return u[0] * v[0] + u[1] * v[1];


def cross_product(u, v):
    return u[0] * v[1] - u[1] * v[0];


def edge_to_vector(edge, coords):
    return [coords[edge[1]][0] - coords[edge[0]][0],
            coords[edge[1]][1] - coords[edge[0]][1]];


def vector(start, end):
    return [end[0] - start[0], end[1] - start[1]];


def is_good_grid(graph, coords):
    # 1. Check if there are two edges lie on the same line or nearly

    for i in range(len(graph['e'])):
        for j in range(i + 1, len(graph['e'])):
            u = edge_to_vector(graph['e'][i], coords);
            v = edge_to_vector(graph['e'][j], coords);
            if (geom_ge(MIN_CROSS_PRODUCT, abs(cross_product(u, v)))):
                # print(abs(cross_product(u, v)), end='')
                return False;

    # 2. Check if there is any vertex that lie on some edge
    # Look, it also check if there are two vertices with the same coordinates

    for i in range(len(graph['e'])):
        for j in range(graph['n']):
            edge = graph['e'][i];
            if (j == edge[0] or j == edge[1]):
                continue
            u = coords[edge[0]];
            v = coords[edge[1]];
            w = coords[j];
            uv = vector(u, v);
            uw = vector(u, w);
            vw = vector(v, w);
            vu = vector(v, u);
            if ((geom_ge(MIN_CROSS_PRODUCT, cross_product(uw, uv)) and geom_ge(dot_product(uw, uv), 0)
                    and geom_ge(dot_product(vw, vu), 0))):
                # print(84, end='')
                return False;

    return True;


def draw_graph(graph):
    while True:
        coords = generate_grid(graph['n']);
        if (is_good_grid(graph, coords)):
            # print()
            return coords
        else:
            pass
            # print('.', end='')



def drawings(g, n):
    return [draw_graph(g) for i in range(n)]





inp_filename = sys.argv[1]
graph6 = open(inp_filename).read().split()

out_filename = inp_filename.split('.')[0] + '.json'

with open(out_filename, 'w') as ouf:
    for i, graph in enumerate(graph6):
        print(i, '/', len(graph6))
        g = nx.parse_graph6(graph)

        degrees = nx.degree(g).values()
        gr = {
            'n': len(g.nodes()),
            'e': g.edges(),
            't': sum(nx.triangles(g).values()) / 3,  # number of triangles
            'b': len(list(nx.biconnected_components(g))),  # number of biconnected components
            'mind': min(degrees),
            'maxd': max(degrees)
        }

        gr['i'] = drawings(gr, 5)

        print(json.dumps(gr, separators=(',',':')), file=ouf)
        print(json.dumps(gr, separators=(',',':')))
