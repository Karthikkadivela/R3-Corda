// To retrieve the txn details during every transaction from the blockchain

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


// Read txnStoreABI.json file to get the txnStore contract abi to get/use the necessary functions in the contract
const erc20abi= fs.readFileSync(__dirname+'/txnStoreABI.json', 'utf8'); 
const contractaddress="0xfd5fbe1c62d567d30df89b4593ca397ef3fe4c53" 

// Function call to retrieve txn info stored in the blockchain 
const txn_retrieve = async (log_id)=>{
  // To get/use the txnStore contract functions needed for retriving info from blockchain
    const contractfunction = new ethers.Contract(contractaddress,erc20abi, provider);
    try {
        // Web3 retrieve function is used (retrieve function in the smart contract)
        var response=await contractfunction.retrieve(log_id);
        response = Buffer.from(response, 'base64').toString('utf-8')
        return (response);     
      } 
      catch (error) {
        return error;
      }
}

module.exports = {txn_retrieve}