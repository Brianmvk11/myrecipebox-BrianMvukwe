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

Create a .env file in the root directory and add the following:

DATABASE_URL=postgresql://<username>:<password>@localhost:5432/recipebox_db
SECRET_KEY=your_secret_key_here


6. Run Migrations
alembic upgrade head

7. Start the Application
python main.py