# app/schemas.py
from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
import re

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    def check_password_strength(cls, v):
        return validate_password(v)

class RecipeBase(BaseModel):
    title: str
    ingredients: List[str]
    steps: str
    image_url: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    title: Optional[str]
    ingredients: Optional[List[str]]
    steps: Optional[str]
    image_url: Optional[str]

class RecipeResponse(RecipeBase):
    id: int
    created_by: Optional[int]
    is_favourite: bool = False
    
    model_config = {
        "from_attributes": True
    }

class SaveRecipeRequest(BaseModel):
    title: str
    ingredients: list[str]
    steps: str
    image_url: str | None = None
    created_by: int | None = None


# -----------------------------
# Helper function
# -----------------------------
def validate_password(v: str) -> str: # makes sure we have a strong password for each user
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters")
    if not re.search(r"[A-Z]", v):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", v):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"[0-9]", v):
        raise ValueError("Password must contain at least one number")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
        raise ValueError("Password must contain at least one special character")
    return v
