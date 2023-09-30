import json
from collections import defaultdict
import pandas as pd

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

def find_ship_by_id(id: int, entries: dict):
    for entry in entries:
        if entry['Ship ID'] == id:
            return entry
    return None

def find_order_by_id(id: int, entries: dict):
    for entry in entries:
        if entry['Order ID'] == id:
            return entry
    return None

def collate_ships_to_orders(order_to_ship):
    # Group orders by ship ID
    ship_id_groups = defaultdict(list)

    for order in order_to_ship:
        ship_id = order["Ship ID"]
        order_id = order["Order ID"]
        ship_id_groups[ship_id].append(order_id)

    result = []
    orders_data = xlsx_to_json('../dataset/order_dataset.xlsx')
    ships_data = xlsx_to_json('../dataset/ship_dataset.xlsx')
    
    for ship_id, order_ids in ship_id_groups.items():
        ship = find_ship_by_id(ship_id, ships_data)
        orders = []
        for order_id in order_ids:
            order = find_order_by_id(order_id, orders_data)
            orders.append(order)
        ship['orders'] = orders
        result.append(ship)
    return result

o = [{"Order ID":2,"Ship ID":1},{"Order ID":162,"Ship ID":157}]
print(collate_ships_to_orders(o))