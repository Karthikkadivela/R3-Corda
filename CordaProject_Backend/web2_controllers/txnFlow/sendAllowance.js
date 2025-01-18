// Investor - Company cycle -> Step 5: Investor gives allowance to the requested USDT for the shares that he/she requested so that the trustee can swap the corresponding assets to the respective party
// Investor - Investor cycle -> Step 7: Trustee forwards the accepted buy request from the buyer(buying other investor shares) to the investor(buyer)

// Necessary imports
const {Db_Service} = require('../../config/db_service')
const db = Db_Service.getDbServiceInstance();

// flag = 1 -> Investor - Investor cycle -> Step 7
// flag = 2 -> Investor - Company cycle -> Step 5

const sendAllowance = async (req,res)=>{
    const {transaction_id,flag} = req.query;
    // Current Date
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Status update variable
    let status = "Swapping"
    if(flag==1)
        status = "Buyer_USDT_Allowance"
    else if(flag == 2)
        status = "Investor_Swapping"
        
    try{
        // Change the status in the transaction table accordingly after Investor gives his allowance for swapping of shares and USDT
        const result = await db.sendAllowance(transaction_id,updatedDate,status);
        res.json({result});
    }catch(err){
        res.json({err});
    }
}

module.exports = {sendAllowance}