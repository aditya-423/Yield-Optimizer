const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");

const pool_abi = require('./usdt_comp.json');

const addr = "0xd98Be00b5D27fc98112BdE293e487f8D4cA57d07";

const usdtContract = new ethers.Contract(addr, pool_abi, provider);

(async () =>{

    const c = parseInt(await usdtContract.totalBorrow())/1e6;
    const d = parseInt(await usdtContract.totalSupply())/1e6;
    const R0c = parseInt(await usdtContract.supplyPerSecondInterestRateBase());
    const R1c = parseInt(await usdtContract.supplyPerSecondInterestRateSlopeLow())*365*24*60*60/1e18;
    const R2c = parseInt(await usdtContract.supplyPerSecondInterestRateSlopeHigh())*365*24*60*60/1e18;
    
    // Format the raw value for readability
    /*console.log(c);
    console.log(d);
    console.log(R0c);
    console.log(R1c);
    console.log(R2c);*/
    console.log(JSON.stringify({R0c, R1c, R2c, c, d}));

})();
