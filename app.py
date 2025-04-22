from flask import Flask, render_template, send_from_directory
from flask_frozen import Freezer
import os
import shutil

app = Flask(__name__)
freezer = Freezer(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

def build_static_files():
    # Create build directory if it doesn't exist
    if not os.path.exists('build'):
        os.makedirs('build')
    
    # Copy static files
    if os.path.exists('static'):
        shutil.copytree('static', 'build/static', dirs_exist_ok=True)
    
    # Copy and process templates
    with open('templates/index.html', 'r') as f:
        content = f.read()
    
    # Fix static file paths
    content = content.replace('href="static/', 'href="./static/')
    content = content.replace('src="static/', 'src="./static/')
    
    # Write the processed index.html to build directory
    with open('build/index.html', 'w') as f:
        f.write(content)
    
    # Create .nojekyll file
    with open('build/.nojekyll', 'w') as f:
        pass

if __name__ == '__main__':
    # For development
    if os.environ.get('FLASK_ENV') == 'development':
        app.run(debug=True)
    else:
        # For generating static files
        app.config['FREEZER_DESTINATION'] = 'build'
        app.config['FREEZER_RELATIVE_URLS'] = True
        freezer.freeze() 