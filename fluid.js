const { ethers } = require("ethers");

// Step 1: Define the provider and contract
const provider = new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");

// Step 2: Import ABI and set the contract address
const pool_abi = require('./fusdt_abi.json'); // ABI of the contract
const contractAddress = "0x46859d33E662d4bF18eEED88f74C36256E606e44"; // Contract address
const tokenAddress = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"; // Replace with the token address you want to query (fUSDT)

const contract = new ethers.Contract(contractAddress, pool_abi, provider);

// Step 3: Write the async function to call getOverallTokenData
(async () => {

    // Call getOverallTokenData function
    const data = await contract.getOverallTokenData(tokenAddress);

    // Destructure the returned values
    const {
      borrowRate,
      supplyRate,
      fee,
      lastStoredUtilization,
      totalSupply,
      totalBorrow,
      rateData
    } = data;

    const totSupply = parseFloat(ethers.utils.formatUnits(totalSupply, 6));
    const totBorrow = parseFloat(ethers.utils.formatUnits(totalBorrow, 6));
    const rateDataV2 = rateData.rateDataV2;
    const k1 = ethers.utils.formatUnits(rateDataV2.kink1, 2)/100;
    const k2 = ethers.utils.formatUnits(rateDataV2.kink2, 2)/100;
    const rateAtUtilizationZero = ethers.utils.formatUnits(rateDataV2.rateAtUtilizationZero, 2)/100;
    const rateAtUtilizationKink1 = ethers.utils.formatUnits(rateDataV2.rateAtUtilizationKink1, 2)/100;
    const rateAtUtilizationKink2 = ethers.utils.formatUnits(rateDataV2.rateAtUtilizationKink2, 2)/100;
    const rateAtUtilizationMax = ethers.utils.formatUnits(rateDataV2.rateAtUtilizationMax, 2)/100;
    const rf = 0.1;
    console.log(JSON.stringify({ k1, k2, rf, totSupply, totBorrow, rateAtUtilizationZero, rateAtUtilizationKink1, rateAtUtilizationKink2, rateAtUtilizationMax }));
    
})();
