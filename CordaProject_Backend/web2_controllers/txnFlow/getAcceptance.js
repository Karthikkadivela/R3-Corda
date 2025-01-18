// Investor - Company cycle -> Step 3: Company decides whether the direct buy share from the company request is accepted or rejected 
// Investor - Investor cycle -> Step 3: Company decides whether the sell share request is accepted or rejected 
// Investor - Investor cycle -> Step 6: Company decides whether the buy share from other investor request is accepted or rejected 

// Necessary imports
const {txn_store} = require('../../web3_controllers/txn_store');
const { txn_retrieve } = require('../../web3_controllers/txn_retrieve');
const { getLogIdCount } = require('../txnLog_data')
const {Db_Service} = require('../../config/db_service')

const getAcceptance = async (req,res)=>{
    // comp_status has status of the request
    const {transaction_id,comp_status,req_usdt} = req.query;

    // Current date
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()

    try{
        // Change the status in the transaction table after company accepts or rejects the request
        const res = await db.getAcceptance(updatedDate,transaction_id,comp_status,req_usdt);
    }catch(err){
        res.json({err});
    }

    // Get the current transaction details
    const result = await db.getIndvTxn(transaction_id);
    const {company_id,no_of_shares,investor_id,trustee_id,status,created_at,updated_at} = result[0]

// This txn object (containing txn details) is logged onto the blockchain 
    const txn = {
        company_id,
        no_of_shares,
        investor_id,
        trustee_id,
        status,
        created_at,
        updated_at
    }

    //Get Current txn log id from the transaction log table
    const LogId = await getLogIdCount();


    // Txn object is pushed onto the blockchain
    const hash= await txn_store(txn,LogId);


   // const response = await txn_retrieve(30);

    // After logging the txn into the blockchain
    try{
        // Log the txn into the database - transaction_log table
        const result = await db.LogTxn(hash,transaction_id);
        res.json({result})
    }catch(err){
        res.json({err})
    }

}

module.exports = {getAcceptance}