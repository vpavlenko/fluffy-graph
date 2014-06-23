#!/bin/bash

python precalcer.py connected_4_vertices.graph6 || exit 1
python precalcer.py connected_5_vertices.graph6 || exit 1
python precalcer.py connected_6_vertices.graph6 || exit 1
python precalcer.py connected_7_vertices.graph6 || exit 1

python3 gen_smart_levels.py
