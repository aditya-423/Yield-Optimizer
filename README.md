## **Yield Optimization Script**

### **Overview**
This project automates the process of optimizing yield across **three protocols**:  
1. **Aave**  
2. **Compound**  
3. **Fluid**  

The automation script retrieves data from the smart contracts of these protocols, processes the outputs, and computes the optimal yield strategy.  



### **Run the Automation Script**
Execute the main automation script:

node final_copt.js

#### **Flow:**

**Step 1:** The script executes collopt.mjs to fetch data from Aave.

The output includes:
1. Total Borrowed USDT on Aave
2. Total Supplied USDT on Aave
3. Base variable borrow rate
4. Variable rate slope 1
5. Variable rate slope 2
6. Reserve factor
The data is saved into the file: aave_params.json.

**Step 2:** The script executes collopt.js to fetch data from Compound.

The output includes:
1. Total Borrowed USDT on Compound
2. Total Supplied USDT on Compound
3. Supply per second interest rate base
4. Supply per second interest rate slope low
5. Supply per second interest rate slope high
The data is saved into the file: comp_params.json.

**Step 3:** The script executes fluid.js to fetch data from Fluid.

The output includes:
1. Total Borrowed USDT on Fluid
2. Total Supplied USDT on Fluid
3. Kink 1 in Interest Rate Model (IRM)
4. Kink 2 in IRM
5. Rate at Utilization Zero
6. Rate at Utilization Kink 1
7. Rate at Utilization Kink 2
8. Rate at Utilization Max
9. Reserve factor
The data is saved into the file: fluid_params.json.

**Step 4:** The script executes coll_opt.py which performs the optimization and prints results.
The Python script:

**Reads data from the JSON files:**
- aave_params.json
- comp_params.json
- fluid_params.json
Performs optimization calculations.

**Outputs:**
The script prints the following results:

- **Initial APR Values:**
  - Initial Supply APR on Aave
  - Initial Supply APR on Compound
  - Initial Supply APR on Fluid

- **Optimal Deposits:**
  - Deposit on Aave
  - Deposit on Fluid
  - Deposit on Compound

- **Optimization Results:**
  - Maximum Profit
  - Final APR Values:
  - Final Supply APR on Aave
  - Final Supply APR on Fluid
  - Final Supply APR on Compound
