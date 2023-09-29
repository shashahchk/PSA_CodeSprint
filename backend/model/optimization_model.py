from gurobipy import Model, GRB

def port_optimize():

    # Create a new model
    m = Model("port_logistics")

    # Define constants (example values; modify as needed)
    num_shipments = 10  # replace with actual number of shipments
    num_ships = 5  # replace with actual number of ships

    # Decision Variables
    x = m.addVars(num_shipments, num_ships, vtype=GRB.BINARY, name="x")
    y = m.addVars(num_ships, vtype=GRB.CONTINUOUS, name="y")
    t = m.addVars(num_shipments, vtype=GRB.CONTINUOUS, name="t")
    z = m.addVars(num_shipments, num_shipments, vtype=GRB.BINARY, name="z")

    # Parameters (sample values; replace with actual data)
    C = [100, 200, 150, 250, 175]  # Capacities for each ship
    S = [10, 15, 20, 25, 30, 15, 40, 10, 35, 15]  # Sizes for each shipment
    P = [1, 2, 1, 2, 1, 1, 2, 2, 1, 2]  # Priority values (e.g., 1 for normal, 2 for express)
    I = [3, 4, 3, 4, 3, 5, 2, 4, 3, 4]  # Ideal delivery times for each shipment
    W_P = 1.5  # Weight for priority 

    # Objective
    m.setObjective(sum(y[j] for j in range(num_ships)) - W_P * sum(P[i] * t[i] for i in range(num_shipments)), GRB.MAXIMIZE)

    # Constraints

    # Assignment Constraint
    for i in range(num_shipments):
        m.addConstr(sum(x[i, j] for j in range(num_ships)) == 1)

    # Capacity Constraint
    for j in range(num_ships):
        m.addConstr(sum(S[i] * x[i, j] for i in range(num_shipments)) <= C[j])

    # Fullness Definition
    for j in range(num_ships):
        m.addConstr(y[j] == sum(S[i] * x[i, j] for i in range(num_shipments)) / C[j])

    # Combination Constraint
    for i in range(num_shipments):
        for k in range(num_shipments):
            for j in range(num_ships):
                if i != k:
                    m.addGenConstrIndicator(z[i, k], 1, x[i, j] == x[k, j])

    # Time Constraint (assuming a constant time for ship j as an example)
    T = [2, 3, 2.5, 3, 2]  # Example ship delivery times
    for i in range(num_shipments):
        m.addConstr(t[i] >= I[i] - sum(x[i, j] * T[j] for j in range(num_ships)))

    # Optimize the model
    m.optimize()

    # Print results
    if m.status == GRB.OPTIMAL:
        print(f'Optimal objective: {m.objVal}')
        for i in range(num_shipments):
            for j in range(num_ships):
                if x[i, j].x > 0.5:  # if the value is closer to 1, it indicates that shipment i is assigned to ship j
                    print(f'Shipment {i} is assigned to ship {j}')
    else:
        print('No solution')

if __name__ == "__main__":
    port_optimize()
