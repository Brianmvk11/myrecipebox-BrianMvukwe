# app/routes/favorites.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models
from backend.database import get_db
from backend.routes.users import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])


# Add to Favorites
@router.post("/{recipe_id}")
def add_favorite(recipe_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    recipe = db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    existing = db.query(models.Favorites).filter_by(user_id=user.id, recipe_id=recipe_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")

    fav = models.Favorites(user_id=user.id, recipe_id=recipe_id)
    db.add(fav)
    db.commit()
    return {"message": "Added to favorites"}


# Remove Favorite
@router.delete("/{recipe_id}")
def remove_favorite(recipe_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    fav = db.query(models.Favorites).filter_by(user_id=user.id, recipe_id=recipe_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}


# Get User Favorites
@router.get("/")
def get_favorites(db: Session = Depends(get_db), user=Depends(get_current_user)):
    recipes = (
        db.query(models.Recipes)
        .join(models.Favorites, models.Recipes.id == models.Favorites.recipe_id)
        .filter(models.Favorites.user_id == user.id)
        .all()
    )
    return recipes
