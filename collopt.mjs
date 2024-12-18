import { ethers } from 'ethers';
import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
} from '@aave/contract-helpers';
import * as markets from '@bgd-labs/aave-address-book';
import { formatReservesAndIncentives } from '@aave/math-utils';
import dayjs from 'dayjs';


const provider = new ethers.providers.JsonRpcProvider(
    'https://arb1.arbitrum.io/rpc',
  );


// View contract used to fetch all reserves data (including market base currency data), and user reserves
// Using Aave V3 Eth Mainnet address for demo
const poolDataProviderContract = new UiPoolDataProvider({
  uiPoolDataProviderAddress: markets.AaveV3Arbitrum.UI_POOL_DATA_PROVIDER,
  provider,
  chainId: ChainId.mainnet,
});

// View contract used to fetch all reserve incentives (APRs), and user incentives
// Using Aave V3 Eth Mainnet address for demo
const incentiveDataProviderContract = new UiIncentiveDataProvider({
  uiIncentiveDataProviderAddress:
    markets.AaveV3Arbitrum.UI_INCENTIVE_DATA_PROVIDER,
  provider,
  chainId: ChainId.mainnet,
});

const reserves = await poolDataProviderContract.getReservesHumanized({
  lendingPoolAddressProvider: markets.AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
});

const reserveIncentives =
    await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
      lendingPoolAddressProvider:
        markets.AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
    });

const reservesArray = reserves.reservesData;
const baseCurrencyData = reserves.baseCurrencyData;

const currentTimestamp = dayjs().unix();

const formattedPoolReserves = formatReservesAndIncentives({
  reserves: reservesArray,
  currentTimestamp,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
  reserveIncentives,
});


const usdtReserve = reservesArray.find(
  (reserve) => reserve.symbol === 'USDT'
);

//console.log(usdtReserve);
const rf = usdtReserve.reserveFactor/10000;
const R1a = usdtReserve.variableRateSlope1/1e27;
const R2a = usdtReserve.variableRateSlope2/1e27;
const R0a = usdtReserve.baseVariableBorrowRate/1e27;
const scaledDebt = usdtReserve.totalScaledVariableDebt;
const bIndex = usdtReserve.variableBorrowIndex;
const avlLiq = usdtReserve.availableLiquidity;
const a = scaledDebt*bIndex/1e33;
const b = a+(avlLiq/1e6);
/*console.log(rf);
console.log(R0a);
console.log(R1a);
console.log(R2a);
console.log(a);
console.log(b);*/
console.log(JSON.stringify({ rf, R0a, R1a, R2a, a, b }));

