generate_graph = function(num_vertices, num_edges) {
    var edges = [];
    var edges_hashes = [];
    for (var i = 0; i < num_edges; ++i) {
        var a = random_randrange(num_vertices);
        var b = random_randrange(num_vertices);
        var edge = [a, b];
        var edge_hash = JSON.stringify(edge);
        if (a >= b || $.inArray(edge_hash, edges_hashes)) {
            --i;
            continue;
        }
        edges.push(edge);
        edges_hashes.push(edge_hash);
    }

    var graph = {
        num_vertices: num_vertices,
        num_edges: num_edges,
        edges: edges
    }

    return graph;
}

generate_non_isomorphing = function(reference_graph) {
    while (true) {
        var new_graph = generate_graph(reference_graph.num_vertices, reference_graph.num_edges);
        if (!are_isomorphing(reference_graph, new_graph)) {
            return new_graph;
        }
    }
}

function edge_comparator(a, b) {
    return (a[0] == b[0] && a[1] == b[1]) ? (0) : ((a[0] < b[0] || a[0] == b[0] && a[1] < b[1]) ? (-1) : (1));
}

function generate_edge_set_hash(graph) {
    var copy_edges = graph.edges.slice(0);
    copy_edges.sort(edge_comparator);
    return JSON.stringify(copy_edges);
}

are_isomorphing = function(a, b) {
    function is_permutation_an_isomorphism(permutation) {
        var b_edge_set = [];
        for (var i in b.edges) {
            b_edge_set.push([permutation[b.edges[i][0]], permutation[b.edges[i][1]]])
        }
        return generate_edge_set_hash(a.edges) == generate_edge_set_hash(b_edge_set);
    }

    var permutations = generate_permutations(a.num_vertices);
    for (var i in permutations) {
        if (is_permutation_an_isomorphism(permutations[i])) {
            return true;
        }
    }

    return false;
}

generate_permutations = function(n) {
    var permArr = [],
        usedChars = [];

    function permute(input) {
        var i, ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
                permArr.push(usedChars.slice());
            }
            permute(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        return permArr
    };

    var array = [];
    for (var i = 0; i < n; ++i) {
        array.push(i);
    }

    return permute(array);
}
