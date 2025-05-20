// Ensure two selected layers (A Cam & B Cam)
var comp = app.project.activeItem;
if (!comp || !(comp instanceof CompItem)) {
    alert("Please select a composition with your multicam clips.");
} else {
    var layers = comp.selectedLayers;
    if (layers.length !== 2) {
        alert("Please select exactly TWO clips (A Cam & B Cam).");
    } else {
        var aCam = layers[0];
        var bCam = layers[1];

        var compWidth = comp.width;
        var compHeight = comp.height;
        var halfWidth = compWidth / 2;

        // Get original video dimensions
        var aSourceWidth = aCam.source.width;
        var aSourceHeight = aCam.source.height;
        var bSourceWidth = bCam.source.width;
        var bSourceHeight = bCam.source.height;

        // Calculate scale to fit half of the composition width
        var aScaleFactor = (halfWidth / aSourceWidth) * 100;
        var bScaleFactor = (halfWidth / bSourceWidth) * 100;

        // Apply uniform scale (preserving aspect ratio)
        aCam.transform.scale.setValue([aScaleFactor, aScaleFactor]);
        bCam.transform.scale.setValue([bScaleFactor, bScaleFactor]);

        // Center each clip in its respective half
        aCam.transform.position.setValue([halfWidth / 2, compHeight / 2]); // Left side
        bCam.transform.position.setValue([halfWidth + halfWidth / 2, compHeight / 2]); // Right side

        alert("Multicam Split-Screen Fixed: A Cam (Left), B Cam (Right), No Forced Black Bars");
    }
}
