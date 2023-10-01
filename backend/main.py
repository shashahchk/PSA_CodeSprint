from flask import Flask, request
from flask_cors import CORS, cross_origin
from model.optimization_model import run_model
from functions import *

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

@app.route('/api/assign_orders', methods=["GET", "POST"])
@cross_origin(options=None)
def assign_orders():
    if request.method == 'POST':
        data = request.get_json()
        ids = data['ids']

        # run model to find pairings(uncomment line below to run model)
        # model will take approx 5 min to run
        # result = json.loads(run_model())  

        # simulates model output generated from running model
        result = xlsx_to_json('../model/pairings/pairings.xlsx')
        result = filter_by_order_id(ids, result)
        return collate_ships_to_orders(result)
    return "POST method only please"

if __name__ == '__main__':
    app.run(debug=True)
