# Ratatouille AI

Ratatouille AI is an intelligent web application designed to detect food ingredients from images using AI and recommend delicious recipes based on what you have available. It features a modern Progressive Web App (PWA) frontend built with React and Vite, powered by a robust Python FastAPI backend utilizing the YOLOv8 object detection model.

## 🌟 Features

- **Ingredient Detection**: Upload an image of your ingredients, and our YOLOv8-powered backend will automatically identify them.
- **Smart Recipe Matching**: Recommends recipes that match your detected ingredients, helping you decide what to cook with what you already have.
- **Modern PWA Frontend**: A fast, responsive, and installable Progressive Web App built with React and Vite.
- **FastAPI Backend**: High-performance, asynchronous Python backend for handling image processing and API requests.

## 🏗️ Project Structure

The repository is divided into two main sections:

- `/frontend`: Contains the React/Vite web application.
- `/Backend`: Contains the FastAPI server, YOLOv8 model, and recipe data.

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **Python** (v3.9 or higher)
- **npm** or **yarn**

### 1. Setting up the Backend

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI development server:
   ```bash
   python main.py
   ```
   *(Alternatively, you can run it using Uvicorn directly: `uvicorn main:app --reload`)*

The backend server will start running on `http://127.0.0.1:8000`.

### 2. Setting up the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend application will be accessible at `http://localhost:3000` (or another port specified in the terminal).

## 📡 API Endpoints (Backend)

- `GET /`: Health check and welcome message.
- `POST /detect`: Upload an image to get detected ingredients and recipe matches.

*Note: The YOLOv8n (nano) model is trained on the COCO dataset, so it will recognize common objects. Recipes in `Backend/recipes.json` are structured to match these classes (e.g., "apple", "broccoli", "carrot", "orange", "banana") for demonstration purposes.*

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript/JavaScript, CSS Modules.
- **Backend**: Python, FastAPI, Uvicorn, Ultralytics (YOLOv8), OpenCV.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for any improvements, bug fixes, or new features.

## 📄 License

This project is open-source. Feel free to use and modify it as per your needs.
