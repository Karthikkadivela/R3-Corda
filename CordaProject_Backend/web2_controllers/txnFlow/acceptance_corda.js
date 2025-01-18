// Necessary imports
const {txn_store} = require('../../web3_controllers/txn_store');
const { txn_retrieve } = require('../../web3_controllers/txn_retrieve');
const { getLogIdCount } = require('../txnLog_data')
const {Db_Service} = require('../../config/db_service')
const dotenv=require('dotenv');
dotenv.config();
const axios = require('axios');


const acceptance_corda = async (req,res)=>{
    // comp_status has status of the request
    const comp_id = req.query.comp_id
    console.log(comp_id)
    // Current date
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()

    const data1 = await db.getTransactionDetails(req.body.transaction_id)

    
    linear_id = data1[0].swap_txn_hash
    var comp_node;
    if(comp_id == "1"){
        comp_node = process.env.COMPANY_NODE1
    }else if(comp_id == "2"){
        comp_node = process.env.COMPANY_NODE2
    }

    const hash= await axios.post(comp_node+"/acceptance",
    linear_id,
      {
        headers: { 'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*' },
    }
    )
    console.log(hash)
    try{
        // Change the status in the transaction table after company accepts or rejects the request
        const res = await db.getAcceptance(updatedDate,req.body.transaction_id,req.body.cur_status,req.body.price);
    }catch(err){
        res.json({err});
    }

    // Get the current transaction details
    const result = await db.getIndvTxn(req.body.transaction_id);
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

module.exports = {acceptance_corda}