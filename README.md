# PSA_CodeSprint
## Getting Started
1. Install the required python dependencies
```bash 
python -m pip install -r requirements.txt
```

**Gurobi**

Installation of Gurobi is required to run our optimization models, you can use pip to install Gurobi into your currently active Python environment
```bash
python -m pip install gurobipy
```
A license is also required to run Gurobi. Refer to this [link](https://www.gurobi.com/academia/academic-program-and-licenses/) for free Gurobi licenses.


2. Install the node packages to run the react frontend.
```bash
npm install
```

3. Run the flask backend.
```bash
cd backend
py main.py
```
4. Run the react frontend in /ad-input
```bash
cd frontend
npm start
```
## Introduction
Welcome to PortFlow! A project that aims to consolidate shipments by automatically matchmaking shippers and shipping lines, taking into account the available containers, and combining orders with similar destinations and expected time of arrival – all in one click

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


