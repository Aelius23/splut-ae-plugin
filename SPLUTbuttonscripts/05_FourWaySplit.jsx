// Four-way grid (2x2) layout
var comp = app.project.activeItem;
if (!comp || !(comp instanceof CompItem)) {
    alert("Please select a composition with your four clips.");
} else {
    var layers = comp.selectedLayers;
    if (layers.length !== 4) {
        alert("Please select exactly FOUR clips.");
    } else {
        var compWidth = comp.width / 2;
        var compHeight = comp.height / 2;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            // Scale video to fit within a quadrant
            var scaleFactor = Math.min(compWidth / layer.source.width, compHeight / layer.source.height) * 100;
            layer.transform.scale.setValue([scaleFactor, scaleFactor]);

            // Position each layer in a 2x2 grid
            var x = (i % 2) * compWidth + compWidth / 2;
            var y = Math.floor(i / 2) * compHeight + compHeight / 2;
            layer.transform.position.setValue([x, y]);
        }

        alert("Four-way grid (2x2) applied.");
    }
}
