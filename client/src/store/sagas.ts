import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  BrowserProvider,
  Signer,
  AddressLike,
} from 'ethers';

import apolloClient from '../apollo/client';
import { Actions } from '../types';
import { GetAllTransactions, SaveTransaction } from '../queries';
import {
  fetchDataFailure,
  fetchDataStart,
  fetchDataSuccess,
} from './reducers/transactionsSlice';
import { navigate } from '../components/NaiveRouter';
import client from '../apollo/client';

interface SendTransactionProps {
  type: Actions.SendTransaction;
  // harun:comment - callback is optional as we dont want to force user of saga to pass noop function
  payload: { to: AddressLike; amount: bigint; callback?: () => void };
}

function* sendTransaction(action: SendTransactionProps) {
  const { to, amount, callback } = action.payload;

  // harun:comment - start fetching
  yield put(fetchDataStart());

  // this could have been passed along in a more elegant fashion,
  // but for the purpouses of this scenario it's good enough
  // @ts-ignore
  const walletProvider = new BrowserProvider(window.web3.currentProvider);

  const signer: Signer = yield walletProvider.getSigner();

  const transaction = {
    to,
    value: amount.toString(),
  };

  try {
    const txResponse: TransactionResponse = yield signer.sendTransaction(
      transaction
    );

    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || '0',
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || '0',
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || '',
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || '123456',
        hash: receipt.hash,
      },
    };

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });

    yield put(fetchDataSuccess());

    yield call(refetchQueries); // harun:comment - refactored refetching queries into its own saga function

    if (variables.transaction.hash)
      yield call(handleNavigation, variables.transaction.hash);

    if (callback) yield fork(callback); // harun:comment - using fork to non-blockingly call the callback
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchDataFailure(error.message));
    } else {
      yield put(fetchDataFailure(String(error)));
    }
  }
}

function* refetchQueries() {
  yield call([client, client.refetchQueries], {
    include: [GetAllTransactions],
  });
}

function* handleNavigation(hash: string) {
  yield call(navigate, `transaction/${hash}`);
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
