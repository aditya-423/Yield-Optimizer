# **Yield Optimization Script**

## **Overview**
This project automates the process of optimizing yield across **three protocols**:  
1. **Aave**  
2. **Compound**  
3. **Fluid**  

The automation script retrieves data from the smart contracts of these protocols, processes the outputs, and computes the optimal yield strategy.  
  

---

## **Folder Structure**
```plaintext
.
├── final_copt.js          # Main automation script
├── collopt.mjs            # Retrieves data from Aave
├── collopt.js             # Retrieves data from Compound
├── fluid.js               # Retrieves data from Fluid
├── coll_opt.py            # Python script for yield optimization
├── aave_params.json       # Stores Aave protocol data
├── comp_params.json       # Stores Compound protocol data
├── fluid_params.json      # Stores Fluid protocol data
└── README.md              # Project documentation

