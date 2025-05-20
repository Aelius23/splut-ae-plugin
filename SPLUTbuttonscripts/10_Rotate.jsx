// Rotate Selected Layer 90 Degrees
// This script rotates the currently selected layer by 90 degrees clockwise

(function() {
    // Check if a project is open
    if (app.project === null) {
        alert("Please open a project first.");
        return;
    }
    
    // Check if a composition is active
    if (app.project.activeItem === null || !(app.project.activeItem instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }
    
    // Get the active composition
    var comp = app.project.activeItem;
    
    // Check if any layers are selected
    if (comp.selectedLayers.length === 0) {
        alert("Please select at least one layer.");
        return;
    }
    
    // Begin undo group
    app.beginUndoGroup("Rotate Selected Layers 90 Degrees");
    
    // Process each selected layer
    for (var i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i];
        
        // Check if the layer has a rotation property (most layers do)
        if (layer.transform.rotation !== null) {
            // Get the current rotation value
            var currentRotation = layer.transform.rotation.value;
            
            // Add 90 degrees (After Effects uses degrees internally despite showing radians in expressions)
            layer.transform.rotation.setValue(currentRotation + 90);
        }
    }
    
    // End undo group
    app.endUndoGroup();
    
    // Show success message
    if (comp.selectedLayers.length === 1) {
        alert("1 layer rotated 90 degrees clockwise.");
    } else {
        alert(comp.selectedLayers.length + " layers rotated 90 degrees clockwise.");
    }
})();