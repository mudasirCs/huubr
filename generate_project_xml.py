import os
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.dom import minidom
import fnmatch
import re

# Define allowed extensions at global scope
ALLOWED_EXTENSIONS = {
    '.py', '.js', '.jsx', '.ts', '.tsx',
    '.html', '.css', '.scss', '.sass',
    '.md', '.txt', '.json', '.yaml', '.yml',
    '.xml', '.csv',
    '.sh', '.bash', '.zsh',
    '.sql',
    '.env.example', '.gitignore'
}

def sanitize_xml_content(content: str) -> str:
    """Sanitize content for XML by removing invalid characters."""
    # Remove invalid XML characters
    def clean_char(c):
        # Keep only valid XML characters
        return c if ord(c) >= 32 or c in '\n\r\t' else ''
    
    # Clean the content character by character
    content = ''.join(clean_char(c) for c in content)
    
    # Handle CDATA sections
    content = f"<![CDATA[{content}]]>"
    
    return content

def should_ignore_file(file_path: Path) -> bool:
    """Check if file should be ignored based on common patterns."""
    ignore_patterns = {
        'directories': {
            'node_modules', 'public' 'venv', 'env', '__pycache__',
            '.git', '.idea', '.vscode', 'dist', 'build', '.next'
        },
        'extensions': {
            '.pyc', '.pyo', '.pyd', '.so',
            '.log', '.lock',
            '.db', '.sqlite', '.sqlite3',
            '.png', '.jpg', '.jpeg', '.gif', '.ico',
            '.mp3', '.mp4', '.wav', '.avi',
            '.zip', '.tar', '.gz', '.rar'
        },
        'files': {
            '.env', '.gitignore', 'package-lock.json',
            'yarn.lock', 'poetry.lock', '.DS_Store', 'thumbs.db'
        }
    }
    
    for parent in file_path.parents:
        if parent.name in ignore_patterns['directories']:
            print(f"Ignoring file in excluded directory: {file_path}")
            return True
    
    if file_path.suffix in ignore_patterns['extensions']:
        print(f"Ignoring file with excluded extension: {file_path}")
        return True
    
    if file_path.name in ignore_patterns['files']:
        print(f"Ignoring specific excluded file: {file_path}")
        return True
    
    return False

def read_file_content(file_path: Path) -> str:
    """Read file content safely, handling different encodings."""
    if file_path.suffix not in ALLOWED_EXTENSIONS:
        print(f"Skipping file with unsupported extension: {file_path}")
        return ""

    max_size = 1_000_000  # 1MB
    if file_path.stat().st_size > max_size:
        print(f"Skipping large file: {file_path}")
        return f"File too large to include: {file_path}"
    
    encodings = ['utf-8', 'latin-1', 'cp1252', 'ascii']
    
    for encoding in encodings:
        try:
            content = file_path.read_text(encoding=encoding)
            print(f"Successfully read file: {file_path}")
            return sanitize_xml_content(content)
        except UnicodeDecodeError:
            continue
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return ""
    
    print(f"Failed to read file with any encoding: {file_path}")
    return ""

def safe_scan_directory(path: Path):
    """Safely scan directory and yield accessible files."""
    try:
        for item in path.rglob('*'):
            if item.is_file():
                if not should_ignore_file(item):
                    print(f"Found file: {item}")
                    yield item
    except Exception as e:
        print(f"Error scanning directory {path}: {e}")

def create_xml_for_project(project_path: str):
    """Create XML structure for all files in the project."""
    project_path = Path(project_path)
    root = ET.Element("documents")
    index = 1
    
    print(f"\nScanning directory: {project_path}")
    print("=" * 50)

    for path in safe_scan_directory(project_path):
        try:
            doc = ET.SubElement(root, "document")
            doc.set("index", str(index))
            
            source = ET.SubElement(doc, "source")
            relative_path = str(path.relative_to(project_path))
            source.text = relative_path
            
            content = ET.SubElement(doc, "document_content")
            file_content = read_file_content(path)
            if file_content:
                content.text = file_content
                index += 1
                print(f"Processed ({index}): {relative_path}")
            
        except Exception as e:
            print(f"Error processing {path}: {e}")

    if index > 1:
        xmlstr = minidom.parseString(ET.tostring(root, encoding='unicode')).toprettyxml(indent="  ")
        
        output_path = project_path / "project_knowledge.xml"
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(xmlstr)
        
        print("\nSummary:")
        print("=" * 50)
        print(f"XML file created at: {output_path}")
        print(f"Total files processed: {index - 1}")
    else:
        print("\nNo files were processed! Check the following:")
        print("1. Are there any files with supported extensions?")
        print("2. Are all files being ignored by the filters?")
        print("3. Is the project path correct?")
        print("\nSupported extensions:", 
              ', '.join(sorted(ALLOWED_EXTENSIONS)))

if __name__ == "__main__":
    project_path = input("Enter the path to your project root: ").strip()
    project_path = os.path.abspath(project_path)
    
    if not os.path.exists(project_path):
        print(f"Error: Path does not exist: {project_path}")
    else:
        create_xml_for_project(project_path)