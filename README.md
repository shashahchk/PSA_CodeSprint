# PSA_CodeSprint
## Getting Started
We are using a flask backend and a React frontend. Please note that you will need python and node installed in your system for this to run. You can either run the following commands or run the .sh/.bat file (see below). Also note that if you choose to run our Gurobi model, you will need a license is also required to run Gurobi. Refer to this [link](https://www.gurobi.com/academia/academic-program-and-licenses/) for free Gurobi licenses.

1. Install the required python dependencies (Run with py instead of python3 on Windows).
```bash 
cd backend
python3 -m pip install -r requirements.txt
```
2. Install the required node dependencies.
```bash
cd ../frontend
npm install
```

2. Run the frontend server. Do these in ./frontend.
```bash
npm start
```

3. Run the flask backend. Do these in ./backend. (Run py on Windows).
```bash
python3 main.py
```
## Executable files
You can also run the start.sh file on UNIX or start.bat file on Windows to perform the above steps automatically.


## Introduction
Welcome to PortFlow! A project that aims to consolidate shipments by automatically matchmaking shippers and shipping lines, taking into account the available containers, and combining orders with similar destinations and expected time of arrival – all in one click

### Features
1. Matching Algorithm using Gurobi Model
Utillizes various features such as order's expected time of arrival, both order and ship's port of harbour and origin, ship's capacity.

2. Full-Stack Web App for Order management and Ship tracking
Provides a user-friendly web-app for PSA to keep track of orders, ship schedules and capacity

### Technologies Used
- Gurobi Optimizer
- Python
- React (Front-end)
- Flask (Back-end)

## Optimization Model for Port Logistics Service Provider

### Decision Variables:

- $x_{i,j}$ - Binary decision variable. It's 1 if shipment $i$ is assigned to ship $j$, and 0 otherwise.
- $y_j$ - Continuous decision variable representing the % fullness of ship $j$.
- $t_i$ - Continuous decision variable indicating the time until delivery for shipment $i$.
- $z\_{i,j}$ - Binary decision variable. It's 1 if shipment $i$ and shipment $j$ are combined, and 0 otherwise.

### Parameters:

- $C_j$ - Capacity of ship $j$.
- $S_i$ - Size of shipment $i$.
- $P_i$ - Priority of shipment $i$ (express or normal).
- $I_i$ - Ship's arrival time to delivery for shipment $i$.
- $E_i$ - Order's expected time of arrival for shipment $i$.
- $W_P$ - Weight for priority (e.g., express shipments can have a higher weight).

### Objective Function:

Maximize the fullness of ships and minimize the ship's arrival time and order's expected time of arrival while considering different priorities:

$$
\max \sum_{j} y_j - W_P \sum_i P_i - \sum_i I_i + E_i
$$

### Constraints:

1. **Assignment Constraint**: Each shipment should be assigned to one ship:

   $\sum_{j} x_{i,j} = 1 \quad \forall i$

2. **Capacity Constraint**: Shipments assigned to a ship should not exceed its capacity:

   $\sum_{i} S_i x_{i,j} \leq C_j \quad \forall j$

3. **Fullness Definition**:

   $y_j = \frac{\sum_{i} S_i x_{i,j}}{C_j} \quad \forall j$

4. **Combination Constraint**: If two shipments are combined, they must be assigned to the same ship:

   $x_{i,j} - x_{k,j} \leq 1 - z_{i,k} \quad \forall i, k, j$

   $x_{k,j} - x_{i,j} \leq 1 - z_{i,k} \quad \forall i, k, j$

5. **Time Constraint**: Ship's arrival time < order's Expected time of arrival
   
7. **Origin and Destination Constraint**: Order's port of origin and destination must match with Ship's port of origin and destination
