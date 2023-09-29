import json
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/analyse', methods=['GET', 'POST'])
@cross_origin(options=None)
def analyse():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    return "Post method only please!"


if __name__ == '__main__':
    app.run(debug=True)
