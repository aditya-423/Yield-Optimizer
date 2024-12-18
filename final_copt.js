// Final Automation Script which needs to be run to start the automation workflow. 

const { exec } = require("child_process");
const fs = require("fs");

// Step 1: Run collopt.mjs and save to aave_params.json
exec("node collopt.mjs", (err, stdout) => {
  if (err) throw err;
  fs.writeFileSync("aave_params.json", stdout);

  // Step 2: Run collopt.js and save to comp_params.json
  exec("node collopt.js", (err, stdout) => {
    if (err) throw err;
    fs.writeFileSync("comp_params.json", stdout);

    // Step 3: Run fluid.js and save to fluid_params.json
    exec("node fluid.js", (err, stdout) => {
      if (err) throw err;
      fs.writeFileSync("fluid_params.json", stdout);

      // Step 4: Run the Python script collateral_optimization.py
      exec("python coll_opt.py", (err, stdout) => {
        if (err) throw err;

        // Parse JSON output from the Python script
        try {
          const optimizationResults = JSON.parse(stdout);
          console.log("Optimization Results:", optimizationResults);
        } catch (parseError) {
          console.error("Failed to parse Python script output:", parseError);
          console.error("Raw output:", stdout);
        }
      });
    });
  });
});
