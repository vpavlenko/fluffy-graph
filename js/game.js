var correct_answer = -1;
var correct_answers = 0;

var current_level = undefined;
var new_level = undefined;

var game_is_on = true;
var timer = 0;

// var MAX_LEVEL = levels.length - 1;
// console.log('num levels = ', MAX_LEVEL)

/*
 * Utilities
 */

function random_randrange(n) {
    return Math.floor(Math.random() * n);
}

function random_randrange_excluded(n, k) {
    while (true) {
        var i = random_randrange(n)
        if (k instanceof Array) {
            console.log('excluded Array', JSON.stringify(k))
            if ($.inArray(i, k) == -1) {
                console.log('return ', i);
                return i;
            }
        } else {
            if (i != k) {
                return i;
            }
        }
    }
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
    $('.game-over').hide();
    game_is_on = true;
    add_to_timer(10);
    generate_new_level();
    switch_to_new_level();
}

function win() {
    var current_correct_answers = ++correct_answers;
    
    $('#counter').addClass('counter-win');
    setTimeout(function() {
        if (current_correct_answers == correct_answers) {
            $('#counter').removeClass('counter-win');
        }
    }, 300);
    
    add_to_timer(4 + Math.round(correct_answers / 7));
    $("#counter").text(correct_answers);
    switch_to_new_level();
}

function lose() {
    $('.game-over').show();
    game_is_on = false;
    $('#timer').html("<span class='lost'>no</span>");
}

function generate_new_level() {
    var level = Math.min(correct_answers, levels.length - 1);
    // var level = Math.min(Math.round(Math.sqrt(2.5 * correct_answers)), MAX_LEVEL);
    console.log('level: ' + level);
    var num_choices = (correct_answers >= 5) ? ((correct_answers >= 30) ? 4 : 3) : 2;

    var reference_graph = random_randrange(levels[level].length);

    var choices = []
    for (var i = 0; i < num_choices - 1; ++i) {
        if (choices.length + 1 < levels[level].length) {
            var choice = random_randrange_excluded(levels[level].length, choices.concat([reference_graph]))
        } else {
            var choice = random_randrange_excluded(levels[level].length, reference_graph);
        }
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
    setTimeout(generate_new_level, 5);
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

    $(document).on('keypress', 'html', function(event) {
        handle_choice(event.keyCode - 49);
    });

    $(document).on('click', '#try-again', function() {
        new_game();
    });

    setInterval(function() {
        // console.log(358);
        decrement_time()
    }, 1000);
});
