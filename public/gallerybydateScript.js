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
    galleryDiv.innerHTML = ""; // Clear previous content

    const categories = ["None", "Important", "Personal", "Work", "Other"]; // Define categories

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

            const captionDiv = document.createElement("div");
            captionDiv.classList.add("caption");
            captionDiv.textContent = `Taken at: ${image.timestamp}`;

              // Category Dropdown
              const categorySelect = document.createElement("select");
              categorySelect.classList.add("form-control");
              categorySelect.style.margin = "5px 0";
  
              categories.forEach(category => {
                  const option = document.createElement("option");
                  option.value = category;
                  option.textContent = category;
                  if (image.category === category) option.selected = true;
                  categorySelect.appendChild(option);
              });
  
              categorySelect.addEventListener("change", () => updateCategory(image.filename, categorySelect.value));
  
              const caption = document.createElement("div");
              captionDiv.classList.add("caption");
              captionDiv.textContent = `Taken at: ${image.timestamp}`;

            // Assemble the elements
            link.appendChild(img);
            thumbnail.appendChild(categorySelect);
            thumbnail.appendChild(link);
            thumbnail.appendChild(captionDiv);
            col.appendChild(thumbnail);
            row.appendChild(col);
        });

        section.appendChild(row);
        galleryDiv.appendChild(section);
    }
}

// Function to update category in database
function updateCategory(filename, newCategory) {
    fetch('/update-category', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ filename, category: newCategory })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Category Updated:", data);

         // ✅ Fetch updated data before reloading the gallery
        return fetch('/public/database.json');
    })
    .then(response => response.json())
    .then(updatedData => {
        displaygallerybydate(updatedData);  // ⬅️ Add this to reload gallery
    })
    .catch(error => console.error("Error updating category:", error));
}