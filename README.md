
Car Finder is a simple and powerful tool that helps you detect cars in images with ease. Whether you're curious about a vehicle in a photo, working on a car-related project, or looking to identify vehicles for personal or business use, our tool makes it quick and hassle-free. Just upload an image, and we'll analyze it using Azure AI to identify the cars present and provide confidence scores.

Installation & Setup
This project consists of a React + Vite frontend that runs locally and communicates with an Azure AI Custom Vision backend service.

Prerequisites:
Node.js: Ensure Node.js (LTS version recommended) is installed on your system.

Git: For cloning the repository.

Code Editor: Such as VS Code.

Azure Account & Custom Vision Resource: You need an active Azure account with a deployed and trained Azure Custom Vision model (for image classification/object detection) configured for prediction. This includes:

A Prediction Endpoint URL (e.g., https://mission01-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/<ProjectId>/classify/iterations/<IterationName>/image)

A Prediction Key

Setup Steps:
Clone the Repository:

git clone https://github.com/VikingQueen85/Mission-01.git
cd Mission-01 # Or the root directory of your cloned project

Install Frontend Dependencies:
Navigate to the project root and install dependencies.

npm install

Configure Environment Variables:
Create a .env file in the root directory of your project. This file will hold your Azure Custom Vision prediction details.

VITE_AZURE_API_ENDPOINT=YOUR_FULL_AZURE_CUSTOM_VISION_PREDICTION_URL_HERE
VITE_AZURE_PREDICTION_KEY=YOUR_AZURE_CUSTOM_VISION_PREDICTION_KEY_HERE

Replace YOUR_FULL_AZURE_CUSTOM_VISION_PREDICTION_URL_HERE with the exact URL from your Custom Vision project's "Prediction URL" dialog (ending in /image for raw file uploads).
Replace YOUR_AZURE_CUSTOM_VISION_PREDICTION_KEY_HERE with your actual Prediction Key.
Ensure .env is added to your .gitignore file to prevent accidental public exposure.

Start the Frontend Application:
Once dependencies are installed and .env is configured, start the development server.

npm run dev

The application will typically open in your browser at http://localhost:5173.

More Details
My project is a React + Vite application, integrated with a Bootstrap-powered front-end, serving as a user-friendly car detection tool.

Core Functionality:
Image Upload & Preview: Users can easily upload an image file from their local machine, and a preview of the selected image is displayed immediately.

Azure Custom Vision Integration: The core car detection functionality is powered by a trained model deployed on Azure Custom Vision. The frontend sends the uploaded image directly to this cloud service for analysis.

Image Format Compatibility: The application includes client-side logic to handle common image formats. Specifically, if a user uploads a WebP image, it is automatically converted to JPEG format in the browser before being sent to Azure Custom Vision, ensuring compatibility with the API's supported image types (JPEG, PNG, GIF, BMP).

Prediction Display: Upon receiving results from Azure, the application parses the JSON response and displays the detected vehicle type and its confidence level directly on the webpage.

Error Handling: Robust error handling is in place to inform the user about missing API keys, network issues, or errors returned by the Azure API (e.g., BadRequestImageFormat).

Technical Breakdown:
Frontend:

React.js (with Vite): Provides the component-based architecture for the user interface. App.jsx serves as the main entry point, while src/main.js contains the core logic for image handling, API communication, and result display.

Bootstrap: Used for responsive design and consistent styling, ensuring the application looks good on various devices.

HTML5 File API & Canvas: Utilized for reading local image files, displaying previews, and performing client-side image format conversion (WebP to JPEG).

fetch API: Used to make HTTP POST requests to the Azure Custom Vision Prediction API.

Backend (Azure Custom Vision Service):

This is a managed Azure AI service where a custom image classification (or object detection) model is trained and deployed.

It handles the heavy lifting of running detection algorithms on the uploaded images and returns structured results to the frontend.

The Azure Portal was used to set up the Custom Vision resource, train the model by manually uploading and tagging pictures of cars (trucks, sedans, SUVs), and publish an iteration for prediction.

How It Works (End-to-End Flow):
User Interaction: A user accesses the local React application (http://localhost:5173) and selects an image file via the provided form.

Client-Side Processing:

The selected image is read by FileReader to display a local preview.

src/main.js checks the image file type. If it's image/webp, a canvas element is used to draw the image and then export it as a image/jpeg Blob.

API Request: The application sends a POST request to the configured VITE_AZURE_API_ENDPOINT (your Azure Custom Vision Prediction URL) with the image file (or the converted JPEG Blob) in the request body and the Prediction-Key in the headers. The Content-Type header is set to application/octet-stream.

Azure AI Processing: The Azure Custom Vision service receives the image, runs its trained model, and performs the car detection/classification.

Result Display: The Azure service sends back a JSON response containing prediction results (e.g., detected tags like "Truck," "Sedan," "SUV," and their confidence probabilities). The frontend then parses this JSON and updates the UI to show the top prediction.

Contributors
Tessa - VikingQueen85