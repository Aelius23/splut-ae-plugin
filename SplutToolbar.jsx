(function(thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "SplutToolbar", undefined, {resizeable: true});
        win.orientation = "column";
        win.alignChildren = ["center", "top"];
        win.spacing = 6;
        win.margins = 10;
        
        // Set dark theme background
        var darkMode = true;
        
        // Calculate sizes based on available screen space
        var calculatorWidth = 280; // Reduced from 700 to match button section width
        var buttonSectionWidth = 280; // Original width for button sections
        
        // Set initial window size
        win.preferredSize = [calculatorWidth, 450];
        
        // Script mappings - Define this FIRST, before any functions that use it
        var scriptMappings = {
            // Top buttons - both possible naming patterns
            "1SPLIT": ["01_AutomatedSplitScreen_ACamLEFT.jsx", "1_AutomatedSplitScreen_ACamLEFT.jsx"],
            "2SPLIT": ["02_AutomatedSplitScreen_ACamRIGHT.jsx", "2_AutomatedSplitScreen_ACamRIGHT.jsx"],
            "3H": ["03_Horizontal3WaySplit.jsx", "3_Horizontal3WaySplit.jsx", "3H_Horizontal3WaySplit.jsx"],
            "3V": ["04_Vertical3WaySplit.jsx", "4_Vertical3WaySplit.jsx", "3V_Vertical3WaySplit.jsx"],
            
            // Main keypad - first row
            "4WAY": ["05_FourWaySplit.jsx", "5_FourWaySplit.jsx", "4WAY_FourWaySplit.jsx"],
            "NINE": ["06_NineWaySplit.jsx", "6_NineWaySplit.jsx", "NINE_NineWaySplit.jsx"],
            "MOOD": ["07_MoodBoardRandomizer.jsx", "7_MoodBoardRandomizer.jsx", "MOOD_MoodBoardRandomizer.jsx"],
            "ZOOM+": ["08_BZoomIn.jsx", "8_BZoomIn.jsx", "ZOOM+_BZoomIn.jsx"],
            
            // Additional buttons
            "ZOOM-": ["09_BZoomOut.jsx", "9_BZoomOut.jsx", "ZOOM-_BZoomOut.jsx"],
            "ROTATE": ["10_Rotate.jsx", "Rotate.jsx", "ROTATE_Rotate.jsx"],
            "STROBE": ["11_Strobe.jsx", "Strobe.jsx", "STROBE_Strobe.jsx"],
            "MAP": ["12_KeyMap.jsx", "KeyMap.jsx", "MAP_KeyMap.jsx"]
        };
        
        // Function to check if something is an array (for older JavaScript versions)
        function isArray(obj) {
            return obj !== null && typeof obj === 'object' && 
                   'length' in obj && 'splice' in obj && 
                   'join' in obj;
        }
        
        // Define a safe file checker function
        function findFirstScriptFile() {
            // Return the first script name that should exist
            if (scriptMappings && scriptMappings["1SPLIT"] && isArray(scriptMappings["1SPLIT"])) {
                return scriptMappings["1SPLIT"][0];
            }
            return "01_AutomatedSplitScreen_ACamLEFT.jsx"; // Fallback
        }
        
        // Define script folder path detection function with multiple search paths
        function findScriptsFolder() {
            var firstScriptToFind = findFirstScriptFile();
            
            // First try the same directory as the panel
            try {
                var panelFile = new File($.fileName);
                var panelDir = decodeURI(panelFile.parent.fsName);
                
                // Check if scripts exist in this directory
                var testFile = new File(panelDir + "/" + firstScriptToFind);
                if (testFile.exists) {
                    return panelDir;
                }
            } catch (e) {
                // Continue to other methods if this fails
            }
            
            // Try standard locations based on OS
            var possiblePaths = [];
            
            if ($.os.indexOf("Windows") != -1) {
                // Windows paths
                possiblePaths = [
                    Folder.startup.fsName + "/Scripts/SPLUTbuttonscripts",
                    Folder.startup.fsName + "/Scripts",
                    app.path + "/Scripts/SPLUTbuttonscripts",
                    app.path + "/Scripts",
                    app.path + "/Scripts/ScriptUI Panels",
                    app.path + "/Support Files/Scripts"
                ];
            } else {
                // macOS paths
                possiblePaths = [
                    Folder.startup.fsName + "/Scripts/SPLUTbuttonscripts",
                    Folder.startup.fsName + "/Scripts",
                    "/Applications/Adobe After Effects " + app.version.substring(0, 4) + "/Scripts/SPLUTbuttonscripts",
                    "/Applications/Adobe After Effects " + app.version.substring(0, 4) + "/Scripts",
                    app.path + "/Scripts/SPLUTbuttonscripts", 
                    app.path + "/Scripts"
                ];
            }
            
            // Try each path
            for (var i = 0; i < possiblePaths.length; i++) {
                var testPath = possiblePaths[i];
                var testFile = new File(testPath + "/" + firstScriptToFind);
                if (testFile.exists) {
                    return testPath;
                }
            }
            
            // If we get here, specifically look for the SPLUTbuttonscripts folder
            try {
                var scriptsFolder = new Folder(Folder.startup.fsName + "/Scripts");
                if (scriptsFolder.exists) {
                    var splutFolder = new Folder(scriptsFolder.fsName + "/SPLUTbuttonscripts");
                    if (splutFolder.exists) {
                        return splutFolder.fsName;
                    }
                }
            } catch (e) {
                // Continue if this fails
            }
            
            // If we get here, return the parent folder as last resort
            try {
                return decodeURI(new File($.fileName).parent.parent.fsName + "/SPLUTbuttonscripts");
            } catch (e) {
                return Folder.startup.fsName + "/Scripts/SPLUTbuttonscripts";
            }
        }
        
        // Get the actual script folder path
        var baseFolder = findScriptsFolder();
        $.writeln("SPLUT Toolbar: Using script folder path: " + baseFolder);
        
        // Function to run a script with proper error handling
        function runScript(scriptID) {
            if (!scriptID || !scriptMappings[scriptID]) {
                alert("Invalid script ID: " + scriptID);
                return; // Safety check
            }
            
            // Get possible script names for this button
            var possibleScripts = scriptMappings[scriptID];
            // Ensure we're working with an array
            if (!isArray(possibleScripts)) {
                possibleScripts = [possibleScripts];
            }
            
            var scriptFound = false;
            
            // Try each possible script name
            for (var i = 0; i < possibleScripts.length; i++) {
                var scriptName = possibleScripts[i];
                var file = new File(baseFolder + "/" + scriptName);
                
                if (file.exists) {
                    scriptFound = true;
                    try {
                        app.beginUndoGroup(scriptName);
                        // Use the fresh file reference directly
                        $.evalFile(file);
                        app.endUndoGroup();
                        break; // Exit the loop if successful
                    } catch (e) {
                        alert("Error executing script: " + e.toString() + "\nScript: " + file.fsName);
                    }
                }
            }
            
            if (!scriptFound) {
                // Try again by searching the Scripts folder directly
                var scriptsFolder = new Folder(app.path + "/Scripts");
                if (scriptsFolder.exists) {
                    var scriptFiles = scriptsFolder.getFiles("*.jsx");
                    for (var j = 0; j < scriptFiles.length; j++) {
                        for (var k = 0; k < possibleScripts.length; k++) {
                            if (scriptFiles[j].name.indexOf(possibleScripts[k]) !== -1) {
                                try {
                                    app.beginUndoGroup(scriptFiles[j].name);
                                    $.evalFile(scriptFiles[j]);
                                    app.endUndoGroup();
                                    scriptFound = true;
                                    break;
                                } catch (e) {
                                    alert("Error executing script: " + e.toString() + "\nScript: " + scriptFiles[j].fsName);
                                }
                            }
                        }
                        if (scriptFound) break;
                    }
                }
                
                if (!scriptFound) {
                    alert("Script not found: " + possibleScripts.join(", ") + 
                          "\nLocation searched: " + baseFolder + 
                          "\nPlease ensure the script files are in the same folder as the toolbar or in the After Effects Scripts folder.");
                }
            }
        }
        
        // ----- HEADER SECTION -----
        var headerGroup = win.add("group");
        headerGroup.orientation = "row";
        headerGroup.alignment = ["center", "top"];
        headerGroup.preferredSize = [calculatorWidth, 40];
        
        var titleText = headerGroup.add("statictext", undefined, "SPLUT INSTRUMENTS");
        titleText.alignment = ["center", "center"];
        try {
            titleText.graphics.font = ScriptUI.newFont("Arial", "BOLD", 16);
        } catch(e) {}
        
        // ----- DISPLAY SECTION -----
        // Create a properly sized display panel with dark background
        var displayPanel = win.add("panel", undefined, "");
        displayPanel.alignment = ["fill", "top"];
        displayPanel.preferredSize = [calculatorWidth, 60];
        
        // Add some visual styling for the panel if possible
        try {
            // Create darker background for the panel - make it very dark for better contrast
            displayPanel.graphics.backgroundColor = displayPanel.graphics.newBrush(
                displayPanel.graphics.BrushType.SOLID_COLOR, [0.1, 0.1, 0.1, 1]);
        } catch(e) {}
        
        // Create centered text display using statictext for cleaner appearance
        var textContainer = displayPanel.add("group");
        textContainer.alignment = ["fill", "center"];
        textContainer.orientation = "row";
        textContainer.preferredSize = [calculatorWidth - 20, 40];
        
        // Use statictext instead of edittext for cleaner appearance
        var displayText = textContainer.add("statictext", undefined, "SPLUT");
        displayText.alignment = ["center", "center"];
        displayText.preferredSize = [calculatorWidth - 40, 30];
        
        try {
            // Style the display text to be bold and red
            displayText.graphics.font = ScriptUI.newFont("Arial", "BOLD", 18);
            displayText.graphics.foregroundColor = displayText.graphics.newPen(
                displayText.graphics.PenType.SOLID_COLOR, [1, 0, 0], 1);
        } catch(e) {}
        
        // Variables for marquee effect
        var marqueeActive = false;
        var displayTimer = null;
        var currentDisplayText = "SPLUT";
        var scrollPosition = 0;
        var scrollSpeed = 100; // Fixed speed - medium pace for best readability
        
        // Full litany text
        var fullLitany = "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. " +
                        "I will face my fear. I will permit it to pass over me and through me. " +
                        "And when it has gone past, I will turn the inner eye to see its path. " +
                        "Where the fear has gone there will be nothing. Only I will remain. ";
        
        // Function to update display with static text
        function updateDisplay(text) {
            // Stop any running marquee
            if (marqueeActive) {
                stopMarquee();
            }
            
            // Update the stored current text
            currentDisplayText = text;
            
            // Update display text with center padding for better appearance
            var paddedText = text;
            // Center the text by adding appropriate padding
            var paddingNeeded = Math.floor((20 - text.length) / 2);
            if (paddingNeeded > 0) {
                var padding = '';
                for (var i = 0; i < paddingNeeded; i++) {
                    padding += ' ';
                }
                paddedText = padding + text;
            }
            
            displayText.text = paddedText;
        }
        
        // Function to stop marquee animation
        function stopMarquee() {
            marqueeActive = false;
            if (displayTimer) {
                app.cancelTask(displayTimer);
                displayTimer = null;
            }
            
            // Make sure the marquee checkbox is synchronized
            if (marqueeButton && marqueeButton.value !== marqueeActive) {
                marqueeButton.value = marqueeActive;
            }
            
            // Restore the regular display text
            displayText.text = currentDisplayText;
        }
        
        // Make scrollText available globally
        function scrollText() {
            if (!marqueeActive) return;
            
            scrollPosition += 1;
            
            if (scrollPosition >= fullLitany.length) {
                scrollPosition = 0;
            }
            
            var visibleText = fullLitany.substring(scrollPosition) + " " + fullLitany.substring(0, scrollPosition);
            displayText.text = visibleText;
            
            displayTimer = app.scheduleTask('$.global.scrollText()', scrollSpeed, false);
        }
        
        // Add to global scope so task scheduler can access it
        $.global.scrollText = scrollText;
        
        // Function to start marquee animation
        function startMarquee() {
            marqueeActive = true;
            scrollPosition = 0;
            
            // Synchronize the marquee button state
            if (marqueeButton) {
                marqueeButton.value = true;
            }
            
            // Start the scrolling animation
            scrollText();
        }
        
        // Initialize with default display
        updateDisplay("SPLUT");
        
        // ----- CONTAINER FOR BUTTONS (CENTERED) -----
        var mainButtonContainer = win.add("group");
        mainButtonContainer.orientation = "column";
        mainButtonContainer.alignment = ["center", "top"];
        mainButtonContainer.preferredSize = [buttonSectionWidth, 300];
        
        // ----- TOP BUTTONS SECTION -----
        var topButtonsGroup = mainButtonContainer.add("group");
        topButtonsGroup.orientation = "row";
        topButtonsGroup.alignment = ["center", "top"];
        topButtonsGroup.spacing = 6;
        topButtonsGroup.preferredSize = [buttonSectionWidth, 45];
        
        // Create top buttons
        var topButtonLabels = [
            {id: "1SPLIT", label: "1 SPLIT"},
            {id: "2SPLIT", label: "2 SPLIT"},
            {id: "3H", label: "3H"},
            {id: "3V", label: "3V"}
        ];
        
        for (var i = 0; i < topButtonLabels.length; i++) {
            var btn = topButtonsGroup.add("button", undefined, topButtonLabels[i].label);
            btn.preferredSize = [65, 40];
            btn.scriptID = topButtonLabels[i].id;
            
            // Add onClick handler
            btn.onClick = function() {
                // Update display
                updateDisplay(this.scriptID);
                
                // Run associated script
                if (scriptMappings[this.scriptID]) {
                    runScript(this.scriptID);
                }
            };
        }
        
        // ----- MAIN KEYPAD SECTION -----
        // Create 2 rows of buttons, 4 buttons per row
        var keypadRows = 2;
        var keypadCols = 4;
        
        var keypadButtons = [
            {id: "4WAY", label: "4 WAY"},
            {id: "NINE", label: "NINE"},
            {id: "MOOD", label: "MOOD"},
            {id: "ZOOM+", label: "ZOOM+"},
            
            {id: "ZOOM-", label: "ZOOM-"},
            {id: "ROTATE", label: "ROTATE"},
            {id: "STROBE", label: "STROBE"},
            {id: "MAP", label: "MAP", isRed: true}
        ];
        
        var mainKeypadGroup = mainButtonContainer.add("group");
        mainKeypadGroup.orientation = "column";
        mainKeypadGroup.alignment = ["center", "top"];
        mainKeypadGroup.spacing = 6;
        mainKeypadGroup.preferredSize = [buttonSectionWidth, 210];
        
        var panelKeypad = mainKeypadGroup.add("panel");
        panelKeypad.orientation = "column";
        panelKeypad.alignment = ["fill", "fill"];
        panelKeypad.preferredSize = [buttonSectionWidth - 20, 200];
        panelKeypad.spacing = 8;
        panelKeypad.margins = 10;
        
        var buttonIdx = 0;
        for (var row = 0; row < keypadRows; row++) {
            var rowGroup = panelKeypad.add("group");
            rowGroup.orientation = "row";
            rowGroup.alignment = ["fill", "top"];
            rowGroup.spacing = 6;
            
            for (var col = 0; col < keypadCols; col++) {
                var buttonInfo = keypadButtons[buttonIdx++];
                var btn = rowGroup.add("button", undefined, buttonInfo.label);
                btn.preferredSize = [65, 40];
                btn.scriptID = buttonInfo.id;
                
                // Style the MAP button since we can't use color
                if (buttonInfo.id === "MAP") {
                    btn.text = "MAP*";  // Add asterisk to highlight it
                }
                
                // Add onClick handler
                btn.onClick = function() {
                    // Update display
                    updateDisplay(this.scriptID);
                    
                    // Run associated script
                    if (scriptMappings[this.scriptID]) {
                        runScript(this.scriptID);
                    }
                    
                    // Special case for MAP button
                    if (this.scriptID === "MAP") {
                        // Always toggle the marquee state when MAP is pressed
                        marqueeActive = !marqueeActive;
                        
                        if (marqueeActive) {
                            startMarquee();
                        } else {
                            stopMarquee();
                            updateDisplay("MAP");
                        }
                    }
                };
            }
        }
        
        // ----- MODEL NUMBER AND MARQUEE TOGGLE -----
        var footerGroup = win.add("group");
        footerGroup.orientation = "row";
        footerGroup.alignment = ["fill", "bottom"];
        footerGroup.alignChildren = ["center", "center"];
        footerGroup.preferredSize = [calculatorWidth, 30];
        footerGroup.margins = [10, 5, 10, 5];
        
        // Add marquee toggle button
        var marqueeButton = footerGroup.add("checkbox", undefined, "Marquee");
        marqueeButton.alignment = ["left", "center"];
        marqueeButton.minimumSize.width = 80;
        marqueeButton.value = false; // MARQUEE OFF BY DEFAULT
        
        // Add spacer to push model number to right edge
        var spacer = footerGroup.add("group");
        spacer.alignment = ["fill", "center"];
        spacer.preferredSize.width = 80;
        
        marqueeButton.onClick = function() {
            if (this.value) {
                if (!marqueeActive) {
                    startMarquee();
                }
            } else {
                if (marqueeActive) {
                    stopMarquee();
                    updateDisplay("SPLUT");
                }
            }
        };
        
        // Add model number on the right
        var modelText = footerGroup.add("statictext", undefined, "SI-1270");
        modelText.alignment = ["right", "center"];
        try {
            modelText.graphics.font = ScriptUI.newFont("Arial", "BOLD", 12);
        } catch(e) {}
        
        // Handle window resize
        win.onResize = function() {
            win.layout.resize();
        };
        
        // Log the script folder for debugging
        $.writeln("SPLUT Toolbar initialized with script folder: " + baseFolder);
        
        if (win instanceof Window) {
            win.center();
            win.show();
        } else {
            win.layout.layout(true);
        }
        
        return win;
    }
    
    buildUI(thisObj);
})(this);