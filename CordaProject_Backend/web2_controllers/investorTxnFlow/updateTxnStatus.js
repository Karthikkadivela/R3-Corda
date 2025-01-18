// Update different transaction status in the Investor <-> Investor cycle

// Necessary imports
const { Db_Service } = require("../../config/db_service");
const db = Db_Service.getDbServiceInstance();
const { getLogIdCount } = require('../txnLog_data');
const {txn_store} = require('../../web3_controllers/txn_store');

const updateTxnStatus=async(req,res)=>{
    const{transaction_id,comp_status}=req.query;
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //For status change of the transaction in the transaction table
    await db.updateTxnTable(comp_status,parseInt(transaction_id),updatedDate);

    // get txn details for blockchain push
    const response=await db.getTransactionDetails(transaction_id);

    // This txn object (containing txn details) is logged onto the blockchain 
    const txn=response[0];

    // add to investor_listing table
    if(comp_status==="Investor_Approved"){
        // steps 1 - get investor(seller) wallet address
        let investor_tuple=await db.getInvestorDataByID(txn.investor_id);
        investor_tuple=investor_tuple[0];

        // Add Listing details to investor_listing table
        await db.insertInvestor_Listing(txn.transaction_id,investor_tuple.wallet_addr);
    }
    
    //Get Current txn log id from the transaction log table
    const LogId = await getLogIdCount();

    // Txn object is pushed onto the blockchain
    const hash= await txn_store(txn,LogId);
    
    // After logging the txn into the blockchain
        try{
            // Log the txn into the database - transaction_log table
            const result_log = await db.LogTxn(hash,txn.transaction_id);
            console.log(result_log);
            res.json({message:result_log.message});
        }catch(err){
            res.json({err})
        }
    
}

module.exports={updateTxnStatus};