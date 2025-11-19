# MyRecipeBox — Your AI Cooking Companion

A full-stack web application where users can browse recipes, manage favourites, and generate AI-powered recipe suggestions based on ingredients they have at home.

## Tech Stack
### Frontend

* React + Vite
* TypeScript
* Axios (API calls)

### Backend

* FastAPI
* SQLAlchemy ORM
* Alembic (migrations)
* Pydantic
* Uvicorn (server)

### Database

* PostgreSQL

### AI Integration

* HuggingFace Inference API

### Other

* python-venv
* Node.js & npm
* Kaggle API (dataset download)

## Features

* Secure user registration + login
* Browse and search recipes
* Save/remove favourite recipes
* Add your own recipes
* AI-powered recipe suggestions based on provided ingredients
* Seeded recipe database from Kaggle dataset

Security Considerations

* Environment variables managed through .env (never committed)
* Passwords are hashed (no plain-text storage)
* API keys kept out of source control
* Auth implemented via JWT
* Example .env.example included for developers

## Project Structure (High-Level)
myrecipebox-brianmvukwe/
│── alembic/
│── backend/
|   └── data (created after seeding)
|       └── Food_Images
|           └── Food_Images
|       └── recipes.csv
|   └── routes
│       ├── favorite.py
│       ├── recipes.py
|       └── ...
|   ├── seed_data
|       ├── downloaded_dataset.py
|       └── ...
|   ├── database.py
|   ├── main.py
|   ├── models.py
|   └── schemas.py
│
│── myrecipebox_frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
│── requirements.txt
│── alembic.ini
│── .env.example
└── README.md

## Installation & Setup

Follow these steps to run the application locally.

1. Clone the Repository
```
git clone https://github.com/Brianmvk11/myrecipebox-BrianMvukwe.git
cd myrecipebox-BrianMvukwe
```

2. Backend Setup
2.1 Create & Activate a Virtual Environment
Windows (PowerShell)
```
python -m venv venv
venv\Scripts\activate
```

macOS / Linux
```
python3 -m venv venv
source venv/bin/activate
```

2.2 Install Python Dependencies
```
pip install -r requirements.txt
```

3. PostgreSQL Setup
Install PostgreSQL

Download and install from:
https://www.postgresql.org/download/

Create Database

You may use pgAdmin or psql.

Using psql:
```
psql -U postgres
CREATE DATABASE recipebox_db;
\q
```

4. Environment Variables

A template file .env.example is included.

Create your .env file in the project root

5. Hugging Face API Setup

* Create or log in to your HuggingFace account
* Go to Settings → Access Tokens
* Generate a new User Access Token
* Add the token to your .env

6. Run Database Migrations
```
alembic revision --autogenerate -m "create initial tables"
alembic upgrade head
```

7. Run the FastAPI Backend

From the root folder:
```
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8008
```


API docs are available at:
http://127.0.0.1:8008/docs

## Seeding the Database (Optional but Recommended)
Step 1: Install Kaggle API

Follow instructions under "Installation & Authentication" here:
https://www.kaggle.com/discussions/getting-started/524433

Step 2: Download Dataset

From the root folder:
```
python -m backend.seed_data.download_dataset
```

After download, structure should look like:
data/
│── recipes.csv
│── Food_Images/
    │── Food_Images/


Rename files/folders as needed:

* Rename CSV:
    Food Ingredients and Recipe Dataset with Image Name Mapping.csv → recipes.csv

* Rename folders
    Food Images → Food_Images
    Subfolder also → Food_Images

Step 3: Populate the Database
```
python -m backend.seed_data.seed_db
```


Dataset source:
https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images

## Running the Frontend
1. Confirm Node Installation
```
node -v
npm -v
```

2. Install Dependencies
```
cd myrecipebox_frontend
npm install
```

3. Start Vite Dev Server (within the frontend folder)
```
npm run dev
```

### Testing Instructions

* Test user registration/login
* Test adding & removing favourites
* Test search functionality
* Test AI recipe suggestion endpoint
* Test creating a custom recipe

### Assumptions & Trade-offs

* Using HuggingFace API due to free tier availability
* Images are loaded from the dataset rather than an S3 bucket (to keep everything local)
* The project prioritizes functionality over styling (UI can be improved)

### Improvements / Known Limitations

* Add "Forgot Password"
* Add "Change Password"
* Improve formatting of recipe steps
* Add more recipe metadata:
* Prep time
* Serving size
* Difficulty level
* Improve search relevance
* Better mobile responsiveness