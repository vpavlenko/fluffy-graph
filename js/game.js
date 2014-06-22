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

function random_randrange_excluded(n, k) {
    while (true) {
        var i = random_randrange(n)
        if (i != k) {
            return i;
        }
    }
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
var delta = 35;
var EPSILON = 1e-6;
var MIN_CROSS_PRODUCT = height * width / 10;

function draw_graph(graph, div, exclude_coord) {
    var canvas = $("<canvas>").attr("height", height).attr("width", width).addClass("canvas");
    div.html(canvas);

    var context = canvas[0].getContext('2d');

    var coords_variant = random_randrange_excluded(graph.i.length, exclude_coord);
    console.log(coords_variant);
    var coords = graph.i[coords_variant];

    for (var i in graph.e) {
        var a = graph.e[i][0];
        var b = graph.e[i][1];

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

    return coords_variant;
}

function draw_graphs(reference_graph, choices, correct_answer) {
    var reference_variant = draw_graph(reference_graph, $("div#reference_graph"), -1);

    var div_choices = $("div#choices");
    div_choices.html("");
    for (var i in choices) {
        var div_choice = $("<div class='choice'>").attr("data-number", i);
        div_choices.append(div_choice);
        console.log(i, current_level.correct_answer, reference_variant);
        draw_graph(choices[i], div_choice, (i == current_level.correct_answer) ? reference_variant : -1);
    }
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
}

function generate_new_level() {
    var level = Math.min(Math.round(Math.sqrt(correct_answers)), 8);
    var num_choices = (correct_answers >= 15) ? 3 : 2;

    var reference_graph = random_randrange(levels[level].length);

    var choices = []
    for (var i = 0; i < num_choices - 1; ++i) {
        var choice = random_randrange_excluded(levels[level].length, reference_graph)
        choices.push(levels[level][choice]);
    }

    reference_graph = levels[level][reference_graph];

    var correct_answer = random_randrange(num_choices)
    choices = choices.slice(0, correct_answer).concat([reference_graph]).concat(choices.slice(correct_answer));

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
    if (game_is_on) {
        if (k == current_level.correct_answer) {
            win();
        } else {
            lose();
        }
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

$(function() {
    new_game();

    $(document).on('click', '.choice', function() {
       handle_choice($(this).attr("data-number"));
    });

    setInterval(function() {
        // console.log(358);
        decrement_time()
    }, 1000);
});
