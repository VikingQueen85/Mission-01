import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for styling

// Azure API info (Loaded from Vite environment variables)
const endpoint = import.meta.env.VITE_API_ENDPOINT; // API endpoint from environment variables
const apiKey = import.meta.env.VITE_API_KEY; // API key from environment variables

// Debugging output to check if endpoint is loaded
console.log("API Endpoint:", endpoint); // Debugging output to verify API endpoint

// DOM elements
const form = document.getElementById('uploadForm'); // Form element for image upload
const resultDiv = document.getElementById('result'); // Div to display results
const uploadedImage = document.getElementById('uploadedImage'); // Image preview element

// Handle image form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const fileInput = document.getElementById('imageInput'); // File input element
    const file = fileInput.files[0]; // Get the selected file
    if (!file) return alert("Please select an image."); // Alert if no file is selected

    // Show image preview
    const reader = new FileReader(); // FileReader to read the image
    reader.onload = function (e) {
        uploadedImage.src = e.target.result; // Set the image preview source
        uploadedImage.classList.remove('d-none'); // Make the image visible
    };
    reader.readAsDataURL(file); // Read the file as a data URL

    try {
        // Check if API endpoint and key are available
        if (!endpoint || !apiKey) {
            console.error("Missing API endpoint or API key"); // Log error if missing
            resultDiv.textContent = "Error: Missing API endpoint or API key."; // Display error message
            resultDiv.classList.remove('d-none'); // Make the result div visible
            return;
        }

        // Sending request to Azure API
        const response = await fetch(endpoint, {
            method: 'POST', // HTTP POST method
            headers: {
                'Prediction-Key': apiKey, // API key for authentication
                'Content-Type': 'application/octet-stream', // Content type for binary data
            },
            body: file, // Send the image file as binary data
        });

        // Handle non-OK responses
        if (!response.ok) {
            const errorText = await response.text(); // Get error response text
            console.error('Error response:', errorText); // Log the error
            resultDiv.textContent = `Error: ${errorText}`; // Display the error message
            resultDiv.classList.remove('d-none'); // Make the result div visible
            return;
        }

        // Get API response
        const result = await response.json(); // Parse the JSON response
        console.log("Azure API Response:", result); // Debugging output for API response

        if (result) {
            displayResults(result); // Call function to display results
        }

    } catch (error) {
        // Handle errors during the API request
        console.error('An error occurred:', error); // Log the error
        resultDiv.textContent = `An error occurred: ${error.message}`; // Display the error message
        resultDiv.classList.remove('d-none'); // Make the result div visible
    }
});

// Function to display results from Azure (Only top result shown)
function displayResults(data) {
    console.log("Processed Data:", data); // Debugging output for processed data

    if (data.predictions && data.predictions.length > 0) {
        // Sort predictions by probability in descending order
        const topPrediction = data.predictions.sort((a, b) => b.probability - a.probability)[0];

        // Extract Vehicle Type (tagName) & Details
        const vehicleType = topPrediction.tagName || "Unknown"; // Extract vehicle type or default to "Unknown"
        const year = topPrediction.year || "Unknown"; // Extract year or default to "Unknown"
        const make = topPrediction.make || "Unknown"; // Extract make or default to "Unknown"
        const model = topPrediction.model || "Unknown"; // Extract model or default to "Unknown"

        // Display results properly
        resultDiv.innerHTML = `<strong>Detected Vehicle:</strong> ${vehicleType}<br>
                                <strong>Make:</strong> ${make}<br>
                                <strong>Model:</strong> ${model}<br>
                                <strong>Year:</strong> ${year}<br>
                                <strong>Confidence:</strong> ${(topPrediction.probability * 100).toFixed(2)}%`;

    } else {
        // Handle case where no predictions are found
        resultDiv.textContent = "No vehicles detected.";
    }
    resultDiv.classList.remove('d-none'); // Make the result div visible
}
