# app/routes/recipes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from routes.users import get_current_user

router = APIRouter(
    prefix="/recipes", 
    tags=["recipes"]
)

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
@router.get("/") #TODO: Make it display in batches of 10
def list_recipes(db: Session = Depends(get_db)):
    return db.query(models.Recipes).all()


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
