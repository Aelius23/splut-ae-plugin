// Vertical Split Screen Generator
// This script creates a vertical split screen with 3 footage items
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

    app.beginUndoGroup("Create Vertical Split Screen");

    // Create a new composition dialog
    var compSettings = {
        name: "Vertical Split Screen",
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
    
    // Calculate panel width (1/3 of the comp width)
    var panelWidth = compSettings.width / 3;
    
    // Use the first 3 selected layers
    var selectedLayers = [];
    for (var i = 0; i < Math.min(3, comp.selectedLayers.length); i++) {
        selectedLayers.push(comp.selectedLayers[i]);
    }
    
    // Create the split screen layout
    try {
        // Create nested comp for left section
        var leftComp = app.project.items.addComp(
            "Left Section", 
            panelWidth, 
            compSettings.height, 
            compSettings.pixelAspect, 
            compSettings.duration, 
            compSettings.frameRate
        );
        
        // Create nested comp for middle section
        var middleComp = app.project.items.addComp(
            "Middle Section", 
            panelWidth, 
            compSettings.height, 
            compSettings.pixelAspect, 
            compSettings.duration, 
            compSettings.frameRate
        );
        
        // Create nested comp for right section
        var rightComp = app.project.items.addComp(
            "Right Section", 
            panelWidth, 
            compSettings.height, 
            compSettings.pixelAspect, 
            compSettings.duration, 
            compSettings.frameRate
        );
        
        // Add left layer to left comp
        try {
            var leftLayer;
            var leftSource = selectedLayers[0];
            
            if (leftSource.source instanceof CompItem) {
                // If it's a composition
                leftLayer = leftComp.layers.add(leftSource.source);
            } else {
                // If it's footage or other layer type
                leftLayer = leftComp.layers.add(leftSource.source);
            }
            
            // Center the layer vertically
            leftLayer.property("Position").setValue([panelWidth/2, compSettings.height/2]);
            
            // Get source dimensions for scaling
            var leftWidth, leftHeight;
            if (leftSource.source.width !== undefined) {
                leftWidth = leftSource.source.width;
                leftHeight = leftSource.source.height;
            } else {
                // For solid layers and other types
                leftWidth = leftSource.width || panelWidth;
                leftHeight = leftSource.height || compSettings.height;
            }
            
            // Fit to height
            var leftHeightScale = compSettings.height / leftHeight * 100;
            leftLayer.property("Scale").setValue([leftHeightScale, leftHeightScale]);
            
            // Set the in point to 0
            leftLayer.startTime = 0;
            
            // Copy effects if any
            try {
                if (leftSource.property("Effects") && leftSource.property("Effects").numProperties > 0) {
                    for (var e = 1; e <= leftSource.property("Effects").numProperties; e++) {
                        var effect = leftSource.property("Effects").property(e);
                        leftLayer.property("Effects").addProperty(effect.matchName);
                    }
                }
            } catch (effectErr) {
                // Ignore effect copy errors
            }
        } catch (e) {
            $.writeln("Error adding left layer: " + e.toString());
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
            
            // Center the layer vertically
            middleLayer.property("Position").setValue([panelWidth/2, compSettings.height/2]);
            
            // Get source dimensions for scaling
            var middleWidth, middleHeight;
            if (middleSource.source.width !== undefined) {
                middleWidth = middleSource.source.width;
                middleHeight = middleSource.source.height;
            } else {
                middleWidth = middleSource.width || panelWidth;
                middleHeight = middleSource.height || compSettings.height;
            }
            
            // Fit to height
            var middleHeightScale = compSettings.height / middleHeight * 100;
            middleLayer.property("Scale").setValue([middleHeightScale, middleHeightScale]);
            
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
        
        // Add right layer to right comp
        try {
            var rightLayer;
            var rightSource = selectedLayers[2];
            
            if (rightSource.source instanceof CompItem) {
                rightLayer = rightComp.layers.add(rightSource.source);
            } else {
                rightLayer = rightComp.layers.add(rightSource.source);
            }
            
            // Center the layer vertically
            rightLayer.property("Position").setValue([panelWidth/2, compSettings.height/2]);
            
            // Get source dimensions for scaling
            var rightWidth, rightHeight;
            if (rightSource.source.width !== undefined) {
                rightWidth = rightSource.source.width;
                rightHeight = rightSource.source.height;
            } else {
                rightWidth = rightSource.width || panelWidth;
                rightHeight = rightSource.height || compSettings.height;
            }
            
            // Fit to height
            var rightHeightScale = compSettings.height / rightHeight * 100;
            rightLayer.property("Scale").setValue([rightHeightScale, rightHeightScale]);
            
            // Set the in point to 0
            rightLayer.startTime = 0;
            
            // Copy effects if any
            try {
                if (rightSource.property("Effects") && rightSource.property("Effects").numProperties > 0) {
                    for (var e = 1; e <= rightSource.property("Effects").numProperties; e++) {
                        var effect = rightSource.property("Effects").property(e);
                        rightLayer.property("Effects").addProperty(effect.matchName);
                    }
                }
            } catch (effectErr) {
                // Ignore effect copy errors
            }
        } catch (e) {
            $.writeln("Error adding right layer: " + e.toString());
        }
        
        // Add the nested comps to the output comp
        try {
            // Add left section comp
            var leftCompLayer = outputComp.layers.add(leftComp);
            leftCompLayer.property("Position").setValue([panelWidth/2, compSettings.height/2]);
            
            // Add middle section comp
            var middleCompLayer = outputComp.layers.add(middleComp);
            middleCompLayer.property("Position").setValue([panelWidth*1.5, compSettings.height/2]);
            
            // Add right section comp
            var rightCompLayer = outputComp.layers.add(rightComp);
            rightCompLayer.property("Position").setValue([panelWidth*2.5, compSettings.height/2]);
            
            // Add thin divider lines
            var leftLine = outputComp.layers.addSolid([1, 1, 1], "Left Divider", 2, outputComp.height, 1);
            leftLine.property("Position").setValue([panelWidth, outputComp.height/2]);
            
            var rightLine = outputComp.layers.addSolid([1, 1, 1], "Right Divider", 2, outputComp.height, 1);
            rightLine.property("Position").setValue([panelWidth*2, outputComp.height/2]);
        } catch (e) {
            $.writeln("Error adding comps to output comp: " + e.toString());
            alert("Error: " + e.toString());
        }
        
        // Open the composition
        outputComp.openInViewer();
        
        alert("Vertical split screen created!");
    } catch (error) {
        $.writeln("Main script error: " + error.toString());
        alert("An error occurred: " + error.toString());
    }
    
    app.endUndoGroup();
})();