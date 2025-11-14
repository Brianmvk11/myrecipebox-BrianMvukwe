import csv
from sqlalchemy.orm import Session
from backend import models
from backend.database import SessionLocal
import os
import ast


def seed_recipes():
    db: Session = SessionLocal()
    file_string = os.path.join('backend','data', 'recipes.csv')
    with open(file_string, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            ingredients_raw = row["Cleaned_Ingredients"]

            # Convert "['item1', 'item2']" → ['item1', 'item2']
            ingredients_list = ast.literal_eval(ingredients_raw)

            recipe = models.Recipes(
                title=row["Title"],
                ingredients=ingredients_list,
                steps=row["Instructions"],
                image_url=os.path.join('backend','data','Food_Images',row["Image_Name"])
            )
            db.add(recipe)
        db.commit()
        db.close()
        print("Database seeded with recipe data")

if __name__ == "__main__":
    seed_recipes()
