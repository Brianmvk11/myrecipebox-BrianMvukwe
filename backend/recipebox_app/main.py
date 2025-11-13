
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from routes import users

app = FastAPI(title="MyRecipeBox API")

origins = [
    "http://localhost:3000",  # React frontend
    "http://192.168.18.66:8081",
]

# Create tables (only runs if they don’t exist yet)
# models.Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # where your frontend runs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MyRecipeBox API"}