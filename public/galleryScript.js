document.addEventListener("DOMContentLoaded", function () {
    fetch('/public/database.json') // Load JSON file
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById("gallery");
            let html = "";

            data.forEach(item => { // Loop through each image object
                html += ` 
                    <div class="col-md-4">
                        <div class="thumbnail">
                            <a href="${item.path}" target="_blank">
                                <img src="${item.path}" alt="${item.filename}" style="width:80%">
                                <div class="caption">
                                    <p><strong>Filename:</strong> ${item.filename}</p>
                                    <p><strong>Captured on:</strong> ${item.timestamp}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                `;
            });

            gallery.innerHTML = html; // Insert images into the page
        })
        .catch(error => console.error("Error loading gallery:", error));
});