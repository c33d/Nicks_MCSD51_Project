document.addEventListener("DOMContentLoaded", () => {
    fetch('/public/database.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            displaygallerybydate(data);
        })
        .catch(error => console.error("Error loading gallery:", error));
});

function displaygallerybydate(images) {
    const galleryDiv = document.getElementById("gallery");

    // Group images by date
    const groupedImages = {};
    images.forEach(image => {
        const date = image.timestamp.split(" ")[0]; // Extract YYYY-MM-DD
        if (!groupedImages[date]) {
            groupedImages[date] = [];
        }
        groupedImages[date].push(image);
    });

    // Create HTML structure for each date group
    for (const date in groupedImages) {
        const section = document.createElement("div");
        section.classList.add("date-group");

        // Add date heading
        const heading = document.createElement("h3");
        heading.textContent = date;
        section.appendChild(heading);

        // Create a row for images
        const row = document.createElement("div");
        row.classList.add("row");

        groupedImages[date].forEach(image => {
            const col = document.createElement("div");
            col.classList.add("col-md-4");

            const thumbnail = document.createElement("div");
            thumbnail.classList.add("thumbnail");

            const link = document.createElement("a");
            link.href = image.path;
            link.target = "_blank";

            const img = document.createElement("img");
            img.src = image.path;
            img.alt = "Image";
            img.style.width = "100%";

            const caption = document.createElement("div");
            caption.classList.add("caption");
            caption.textContent = `Taken at: ${image.timestamp}`;

            // Assemble the elements
            link.appendChild(img);
            thumbnail.appendChild(link);
            thumbnail.appendChild(caption);
            col.appendChild(thumbnail);
            row.appendChild(col);
        });

        section.appendChild(row);
        galleryDiv.appendChild(section);
    }
}
