// Script to obtain values from Aave's aUSDT Smart Contract

import { ethers } from 'ethers';
import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
} from '@aave/contract-helpers';
import * as markets from '@bgd-labs/aave-address-book';
import { formatReservesAndIncentives } from '@aave/math-utils';
import dayjs from 'dayjs';

const RAY_DECIMALS = 1e27; // Ray Decimals for Aave
const USDT_DECIMALS = 1e6; // USDT has 6 decimals

const provider = new ethers.providers.JsonRpcProvider(
  'https://arb1.arbitrum.io/rpc',
);

// Contracts to fetch reserves and incentives
const poolDataProviderContract = new UiPoolDataProvider({
  uiPoolDataProviderAddress: markets.AaveV3Arbitrum.UI_POOL_DATA_PROVIDER,
  provider,
  chainId: ChainId.mainnet,
});

const incentiveDataProviderContract = new UiIncentiveDataProvider({
  uiIncentiveDataProviderAddress:
    markets.AaveV3Arbitrum.UI_INCENTIVE_DATA_PROVIDER,
  provider,
  chainId: ChainId.mainnet,
});

// Fetch reserves and incentives data
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

// Current timestamp
const currentTimestamp = dayjs().unix();

// Format reserves
const formattedPoolReserves = formatReservesAndIncentives({
  reserves: reservesArray,
  currentTimestamp,
  marketReferenceCurrencyDecimals:
    baseCurrencyData.marketReferenceCurrencyDecimals,
  marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
  reserveIncentives,
});

// Find USDT reserve
const usdtReserve = reservesArray.find((reserve) => reserve.symbol === 'USDT');

// Aave Parameters and Scaling to Ray Decimals and USDT Decimals
const rf = usdtReserve.reserveFactor / 10000; // Reserve Factor (percentage form)
const R0a = usdtReserve.baseVariableBorrowRate / RAY_DECIMALS; // Base Variable Borrow Rate
const R1a = usdtReserve.variableRateSlope1 / RAY_DECIMALS; // Variable Rate Slope 1
const R2a = usdtReserve.variableRateSlope2 / RAY_DECIMALS; // Variable Rate Slope 2

// Total Borrowed and Total Supplied Amounts
const scaledDebt = usdtReserve.totalScaledVariableDebt; // Scaled total variable debt
const bIndex = usdtReserve.variableBorrowIndex; // Borrow index for scaling
const availableLiquidity = usdtReserve.availableLiquidity; // Total available liquidity

// Apply scaling
const a = (scaledDebt * bIndex) / (RAY_DECIMALS * USDT_DECIMALS); // Total borrowed USDT
const b = a + availableLiquidity / USDT_DECIMALS; // Total supplied USDT

// Print results
console.log(JSON.stringify({ rf, R0a, R1a, R2a, a, b }));
