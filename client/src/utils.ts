import { ethers } from 'ethers';

// harun:comment - Created util functions for converting WEI to ETH
// and ETH to WEI using ethers.js library
const weiToEth = (wei: string) => ethers.formatEther(wei);
const ethToWei = (eth: string) => ethers.parseUnits(eth, 'ether');

export { weiToEth, ethToWei };
