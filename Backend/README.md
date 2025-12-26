# Food Detection Backend

This is a local backend using FastAPI and YOLOv8 to detect food ingredients and recommend recipes.

## Setup

1.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

2.  Run the server:
    ```bash
    python main.py
    ```
    Or directly with uvicorn:
    ```bash
    uvicorn main:app --reload
    ```

## Endpoints

-   `GET /`: Welcome message.
-   `POST /detect`: Upload an image to get detected ingredients and recipe matches.

## Data

Recipes are stored in `recipes.json`. matches are made based on the intersection of YOLO detected labels and the "ingredients" list in the recipe objects.

**Note:** YOLOv8n (nano) is used for detection. It detects common objects (COCO dataset). Ingredients in `recipes.json` should match COCO class names (e.g., "bowl", "apple", "broccoli", "carrot", "orange", "banana") for testing purposes.