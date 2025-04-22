from flask import Flask, render_template
from flask_frozen import Freezer
import os

app = Flask(__name__)
freezer = Freezer(app)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # For development
    if os.environ.get('FLASK_ENV') == 'development':
        app.run(debug=True)
    else:
        # For generating static files
        app.config['FREEZER_DESTINATION'] = 'build'
        app.config['FREEZER_RELATIVE_URLS'] = True
        freezer.freeze() 