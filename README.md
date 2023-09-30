# PSA_CodeSprint

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
- $I_i$ - Ideal time to delivery for shipment $i$.
- $W_P$ - Weight for priority (e.g., express shipments can have a higher weight).

### Objective Function:

Maximize the fullness of ships and minimize the ship'sarrival time and order's expected time of arrival while considering different priorities:

$$
\max \sum_{j} y_j - W_P \sum_i P_i t_i
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

5. **Time Constraint**: Time until delivery for each shipment:

   $t_i \geq I_i - \sum_{j} (x_{i,j} \times T_{j}) \quad \forall i$
