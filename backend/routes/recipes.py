# app/routes/recipes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas
from backend.database import get_db
from backend.routes.users import get_current_user
from huggingface_hub import InferenceClient
import os, json
from dotenv import load_dotenv

from pydantic import BaseModel

class SuggestRequest(BaseModel):
    ingredients: list[str]

router = APIRouter(
    prefix="/recipes", 
    tags=["recipes"]
)

load_dotenv()
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

client = InferenceClient(api_key=HF_API_TOKEN)

# Create Recipe
@router.post("/")
def create(recipe: schemas.RecipeCreate, 
           db: Session = Depends(get_db), 
           user=Depends(get_current_user)):
    new_recipe = models.Recipes(
        title=recipe.title,
        ingredients=recipe.ingredients,
        steps=recipe.steps,
        image_url=recipe.image_url,
        created_by=user.id
    )
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe


# List Recipes
@router.get("/", response_model=dict)
def list_recipes(
    page: int = 1,        # page number (1-based)
    page_size: int = 10,  # items per page
    db: Session = Depends(get_db)
):
    # Calculate offset
    skip = (page - 1) * page_size

    recipes = (
        db.query(models.Recipes)
        .offset(skip)
        .limit(page_size)
        .all()
    )

    total = db.query(models.Recipes).count()

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": (total + page_size - 1) // page_size,
        "recipes": [schemas.RecipeResponse.model_validate(r).model_dump() for r in recipes],
    }

# Get Single Recipe
@router.get("/{recipe_id}")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


# Update Recipe
@router.put("/{recipe_id}")
def update(recipe_id: int, update_data: schemas.RecipeUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    recipe = db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    if recipe.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed to modify this recipe")

    for key, value in update_data.model_dump(): #.items():
        setattr(recipe, key, value)

    db.commit()
    db.refresh(recipe)
    return recipe


# Delete Recipe
@router.delete("/{recipe_id}")
def delete(recipe_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    recipe = db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    if recipe.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this recipe")

    db.delete(recipe)
    db.commit()
    return {"message": "Recipe deleted"}

# searching based on the title TODO: Search db based on ingredients
@router.get("/search")
def search_recipes(
    q: str,
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size

    query = db.query(models.Recipes).filter(
        models.Recipes.title.ilike(f"%{q}%")
    )

    results = query.offset(skip).limit(page_size).all()
    total = query.count()

    return {
        "query": q,
        "page": page,
        "page_size": page_size,
        "total": total,
        "recipes": results,
    }

# AI ingredients creation
@router.post("/suggest-recipes")
def suggest(req: SuggestRequest):

    prompt = f"""
    Generate exactly 1 recipe idea using ONLY these ingredients: {", ".join(req.ingredients)}.

    Return ONLY valid JSON. Format EXACTLY like this:

    [
    {{
        "title": "string",
        "ingredients": ["list", "of", "strings"],
        "steps": "string with instructions",
        "image_url": null
    }}
    ]

    No markdown. No explanations.
    """

    completion = client.chat.completions.create(
        model="Qwen/Qwen2.5-7B-Instruct-1M:featherless-ai",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=800,
        temperature=0.5
    )

    raw = completion.choices[0].message["content"]

    print(raw)
    # Parse JSON safely
    try:
        recipes = json.loads(raw)
    except Exception:
        raise HTTPException(500, detail="AI returned invalid JSON")

    return {"recipes": recipes}

# if AI generated receipe needs to be saved.
@router.post("/save-recipe")
def save_recipe(req: schemas.SaveRecipeRequest, db: Session = Depends(get_db)):
    # Prevent duplicates
    existing = (
        db.query(models.Recipes)
        .filter(models.Recipes.title == req.title)
        .first()
    )

    if existing:
        raise HTTPException(400, detail="Recipe already saved")

    recipe = models.Recipes(
        title=req.title,
        ingredients=req.ingredients,
        steps=req.steps,
        image_url=req.image_url,
        created_by=req.created_by,
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)

    return {"message": "Recipe saved", "recipe": recipe}

