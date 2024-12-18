# Final Optimization Script which obtains params from the respective json files and performs the optimization algorithm to give the optimal result.

from scipy.optimize import minimize
import json

# Loading real-time parameters from JSON files
with open("aave_params.json", "r") as f:
    aave_params = json.load(f)

with open("comp_params.json", "r") as f:
    compound_params = json.load(f)

with open("fluid_params.json", "r") as f:
    fluid_params = json.load(f)

# Assign parameters
rf_a = aave_params["rf"] #reserve factor for Aave
R0a = aave_params["R0a"] #Base Variable Borrow Rate for Aave
R1a = aave_params["R1a"] #Variable Rate Slope 1 for Aave
R2a = aave_params["R2a"] #Variable Rate Slope 2 for Aave
a = aave_params["a"] #Total Amount of USDT Borrowed on Aave
b = aave_params["b"] #Total Amount of USDT Supplied on Aave

c = compound_params["c"] #Total Amount of USDT Borrowed on Compound
d = compound_params["d"] #Total Amount of USDT Supplied on Compound
R0c = compound_params["R0c"] #supply Per Second Interest Rate Base on Compound
R1c = compound_params["R1c"] #supply Per Second Interest Rate Low on Compound
R2c = compound_params["R2c"] #supply Per Second Interest Rate High on Compound

e = fluid_params["totBorrow"] #Total Amount of USDT Borrowed on Fluid
f = fluid_params["totSupply"] #Total Amount of USDT Supplied on Fluid
R0f = fluid_params["rateAtUtilizationZero"] #Borrow Rate at Utilization Zero on Fluid
R1f = fluid_params["rateAtUtilizationKink1"] #Borrow Rate at Utilization Kink 1 on Fluid
R2f = fluid_params["rateAtUtilizationKink2"] #Borrow Rate at Utilization Kink 2 on Fluid
R3f = fluid_params["rateAtUtilizationMax"] #Borrow Rate at Max Utilization on Fluid
rf_f = fluid_params["rf"] #Reserve Factor for Fluid
k1 = fluid_params["k1"] #Kink 1 for Fluid
k2 = fluid_params["k2"] #Kink 2 for Fluid


T = 100000 #Total Amount of USDT to be deposited across all protocols

#Supply APR on Aave as a function of x = the amount of USDT to be deposited on Aave
def SA(x):
    if((a/(b+x))<0.9):
        return ((a / (b + x)) * (R0a + (a / (b + x)) * (10 * R1a / 9)))*(1 - rf_a)
    else:
        return ((a / (b + x)) * (R0a + R1a + (10*((a / (b + x)) - 0.9)) * R2a))*(1 - rf_a)

#Supply APR on Compound as a function of x = Total Amount of USDT deposited across other protocols
def SC(x):
    if((c / (d + T - x)) < 0.85):
        return (R0c + ((c / (d + T - x)) * R1c))
    else:
        return (R0c + (R1c*0.85) + (R2c*((c / (d + T - x))-0.85)))
    
#Supply APR on Fluid as a function of x = the amount of USDT to be deposited on Fluid
def SF(x):
    U = e / (f + x)
    if(U <= 0.85):
        return (U ** 2) * ((R1f - R0f) / k1) * (1 - rf_f)
    elif(U > 0.85 and U <= 0.93):
        return R1f + (((R2f - R1f)/(k2 - k1)) * (U - k1) * U) * (1 - rf_f)
    else:
        return R2f + (((R3f - R2f) / (1 - k2)) * (U - k2) * U) * (1 - rf_f)

# Define the profit function
def profit(xy):
    x, y = xy  # Split input variables
    return (x * SA(x)) + (y * SF(y)) + ((T - x - y) * SC(x + y)) #profit function as a function of x (USDT deposit on Aave) and y (USDT deposit on Fluid)

# Define the negative profit (to maximize profit using minimization)
def neg_profit(xy):
    return -profit(xy)

# Constraints: x + y <= T
constraints = [
    {'type': 'ineq', 'fun': lambda xy: T - xy[0] - xy[1]}  # x + y <= T
]

# Set bounds for x and y
bounds = [(0, T), (0, T)]  # Both x and y must be between 0 and T

# Initial guess for x and y
x0 = [T / 3, T / 3]  # Initial guess evenly splitting T into x and y

# Perform the optimization using Trusted-Constraints Method
result = minimize(
    neg_profit,          # Objective function
    x0,                  # Initial guess
    method='trust-constr',
    bounds=bounds,       # Bounds for variables
    constraints=constraints,  # Constraints
    options={'verbose': 1}    # Verbosity for detailed output (optional)
)

# Extract optimal x, y, and maximum profit
optimal_x = result.x[0]
optimal_y = result.x[1]
max_profit = -result.fun

results = {
    "Initial Supply APR on Aave": SA(0),
    "Initial Supply APR on Compound": SC(T),
    "Initial Supply APR on Fluid": SF(0),
    "Deposit on Aave": optimal_x,
    "Deposit on Fluid": optimal_y,
    "Deposit on Compound": T - optimal_x - optimal_y,
    "Maximum Profit": max_profit,
    "Final Supply APR on Aave": SA(optimal_x),
    "Final Supply APR on Fluid": SF(optimal_y),
    "Final Supply APR on Compound": SC(optimal_x + optimal_y),
}

print(json.dumps(results, indent=2)) #using JSON output for Automation Workflow

"""
The following script was utilized to check if the Trusted Constraints Method was working fine.

x = np.linspace(0, T, 100)
y = np.linspace(0, T, 100)
X, Y = np.meshgrid(x, y)

# Calculate Z (profit values) for the grid
Z = np.zeros_like(X)

max=0
x_max=0
y_max=0

for i in range(X.shape[0]):
    for j in range(X.shape[1]):
        if X[i, j] + Y[i, j] <= T:  # Ensure x + y <= T
            Z[i, j] = profit([X[i, j], Y[i, j]])
            if Z[i,j]>max:
                max=Z[i,j]
                x_max=X[i,j]
                y_max=Y[i,j]
        else:
            Z[i, j] = np.nan  # Exclude invalid points where x + y > T

print(max, x_max, y_max)"""
