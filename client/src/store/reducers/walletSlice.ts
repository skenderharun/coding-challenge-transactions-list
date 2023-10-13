import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { wallet?: string } = {};

// harun:comment - walletSlice super simple implementation

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    fetchWalletSuccess: (state, action: PayloadAction<string>) => {
      state.wallet = action.payload;
    },
  },
});

export const { fetchWalletSuccess } = walletSlice.actions;

export default walletSlice.reducer;

// harun:comment - ducks pattern FTW
