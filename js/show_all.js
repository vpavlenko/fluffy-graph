$(function() {
    for (var i = 50; i < 69; ++i) {
        var level_div = $('<div>').text("Level #" + i);
        var level = levels[i]
        for (var j in level) {
            var graph = level[j]
            for (var bucket in graph.i) {
                var bucket_div = $('<div class="bucket">')
                for (var k in graph.i[bucket]) {
                    var layout_span = $('<span class="choice">');
                    var coords = graph.i[bucket][k];
                    draw_graph_selected_coords(graph, layout_span, coords);
                    bucket_div.append(layout_span);
                }
                level_div.append(bucket_div);
            }
            level_div.append($('<hr>'));
        }
        $("#all").append(level_div);
    }
});
