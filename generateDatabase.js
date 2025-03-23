const fs = require("fs");
const path = require("path");

const imagesDir = "public/images/snapshots";  // Change this to your image folder path
const outputJSON = "./database.json";

fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }

    let imageData = files
        .filter(file => file.endsWith(".jpg") || file.endsWith(".png"))
        .map(file => {
            let match = file.match(/\d{8}_\d{6}/);
            let timestamp = match ? formatTimestamp(match[0]) : "Unknown";

            return {
                filename: file,
                timestamp: timestamp,
                path: path.join(imagesDir, file).replace(/\\/g, "/")  // Ensure cross-platform paths
            };
        });

    fs.writeFileSync(outputJSON, JSON.stringify(imageData, null, 4));
    console.log(" Database updated! ");
});

function formatTimestamp(ts) {
    // Split the timestamp into date and time parts based on the underscore
    const datePart = ts.substring(0, 8);  // "20250119" (YYYYMMDD)
    const timePart = ts.substring(9, 15); // "170823" (HHMMSS)

    // Format into "YYYY-MM-DD HH:MM:SS"
    return `${datePart.substring(0, 4)}-${datePart.substring(4, 6)}-${datePart.substring(6, 8)} `
         + `${timePart.substring(0, 2)}:${timePart.substring(2, 4)}:${timePart.substring(4, 6)}`;
}
