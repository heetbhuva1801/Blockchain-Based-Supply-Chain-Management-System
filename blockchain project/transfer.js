const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545'); // This should match Ganache's RPC server URL

const sender = '0x9ae54A6043A566dcE912207ffbaA18B0997e49dC'; // Replace with a funded account address from Ganache
const receiver = '0x5Ad0C4792df96D167D9340C9D01Dc2Fe0ec92876'; // Replace with the account to receive ETH
const amountInEther = '10'; // Amount of ETH to send

async function sendFunds() {
  const amountInWei = web3.utils.toWei(amountInEther, 'ether');
  await web3.eth.sendTransaction({
    from: sender,
    to: receiver,
    value: amountInWei,
    gas: 21000
  });
  console.log('Transfer successful');
}

sendFunds().catch(console.error);
