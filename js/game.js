var correct_answer = -1;
var correct_answers = 0;

function random_randrange(n) {
    return Math.floor(Math.random() * n);
}

function new_game() {
    add_to_timer(10);
    new_level();
}

function win() {
    correct_answers++;
    $("#counter").text(correct_answers);
    new_level();
}

function lose() {
    new_level();
    console.log("lose");
}

function add_to_timer(n) {
    console.log("Add to timer: " + n)
}

function random_with_grid(limit, border, delta) {
    // Generates random number in [border; border + delta; border + 2 * delta; ... ; limit - border)
    return random_randrange((limit - 2 * border) / delta) * delta + border;
}

function draw_graph(graph, div) {
    var height = 200;
    var width = 200;
    var border = 10;
    var delta = 30;

    var canvas = $("<canvas>").attr("height", height).attr("width", width).addClass("canvas");
    div.html(canvas);

    var context = canvas[0].getContext('2d');

    var coords = [];
    for (var i = 0; i < graph.num_vertices; ++i) {
        coords.push([random_with_grid(width, border, delta),
                     random_with_grid(height, border, delta)]);
    }

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
        context.arc(coords[i][0], coords[i][1], 5, 0, 2 * Math.PI, false);
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

function new_level() {
    var num_vertices = 5;
    var num_edges = 4;
    var num_choices = 4;

    // alert(51);

    var reference_graph = generate_graph(num_vertices, num_edges)
    // alert(54);
    var choices = []
    for (var i = 0; i < num_choices - 1; ++i) {
        // alert(57);
        choices.push(generate_non_isomorphing(reference_graph))
    }

    // alert(59);

    correct_answer = random_randrange(num_choices)
    // correct_answer = 0;
    choices = choices.slice(0, correct_answer).concat([reference_graph]).concat(choices.slice(correct_answer));

    draw_graphs(reference_graph, choices)
}

function handle_choice(k) {
    if (k == correct_answer) {
        win();
    } else {
        lose();
    }
}

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
    console.log(132);
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
        console.log(s, t);
        return s == t;
    }

    var permutations = generate_permutations(a.num_vertices);
    for (var i in permutations) {
        console.log(i);
        if (is_permutation_an_isomorphism(permutations[i])) {
            console.log("true");
            return true;
        }
    }

    console.log("false");
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
});
