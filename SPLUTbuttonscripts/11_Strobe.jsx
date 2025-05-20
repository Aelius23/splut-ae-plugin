// Strobe Effect Generator (Shape Layer Version)
// Creates an efficient looping strobe effect using expressions and shape layers

(function() {
    // Check if a project is open
    if (!app.project) {
        alert("Please open a project first.");
        return;
    }

    // Check if a composition is selected
    if (!app.project.activeItem || !(app.project.activeItem instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var comp = app.project.activeItem;
    
    // Create the dialog
    var dialog = new Window("dialog", "Strobe Effect Generator");
    dialog.orientation = "column";
    dialog.alignChildren = ["center", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;

    // Add instructions
    dialog.add("statictext", undefined, "Create an efficient strobing effect with adjustable color.");
    
    // Input group for frame settings
    var frameGroup = dialog.add("group", undefined);
    frameGroup.orientation = "row";
    frameGroup.alignChildren = ["left", "center"];
    frameGroup.spacing = 10;
    
    frameGroup.add("statictext", undefined, "Strobe every:");
    var frameInput = frameGroup.add("edittext", undefined, "2");
    frameInput.characters = 4;
    frameInput.active = true;
    frameGroup.add("statictext", undefined, "frames");
    
    // Duration group
    var durationGroup = dialog.add("group", undefined);
    durationGroup.orientation = "row";
    durationGroup.alignChildren = ["left", "center"];
    durationGroup.spacing = 10;
    
    durationGroup.add("statictext", undefined, "Duration of color frame:");
    var durationInput = durationGroup.add("edittext", undefined, "1");
    durationInput.characters = 4;
    durationGroup.add("statictext", undefined, "frames");

    // Initial length group (in seconds)
    var lengthGroup = dialog.add("group", undefined);
    lengthGroup.orientation = "row";
    lengthGroup.alignChildren = ["left", "center"];
    lengthGroup.spacing = 10;
    
    lengthGroup.add("statictext", undefined, "Initial layer length:");
    var lengthInput = lengthGroup.add("edittext", undefined, "60");
    lengthInput.characters = 4;
    lengthGroup.add("statictext", undefined, "seconds");
    
    // Set default color to black
    var colorValue = [0, 0, 0]; // Pure black
    
    // Button group
    var buttonGroup = dialog.add("group", undefined);
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["center", "center"];
    buttonGroup.spacing = 10;
    
    var cancelButton = buttonGroup.add("button", undefined, "Cancel", {name: "cancel"});
    var okButton = buttonGroup.add("button", undefined, "OK", {name: "ok"});
    
    // Show the dialog
    if (dialog.show() == 1) {
        // Validate input
        var strobeInterval = parseInt(frameInput.text);
        var colorFrameDuration = parseInt(durationInput.text);
        var initialLength = parseFloat(lengthInput.text);
        
        if (isNaN(strobeInterval) || strobeInterval < 1) {
            alert("Please enter a valid number for strobe interval (minimum 1).");
            return;
        }
        
        if (isNaN(colorFrameDuration) || colorFrameDuration < 1 || colorFrameDuration >= strobeInterval) {
            alert("Please enter a valid number for color frame duration (minimum 1, less than strobe interval).");
            return;
        }
        
        if (isNaN(initialLength) || initialLength <= 0) {
            alert("Please enter a valid initial length in seconds.");
            return;
        }
        
        // Create the effect
        app.beginUndoGroup("Create Efficient Strobe Effect (Shape Layer)");
        
        try {
            // Create a shape layer
            var strobeLayer = comp.layers.addShape();
            strobeLayer.name = "Strobe Effect (Shape)";
            strobeLayer.moveToBeginning(); // Move to top of layer stack
            
            // Set the initial duration of the layer
            strobeLayer.outPoint = Math.min(comp.duration, initialLength);
            
            // First reset the anchor point to [0,0] to make positioning predictable
            strobeLayer.property("Transform").property("Anchor Point").setValue([0, 0]);
            
            // Add a rectangle shape that covers the comp
            var shapeGroup = strobeLayer.property("Contents").addProperty("ADBE Vector Group");
            shapeGroup.name = "Strobe Rectangle";
            
            var rect = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
            rect.property("ADBE Vector Rect Size").setValue([comp.width, comp.height]);
            rect.property("ADBE Vector Rect Position").setValue([comp.width/2, comp.height/2]);
            
            // Now set the position to the center of the comp
            strobeLayer.property("Transform").property("Position").setValue([comp.width/2, comp.height/2]);
            
            // Move the anchor point to the center of the shape/comp
            strobeLayer.property("Transform").property("Anchor Point").setValue([comp.width/2, comp.height/2]);
            
            // Add fill to the shape
            var fill = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
            fill.property("ADBE Vector Fill Color").setValue(colorValue);
            
            // Calculate the loop cycle in seconds
            var frameRate = comp.frameRate;
            var loopCycleDuration = strobeInterval / frameRate;
            
            // Calculate color frame duration in seconds
            var colorDuration = colorFrameDuration / frameRate;
            
            // Apply expression to shape group transform opacity
            var opacityProperty = shapeGroup.property("Transform").property("Opacity");
            
            // Initially set opacity to 100%
            opacityProperty.setValue(100);
            
            // Build an expression that creates a strobe effect without excessive keyframes
            var expression = [
                "// Strobe Effect Expression",
                "// Strobe Interval: " + strobeInterval + " frames",
                "// Color Duration: " + colorFrameDuration + " frames",
                "",
                "// Convert frames to seconds for calculation",
                "var cycleTime = " + loopCycleDuration.toFixed(6) + ";",
                "var colorTime = " + colorDuration.toFixed(6) + ";",
                "",
                "// Calculate the current position within the cycle",
                "var cyclePosition = time % cycleTime;",
                "",
                "// If within the color frame portion of the cycle, show color (100% opacity)",
                "// Otherwise, hide the shape (0% opacity)",
                "if (cyclePosition < colorTime) {",
                "    100; // Color visible (opaque)",
                "} else {",
                "    0;   // Transparent (show footage)",
                "}"
            ].join("\n");
            
            // Apply the expression
            opacityProperty.expression = expression;
            
            alert("Efficient strobe effect created successfully!\n\n" + 
                  "The effect is initially " + initialLength + " seconds long but can be extended by adjusting the layer's out point.");
        } catch (error) {
            alert("Error creating strobe effect: " + error.toString());
        }
        
        app.endUndoGroup();
    }
})();