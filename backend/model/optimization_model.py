import gurobipy as gp
from gurobipy import GRB
import pandas as pd

def run_model(order_ids):
    # Load the Excel files into DataFrames
    order_df = pd.read_excel("../dataset/order_dataset.xlsx")
    ship_df = pd.read_excel("../dataset/ship_dataset.xlsx")

    # Current time (assuming it's the time when the model is being run)
    current_time = pd.Timestamp.now()

    # Calculate ideal time to delivery for each order
    order_df['Ideal_Time'] = (order_df['Expected Time of Arrival'] - current_time).dt.total_seconds() / 3600  # in hours

    # Define the model
    m = gp.Model("port_logistics")

    # Number of orders and ships
    num_orders = len(order_df)
    num_ships = len(ship_df)

    # Decision Variables
    x = m.addVars(num_orders, num_ships, vtype=GRB.BINARY, name="x")  # x[i,j]
    y = m.addVars(num_ships, lb=0, ub=1, name="y")  # y[j]
    t = m.addVars(num_orders, lb=0, name="t")  # t[i]
    z = m.addVars(num_orders, num_orders, num_ships, vtype=GRB.BINARY, name="z")  # z[i,k,j]

    # Decision Variable for grouping orders with similar expected time of arrival and type
    g = m.addVars(num_orders, num_orders, num_ships, vtype=GRB.BINARY, name="g")  # g[i,k,j]

    # Objective Function
    m.setObjective(
        gp.quicksum(y[j] for j in range(num_ships)) - 
        gp.quicksum(
            order_df.loc[i, 'Weight of Order (tons)'] * 
            (2 if ship_df.loc[j, 'Priority'] == 'Express' else 1) * t[i] 
            for i in range(num_orders) for j in range(num_ships)
        ) -
        gp.quicksum(
            (ship_df.loc[j, 'Arrival Time'] - order_df.loc[i, 'Expected Time of Arrival']).total_seconds() / 3600  # Calculate time difference in hours
            for i in range(num_orders) for j in range(num_ships)
        ) +
        gp.quicksum(
            g[i, k, j] for i in range(num_orders) for k in range(num_orders) for j in range(num_ships)
        ),
        GRB.MAXIMIZE
    )

    # Constraints
    # 1. Assignment Constraint
    for i in range(num_orders):
        m.addConstr(gp.quicksum(x[i, j] for j in range(num_ships)) == 1)

    # 2. Capacity Constraint
    for j in range(num_ships):
        m.addConstr(gp.quicksum(order_df.loc[i, 'Weight of Order (tons)'] * x[i, j] for i in range(num_orders)) <= ship_df.loc[j, 'Vessel Capacity (tonnes)'])

    # 3. Port Destination and Origin Constraints
    for i in range(num_orders):
        for j in range(num_ships):
            if order_df.loc[i, 'Port of Origin'] != ship_df.loc[j, 'Port of Origin']:
                m.addConstr(x[i, j] == 0)
            if order_df.loc[i, 'Port of Destination'] != ship_df.loc[j, 'Port of Destination']:
                m.addConstr(x[i, j] == 0)

    # 4. Combination Constraint
    for i in range(num_orders):
        for k in range(num_orders):
            for j in range(num_ships):
                m.addConstr(x[i, j] - x[k, j] <= 1 - z[i, k, j])
                m.addConstr(x[k, j] - x[i, j] <= 1 - z[i, k, j])

    # 5. Constraint to ensure g[i,k,j] is 1 only if orders i and k are assigned to the same ship j
    for i in range(num_orders):
        for k in range(num_orders):
            for j in range(num_ships):
                m.addConstr(x[i, j] + x[k, j] - 1 <= g[i, k, j])

    # 6. Constraint for ensuring ship's Arrival Time is less than order's expected time of arrival
    for i in range(num_orders):
        for j in range(num_ships):
            m.addConstr(
                y[j] * (ship_df.loc[j, 'Arrival Time'] - order_df.loc[i, 'Expected Time of Arrival']).total_seconds() / 3600 <= 0
            )

    m.optimize()

    # Dictionary to store pairings
    pairings = {}

    # Iterate through the x decision variables
    for i in range(num_orders):
        for j in range(num_ships):
            if x[i, j].X > 0.5:  # If x[i,j] is approximately 1 (due to the binary nature)
                pairings[order_df.loc[i, 'Order ID']] = ship_df.loc[j, 'Ship ID']

    # Convert dictionary to Pandas DataFrame
    pairings_df = pd.DataFrame(list(pairings.items()), columns=['Order ID', 'Ship ID'])

    # Display the pairings DataFrame
    print("Pairings of Order ID and Ship ID:")
    print(pairings_df)

    # Save the pairings to an Excel file
    return pairings_df.to_json(orient='records')
