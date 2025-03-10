import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Actions } from '../types';
import { useWallet } from '../hooks';
import { useAppDispatch } from '../store/hooks';
import { ethToWei } from '../utils';

interface FormProps {
  'input-sender': string;
  'input-recipient': string;
  'input-amount': string;
}

// harun:comment - Regular expression to validate Ethereum address format
const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

// harun:comment - Custom validation function for amount
const validateAmount = (value: string) => parseFloat(value) > 0;

// harun:comment - Didnt want to go with Zod as it was not included in package.json
const SendTransaction: React.FC = () => {
  const dispatch = useAppDispatch();
  // harun:comment - ref for modal
  const modalRef = useRef<HTMLInputElement>(null);
  const { wallet } = useWallet();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormProps>({
    defaultValues: {
      'input-sender': wallet || '',
    },
  });

  const onSubmit = (data: FormProps) => {
    handleDispatch(data['input-recipient'], ethToWei(data['input-amount']));
  };

  const handleDispatch = (to: string, value: bigint) => {
    dispatch({
      type: Actions.SendTransaction,
      payload: {
        to,
        amount: value,
        callback: () => {
          // harun:comment - The thing here is to closeModal only after req was successful
          // I didnt want to include it in saga because then I am forcing user to use saga with that behavior
          // So I know this is not best practice but its best way I could think of in a moment
          // Would definitely like to hear your opinion on this and what is your pattern for handling similar things in your app
          closeModalHandler();
        },
      },
    });
  };

  const closeModalHandler = () => {
    // harun:comment - Typescript not yelling at us anymore as its type safe!
    if (modalRef.current) window.HSOverlay.close(modalRef.current);
  };

  return (
    <>
      <button
        data-hs-overlay="#hs-basic-modal"
        type="button"
        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
      >
        Send
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          id="hs-basic-modal"
          ref={modalRef}
          className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto bg-black bg-opacity-60"
        >
          <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-100 transition-all w-full m-3 mx-auto flex flex-col h-full items-center justify-center">
            <div className="bg-white border shadow-sm rounded-xl w-modal">
              <div className="flex justify-between items-center py-3 px-4 border-b">
                <h3 className="font-bold text-gray-800 text-xl">
                  Send Transaction
                </h3>
                <button
                  type="button"
                  className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm"
                  data-hs-overlay="#hs-basic-modal"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-3.5 h-3.5"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <p className="mt-1 mb-6 text-gray-800">
                  Send ETH to a wallet address
                </p>
                <label
                  htmlFor="input-sender"
                  className="block text-sm font-bold my-2"
                >
                  Sender:
                </label>
                <input
                  // harun:comment - input-sender validation and error message
                  {...register('input-sender', {
                    required: 'Sender address is required',
                    pattern: {
                      value: ethAddressRegex,
                      message: 'Invalid Ethereum address format',
                    },
                  })}
                  type="text"
                  id="input-sender"
                  className="opacity-70 pointer-events-none py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                  placeholder="Sender Address (Autocompleted)"
                  disabled
                />
                {errors['input-sender'] && (
                  <div className="text-red-400">
                    {errors['input-sender'].message}
                  </div>
                )}
                <label
                  htmlFor="input-recipient"
                  className="block text-sm font-bold my-2"
                >
                  Recipient:
                </label>
                <input
                  // harun:comment - input-recipient validation and error message
                  {...register('input-recipient', {
                    required: 'Recipient address is required',
                    pattern: {
                      value: ethAddressRegex,
                      message: 'Invalid Ethereum address format',
                    },
                  })}
                  type="text"
                  id="input-recipient"
                  className="py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                  placeholder="Recipient Address"
                />
                {errors['input-recipient'] && (
                  <div className="text-red-400">
                    {errors['input-recipient'].message}
                  </div>
                )}
                <label
                  htmlFor="input-amount"
                  className="block text-sm font-bold my-2"
                >
                  Amount:
                </label>
                <input
                  // harun:comment - input-amount validation and error message
                  {...register('input-amount', {
                    required: 'Amount is required',
                    validate: {
                      positive: (value) =>
                        validateAmount(value) ||
                        'Amount must be greater than 0',
                    },
                  })}
                  type="string"
                  id="input-amount"
                  className="py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                  placeholder="Amount"
                />
                {errors['input-amount'] && (
                  <div className="text-red-400">
                    {errors['input-amount'].message}
                  </div>
                )}
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                <button
                  type="button"
                  className="hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
                  data-hs-overlay="#hs-basic-modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SendTransaction;
