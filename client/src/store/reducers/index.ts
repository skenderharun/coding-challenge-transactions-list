import { combineReducers } from '@reduxjs/toolkit';
import walletSlice from './walletSlice';

// harun:comment - combine reducers
const rootReducer = combineReducers({
  wallet: walletSlice,
});

export default rootReducer;
