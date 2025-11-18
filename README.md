# Installation and Setup

1. Clone the Repository
```
git clone https://github.com/Brianmvk11/MyRecipeBox-Your-AI-Cooking-Companion.git
cd MyRecipeBox-Your-AI-Cooking-Companion
```

2. Set up a Virtual Environment

Windows (PowerShell):
```
python -m venv venv
venv\Scripts\Activate
```

macOS / Linux:
```
python3 -m venv venv
source venv/bin/activate
```

3. Install Dependencies
```
pip install -r requirements.txt
```

4. Install and Set Up PostgreSQL
```
Download and install PostgreSQL from the official site:
https://www.postgresql.org/download/
```

You can use either of the following options to create your database:

Option 1: Using pgAdmin (GUI)

Open pgAdmin.

Create a new database (e.g., recipebox_db).

Note your username and password (you’ll need them for your .env file).

Option 2: Using psql (Terminal)

Open your terminal and start the PostgreSQL shell:

psql -U postgres


Create the database:

CREATE DATABASE recipebox_db;


Exit psql:

\q

5. Set Up Environment Variables

NOTE: An example of how your .env file should look can be found in the file ".env.example"

Create a .env file in the root directory and add the following:

DATABASE_URL=postgresql://<username>:<password>@localhost:5432/recipebox_db
SECRET_KEY=your_secret_key_here

* <username>: The user name for the database, usually "postgres"
* <password>: The password related to the created database
* "your_secret_key_here" can be any random string of characters

6. Create a hugging face API key:
* Start by creating a hugging face profile (if you don't already have one) and logging in
* Navigate to create an API key.
To create an access token, go to your settings, then click on the Access Tokens tab. Click on the New token button to create a new User Access Token.
* Copy that API token and paste it in your .env file.


7. Run Migrations

Autogenerate migrations from your SQLAlchemy models:
```
alembic revision --autogenerate -m "create users, recipes and favorites tables"
```
alembic upgrade head

8. To run the Fastapi backend

Inside the root folder
```
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8008
```
Access the FastAPI docs at: http://127.0.0.1:8008/docs 

9. Start the Application 
Inside the root folder
```
python -m backend.main
```

# Seed the database:
1. To seed the database, you need a Kaggle API key. Follow these steps to create one (Follow thw steps under the heading "Installation & Authentication"):
https://www.kaggle.com/discussions/getting-started/524433 

2. Download the data on to your machine:
while in the root folder: (This can take up to 2 min) (run this only once)
```
python -m backend.seed_data.download_dataset
```

You can find the data in a folder "data"

3. Rename the csv file in the folder "data" from "Food Ingredients and Recipe Dataset with Image Name Mapping.csv" to "recipes.csv"

4. Rename the folder from "Food Images" to "Food_Images"

5. Rename the other folder inside this folder from "Food Images" to "Food_Images"
You should have the structure:
data
|-->Food_Images
---|-->Food_Images

6. Populate the database with the data: (run from root)
``` 
python -m backend.seed_data.seed_db
```


Seed database used: https://www.kaggle.com/datasets/pes12017000148/food-ingredients-and-recipe-dataset-with-images

* title: Title of the dish
* ingredients: The ingredients and amount (Unorganized)
* Instructions: Has the recipe instructions to be followed to recreate the dish
* Image_Name: Has the name of the image as stored in the Food Images zipped folder
* Cleaned_Ingredients: Contains the ingredients after being processed and cleaned

# Running the front-end
1. Make sure that you have Node.js installed by running:
```
node -v
npm -v
```

2. Change directory into the frontend folder and install packages:
```
cd myrecipebox_frontend
npm install
```

3. run the project
```
npm run dev
```

imporovements:
- Forgot password
- change password