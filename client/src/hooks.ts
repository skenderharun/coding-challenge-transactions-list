import { useAppSelector } from './store/hooks';

// harun:comment - useWallet hook for fetching logged in user address
export const useWallet = () => useAppSelector((state) => state.wallet);
