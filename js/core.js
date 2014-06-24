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


function mul_vector_matrix(vector, matrix) {
    vector = [vector[0] - width / 2, vector[1] - height / 2];
    vector = [vector[0] * matrix[0][0] + vector[1] * matrix[1][0], 
              vector[0] * matrix[0][1] + vector[1] * matrix[1][1]];
    vector = [vector[0] + width / 2, vector[1] + height / 2];
    return vector;
}


function transform_apply_matrix(coords, matrix) {
    var res = [];
    for (var i in coords) {
        res.push(mul_vector_matrix(coords[i], matrix));
    }
    return res;
}


function transform_rotate(coords) {
    return transform_apply_matrix(coords, [[0, -1], [1, 0]]);
}


function transform_horizontal_flip(coords) {
    return transform_apply_matrix(coords, [[1, 0], [0, -1]]);
}


function transform_vertical_flip(coords) {
    return transform_apply_matrix(coords, [[-1, 0], [0, 1]]);
}


function random_transform(coords) {
    var num_rotations = random_randrange(4);
    for (var i = 0; i < num_rotations; ++i) {
        coords = transform_rotate(coords);
    }
    if (random_randrange(2) == 0) {
        coords = transform_horizontal_flip(coords);
    }
    if (random_randrange(2) == 0) {
        coords = transform_vertical_flip(coords);
    }
    return coords;
}


function draw_graph_selected_coords(graph, div, coords_variant) {
    var canvas = $("<canvas>").attr("height", height).attr("width", width).addClass("canvas");
    div.html(canvas);

    var context = canvas[0].getContext('2d');
    
    var coords = graph.i[coords_variant];

    coords = random_transform(coords)

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

