import json
import pandas as pd
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'

@app.route('/api/orders')
def orders():
    orders = xlsx_to_json('../dataset/order_dataset.xlsx')
    return seperate_incoming_outgoing(orders)

@app.route('/api/ships')
def ships():
    ships = xlsx_to_json('../dataset/ship_dataset.xlsx')
    return seperate_incoming_outgoing(ships)

@app.route('/api/assign_orders', methods=['GET', 'POST'])
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

def seperate_incoming_outgoing(entries):
    INTERMEDIATE_PORT = 'Singapore'
    incoming = []
    outgoing = []

    for entry in entries:
        if entry['Port of Destination'] == INTERMEDIATE_PORT:
            incoming.append(entry)
            continue
        if entry['Port of Origin'] == INTERMEDIATE_PORT:
            outgoing.append(entry)
            continue
        print(f'{INTERMEDIATE_PORT} not a destination or origin')

    result = {
        'incoming': incoming,
        'outgoing': outgoing
    }

    return result


if __name__ == '__main__':
    app.run(debug=True)
