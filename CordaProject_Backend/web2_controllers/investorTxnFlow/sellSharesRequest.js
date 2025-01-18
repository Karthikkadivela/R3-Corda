// Investor - Investor cycle -> Step 1: Investor requests to sell shares of the given company

// Necessary imports
const {Db_Service} = require('../../config/db_service');
const { getLogIdCount } = require('../txnLog_data');
const {txn_store} = require('../../web3_controllers/txn_store');
const db = Db_Service.getDbServiceInstance();

const sellSharesRequest=async(req,res)=>{

    // Current date
    const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let {cname,csym,sellShares,pricePerShare,currentAccount}=req.body;
    
    // String to Integer and USDT is calculated for the amount of shares investor is selling
    let req_usdt=parseInt(sellShares)*parseInt(pricePerShare);
    sellShares=parseInt(sellShares);

    // Get investor details using his wallet address
    let investor_id=await db.getInvestorData(currentAccount);

    // investor id(investor table) is retrieved 
    investor_id=investor_id[0].investor_id;

    // This txn object (containing txn details) is logged onto the blockchain 
    const txn = {
        company_id:1, // to be made dynamic
        no_of_shares:sellShares,
        investor_id:investor_id,
        trustee_id:1,
        status:"Investor_Initiated",
        request_usdt:req_usdt,
        created_at:createdDate,
        updated_at:createdDate
    }

    //Get Current txn log id from the transaction log table
    const LogId = await getLogIdCount();


    // Txn object is pushed onto the blockchain
    const hash= await txn_store(txn,LogId);

    // const response = await txn_retrieve(30);

    // After logging the txn into the blockchain
    try{
        // Insert the txn into the database - transaction table to let all the actors to know that the selling of shares txn has been initiated
        const result = await db.IntiateSellTxn_Investor(txn);
        console.log(result["id"]["insertId"]);
        var txn_id=result["id"]["insertId"];

        try{
            // Log the txn into the database - transaction_log table
            const result_log = await db.LogTxn(hash,txn_id);
            console.log(result_log);
            res.json({message:result_log.message});
        }catch(err){
            res.json({err})
        }
    }catch(err){
        res.json({err})
    }
}

module.exports={sellSharesRequest}