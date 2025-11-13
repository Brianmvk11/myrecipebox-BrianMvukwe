# Database should store:
'''
Users
  id | name | email | password_hash

Recipes
  id | title | ingredients | steps | image_url | created_by (user_id)

Favorites
  id | user_id | recipe_id
'''

from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base
from sqlalchemy.dialects.postgresql import ARRAY

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)

class Recipes(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    ingredients = Column(ARRAY(String), nullable=False) 
    steps = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True) #If null then it data that was available and not added by the user

class Favorites(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    recipe_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
