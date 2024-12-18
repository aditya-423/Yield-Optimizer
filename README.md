1. Used to Optimize your Yield between 3 protocols: Aave, Compound and Fluid.

2. Automation Script is included in the final_copt.js file.

3. Running the automation script obtains values from the smart contracts of Aave (using collopt.mjs), Compound (using collopt.js) and Fluid (using fluid.js).

4. The script then loads the outputs from the above executions into the respective params file (aave_params.json, comp_params.json and fluid_params.json)

5. Then, the python script (coll_opt.py) is executed to give the optimized result.
