import { combineReducers } from '@reduxjs/toolkit';
import walletSlice from './walletSlice';
import transactionsSlice from './transactionsSlice';

// harun:comment - combine reducers
const rootReducer = combineReducers({
  transactions: transactionsSlice,
  wallet: walletSlice,
});

export default rootReducer;
