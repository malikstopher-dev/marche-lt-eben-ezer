import os
from PIL import Image

INPUT_FOLDER = "public/hero_images_raw"
OUTPUT_FOLDER = "public/hero_banners"

TARGET_WIDTH = 1920
TARGET_HEIGHT = 800

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def resize_and_crop(image_path, output_path):
    img = Image.open(image_path)

    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    img_ratio = img.width / img.height
    target_ratio = TARGET_WIDTH / TARGET_HEIGHT

    if img_ratio > target_ratio:
        new_height = TARGET_HEIGHT
        new_width = int(new_height * img_ratio)
    else:
        new_width = TARGET_WIDTH
        new_height = int(new_width / img_ratio)

    img = img.resize((new_width, new_height), Image.LANCZOS)

    left = (new_width - TARGET_WIDTH) // 2
    top = (new_height - TARGET_HEIGHT) // 2
    right = left + TARGET_WIDTH
    bottom = top + TARGET_HEIGHT

    img = img.crop((left, top, right, bottom))

    img.save(output_path, quality=90)

for file in os.listdir(INPUT_FOLDER):
    if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        input_path = os.path.join(INPUT_FOLDER, file)
        output_name = os.path.splitext(file)[0] + ".jpg"
        output_path = os.path.join(OUTPUT_FOLDER, output_name)

        resize_and_crop(input_path, output_path)

print("Done. Hero banners resized to 1920x800.")