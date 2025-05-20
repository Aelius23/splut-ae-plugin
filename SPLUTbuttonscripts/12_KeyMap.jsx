// 12_KeyMap.jsx
// Simple script to provide keyboard shortcut mapping instructions

(function() {
    // Get script folder path dynamically
    function getScriptPath() {
        try {
            var scriptFile = new File($.fileName);
            return decodeURI(scriptFile.parent.fsName);
        } catch (err) {
            // Just return a generic message if we can't detect
            return "The folder where you installed the SPLUT scripts"; 
        }
    }
    
    // Try to get the path for displaying in instructions
    var scriptPath = getScriptPath();
    
    // Show a simple instructional dialog
    alert("SPLUT INSTRUMENTS KEYBOARD MAPPING\n\n" +
          "To map scripts to your keyboard:\n\n" +
          "1. Go to Edit > Keyboard Shortcuts...\n" +
          "2. In the 'Application' tab, search for 'Run Script File'\n" +
          "3. Assign keys (1-9, 0, -) to the corresponding script files in the folder:\n" +
          "   " + scriptPath + "\n\n" +
          "Recommended mappings:\n" +
          "• 1 → 01_AutomatedSplitScreen_ACamLEFT.jsx\n" +
          "• 2 → 02_AutomatedSplitScreen_ACamRIGHT.jsx\n" +
          "• 3 → 03_Horizontal3WaySplit.jsx\n" +
          "• 4 → 04_Vertical3WaySplit.jsx\n" +
          "• 5 → 05_FourWaySplit.jsx\n" +
          "• 6 → 06_NineWaySplit.jsx\n" +
          "• 7 → 07_MoodBoardRandomizer.jsx\n" +
          "• 8 → 08_BZoomIn.jsx\n" +
          "• 9 → 09_BZoomOut.jsx\n" +
          "• 0 → 10_Rotate.jsx\n" +
          "• - → 11_Strobe.jsx");
})();