from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import List, Dict, Any
import uvicorn
from ultralytics import YOLO
from PIL import Image
import io
import json
import os

app = FastAPI(title="Food Detection & Recipe Recommendation Backend")

# Global variables to hold model and data
model = None
recipes_db = []

def load_recipes():
    """Loads recipes from the local JSON file."""
    global recipes_db
    try:
        with open("recipes.json", "r") as f:
            recipes_db = json.load(f)
        print(f"Loaded {len(recipes_db)} recipes.")
    except Exception as e:
        print(f"Error loading recipes.json: {e}")
        recipes_db = []

@app.on_event("startup")
async def startup_event():
    """Load resources on startup."""
    global model
    # Load YOLOv8n model
    try:
        model = YOLO("yolov8n.pt")
        print("YOLOv8 model loaded successfully.")
    except Exception as e:
        print(f"Error loading YOLOv8 model: {e}")
    
    # Load recipes
    load_recipes()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Food Detection API"}

@app.post("/detect")
async def detect_food(file: UploadFile = File(...)):
    """
    Detects ingredients in the uploaded image and returns matching recipes.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    try:
        # Read image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        # Perform detection
        results = model(image)
        
        # Extract detected class names
        detected_ingredients = set()
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                class_name = model.names[class_id]
                detected_ingredients.add(class_name)
        
        detected_list = list(detected_ingredients)
        
        # Match recipes
        matched_recipes = []
        for recipe in recipes_db:
            recipe_ingredients = set(recipe.get("ingredients", []))
            # Find intersection
            common_ingredients = recipe_ingredients.intersection(detected_ingredients)
            
            if common_ingredients:
                matched_recipes.append({
                    "id": recipe.get("id"),
                    "name": recipe.get("name"),
                    "matched_ingredients": list(common_ingredients),
                    "missing_ingredients": list(recipe_ingredients - detected_ingredients),
                    "instructions": recipe.get("instructions")
                })
        
        # Sort by number of matched ingredients (descending)
        matched_recipes.sort(key=lambda x: len(x["matched_ingredients"]), reverse=True)

        return {
            "detected_ingredients": detected_list,
            "recipes": matched_recipes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
