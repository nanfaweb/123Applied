import os
import re

def rename_logos():
    base_path = os.path.join('public', 'custs')
    
    # Ensure we're in the right directory
    if not os.path.exists(base_path):
        print(f"Error: {base_path} directory not found!")
        return

    # Go through each numbered folder
    for folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder)
        
        # Skip if not a directory or not a number
        if not os.path.isdir(folder_path) or not folder.isdigit():
            continue
            
        # Look at each file in the folder
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            
            # Skip if it's already named 'logo.*'
            if filename.startswith('logo.'):
                continue
                
            # Skip if the filename is just numbers (matching the folder name)
            name_without_ext = os.path.splitext(filename)[0]
            if name_without_ext.isdigit():
                continue
                
            # Get the file extension
            _, ext = os.path.splitext(filename)
            
            # Create the new filename
            new_filename = f"logo{ext}"
            new_file_path = os.path.join(folder_path, new_filename)
            
            # Rename the file
            try:
                os.rename(file_path, new_file_path)
                print(f"Renamed in folder {folder}: {filename} → {new_filename}")
            except Exception as e:
                print(f"Error renaming in folder {folder}: {str(e)}")

if __name__ == "__main__":
    rename_logos()
    print("Done! All company logos have been renamed.")
