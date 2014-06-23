$(function() {
    for (var i = 0; i < 20; ++i) {
        var level_div = $('<div>').text("Level #" + i);
        var level = levels[i]
        for (var j in level) {
            var graph = level[j]
            for (var k in graph.i) {
                var layout_div = $('<span class="choice">');
                draw_graph_selected_coords(graph, layout_div, k);
                level_div.append(layout_div);
            }
            level_div.append($('<hr>'));
        }
        $("#all").append(level_div);
    }
});
