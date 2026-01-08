import os
import shutil

FOLDER_PATH = './out'

def is_duplicate_folder(rootFolder):
    parentFolder = rootFolder.split('/')[:-1]
    parentFolder = '/'.join(parentFolder)
    folder = rootFolder.split('/')[-1].lower().replace(" ", "_")
    for root, dirs, files in os.walk(parentFolder):
        for dir in dirs:
            if folder == dir:
                return True
    return False

def move_json_files(source_forder=FOLDER_PATH):
    for root, dirs, files in os.walk(f'{source_forder}/_next/data'):
        is_Duplicate = False
        rootDir = root.split('/')[-1]
        if rootDir[0].isupper():
            is_Duplicate = is_duplicate_folder(root)

        if is_Duplicate:
            for file in files:
                if file.endswith('.json'):
                    parent = root.split('/')[:-1]
                    parent.append(rootDir.lower().replace(' ', '_'))
                    parent = '/'.join(parent)

                    target_folder = parent

                    # Create the folder if it doesn't exist
                    if not os.path.exists(target_folder):
                        os.makedirs(target_folder)

                    source_path = os.path.join(root, file)
                    target_path = os.path.join(target_folder, file)

                    # Move the JSON file to the corresponding folder
                    shutil.move(source_path, target_path)
                    print(f"Moved {file} to {target_folder}")
        if is_Duplicate:
            shutil.rmtree(root)
            print(f"Directory '{root}' successfully deleted.")

def move_html_files(source_folder=FOLDER_PATH):
    for root, dirs, files in os.walk(source_folder):
        is_Duplicate = False

        if './out/_next' in root:
            continue

        rootDir = root.split('/')[-1]
        if rootDir[0].isupper():
            is_Duplicate = is_duplicate_folder(root)

        if not is_Duplicate:
            for file in files:
                if file.endswith('.html') and file != 'index.html':
                    folder_name = os.path.splitext(file)[0]
                    target_folder = os.path.join(root, folder_name)

                    # Create the folder if it doesn't exist
                    if not os.path.exists(target_folder):
                        os.makedirs(target_folder)

                    source_path = os.path.join(root, file)
                    target_path = os.path.join(target_folder, 'index.html')

                    # Move the HTML file to the corresponding folder
                    shutil.move(source_path, target_path)
                    print(f"Moved {file} to {target_folder}")
        else:
            for file in files:
                if file.endswith('.html') and file != 'index.html':
                    folder_name = os.path.splitext(file)[0]

                    parent = root.split('/')[:-1]
                    parent.append(rootDir.lower().replace(' ', '_'))
                    parent = '/'.join(parent)

                    target_folder = os.path.join(parent, folder_name)

                    # Create the folder if it doesn't exist
                    if not os.path.exists(target_folder):
                        os.makedirs(target_folder)

                    source_path = os.path.join(root, file)
                    target_path = os.path.join(target_folder, 'index.html')

                    # Move the HTML file to the corresponding folder
                    shutil.move(source_path, target_path)
                    print(f"Moved {file} to {target_folder}")

        if is_Duplicate:
            shutil.rmtree(root)
            print(f"Directory '{root}' successfully deleted.")


if __name__ == "__main__":
    move_html_files()
    move_json_files()