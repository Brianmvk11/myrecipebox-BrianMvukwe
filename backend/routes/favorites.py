# app/routes/favorites.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.routes.users import get_current_user
from backend import models, schemas


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
@router.get("/", response_model=dict)
def get_favorites(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    skip = (page - 1) * page_size

    # Get favorites for the logged-in user
    fav_query = (
        db.query(models.Recipes)
        .join(models.Favorites, models.Recipes.id == models.Favorites.recipe_id)
        .filter(models.Favorites.user_id == user.id)
    )

    total = fav_query.count()

    recipes = (
        fav_query
        .offset(skip)
        .limit(page_size)
        .all()
    )

    response = []
    for r in recipes:
        item = schemas.RecipeResponse.model_validate(r).model_dump()
        item["is_favorite"] = True  # Always true in this endpoint
        response.append(item)

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": (total + page_size - 1) // page_size,
        "recipes": response,
    }


# Is this recipe a favorite?
def is_favorite_recipe(db: Session, user_id: int, recipe_id: int) -> bool:
    return db.query(models.Favorites).filter(
        models.Favorites.user_id == user_id,
        models.Favorites.recipe_id == recipe_id
    ).first() is not None