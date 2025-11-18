# app/routes/recipes.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend import models, schemas
from backend.database import get_db
from backend.routes.users import get_current_user
from huggingface_hub import InferenceClient
import os, json
from dotenv import load_dotenv
from backend.routes.favorites import is_favorite_recipe
from typing import Optional

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
@router.post("/", response_model=schemas.RecipeResponse)
def create(title: str = Form(...),
            ingredients: list[str] = Form(...),
            steps: str = Form(...),
            file: UploadFile = File(None),
            db: Session = Depends(get_db),
            user = Depends(get_current_user)):
    # Prevent duplicates
    existing = (
        db.query(models.Recipes)
        .filter(models.Recipes.title == title)
        .first()
    )

    if existing:
        raise HTTPException(400, detail="Recipe already saved")
    
    #saving the image if one was uploaded
    # --- Save optional uploaded file ---
    if file:
        upload_dir = os.path.join('backend', 'data', 'Food_Images', 'Food_Images')
        upload_path = os.path.join(upload_dir, file.filename)
        with open(upload_path, "wb") as buffer:
            buffer.write(file.file.read())

    new_recipe = models.Recipes(
        title=title,
        ingredients=ingredients,
        steps=steps,
        image_url= "/images/"+file.filename,#recipe.image_url,
        created_by=user.id
    )

    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    # #Add it to favorites
    # favorite = models.Favorites(
    #     user_id = user.id,
    #     recipe_id = new_recipe.id
    # )

    # db.add(favorite)
    # db.commit()
    # db.refresh(favorite)

    return new_recipe


# List Recipes
@router.get("/", response_model=dict)
def list_recipes(
    page: int = 1,        # page number (1-based)
    page_size: int = 10,  # items per page
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
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

    response = []
    for r in recipes:
        item = schemas.RecipeResponse.model_validate(r).model_dump()
        item["is_favorite"] = is_favorite_recipe(db, user.id, r.id)
        response.append(item)

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": (total + page_size - 1) // page_size,
        "recipes": response,
    }

# Get Single Recipe
@router.get("/id/{recipe_id}")
def get_recipe(recipe_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    recipe = db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    data = schemas.RecipeResponse.model_validate(recipe).model_dump()
    data["is_favorite"] = is_favorite_recipe(db, user.id, recipe_id)
    if not recipe.creator:
        data["created_by_name"] = None
    else:
        
        data["created_by_name"] = recipe.creator.name
    return data


# Update Recipe
@router.put("/id/{recipe_id}")
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
@router.delete("/id/{recipe_id}")
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
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    skip = (page - 1) * page_size

    query = db.query(models.Recipes).filter(
        models.Recipes.title.ilike(f"%{q}%")
    )

    results = query.offset(skip).limit(page_size).all()
    total = query.count()

    response = []
    for r in results:
        item = schemas.RecipeResponse.model_validate(r).model_dump()
        item["is_favorite"] = is_favorite_recipe(db, user.id, r.id)
        response.append(item)

    return {
        "query": q,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": (total + page_size - 1) // page_size,
        "recipes": response,
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

    # print(raw)
    # Parse JSON safely
    try:
        recipes = json.loads(raw)
    except Exception:
        raise HTTPException(500, detail="AI returned invalid JSON")

    return {"recipes": recipes}

# # if AI generated receipe needs to be saved.
# @router.post("/save-recipe")
# def save_recipe(req: schemas.SaveRecipeRequest, db: Session = Depends(get_db)):
#     # Prevent duplicates
#     existing = (
#         db.query(models.Recipes)
#         .filter(models.Recipes.title == req.title)
#         .first()
#     )

#     if existing:
#         raise HTTPException(400, detail="Recipe already saved")

#     recipe = models.Recipes(
#         title=req.title,
#         ingredients=req.ingredients,
#         steps=req.steps,
#         image_url=req.image_url,
#         created_by=req.created_by,
#     )

#     db.add(recipe)
#     db.commit()
#     db.refresh(recipe)

#     return {"message": "Recipe saved", "recipe": recipe}

