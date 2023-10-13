import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface TransactionSliceInitialState {
  loading: boolean;
  error?: string | null;
}

// harun:comment - super simple transactionSlice for handling loading and error states
// There is definitely a lot of things to do if we want to enable caching for performance
// optimistic updates etc, but for the purpouses of this challange it's good enough
const initialState: TransactionSliceInitialState = {
  loading: false,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    fetchDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state) => {
      state.loading = false;
    },
    fetchDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } =
  transactionsSlice.actions;

export default transactionsSlice.reducer;
