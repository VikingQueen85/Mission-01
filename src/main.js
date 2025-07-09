
import 'bootstrap/dist/css/bootstrap.min.css';

const AZURE_PREDICTION_ENDPOINT = import.meta.env.VITE_AZURE_API_ENDPOINT;
const AZURE_PREDICTION_KEY = import.meta.env.VITE_AZURE_PREDICTION_KEY;

console.log("API Endpoint:", AZURE_PREDICTION_ENDPOINT);

const form = document.getElementById('uploadForm');
const resultDiv = document.getElementById('result');
const uploadedImage = document.getElementById('uploadedImage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        uploadedImage.classList.remove('d-none');
    };
    reader.readAsDataURL(file);

    try {
        if (!AZURE_PREDICTION_ENDPOINT || !AZURE_PREDICTION_KEY) {
            console.error("Error: Missing API endpoint or API key in environment variables.");
            resultDiv.textContent = "Error: Missing API endpoint or API key. Please check your .env file.";
            resultDiv.classList.remove('d-none');
            return;
        }

        console.log("File Name:", file.name);
        console.log("File Type (MIME):", file.type);
        console.log("File Size (bytes):", file.size);

        let imageToSend = file;

        // Convert to JPEG if file is WebP
        if (file.type === 'image/webp') {
            imageToSend = await convertImageToJpeg(file);
            console.log("Converted WebP to JPEG for Azure compatibility.");
        }

        const response = await fetch(AZURE_PREDICTION_ENDPOINT, {
            method: 'POST',
            headers: {
                'Prediction-Key': AZURE_PREDICTION_KEY,
                'Content-Type': 'application/octet-stream',
            },
            body: imageToSend,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from Azure API:', response.status, response.statusText, errorText);
            resultDiv.textContent = `Error from Azure: ${response.status} ${response.statusText} - ${errorText}`;
            resultDiv.classList.remove('d-none');
            return;
        }

        const result = await response.json();
        console.log("Azure API Response:", result);

        if (result) {
            displayResults(result);
        }

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        resultDiv.textContent = `An unexpected error occurred: ${error.message}`;
        resultDiv.classList.remove('d-none');
    }
});

// Convert WebP to JPEG using canvas
function convertImageToJpeg(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Conversion to JPEG failed'));
            }, 'image/jpeg', 0.95);
        };

        reader.onerror = reject;
        img.onerror = reject;

        reader.readAsDataURL(file);
    });
}

// Display prediction result
function displayResults(data) {
    console.log("Processed Data for Display:", data);

    if (data.predictions && data.predictions.length > 0) {
        const topPrediction = data.predictions.sort((a, b) => b.probability - a.probability)[0];
        const vehicleType = topPrediction.tagName || "Unknown";

        resultDiv.innerHTML = `<strong>Detected Vehicle:</strong> ${vehicleType}<br>
                                <strong>Confidence:</strong> ${(topPrediction.probability * 100).toFixed(2)}%`;
    } else {
        resultDiv.textContent = "No vehicles detected.";
    }
    resultDiv.classList.remove('d-none');
}
