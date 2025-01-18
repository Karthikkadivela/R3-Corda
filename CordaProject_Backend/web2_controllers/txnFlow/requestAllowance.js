// Investor - Company cycle -> Step 4: Company requests allowance for USDT transfer from the Investor who wants to buy the shares 

const {Db_Service} = require('../../config/db_service')

const requestAllowance = async (req,res)=>{
    const {transaction_id} = req.query;

    // Current date
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()

    try{
        // Change the status(USDT allowance) in the transaction table after trustee requests allowance from the Investor 
        const result = await db.requestAllowance(updatedDate,transaction_id);
        res.json({result});
    }catch(err){
        res.json({err});
    }
}

module.exports = {requestAllowance}