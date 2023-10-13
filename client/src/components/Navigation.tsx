import React, { useCallback, useState } from 'react';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

import SendTransaction from './SendTransaction';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWalletSuccess } from '../store/reducers/walletSlice';
import { navigate } from './NaiveRouter';

// harun:comment - `injected` enables the app to support browser-injected wallets like MetaMask.
const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  // harun:comment - `chains` lists the blockchain networks the app can connect to, with their IDs, tokens, labels, and RPC URLs.
  chains: [
    {
      id: '123456',
      token: 'ETH',
      label: 'Local Ganache',
      rpcUrl: 'http://localhost:8545',
    },
  ],
});
const Navigation: React.FC = () => {
  const dispatch = useAppDispatch();
  // harun:comment - wallet is now in redux instead of a local state as it will be needed later on
  const { wallet } = useAppSelector((state) => state.wallet);

  const handleConnect = useCallback(async () => {
    const wallets = await onboard.connectWallet();
    const [metamaskWallet] = wallets;

    if (
      metamaskWallet.label === 'MetaMask' &&
      metamaskWallet.accounts[0].address
    ) {
      dispatch(fetchWalletSuccess(metamaskWallet.accounts[0].address));
    }
  }, [dispatch]);

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-ful text-sm py-4 bg-gray-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <div
            className="flex-none text-xl font-semibold dark:text-white cursor-pointer"
            onClick={() => {
              // harun:comment - fix navigation
              navigate('/transactions');
            }}
          >
            Transactions List
          </div>
        </div>
        {/* harun:comment - fix connect button */}
        <div className="hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block pt-3 sm:pt-0">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
            {wallet && (
              <>
                <SendTransaction />
                <p className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 text-sm">
                  {wallet}
                </p>
              </>
            )}
            {!wallet && (
              <button
                type="button"
                onClick={handleConnect}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
