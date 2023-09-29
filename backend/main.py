import json
import pandas as pd
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'

@app.route('/')
def index():
    orders = xlsx_to_json('../dataset/Order Dataset.xlsx')
    records = xlsx_to_json('../dataset/Ship Dataset.xlsx')
    result = {
        'orders': orders,
        'records': records
    }
    return result

@app.route('/analyse', methods=['GET', 'POST'])
@cross_origin(options=None)
def analyse():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    return "Post method only please!"

def xlsx_to_json(excel_path):
    df = pd.read_excel(excel_path)
    result = df.to_json(orient='records')
    return json.loads(result)

if __name__ == '__main__':
    app.run(debug=True)
