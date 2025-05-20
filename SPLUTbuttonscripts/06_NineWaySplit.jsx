// Nine-way grid (3x3) layout
var comp = app.project.activeItem;
if (!comp || !(comp instanceof CompItem)) {
    alert("Please select a composition with your nine clips.");
} else {
    var layers = comp.selectedLayers;
    if (layers.length !== 9) {
        alert("Please select exactly NINE clips.");
    } else {
        var compWidth = comp.width / 3;
        var compHeight = comp.height / 3;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            // Scale video to fit within a grid cell
            var scaleFactor = Math.min(compWidth / layer.source.width, compHeight / layer.source.height) * 100;
            layer.transform.scale.setValue([scaleFactor, scaleFactor]);

            // Position each layer in a 3x3 grid
            var x = (i % 3) * compWidth + compWidth / 2;
            var y = Math.floor(i / 3) * compHeight + compHeight / 2;
            layer.transform.position.setValue([x, y]);
        }

        alert("Nine-way grid (3x3) applied.");
    }
}
