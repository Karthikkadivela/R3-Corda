// To store the txn details during every transaction into the blockchain

// Required imports
require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs')
const mnemonic = process.env.seed_phrase; // wallet seed phrase
const providerOrUrl = process.env.alchemy_url /* RINKEBY ENDPOINT */
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Get trustee wallet info
const wallet = new HDWalletProvider({mnemonic:mnemonic, providerOrUrl:providerOrUrl,pollingInterval:3600000});
const provider = new ethers.providers.Web3Provider(wallet);


//Read txnStoreABI.json file to get the txnStore contract abi to get/use the necessary functions in the contract 
const erc20abi= fs.readFileSync(__dirname+'/txnStoreABI.json', 'utf8'); 
const contractaddress="0x49D26BA76DF6F9DC184843602359C0026e894A9A" 

// Function call to retrieve txn info stored in the blockchain 
const txn_store = async (txn,log_id)=>{
  // To get/use the txnStore contract functions needed for storing info into blockchain
    const signer = await provider.getSigner();
    const contractfunction = new ethers.Contract(contractaddress,erc20abi, signer);

    // Convert txn json obj received to base64 encoding to store it into the block (For convinience and security sake)
    txn = Buffer.from(JSON.stringify(txn)).toString('base64')

    try {
      // Web3 store function is used (store function in the smart contract)
        const response=await contractfunction.store(txn,log_id);
        return (response.hash);     
      } 
      catch (error) {
        return error;
      }
      
}

module.exports = {txn_store}
