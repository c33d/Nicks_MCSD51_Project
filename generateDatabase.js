module.exports = function generateDatabase() {
    const fs = require("fs");
    const path = require("path");

    const imagesDir = "public/images/snapshots"; // Directory containing snapshots
    const outputJSON = "public/database.json";

    // Read the directory and sync with database.json
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        // Filter for image files (e.g., .jpg, .png)
        const imageFiles = files.filter(file => file.endsWith(".jpg") || file.endsWith(".png"));

        // Read the existing database.json file
        let existingData = [];
        if (fs.existsSync(outputJSON)) {
            existingData = JSON.parse(fs.readFileSync(outputJSON, "utf8"));
        }

        // Create a map of existing filenames for quick lookup
        const existingFilesMap = new Map(existingData.map(item => [item.filename, item]));

        // Prepare the updated data
        const updatedData = imageFiles.map(file => {
            if (existingFilesMap.has(file)) {
                // If the file already exists in the database, keep its metadata
                return existingFilesMap.get(file);
            } else {
                // If the file is new, generate metadata for it
                const match = file.match(/\d{8}_\d{6}/);
                const timestamp = match ? formatTimestamp(match[0]) : "Unknown";
                return {
                    filename: file,
                    timestamp: timestamp,
                    path: path.join(imagesDir, file).replace(/\\/g, "/"), // Ensure cross-platform paths
                    category: "None" // Default category for new files
                };
            }
        });

        // Write the updated data back to database.json
        fs.writeFileSync(outputJSON, JSON.stringify(updatedData, null, 4));
        console.log("database.json has been updated!");
    });

    // Helper function to format timestamps
    function formatTimestamp(ts) {
        // Split the timestamp into date and time parts based on the underscore
        const datePart = ts.substring(0, 8); // "20250119" (YYYYMMDD)
        const timePart = ts.substring(9, 15); // "170823" (HHMMSS)

        // Format into "YYYY-MM-DD HH:MM:SS"
        return `${datePart.substring(0, 4)}-${datePart.substring(4, 6)}-${datePart.substring(6, 8)} `
             + `${timePart.substring(0, 2)}:${timePart.substring(2, 4)}:${timePart.substring(4, 6)}`;
    }
};

