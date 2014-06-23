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

var height = 400;
var width = 400;
var border = 30;
var delta = 35;
var EPSILON = 1e-6;
var MIN_CROSS_PRODUCT = height * width / 10;


function draw_graph_selected_coords(graph, div, coords_variant) {
    var canvas = $("<canvas>").attr("height", height).attr("width", width).addClass("canvas");
    div.html(canvas);

    var context = canvas[0].getContext('2d');
    
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


function draw_graph(graph, div, exclude_coord) {
    var coords_variant = random_randrange_excluded(graph.i.length, exclude_coord);
    draw_graph_selected_coords(graph, div, coords_variant);
}

