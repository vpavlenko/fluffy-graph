var graphs = document.libraries.graphs; 

var correct_answer = -1;

function random_randrange(n) {
    return Math.floor(Math.random() * n);
}

function new_game() {
    add_to_timer(10);
    new_level();
}

function draw_graph(graph, div) {
    
}

function draw_graphs(reference_graph, choices) {
    draw_graph(reference_graph, $("div#reference_graph"));

    var div_choices = $("div#choices");
    div_choices.html("");
    for (var i in choices) {
        var div_choice = $("<div>").attr("data-number", i);
        div_choices.append(div_choice);
        draw_graph(choices[i], div_choice);
    }
}

function new_level() {
    var num_vertices = 4;
    var num_edges = 3;
    var num_choices = 3;

    var reference_graph = generate_graph(num_vertices, num_edges)
    var choices = []
    for (var i = 0; i < num_choices - 1; ++i) {
        choices.push(generate_non_isomorphing(reference_graph))
    }

    correct_answer = random_randrange(num_choices)
    choices = choices[:correct_answer] + [reference_graph] + choices[correct_answer:]

    draw_graphs(reference_graph, choices)

    add_to_timer(5)
}

function handle_choice(k) {
    if (k == correct_answer) {
        new_level();
    } else {
        lose();
    }
}

$(function() {
    new_game();
});