var correct_answer = -1;
var correct_answers = 0;

var current_level = undefined;
var new_level = undefined;

var game_is_on = true;
var timer = 0;

/*
 * Utilities
 */

function random_randrange(n) {
    return Math.floor(Math.random() * n);
}

/*
 * Graph drawing logic
 */

function random_with_grid(limit, border, delta) {
    // Generates random number in [border; border + delta; border + 2 * delta; ... ; limit - border)
    return random_randrange((limit - 2 * border) / delta) * delta + border;
}

var height = 400;
var width = 400;
var border = 30;
var delta = 25;
var EPSILON = 1e-6;
var MIN_CROSS_PRODUCT = height * width / 30;
// var MIN_CROSS_PRODUCT = 0;

function generate_grid(num_vertices) {
    var coords = [];
    for (var i = 0; i < num_vertices; ++i) {
        coords.push([random_with_grid(width, border, delta),
                     random_with_grid(height, border, delta)]);
    }
    return coords;
}

function geom_eq(a, b) {
    return Math.abs(a - b) < EPSILON;
}

function geom_ge(a, b) {
    return a + EPSILON > b;
}

function dot_product(u, v) {
    return u[0] * v[0] + u[1] * v[1];
}

function cross_product(u, v) {
    return u[0] * v[1] - u[1] * v[0];
}

function edge_to_vector(edge, coords) {
    return [coords[edge[1]][0] - coords[edge[0]][0],
            coords[edge[1]][1] - coords[edge[0]][1]];
}

function vector(start, end) {
    return [end[0] - start[0], end[1] - start[1]];
}

function is_good_grid(graph, coords) {
    // 1. Check if there are two edges lie on the same line or nearly

    for (var i in graph.edges) {
        for (var j in graph.edges) {
            if (i >= j) {
                continue;
            }
            var u = edge_to_vector(graph.edges[i], coords);
            var v = edge_to_vector(graph.edges[j], coords);
            if (geom_ge(MIN_CROSS_PRODUCT, Math.abs(cross_product(u, v)))) {
                return false;
            }
        }
    }

    // 2. Check if there is any vertex that lie on some edge
    // Look, it also check if there are two vertices with the same coordinates

    for (var i in graph.edges) {
        for (var j = 0; j < graph.num_vertices; ++j) {
            var edge = graph.edges[i];
            if (j == edge[0] || j == edge[1]) {
                continue;
            }
            var u = coords[edge[0]];
            var v = coords[edge[1]];
            var w = coords[j];
            var uv = vector(u, v);
            var uw = vector(u, w);
            var vw = vector(v, w);
            var vu = vector(v, u);
            if (geom_ge(MIN_CROSS_PRODUCT, cross_product(uw, uv)) && geom_ge(dot_product(uw, uv), 0)
                    && geom_ge(dot_product(vw, vu), 0)) {
                return false;
            }
        }
    }

    return true;
}

function draw_graph(graph, div) {
    var canvas = $("<canvas>").attr("height", height).attr("width", width).addClass("canvas");
    div.html(canvas);

    var context = canvas[0].getContext('2d');

    var coords = graph.coords;

    for (var i in graph.edges) {
        var a = graph.edges[i][0];
        var b = graph.edges[i][1];

        context.beginPath();
        context.moveTo(coords[a][0], coords[a][1]);
        context.lineTo(coords[b][0], coords[b][1]);
        context.stroke();
    }

    for (var i in coords) {
        context.beginPath();
        context.arc(coords[i][0], coords[i][1], 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'blue';
        context.fill();
    }
}

function draw_graphs(reference_graph, choices) {
    draw_graph(reference_graph, $("div#reference_graph"));

    var div_choices = $("div#choices");
    div_choices.html("");
    for (var i in choices) {
        var div_choice = $("<div class='choice'>").attr("data-number", i);
        div_choices.append(div_choice);
        draw_graph(choices[i], div_choice);
    }
}

function attach_coords(graph) {
    while (true) {
        var coords = generate_grid(graph.num_vertices);
        if (is_good_grid(graph, coords)) {
            break;
        }
    }
    graph.coords = coords;
}

/*
 * Switch between levels logic
 */

function new_game() {
    game_is_on = true;
    add_to_timer(10);
    generate_new_level();
    switch_to_new_level();
}

function win() {
    correct_answers++;
    add_to_timer(3);
    $("#counter").text(correct_answers);
    switch_to_new_level();
}

function lose() {
    game_is_on = false;
    $('#timer').text("lost");
    // switch_to_new_level();
}

function copy_graph(graph) {
    return {
        num_vertices: graph.num_vertices,
        num_edges: graph.num_edges,
        edges: graph.edges.slice(0)
    }
}

function generate_new_level() {
    var num_vertices = (correct_answers > 5) ? 5 : 4;
    var num_edges = (correct_answers > 10) ? 6 : ((correct_answers > 7) ? 5 : 4);
    var num_choices = (correct_answers > 15) ? 3 : 2;

    var reference_graph = generate_graph(num_vertices, num_edges)
    attach_coords(reference_graph);

    var choices = []
    for (var i = 0; i < num_choices - 1; ++i) {
        var choice = generate_non_isomorphing(reference_graph);
        attach_coords(choice);
        choices.push(choice);
    }

    var correct_answer = random_randrange(num_choices)
    var reference_graph_copy = copy_graph(reference_graph);
    attach_coords(reference_graph_copy);
    choices = choices.slice(0, correct_answer).concat([reference_graph_copy]).concat(choices.slice(correct_answer));

    new_level = {
        correct_answer: correct_answer,
        reference_graph: reference_graph,
        choices: choices
    };
}

function switch_to_new_level() {
    current_level = new_level;
    draw_graphs(current_level.reference_graph, current_level.choices);
    // dirty hack. otherwise it doesn't redraw
    setTimeout(generate_new_level, 20);
}

function handle_choice(k) {
    if (k == current_level.correct_answer) {
        win();
    } else {
        lose();
    }
}

function visualize_timer() {
    $('#timer').text(timer);
}

function add_to_timer(n) {
    timer += n;
    visualize_timer();
}

function decrement_time() {
    if (game_is_on) {
        timer--;
        visualize_timer();
    };
    if (timer <= 0) {
        lose();
    }
}

/*
 * Graph generating logic
 */

generate_graph = function(num_vertices, num_edges) {
    var edges = [];
    var edges_hashes = [];
    for (var i = 0; i < num_edges; ++i) {
        var a = random_randrange(num_vertices);
        var b = random_randrange(num_vertices);
        var edge = [a, b];
        var edge_hash = JSON.stringify(edge);
        // alert(edge_hash);
        // alert(JSON.stringify(edges_hashes));
        if (a >= b || $.inArray(edge_hash, edges_hashes) != -1) {
            // alert(90);
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

function generate_edge_set_hash(edge_set) {
    var copy_edges = edge_set.slice(0);
    copy_edges.sort(edge_comparator);
    return JSON.stringify(copy_edges);
}

are_isomorphing = function(a, b) {
    function is_permutation_an_isomorphism(permutation) {
        var b_edge_set = [];
        for (var i in b.edges) {
            var u = permutation[b.edges[i][0]];
            var v = permutation[b.edges[i][1]];
            b_edge_set.push([Math.min(u, v), Math.max(u, v)]);
        }
        var s = generate_edge_set_hash(a.edges);
        var t = generate_edge_set_hash(b_edge_set);
        return s == t;
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

$(function() {
    new_game();

    $(document).on('click', '.choice', function() {
       handle_choice($(this).attr("data-number"));
    });

    setInterval(function() {
        console.log(358);
        decrement_time()
    }, 1000);
});
