// Investor - Company cycle -> Step 2: Trustee forwards the buy share request by the investor to the company
// Investor - Investor cycle -> Step 2: Trustee forwards the sell share request by the investor(seller) to the company
// Investor - Investor cycle -> Step 5: Trustee forwards the buy share request(shares sold by the other investors and not from the company) by the investor to the company

// Necessary imports
const {txn_store} = require('../../web3_controllers/txn_store');
const { txn_retrieve } = require('../../web3_controllers/txn_retrieve');
const { getLogIdCount } = require('../txnLog_data')
const {Db_Service} = require('../../config/db_service')

const sendConfirmation = async (req,res)=>{
    const {transaction_id,flag} = req.query;
    
    // flag =0 -> Investor - Company cycle -> Step 2
    // flag =1 -> Investor - Investor cycle -> Step 2
    // flag =2 -> Investor - Investor cycle -> Step 5

    // Current date
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()

    // Status variable to change the status based on the flag value
    let flag_status="Processing"
    if(flag==1){
        flag_status="Investor_Processing";
    }
    else if(flag==2){
        flag_status="Buyer_Processing";
    }
    try{
        // Change the status in the transaction table after trustee forwards the requests
        const res = await db.sendConfirmation(flag_status,updatedDate,transaction_id);
    }catch(err){
        res.json({err});
    }

    // Get the current transaction details
    const result = await db.getIndvTxn(transaction_id);
    const {company_id,no_of_shares,investor_id,trustee_id,status,request_usdt,created_at,updated_at} = result[0]

    // This txn object (containing txn details) is logged onto the blockchain 
    const txn = {
        company_id,
        no_of_shares,
        investor_id,
        trustee_id,
        status,
        request_usdt,
        created_at,
        updated_at
    }

    //Get Current txn log id from the transaction log table
    const LogId = await getLogIdCount();


    // Txn object is pushed onto the blockchain
    const hash= await txn_store(txn,LogId);

    // // const response = await txn_retrieve(30);

    // After logging the txn into the blockchain
    try{
        // Log the txn into the database - transaction_log table
        const result = await db.LogTxn(hash,transaction_id);
        res.json({result})
    }catch(err){
        res.json({err})
    }

}

module.exports = {sendConfirmation}