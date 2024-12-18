//Script to obtain values from Compound's cUSDT Smart Contract

const { ethers } = require("ethers");

// Define constants for calculations
const SECONDS_IN_YEAR = 365 * 24 * 60 * 60; // Total seconds in a year
const USDT_DECIMALS = 6; // USDT has 6 decimal places, used for scaling values
const DAI_DECIMALS = 18; // DAI has 18 decimal places, can be reused if needed

// Initialize provider to connect to the Arbitrum network
const provider = new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");

// Load ABI for the USDT lending pool contract (Compound-like interface)
const pool_abi = require("./usdt_comp.json");

// Contract address for the USDT pool on Compound (replaceable for other collateral)
const addr = "0xd98Be00b5D27fc98112BdE293e487f8D4cA57d07";

// Instantiate the USDT pool contract
const usdtContract = new ethers.Contract(addr, pool_abi, provider);

(async () => {
    // Fetch data from the contract and scale it for readability

    // Total Amount of USDT Borrowed on Compound (scaled down by USDT decimals)
    const c = parseInt(await usdtContract.totalBorrow()) / Math.pow(10, USDT_DECIMALS);

    // Total Amount of USDT Supplied on Compound (scaled down by USDT decimals)
    const d = parseInt(await usdtContract.totalSupply()) / Math.pow(10, USDT_DECIMALS);

    // Supply Per Second Interest Rate Base on Compound (raw value, no scaling required)
    const R0c = parseInt(await usdtContract.supplyPerSecondInterestRateBase());

    // Supply Per Second Interest Rate Slope Low (scaled to annual percentage)
    const R1c = (parseInt(await usdtContract.supplyPerSecondInterestRateSlopeLow()) 
                 * SECONDS_IN_YEAR) / Math.pow(10, DAI_DECIMALS);

    // Supply Per Second Interest Rate Slope High (scaled to annual percentage)
    const R2c = (parseInt(await usdtContract.supplyPerSecondInterestRateSlopeHigh()) 
                 * SECONDS_IN_YEAR) / Math.pow(10, DAI_DECIMALS);
    console.log(JSON.stringify({R0c, R1c, R2c, c, d}));

})();
