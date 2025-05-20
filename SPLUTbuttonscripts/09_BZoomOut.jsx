// Fun Dynamic Zoom Out Effect
// This script adds a quick 9-frame zoom out effect (170% to 100% scale) with motion blur at the current time indicator

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
        alert("Please select a layer to apply the zoom out effect to.");
        return;
    }
    
    // Get the current time of the composition
    var currentTime = comp.time;
    
    // Duration of the zoom effect in seconds (9 frames at ~24fps)
    var zoomDuration = 9/24;
    
    // Begin undo group
    app.beginUndoGroup("Add Fun Dynamic Zoom Out Effect");
    
    // Process the first selected layer
    var layer = comp.selectedLayers[0];
    
    // Turn on motion blur for the layer
    layer.motionBlur = true;
    // Make sure composition motion blur is enabled
    comp.motionBlur = true;
    
    // Get the current scale value (at current time, accounting for keyframes)
    var currentScale = layer.transform.scale.valueAtTime(currentTime, false);
    
    // Calculate start and end scales
    var startScale = currentScale; // Current scale as starting point
    var endScale = [startScale[0] / 1.7, startScale[1] / 1.7, startScale[2] / 1.7]; // Shrink to ~59% of current scale
    
    // Add keyframes for scale
    layer.transform.scale.setValueAtTime(currentTime, startScale);
    layer.transform.scale.setValueAtTime(currentTime + zoomDuration, endScale);
    
    // Get keyframe indices to apply easing
    var startKeyIndex = layer.transform.scale.nearestKeyIndex(currentTime);
    var endKeyIndex = layer.transform.scale.nearestKeyIndex(currentTime + zoomDuration);
    
    // Apply easing to keyframes (reversed from zoom in for natural feel)
    
    // For the first keyframe - outgoing velocity (start with a hit)
    var easeOut = new KeyframeEase(0, 85); // Strong influence for initial "hit"
    var firstKeyEaseOut = [easeOut, easeOut, easeOut];
    var emptyEaseIn = [new KeyframeEase(0, 0.1), new KeyframeEase(0, 0.1), new KeyframeEase(0, 0.1)];
    layer.transform.scale.setTemporalEaseAtKey(startKeyIndex, emptyEaseIn, firstKeyEaseOut);
    
    // For the second keyframe - incoming velocity (smoother landing)
    var easeIn = new KeyframeEase(0, 33.33); // Moderate influence for smooth finish
    var secondKeyEaseIn = [easeIn, easeIn, easeIn];
    var emptyEaseOut = [new KeyframeEase(0, 0.1), new KeyframeEase(0, 0.1), new KeyframeEase(0, 0.1)];
    layer.transform.scale.setTemporalEaseAtKey(endKeyIndex, secondKeyEaseIn, emptyEaseOut);
    
    // Set the work area to preview the effect
    comp.workAreaStart = Math.max(0, currentTime - 0.5);
    comp.workAreaDuration = zoomDuration + 1;
    
    // End undo group
    app.endUndoGroup();
    
    // Show success message
    alert("Fun Dynamic Zoom OUT effect applied!\n\n" +
          "• Motion blur enabled\n" +
          "• 9 frames duration (at 24fps)\n" +
          "• Zooms OUT to 59% of starting scale\n" +
          "• Custom velocity easing applied");
})();