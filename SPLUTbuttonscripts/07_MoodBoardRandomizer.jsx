// MoodBoardLayouts.jsx
// Script to generate moodboard layouts with 5-13 rectangles
// Supports different layout patterns with uniform padding and asymmetry

(function() {
    // Check if a project is open
    if (!app.project) {
        alert("Please open a project first.");
        return;
    }
    
    app.beginUndoGroup("Create MoodBoard Layout");
    
    // Default composition settings
    var compSettings = {
        name: "MoodBoard Layout",
        width: 1920,
        height: 1080,
        pixelAspect: 1,
        duration: 10,
        frameRate: 30
    };
    
    // Get user input for composition settings
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
    
    // Padding
    var paddingGroup = compSettingsDialog.add("group");
    paddingGroup.add("statictext", undefined, "Padding (pixels):");
    var paddingInput = paddingGroup.add("edittext", undefined, "10");
    paddingInput.characters = 6;
    
    // Buttons
    var buttonGroup = compSettingsDialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    okButton.onClick = function() {
        compSettings.width = parseInt(widthInput.text);
        compSettings.height = parseInt(heightInput.text);
        compSettings.duration = parseFloat(durationInput.text);
        compSettings.padding = parseInt(paddingInput.text);
        
        // Validate padding isn't too large for the composition
        var minDimension = Math.min(compSettings.width, compSettings.height);
        var maxValidPadding = Math.floor(minDimension / 10); // Arbitrary safe limit
        
        if (compSettings.padding > maxValidPadding) {
            alert("Padding value is too large for the composition size. Maximum recommended value: " + maxValidPadding + "px");
            return;
        }
        
        compSettingsDialog.close(1);
    };
    
    cancelButton.onClick = function() {
        compSettingsDialog.close(0);
    };
    
    if (compSettingsDialog.show() !== 1) {
        app.endUndoGroup();
        return;
    }
    
    // Create the composition
    var comp = app.project.items.addComp(
        compSettings.name,
        compSettings.width,
        compSettings.height,
        compSettings.pixelAspect,
        compSettings.duration,
        compSettings.frameRate
    );
    
    // Check if there's an active composition first
    if (!app.project.activeItem || !(app.project.activeItem instanceof CompItem)) {
        alert("Please open a composition and select layers before running this script.");
        comp.remove();
        app.endUndoGroup();
        return;
    }
    
    // Check if there are selected layers in the active composition
    var activeComp = app.project.activeItem;
    var selectedLayers = [];
    
    for (var i = 1; i <= activeComp.numLayers; i++) {
        if (activeComp.layer(i).selected) {
            selectedLayers.push({
                index: i,
                name: activeComp.layer(i).name,
                layer: activeComp.layer(i)
            });
        }
    }
    
    // Validate layer selection
    if (selectedLayers.length < 5 || selectedLayers.length > 13) {
        alert("Please select between 5 and 13 layers in your composition before running this script.");
        comp.remove();
        app.endUndoGroup();
        return;
    }
    
    // Set the rectangle count based on selected layers
    compSettings.rectangleCount = selectedLayers.length;

    // Define layout templates for different rectangle counts
    var layoutCatalog = {
        // 5 Rectangle Layouts
        5: [
            // Layout 1: One large (2x2), four small (1x1) in corners
           // Layout 1: Redesigned layout that fills 16:9 space better
            // Layout 2: Horizontal layout with one large center
            {
            
                    name: "One large center, four corners",
                    rectangles: [
                        {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},  // Top-left
                        {row: 0, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},  // Top-right
                        {row: 1, col: 0, rowSpan: 2, colSpan: 4, color: [0, 0, 1]},  // Center (large)
                        {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [1, 1, 0]},  // Bottom-left
                        {row: 3, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 1]}   // Bottom-right
                    ],
                    grid: {rows: 4, cols: 4}
            },
            // Layout 3: Vertical stacked with one tall
            {
                name: "Vertical with one tall",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 3, colSpan: 1, color: [1, 0, 0]},  // Left (tall)
                    {row: 0, col: 1, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},  // Top
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-left
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle-right
                    {row: 2, col: 1, rowSpan: 1, colSpan: 2, color: [0, 1, 1]}   // Bottom
                ],
                grid: {rows: 3, cols: 3}
            },
            // Additional layouts for class 5
            {
                name: "Horizontal feature with quad panels",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 4, color: [1, 0, 0]},  // Top (large horizontal feature)
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Bottom-left
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Bottom-middle-left
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Bottom-middle-right
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]}   // Bottom-right
                ],
                grid: {rows: 3, cols: 4}
            },
            {
                name: "Cross pattern",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 0]},  // Top-left
                    {row: 0, col: 1, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},  // Top-center
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Top-right
                    {row: 1, col: 0, rowSpan: 1, colSpan: 4, color: [1, 1, 0]},  // Middle (full width)
                    {row: 2, col: 0, rowSpan: 1, colSpan: 4, color: [0, 1, 1]}   // Bottom (full width)
                ],
                grid: {rows: 3, cols: 4}
            },
            {
                name: "Sidebar with grid",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 3, colSpan: 1, color: [1, 0, 0]},  // Left sidebar (tall)
                    {row: 0, col: 1, rowSpan: 1, colSpan: 3, color: [0, 1, 0]},  // Top-right (wide)
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-right-top
                    {row: 1, col: 2, rowSpan: 2, colSpan: 2, color: [1, 1, 0]},  // Bottom-right (large)
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0, 1, 1]}   // Bottom-middle
                ],
                grid: {rows: 3, cols: 4}
            }
        ],
        
        // 6 Rectangle Layouts
        6: [
                // Layout 1: 2×3 grid (improved space utilization)
                {
                    name: "2×3 grid optimized",
                    rectangles: [
                        {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},  // Top-left (wide)
                        {row: 0, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},  // Top-right (wide)
                        {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-left
                        {row: 1, col: 1, rowSpan: 1, colSpan: 2, color: [1, 1, 0]},  // Middle-center (wide)
                        {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right
                        {row: 2, col: 0, rowSpan: 1, colSpan: 4, color: [0, 1, 1]}   // Bottom (full width)
                    ],
                    grid: {rows: 3, cols: 4}
                },
                // Layout 2: One large center, 5 around (improved)
                {
                    name: "One large center, 5 around",
                    rectangles: [
                        {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},  // Top-left
                        {row: 0, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},  // Top-right
                        {row: 1, col: 0, rowSpan: 2, colSpan: 1, color: [0, 0, 1]},  // Left
                        {row: 1, col: 1, rowSpan: 2, colSpan: 2, color: [1, 1, 0]},  // Center (large)
                        {row: 1, col: 3, rowSpan: 2, colSpan: 1, color: [1, 0, 1]},  // Right
                        {row: 3, col: 0, rowSpan: 1, colSpan: 4, color: [0, 1, 1]}   // Bottom (full width)
                    ],
                    grid: {rows: 4, cols: 4}
                },
                // Layout 3: Vertical split with horizontal asymmetry (new layout)
                {
                    name: "Vertical split with asymmetry",
                    rectangles: [
                        {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Left-top (large)
                        {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Right-top-left
                        {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Right-top-right
                        {row: 1, col: 2, rowSpan: 1, colSpan: 2, color: [1, 1, 0]},  // Right-middle (wide)
                        {row: 2, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 1]},  // Left-bottom (wide)
                        {row: 2, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 1]}   // Right-bottom (wide)
                    ],
                    grid: {rows: 3, cols: 4}
                },
                // Additional layouts for class 6
                {
                    name: "L-shaped feature with balance",
                    rectangles: [
                        {row: 0, col: 0, rowSpan: 2, colSpan: 3, color: [1, 0, 0]},  // Top-left (large L part 1)
                        {row: 0, col: 3, rowSpan: 2, colSpan: 1, color: [0, 1, 0]},  // Top-right (FIXED - made taller)
                        {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Bottom-left (L part 2)
                        {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Bottom-middle-left
                        {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Bottom-middle-right
                        {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]}   // Bottom-right
                    ],
                    grid: {rows: 3, cols: 4}
                },
                {
                    name: "Split grid with varied sizes",
                    rectangles: [
                        {row: 0, col: 0, rowSpan: 1, colSpan: 3, color: [1, 0, 0]},  // Top-left (wide)
                        {row: 0, col: 3, rowSpan: 2, colSpan: 1, color: [0, 1, 0]},  // Right (tall)
                        {row: 1, col: 0, rowSpan: 2, colSpan: 1, color: [0, 0, 1]},  // Left (tall)
                        {row: 1, col: 1, rowSpan: 1, colSpan: 2, color: [1, 1, 0]},  // Middle (wide)
                        {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Bottom-middle
                        {row: 2, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 1]}   // Bottom-right (wide)
                    ],
                    grid: {rows: 3, cols: 4}
                }
        ],
        
        // 7 Rectangle Layouts
        7: [
            // Layout 1: 3×3 grid with merged cells
            {
                name: "3×3 with merged cells",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},  // Top-left (wide)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Top-right
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-left
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-left
                    {row: 2, col: 1, rowSpan: 1, colSpan: 2, color: [0.5, 0.5, 0.5]}  // Bottom-right (wide)
                ],
                grid: {rows: 3, cols: 3}
            },
            // Layout 2: 1 large + 6 small
            {
                name: "1 large + 6 small",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left (large)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Top-middle
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Top-right
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle-middle
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right
                    {row: 2, col: 0, rowSpan: 1, colSpan: 2, color: [0, 1, 1]},  // Bottom-left
                    {row: 2, col: 2, rowSpan: 1, colSpan: 2, color: [0.5, 0.5, 0.5]}  // Bottom-right
                ],
                grid: {rows: 3, cols: 4}
            },
            // Additional layouts for class 7
            {
                name: "Magazine cover layout",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 4, color: [1, 0, 0]},  // Top banner (full width)
                    {row: 1, col: 0, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},  // Left feature (large)
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Top-right
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Top-far-right
                    {row: 2, col: 2, rowSpan: 1, colSpan: 2, color: [1, 0, 1]},  // Middle-right (wide)
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0, 1, 1]},  // Bottom-left
                    {row: 3, col: 2, rowSpan: 1, colSpan: 2, color: [0.5, 0.5, 0.5]}  // Bottom-right
                ],
                grid: {rows: 4, cols: 4}
            },
            {
                name: "Split screen with varied panels",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 3, colSpan: 2, color: [1, 0, 0]},  // Left half (tall)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},  // Top-right
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-right-top
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle-right-right
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right-bottom
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-right
                    {row: 3, col: 0, rowSpan: 1, colSpan: 4, color: [0.5, 0.5, 0.5]}  // Bottom (full width)
                ],
                grid: {rows: 4, cols: 4}
            },
            {
                name: "Dynamic diagonal flow",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},  // Top-left
                    {row: 0, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},  // Top-right
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-left
                    {row: 1, col: 1, rowSpan: 2, colSpan: 2, color: [1, 1, 0]},  // Center (large)
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-left
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}  // Bottom-right
                ],
                grid: {rows: 3, cols: 4}
            }
        ],
        
        // 8 Rectangle Layouts
        8: [
            // Layout 1: 2×4 grid
            {
                name: "2×4 grid with asymmetry",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 0]},
                    {row: 0, col: 1, rowSpan: 1, colSpan: 2, color: [0, 1, 0]}, // Wide rectangle for asymmetry
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},
                    {row: 2, col: 0, rowSpan: 1, colSpan: 4, color: [0.7, 0.3, 0.3]} // Full width bottom for asymmetry
                ],
                grid: {rows: 3, cols: 4}
            },
            // Layout 2: Modular grid layout
            {
                name: "Modular grid layout",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left (large)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Top-middle
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Top-right
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle-middle
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-left
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Bottom-middle-left
                    {row: 2, col: 2, rowSpan: 1, colSpan: 2, color: [0.7, 0.3, 0.3]}  // Bottom-right (wide)
                ],
                grid: {rows: 3, cols: 4}
            },
            // Additional layouts for class 8
            {
                name: "Magazine feature layout",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 4, color: [1, 0, 0]},  // Top banner (full width)
                    {row: 1, col: 0, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},  // Left feature (large)
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-top-right
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Top-right
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-bottom-right
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-right
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0.5, 0.5, 0.5]},  // Bottom-left
                    {row: 3, col: 2, rowSpan: 1, colSpan: 2, color: [0.7, 0.3, 0.3]}   // Bottom-right
                ],
                grid: {rows: 4, cols: 4}
            },
            {
                name: "Dual feature with grid",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left feature
                    {row: 0, col: 2, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},  // Top-right feature
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Bottom-left
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Bottom-middle-left
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Bottom-middle-right
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-right
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0.5, 0.5, 0.5]},  // Bottom-row-left
                    {row: 3, col: 2, rowSpan: 1, colSpan: 2, color: [0.7, 0.3, 0.3]}   // Bottom-row-right
                ],
                grid: {rows: 4, cols: 4}
            },
            {
                name: "Asymmetric showcase",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 3, color: [1, 0, 0]},  // Top-left (wide)
                    {row: 0, col: 3, rowSpan: 2, colSpan: 1, color: [0, 1, 0]},  // Right (tall)
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-left
                    {row: 1, col: 1, rowSpan: 1, colSpan: 2, color: [1, 1, 0]},  // Middle-center (wide)
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Bottom-left
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-middle-left
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Bottom-middle-right
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}   // Bottom-right
                ],
                grid: {rows: 3, cols: 4}
            }
        ],
        
        // 9 Rectangle Layouts
        9: [
            // Layout 1: 3×3 grid
            {
                name: "3×3 grid with asymmetry",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 0]},
                    {row: 0, col: 1, rowSpan: 1, colSpan: 2, color: [0, 1, 0]}, // Wide rectangle for asymmetry
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},
                    {row: 3, col: 0, rowSpan: 1, colSpan: 3, color: [0.3, 0.7, 0.3]} // Full width bottom row
                ],
                grid: {rows: 4, cols: 3}
            },
            // Layout 2: Complex asymmetric layout
            {
                name: "Complex asymmetric layout",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left (large)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Top-right 1
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Top-right 2
                    {row: 1, col: 2, rowSpan: 1, colSpan: 2, color: [1, 1, 0]},  // Middle-right
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Bottom-left 1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-left 2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Bottom-right 1
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Bottom-right 2
                    {row: 3, col: 0, rowSpan: 1, colSpan: 4, color: [0.3, 0.7, 0.3]}  // Extra bottom row
                ],
                grid: {rows: 4, cols: 4}
            },
            // Additional layouts for class 9
            {
                name: "Feature with 8-panel grid",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left (large feature)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Top-right 1
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Top-right 2
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle-right 1
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right 2
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-left 1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Bottom-left 2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Bottom-right 1
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}   // Bottom-right 2
                ],
                grid: {rows: 3, cols: 4}
            },
            {
                name: "Magazine spread layout",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 4, color: [1, 0, 0]},  // Top header (full width)
                    {row: 1, col: 0, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},  // Left feature (large)
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-top 1
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle-top 2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-bottom 1
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Middle-bottom 2
                    {row: 3, col: 0, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Bottom 1
                    {row: 3, col: 1, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Bottom 2
                    {row: 3, col: 2, rowSpan: 1, colSpan: 2, color: [0.3, 0.7, 0.3]}   // Bottom 3 (wide)
                ],
                grid: {rows: 4, cols: 4}
            },
            {
                name: "Triple row design",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},  // Top row 1
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Top row 2
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Top row 3
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle row 1
                    {row: 1, col: 1, rowSpan: 1, colSpan: 2, color: [1, 0, 1]},  // Middle row 2 (wide)
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Middle row 3
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Bottom row 1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Bottom row 2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 2, color: [0.3, 0.7, 0.3]}   // Bottom row 3 (wide)
                ],
                grid: {rows: 3, cols: 4}
            }
                    ],
        
        // 10 Rectangle Layouts
        10: [
            // Layout 1: 2×5 grid with asymmetry
            {
                name: "2×5 grid with asymmetry",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},  // Top row, merged cells
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},
                    {row: 0, col: 4, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},
                    {row: 2, col: 0, rowSpan: 1, colSpan: 5, color: [0.3, 0.3, 0.7]}  // Bottom full width
                ],
                grid: {rows: 3, cols: 5}
            },
            // Layout 2: 3×4 with merged cells
            {
                name: "3×4 with merged cells",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left large
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},
                    {row: 3, col: 0, rowSpan: 1, colSpan: 4, color: [0.3, 0.3, 0.7]}  // Bottom full width
                ],
                grid: {rows: 4, cols: 4}
            },
            // Additional layouts for class 10
            {
                name: "Dual feature with grid",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left feature
                    {row: 0, col: 2, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},  // Top-right feature
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Bottom grid 1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Bottom grid 2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Bottom grid 3
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom grid 4
                    {row: 3, col: 0, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Bottom grid 5
                    {row: 3, col: 1, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Bottom grid 6
                    {row: 3, col: 2, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},  // Bottom grid 7
                    {row: 3, col: 3, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]}   // Bottom grid 8
                ],
                grid: {rows: 4, cols: 4}
            },
            {
                name: "Magazine feature layout",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 4, color: [1, 0, 0]},  // Top banner
                    {row: 1, col: 0, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},  // Left feature
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Right top 1
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Right top 2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Right middle 1
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Right middle 2
                    {row: 3, col: 0, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Bottom 1
                    {row: 3, col: 1, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Bottom 2
                    {row: 3, col: 2, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},  // Bottom 3
                    {row: 3, col: 3, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]}   // Bottom 4
                ],
                grid: {rows: 4, cols: 4}
            },
            {
                name: "Triple row varied widths",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 0]},  // Top row 1
                    {row: 0, col: 1, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},  // Top row 2 (wide)
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Top row 3
                    {row: 0, col: 4, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Top row 4
                    {row: 1, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 1]},  // Middle row 1 (wide)
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Middle row 2
                    {row: 1, col: 3, rowSpan: 1, colSpan: 2, color: [0.5, 0.5, 0.5]},  // Middle row 3 (wide)
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Bottom row 1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 3, color: [0.3, 0.7, 0.3]},  // Bottom row 2 (wide)
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]}   // Bottom row 3
                ],
                grid: {rows: 3, cols: 5}
            }
        ],
        
        // 11 Rectangle Layouts
        11: [
            // Layout 1: Complex grid with varied sizes
            {
                name: "Complex grid with varied sizes",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left large
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},
                    {row: 0, col: 4, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]},
                    {row: 2, col: 3, rowSpan: 1, colSpan: 2, color: [0.7, 0.7, 0.3]}  // Bottom-right wide
                ],
                grid: {rows: 3, cols: 5}
            },
            // Layout 2: Magazine layout style
            {
                name: "Magazine layout style",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 6, color: [1, 0, 0]},  // Top full width
                    {row: 1, col: 0, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},  // Left tall
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},
                    {row: 1, col: 4, rowSpan: 1, colSpan: 2, color: [1, 0, 1]},  // Right medium
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},
                    {row: 2, col: 4, rowSpan: 1, colSpan: 2, color: [0.7, 0.3, 0.3]},  // Right medium
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0.3, 0.7, 0.3]},  // Bottom left
                    {row: 3, col: 2, rowSpan: 1, colSpan: 2, color: [0.3, 0.3, 0.7]},  // Bottom middle
                    {row: 3, col: 4, rowSpan: 1, colSpan: 2, color: [0.7, 0.7, 0.3]}   // Bottom right
                ],
                grid: {rows: 4, cols: 6}
            },
            // Additional layouts for class 11
            {
                name: "Dual feature with grid layout",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},  // Top-left feature
                    {row: 0, col: 2, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},  // Top-right feature
                    {row: 0, col: 4, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Right top
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Right middle
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Bottom-left 1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Bottom-left 2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Bottom-middle 1
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Bottom-middle 2
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},  // Bottom-right
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0.3, 0.3, 0.7]},  // Footer-left
                    {row: 3, col: 2, rowSpan: 1, colSpan: 3, color: [0.7, 0.7, 0.3]}   // Footer-right
                ],
                grid: {rows: 4, cols: 5}
            },
            {
                name: "Triple tier with asymmetry",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 5, color: [1, 0, 0]},  // Top banner
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},  // Middle-left 1
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-left 2
                    {row: 1, col: 2, rowSpan: 1, colSpan: 2, color: [1, 1, 0]},  // Middle-center (wide)
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right
                    {row: 2, col: 0, rowSpan: 1, colSpan: 2, color: [0, 1, 1]},  // Bottom-left (wide)
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Bottom-middle
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Bottom-right 1
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},  // Bottom-right 2
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0.3, 0.3, 0.7]},  // Footer-left
                    {row: 3, col: 2, rowSpan: 1, colSpan: 3, color: [0.7, 0.7, 0.3]}   // Footer-right
                ],
                grid: {rows: 4, cols: 5}
            },
            {
                name: "Feature sidebar with grid",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 3, colSpan: 2, color: [1, 0, 0]},  // Left sidebar (tall feature)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 3, color: [0, 1, 0]},  // Top-right (wide)
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},  // Middle-right 1
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},  // Middle-right 2
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},  // Middle-right 3
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},  // Lower-right 1
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},  // Lower-right 2
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},  // Lower-right 3
                    {row: 3, col: 0, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},  // Bottom-left
                    {row: 3, col: 1, rowSpan: 1, colSpan: 2, color: [0.3, 0.3, 0.7]},  // Bottom-middle
                    {row: 3, col: 3, rowSpan: 1, colSpan: 2, color: [0.7, 0.7, 0.3]}   // Bottom-right
                ],
                grid: {rows: 4, cols: 5}
            }
        ],
        
        // 12 Rectangle Layouts
        12: [
            // Layout 1: 3×4 grid with asymmetry
            {
                name: "3×4 grid with asymmetry",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},  // Top-left wide
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]},
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]},
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]},
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]},
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.7, 0.3]},
                    {row: 3, col: 0, rowSpan: 1, colSpan: 4, color: [0.5, 0.3, 0.7]}  // Bottom full width
                ],
                grid: {rows: 4, cols: 4}
            },
            // Layout 2: Complex modular design
            {
                name: "Complex modular design",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},       // Top-left large
                    {row: 0, col: 2, rowSpan: 1, colSpan: 2, color: [0, 1, 0]},       // Top-right wide
                    {row: 0, col: 4, rowSpan: 2, colSpan: 1, color: [0, 0, 1]},       // Right tall
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},       // Middle-right-1
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},       // Middle-right-2
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},       // Bottom-left-1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Bottom-left-2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Bottom-middle-1
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}, // Bottom-middle-2
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]}, // Bottom-right
                    {row: 3, col: 0, rowSpan: 1, colSpan: 3, color: [0.7, 0.7, 0.3]}, // Footer-left
                    {row: 3, col: 3, rowSpan: 1, colSpan: 2, color: [0.5, 0.3, 0.7]}  // Footer-right
                ],
                grid: {rows: 4, cols: 5}
            },
             // Additional layouts for class 12
             {
                name: "Dual feature with grid pattern",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},       // Top-left feature
                    {row: 0, col: 2, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},       // Top-right feature
                    {row: 0, col: 4, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},       // Right-top
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},       // Right-bottom
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},       // Bottom-row-1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},       // Bottom-row-2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Bottom-row-3
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Bottom-row-4
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}, // Bottom-row-5
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0.3, 0.3, 0.7]}, // Footer-left
                    {row: 3, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.7, 0.3]}, // Footer-middle
                    {row: 3, col: 3, rowSpan: 1, colSpan: 2, color: [0.5, 0.3, 0.7]}  // Footer-right
                ],
                grid: {rows: 4, cols: 5}
            },
            {
                name: "Triple row varied panels",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 6, color: [1, 0, 0]},       // Top banner
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},       // Middle-row-1
                    {row: 1, col: 1, rowSpan: 1, colSpan: 2, color: [0, 0, 1]},       // Middle-row-2 (wide)
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},       // Middle-row-3
                    {row: 1, col: 4, rowSpan: 1, colSpan: 2, color: [1, 0, 1]},       // Middle-row-4 (wide)
                    {row: 2, col: 0, rowSpan: 1, colSpan: 2, color: [0, 1, 1]},       // Bottom-row-1 (wide)
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Bottom-row-2
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Bottom-row-3
                    {row: 2, col: 4, rowSpan: 1, colSpan: 2, color: [0.3, 0.7, 0.3]}, // Bottom-row-4 (wide)
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0.3, 0.3, 0.7]}, // Footer-left (wide)
                    {row: 3, col: 2, rowSpan: 1, colSpan: 2, color: [0.7, 0.7, 0.3]}, // Footer-middle (wide)
                    {row: 3, col: 4, rowSpan: 1, colSpan: 2, color: [0.5, 0.3, 0.7]}  // Footer-right (wide)
                ],
                grid: {rows: 4, cols: 6}
            },
            {
                name: "Feature sidebar with grid panels",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 4, colSpan: 2, color: [1, 0, 0]},       // Left sidebar (tall feature)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 3, color: [0, 1, 0]},       // Top-right
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},       // Middle-row-1 
                    {row: 1, col: 3, rowSpan: 1, colSpan: 2, color: [1, 1, 0]},       // Middle-row-2 (wide)
                    {row: 2, col: 2, rowSpan: 1, colSpan: 2, color: [1, 0, 1]},       // Middle-row-3 (wide)
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},       // Middle-row-4
                    {row: 3, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Bottom-row-1
                    {row: 3, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Bottom-row-2
                    {row: 3, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}, // Bottom-row-3
                    {row: 4, col: 0, rowSpan: 1, colSpan: 2, color: [0.3, 0.3, 0.7]}, // Footer-left
                    {row: 4, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.7, 0.3]}, // Footer-middle
                    {row: 4, col: 3, rowSpan: 1, colSpan: 2, color: [0.5, 0.3, 0.7]}  // Footer-right
                ],
                grid: {rows: 5, cols: 5}
            }
        ],
        
        // 13 Rectangle Layouts
        13: [
            // Layout 1: Complex modular design
            {
                name: "Complex modular grid",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},       // Top-left large
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},       // Top-middle-1
                    {row: 0, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},       // Top-middle-2
                    {row: 0, col: 4, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},       // Top-right
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},       // Middle-middle-1
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},       // Middle-middle-2
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Middle-right
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Bottom-row-1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}, // Bottom-row-2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]}, // Bottom-row-3
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.7, 0.3]}, // Bottom-row-4
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.7]}, // Bottom-row-5
                    {row: 3, col: 0, rowSpan: 1, colSpan: 5, color: [0.3, 0.7, 0.7]}  // Footer full width
                ],
                grid: {rows: 4, cols: 5}
            },
            // Layout 2: 3×5 with asymmetry and merged cells
            {
                name: "3×5 with merged cells",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 2, color: [1, 0, 0]},       // Top-left
                    {row: 0, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 0]},       // Top-middle
                    {row: 0, col: 3, rowSpan: 1, colSpan: 2, color: [0, 0, 1]},       // Top-right
                    {row: 1, col: 0, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},       // Middle-1
                    {row: 1, col: 1, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},       // Middle-2
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},       // Middle-3
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Middle-4
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Middle-5
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}, // Bottom-1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]}, // Bottom-2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.7, 0.3]}, // Bottom-3
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.7]}, // Bottom-4
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.7]}  // Bottom-5
                ],
                grid: {rows: 3, cols: 5}
            },
            // Additional layouts for class 13
            {
                name: "Magazine hierarchy layout",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 1, colSpan: 5, color: [1, 0, 0]},       // Top banner
                    {row: 1, col: 0, rowSpan: 2, colSpan: 3, color: [0, 1, 0]},       // Main feature
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},       // Sidebar top-1
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},       // Sidebar top-2
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},       // Sidebar middle-1
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},       // Sidebar middle-2
                    {row: 3, col: 0, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Bottom grid-1
                    {row: 3, col: 1, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Bottom grid-2
                    {row: 3, col: 2, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}, // Bottom grid-3
                    {row: 3, col: 3, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]}, // Bottom grid-4
                    {row: 3, col: 4, rowSpan: 1, colSpan: 1, color: [0.7, 0.7, 0.3]}, // Bottom grid-5
                    {row: 4, col: 0, rowSpan: 1, colSpan: 2, color: [0.7, 0.3, 0.7]}, // Footer-left
                    {row: 4, col: 2, rowSpan: 1, colSpan: 3, color: [0.3, 0.7, 0.7]}  // Footer-right
                ],
                grid: {rows: 5, cols: 5}
            },
            {
                name: "Dual feature with varied grid",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 2, colSpan: 2, color: [1, 0, 0]},       // Left feature
                    {row: 0, col: 2, rowSpan: 2, colSpan: 2, color: [0, 1, 0]},       // Right feature
                    {row: 0, col: 4, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},       // Sidebar top
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},       // Sidebar bottom
                    {row: 2, col: 0, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},       // Middle grid-1
                    {row: 2, col: 1, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},       // Middle grid-2
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Middle grid-3
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Middle grid-4
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}, // Middle grid-5
                    {row: 3, col: 0, rowSpan: 1, colSpan: 2, color: [0.3, 0.3, 0.7]}, // Bottom-left
                    {row: 3, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.7, 0.3]}, // Bottom-middle
                    {row: 3, col: 3, rowSpan: 1, colSpan: 2, color: [0.7, 0.3, 0.7]}  // Bottom-right
                ],
                grid: {rows: 4, cols: 5}
            },
            {
                name: "Split screen with grid panels",
                rectangles: [
                    {row: 0, col: 0, rowSpan: 3, colSpan: 2, color: [1, 0, 0]},       // Left panel (tall)
                    {row: 0, col: 2, rowSpan: 1, colSpan: 3, color: [0, 1, 0]},       // Top-right
                    {row: 1, col: 2, rowSpan: 1, colSpan: 1, color: [0, 0, 1]},       // Middle-1
                    {row: 1, col: 3, rowSpan: 1, colSpan: 1, color: [1, 1, 0]},       // Middle-2
                    {row: 1, col: 4, rowSpan: 1, colSpan: 1, color: [1, 0, 1]},       // Middle-3
                    {row: 2, col: 2, rowSpan: 1, colSpan: 1, color: [0, 1, 1]},       // Bottom-1
                    {row: 2, col: 3, rowSpan: 1, colSpan: 1, color: [0.5, 0.5, 0.5]}, // Bottom-2
                    {row: 2, col: 4, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.3]}, // Bottom-3
                    {row: 3, col: 0, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.3]}, // Footer-1
                    {row: 3, col: 1, rowSpan: 1, colSpan: 1, color: [0.3, 0.3, 0.7]}, // Footer-2
                    {row: 3, col: 2, rowSpan: 1, colSpan: 1, color: [0.7, 0.7, 0.3]}, // Footer-3
                    {row: 3, col: 3, rowSpan: 1, colSpan: 1, color: [0.7, 0.3, 0.7]}, // Footer-4
                    {row: 3, col: 4, rowSpan: 1, colSpan: 1, color: [0.3, 0.7, 0.7]}  // Footer-5
                ],
                grid: {rows: 4, cols: 5}
            }        
        ]
    };
    
    // Function to select a random layout from available options
    function selectRandomLayout(rectangleCount) {
        var layouts = layoutCatalog[rectangleCount];
        return layouts[Math.floor(Math.random() * layouts.length)];
    }
    
    // Select a layout based on the rectangle count
    var selectedLayout = selectRandomLayout(compSettings.rectangleCount);
    
    // Calculate cell dimensions
    var grid = selectedLayout.grid;
    var cellWidth = (compSettings.width - compSettings.padding * (grid.cols + 1)) / grid.cols;
    var cellHeight = (compSettings.height - compSettings.padding * (grid.rows + 1)) / grid.rows;
    
   // Function to create a rectangle 
function createRectangle(comp, name, rect, layerInfo) {
    // Calculate position based on grid
    var x = compSettings.padding + rect.col * (cellWidth + compSettings.padding);
    var y = compSettings.padding + rect.row * (cellHeight + compSettings.padding);
    
    // Calculate width and height
    var width = Math.floor(rect.colSpan * cellWidth + (rect.colSpan - 1) * compSettings.padding);
    var height = Math.floor(rect.rowSpan * cellHeight + (rect.rowSpan - 1) * compSettings.padding);
    
    // Create nested comp for this section
    var nestedComp = app.project.items.addComp(
        name, 
        width,
        height, 
        compSettings.pixelAspect, 
        compSettings.duration, 
        compSettings.frameRate
    );
    
    // Add layer to nested comp
    try {
        var sourceLayer = activeComp.layer(layerInfo.index);
        // Duplicate the layer to the nested comp
        var dupLayer;
        
        if (sourceLayer.source instanceof CompItem) {
            // If it's a comp, just add it
            dupLayer = nestedComp.layers.add(sourceLayer.source);
        } else if (sourceLayer.source instanceof FootageItem) {
            // If it's footage, add the footage
            dupLayer = nestedComp.layers.add(sourceLayer.source);
        } else {
            // For other layer types like solids, shapes, etc.
            // We need to duplicate in a different way
            alert("Some selected layers may not be supported for duplication.");
            dupLayer = nestedComp.layers.addSolid([1, 1, 1], "Placeholder", width, height, 1);
        }
        
        // Center the layer
        dupLayer.property("Position").setValue([width/2, height/2]);
        
        // Fit to width or height, whichever is larger to ensure it fills the rectangle
        if (dupLayer.source && dupLayer.source.width && dupLayer.source.height) {
            var widthScale = width / dupLayer.source.width * 100;
            var heightScale = height / dupLayer.source.height * 100;
            var scaleFactor = Math.max(widthScale, heightScale);
            dupLayer.property("Scale").setValue([scaleFactor, scaleFactor]);
        }
        
        // Set the in point to 0
        dupLayer.startTime = 0;
    } catch (e) {
        $.writeln("Error adding layer to " + name + ": " + e.toString());
    }
    
    // Add the nested comp to the main comp
    var nestedCompLayer = comp.layers.add(nestedComp);
    nestedCompLayer.property("Position").setValue([x + width/2, y + height/2]);
    
    return nestedCompLayer;
}

// Calculate cell dimensions
var grid = selectedLayout.grid;
var cellWidth = (compSettings.width - compSettings.padding * (grid.cols + 1)) / grid.cols;
var cellHeight = (compSettings.height - compSettings.padding * (grid.rows + 1)) / grid.rows;

// Create shapes for each rectangle in the layout
for (var i = 0; i < selectedLayout.rectangles.length; i++) {
    var rect = selectedLayout.rectangles[i];
    // Use the layer that matches this rectangle's position
    // If we have fewer layers than rectangles, reuse the last one
    var layerInfo = selectedLayers[Math.min(i, selectedLayers.length - 1)];
    
    createRectangle(
        comp, 
        "Rectangle " + (i + 1), 
        rect,
        layerInfo
    );
}
    
    // Open the composition in viewer
    comp.openInViewer();
    
    alert("MoodBoard layout created with " + compSettings.rectangleCount + " rectangles!");
    
    app.endUndoGroup();
})();