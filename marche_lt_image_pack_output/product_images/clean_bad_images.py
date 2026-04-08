import os
import shutil

# FIXED PATHS (based on where you're running it)
SOURCE_DIR = r"."
REVIEW_DIR = r"..\review_bad_images"

# Files smaller than this many KB will be moved for review
SIZE_THRESHOLD_KB = 15

os.makedirs(REVIEW_DIR, exist_ok=True)

moved = 0
checked = 0

for root, dirs, files in os.walk(SOURCE_DIR):
    for file in files:
        if not file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            continue

        checked += 1
        full_path = os.path.join(root, file)
        size_kb = os.path.getsize(full_path) / 1024

        if size_kb < SIZE_THRESHOLD_KB:
            rel_dir = os.path.relpath(root, SOURCE_DIR)
            target_dir = os.path.join(REVIEW_DIR, rel_dir)
            os.makedirs(target_dir, exist_ok=True)

            target_path = os.path.join(target_dir, file)
            shutil.move(full_path, target_path)
            moved += 1
            print(f"MOVED ({size_kb:.1f} KB): {full_path} -> {target_path}")

print("\nDone.")
print(f"Checked: {checked}")
print(f"Moved to review: {moved}")
print(f"Review folder: {REVIEW_DIR}")