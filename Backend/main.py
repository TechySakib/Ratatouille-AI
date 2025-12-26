from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO
from PIL import Image
import io, json, re, uuid
from typing import List, Dict, Any, Optional

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
# Globals (loaded once)
# ----------------------------
model: Optional[YOLO] = None
recipes_db: List[Dict[str, Any]] = []


# ----------------------------
# Helpers
# ----------------------------
def load_recipes(path: str = "recipes.json") -> List[Dict[str, Any]]:
    """Load recipes JSON into memory once."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"✅ Loaded {len(data)} recipes from {path}")
        return data
    except Exception as e:
        print(f"⚠️ Could not load {path}: {e}")
        return []


def norm(s: str) -> str:
    """Normalize ingredient strings for matching."""
    s = (s or "").lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", " ", s)
    return s


def match_recipes(user_ingredients: List[str], recipes: List[Dict[str, Any]], top_k: int = 15):
    """
    Score = (ingredients you have) / (ingredients required)
    Returns sorted list of best matches.
    """
    user_set = set(norm(x) for x in user_ingredients if x)

    out = []
    for r in recipes:
        title = r.get("title") or r.get("name") or "Untitled Recipe"

        # Support both keys: "ingredients" and "instructions"/"steps"
        req_raw = r.get("ingredients", [])
        steps = r.get("steps") or r.get("instructions") or []

        req = [norm(x) for x in req_raw if x]
        req_set = set(req)

        if not req_set:
            continue

        used = sorted(list(req_set.intersection(user_set)))
        missing = sorted(list(req_set.difference(user_set)))

        score = len(used) / max(len(req_set), 1)
        out.append({
            "id": str(r.get("id") or uuid.uuid4()),
            "title": title,
            "matchScore": round(score * 100, 1),
            "used": used,
            "missing": missing,
            "steps": steps,
        })

    out.sort(key=lambda x: (x["matchScore"], -len(x["used"])), reverse=True)
    return out[:top_k]


# ----------------------------
# Startup: load YOLO + recipes
# ----------------------------
@app.on_event("startup")
def startup_event():
    global model, recipes_db

    # 1) Load YOLO once at startup (CPU-only)
    try:
        model = YOLO("yolov8n.pt")
        print("✅ YOLOv8n loaded (CPU).")
    except Exception as e:
        print(f"❌ YOLO load failed: {e}")
        model = None

    # 2) Load recipes once
    recipes_db = load_recipes()


# ----------------------------
# Request Models
# ----------------------------
class RecipesRequest(BaseModel):
    ingredients: List[str]


# ----------------------------
# Routes
# ----------------------------
@app.get("/")
def read_root():
    return {"message": "Ratatouille AI backend is running."}


@app.post("/detect")
async def detect_food(file: UploadFile = File(...)):
    """
    Receives an image and returns detected ingredient labels + confidence.
    (Does NOT match recipes here; frontend will call /recipes next.)
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded.")

    # Read image bytes
    image_data = await file.read()
    try:
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    # YOLO prediction (explicit CPU)
    results = model.predict(img, conf=0.25, device="cpu", verbose=False)

    # Extract + deduplicate (keep max confidence per class)
    best_conf: Dict[str, float] = {}
    names = model.names

    if results and results[0].boxes is not None:
        cls_list = results[0].boxes.cls.tolist()
        conf_list = results[0].boxes.conf.tolist()

        for cls_id, conf in zip(cls_list, conf_list):
            label = names[int(cls_id)]
            best_conf[label] = max(best_conf.get(label, 0.0), float(conf))

    ingredients = [{"name": k, "confidence": best_conf[k]} for k in sorted(best_conf.keys())]
    return {"ingredients": ingredients}


@app.post("/recipes")
def get_recipes(req: RecipesRequest):
    """
    Receives ingredient list and returns top recipe matches with matchScore.
    """
    if not recipes_db:
        raise HTTPException(status_code=500, detail="recipes.json not loaded or empty.")

    recipes = match_recipes(req.ingredients, recipes_db, top_k=15)
    return {"recipes": recipes}


# Dev run
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
