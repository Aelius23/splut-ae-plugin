// Horizontal Split Screen Generator
// This script creates a horizontal split screen with 3 footage items
// Uses selected layers from the timeline instead of asking for specific footage

(function() {
    // Check if a project is open
    if (!app.project) {
        alert("Please open a project first.");
        return;
    }

    // Check if a composition is active
    if (!app.project.activeItem || !(app.project.activeItem instanceof CompItem)) {
        alert("Please select a composition with at least 3 layers.");
        return;
    }
    
    // Get the active composition
    var comp = app.project.activeItem;
    
    // Check if at least 3 layers are selected
    if (comp.selectedLayers.length < 3) {
        alert("Please select at least 3 layers in your composition.");
        return;
    }

    app.beginUndoGroup("Create Horizontal Split Screen");

    // Create a new composition dialog
    var compSettings = {
        name: "Horizontal Split Screen",
        width: 1920,
        height: 1080,
        pixelAspect: 1,
        duration: 10,
        frameRate: 30
    };

    // Ask user for composition settings
    var compSettingsDialog = new Window("dialog", "Composition Settings");
    compSettingsDialog.orientation = "column";
    
    // Width
    var widthGroup = compSettingsDialog.add("group");
    widthGroup.add("statictext", undefined, "Width:");
    var widthInput = widthGroup.add("edittext", undefined, compSettings.width);
    widthInput.characters = 6;
    
    // Height
    var heightGroup = compSettingsDialog.add("group");
    heightGroup.add("statictext", undefined, "Height:");
    var heightInput = heightGroup.add("edittext", undefined, compSettings.height);
    heightInput.characters = 6;
    
    // Duration
    var durationGroup = compSettingsDialog.add("group");
    durationGroup.add("statictext", undefined, "Duration (seconds):");
    var durationInput = durationGroup.add("edittext", undefined, compSettings.duration);
    durationInput.characters = 6;
    
    // Frame Rate
    var frameRateGroup = compSettingsDialog.add("group");
    frameRateGroup.add("statictext", undefined, "Frame Rate:");
    var frameRateInput = frameRateGroup.add("edittext", undefined, compSettings.frameRate);
    frameRateInput.characters = 6;
    
    // Buttons
    var buttonGroup = compSettingsDialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    okButton.onClick = function() {
        compSettings.width = parseInt(widthInput.text);
        compSettings.height = parseInt(heightInput.text);
        compSettings.duration = parseFloat(durationInput.text);
        compSettings.frameRate = parseFloat(frameRateInput.text);
        compSettingsDialog.close(1);
    };
    
    cancelButton.onClick = function() {
        compSettingsDialog.close(0);
    };
    
    if (compSettingsDialog.show() !== 1) {
        app.endUndoGroup();
        return;
    }
    
    // Create the output composition
    var outputComp = app.project.items.addComp(
        compSettings.name,
        compSettings.width,
        compSettings.height,
        compSettings.pixelAspect,
        compSettings.duration,
        compSettings.frameRate
    );
    
    // Calculate panel height (1/3 of the comp height)
    var panelHeight = compSettings.height / 3;
    
    // Use the first 3 selected layers
    var selectedLayers = [];
    for (var i = 0; i < Math.min(3, comp.selectedLayers.length); i++) {
        selectedLayers.push(comp.selectedLayers[i]);
    }
    
    // Create the split screen layout
    try {
        // Create nested comp for top section
        var topComp = app.project.items.addComp(
            "Top Section", 
            compSettings.width, 
            panelHeight, 
            compSettings.pixelAspect, 
            compSettings.duration, 
            compSettings.frameRate
        );
        
        // Create nested comp for middle section
        var middleComp = app.project.items.addComp(
            "Middle Section", 
            compSettings.width, 
            panelHeight, 
            compSettings.pixelAspect, 
            compSettings.duration, 
            compSettings.frameRate
        );
        
        // Create nested comp for bottom section
        var bottomComp = app.project.items.addComp(
            "Bottom Section", 
            compSettings.width, 
            panelHeight, 
            compSettings.pixelAspect, 
            compSettings.duration, 
            compSettings.frameRate
        );
        
        // Add top layer to top comp
        try {
            var topLayer;
            var topSource = selectedLayers[0];
            
            if (topSource.source instanceof CompItem) {
                // If it's a composition
                topLayer = topComp.layers.add(topSource.source);
            } else {
                // If it's footage or other layer type
                topLayer = topComp.layers.add(topSource.source);
            }
            
            // Center the layer horizontally
            topLayer.property("Position").setValue([compSettings.width/2, panelHeight/2]);
            
            // Get source dimensions for scaling
            var topWidth, topHeight;
            if (topSource.source.width !== undefined) {
                topWidth = topSource.source.width;
                topHeight = topSource.source.height;
            } else {
                // For solid layers and other types
                topWidth = topSource.width || compSettings.width;
                topHeight = topSource.height || panelHeight;
            }
            
            // Fit to width
            var topWidthScale = compSettings.width / topWidth * 100;
            topLayer.property("Scale").setValue([topWidthScale, topWidthScale]);
            
            // Set the in point to 0
            topLayer.startTime = 0;
            
            // Copy effects if any
            try {
                if (topSource.property("Effects") && topSource.property("Effects").numProperties > 0) {
                    for (var e = 1; e <= topSource.property("Effects").numProperties; e++) {
                        var effect = topSource.property("Effects").property(e);
                        topLayer.property("Effects").addProperty(effect.matchName);
                    }
                }
            } catch (effectErr) {
                // Ignore effect copy errors
            }
        } catch (e) {
            $.writeln("Error adding top layer: " + e.toString());
        }
        
        // Add middle layer to middle comp
        try {
            var middleLayer;
            var middleSource = selectedLayers[1];
            
            if (middleSource.source instanceof CompItem) {
                middleLayer = middleComp.layers.add(middleSource.source);
            } else {
                middleLayer = middleComp.layers.add(middleSource.source);
            }
            
            // Center the layer horizontally
            middleLayer.property("Position").setValue([compSettings.width/2, panelHeight/2]);
            
            // Get source dimensions for scaling
            var middleWidth, middleHeight;
            if (middleSource.source.width !== undefined) {
                middleWidth = middleSource.source.width;
                middleHeight = middleSource.source.height;
            } else {
                middleWidth = middleSource.width || compSettings.width;
                middleHeight = middleSource.height || panelHeight;
            }
            
            // Fit to width
            var middleWidthScale = compSettings.width / middleWidth * 100;
            middleLayer.property("Scale").setValue([middleWidthScale, middleWidthScale]);
            
            // Set the in point to 0
            middleLayer.startTime = 0;
            
            // Copy effects if any
            try {
                if (middleSource.property("Effects") && middleSource.property("Effects").numProperties > 0) {
                    for (var e = 1; e <= middleSource.property("Effects").numProperties; e++) {
                        var effect = middleSource.property("Effects").property(e);
                        middleLayer.property("Effects").addProperty(effect.matchName);
                    }
                }
            } catch (effectErr) {
                // Ignore effect copy errors
            }
        } catch (e) {
            $.writeln("Error adding middle layer: " + e.toString());
        }
        
        // Add bottom layer to bottom comp
        try {
            var bottomLayer;
            var bottomSource = selectedLayers[2];
            
            if (bottomSource.source instanceof CompItem) {
                bottomLayer = bottomComp.layers.add(bottomSource.source);
            } else {
                bottomLayer = bottomComp.layers.add(bottomSource.source);
            }
            
            // Center the layer horizontally
            bottomLayer.property("Position").setValue([compSettings.width/2, panelHeight/2]);
            
            // Get source dimensions for scaling
            var bottomWidth, bottomHeight;
            if (bottomSource.source.width !== undefined) {
                bottomWidth = bottomSource.source.width;
                bottomHeight = bottomSource.source.height;
            } else {
                bottomWidth = bottomSource.width || compSettings.width;
                bottomHeight = bottomSource.height || panelHeight;
            }
            
            // Fit to width
            var bottomWidthScale = compSettings.width / bottomWidth * 100;
            bottomLayer.property("Scale").setValue([bottomWidthScale, bottomWidthScale]);
            
            // Set the in point to 0
            bottomLayer.startTime = 0;
            
            // Copy effects if any
            try {
                if (bottomSource.property("Effects") && bottomSource.property("Effects").numProperties > 0) {
                    for (var e = 1; e <= bottomSource.property("Effects").numProperties; e++) {
                        var effect = bottomSource.property("Effects").property(e);
                        bottomLayer.property("Effects").addProperty(effect.matchName);
                    }
                }
            } catch (effectErr) {
                // Ignore effect copy errors
            }
        } catch (e) {
            $.writeln("Error adding bottom layer: " + e.toString());
        }
        
        // Add the nested comps to the output comp
        try {
            // Add top section comp
            var topCompLayer = outputComp.layers.add(topComp);
            topCompLayer.property("Position").setValue([compSettings.width/2, panelHeight/2]);
            
            // Add middle section comp
            var middleCompLayer = outputComp.layers.add(middleComp);
            middleCompLayer.property("Position").setValue([compSettings.width/2, panelHeight*1.5]);
            
            // Add bottom section comp
            var bottomCompLayer = outputComp.layers.add(bottomComp);
            bottomCompLayer.property("Position").setValue([compSettings.width/2, panelHeight*2.5]);
            
            // Add thin divider lines
            var topLine = outputComp.layers.addSolid([1, 1, 1], "Top Divider", outputComp.width, 2, 1);
            topLine.property("Position").setValue([outputComp.width/2, panelHeight]);
            
            var bottomLine = outputComp.layers.addSolid([1, 1, 1], "Bottom Divider", outputComp.width, 2, 1);
            bottomLine.property("Position").setValue([outputComp.width/2, panelHeight*2]);
        } catch (e) {
            $.writeln("Error adding comps to output comp: " + e.toString());
            alert("Error: " + e.toString());
        }
        
        // Open the composition
        outputComp.openInViewer();
        
        alert("Horizontal split screen created!");
    } catch (error) {
        $.writeln("Main script error: " + error.toString());
        alert("An error occurred: " + error.toString());
    }
    
    app.endUndoGroup();
})();