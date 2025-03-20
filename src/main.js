import 'bootstrap/dist/css/bootstrap.min.css';

// Azure API info
const endpoint = import.meta.env.VITE_API_ENDPOINT; 
const apiKey = import.meta.env.VITE_API_KEY;  

// Debugging output to check if endpoint is loaded
console.log("API Endpoint:", endpoint);  

const form = document.getElementById('uploadForm');
const resultDiv = document.getElementById('result');

// Handle image form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    if (!file) return alert("Please select an image.");

    const formData = new FormData();
    formData.append('image', file);

    try {
        if (!endpoint || !apiKey) {
            console.error("Missing API endpoint or API key");
            resultDiv.textContent = "Error: Missing API endpoint or API key.";
            resultDiv.classList.remove('d-none');
            return;
        }

        // Making the fetch request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Prediction-Key': apiKey,  
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();  
            console.error('Error response:', errorText);
            resultDiv.textContent = `Error: ${errorText}`;
            resultDiv.classList.remove('d-none');
            return;
        }

        // Try parsing the response as JSON
        const result = await response.json().catch((error) => {
            console.error('Failed to parse JSON:', error);
            resultDiv.textContent = `Error: Failed to parse JSON response.`;
            resultDiv.classList.remove('d-none');
            return;
        });

        if (result) {
            displayResults(result);
        }

    } catch (error) {
        console.error('An error occurred:', error);
        resultDiv.textContent = `An error occurred: ${error.message}`;
        resultDiv.classList.remove('d-none');
    }
});

// Function to display results from Azure
function displayResults(data) {
    if (data.predictions && data.predictions.length > 0) {
        let resultText = "Detected Vehicles: ";
        data.predictions.forEach((prediction) => {
            resultText += `${prediction.tagName} (Confidence: ${prediction.probability.toFixed(2)}) `;
        });
        resultDiv.textContent = resultText;
    } else {
        resultDiv.textContent = "No vehicles detected.";
    }
    resultDiv.classList.remove('d-none');
}
