// Investor - Investor cycle -> Step 4: Investor requests to buy shares of the given company sold by the other investors

// Necessary imports
const { Db_Service } = require("../../config/db_service");
const db=Db_Service.getDbServiceInstance();

const initiateBuyTxn=async(req,res)=>{

    const {wallet_addr,txn_id} =req.body;

    // Insert into investor_listing table the buyer wallet address
    try{
    await db.insertWalletAddress(txn_id,wallet_addr);
    }
    catch(err){
        console.log(err);
    }

    // Current Date
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try{
        // Update the status of the transaction in the trasaction table
        const response = await db.sendConfirmation("Buyer_Initiated",updatedDate,txn_id);
        res.json({message:"Buy Request accepted"});
    }catch(err){
        res.json({err});
    }
}

module.exports={initiateBuyTxn};