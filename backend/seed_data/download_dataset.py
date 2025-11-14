import os
import kaggle

# def download_dataset():
os.makedirs("data", exist_ok=True)
kaggle.api.dataset_download_files(
    "pes12017000148/food-ingredients-and-recipe-dataset-with-images",
    path="data",
    unzip=True
)
print("Dataset downloaded and extracted to /data folder")
