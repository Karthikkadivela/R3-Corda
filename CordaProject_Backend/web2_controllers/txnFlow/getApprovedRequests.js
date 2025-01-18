// Gets all the approved requests of investor directly buying the shares from the company, investor selling the shares of the company and investor  buying the company shares from  other investor after the company approves of the request
// Showing on the trustee page 

// Necessary imports
const {Db_Service} = require('../../config/db_service')
const db = Db_Service.getDbServiceInstance();

const getApprovedRequests = async (req,res)=>{
    const {wallet_addr} = req.query;

    try{
        // Gets all the approved requests of investor directly buying the shares from the company
        const result_comp_cycle = await db.getApprovedRequests(wallet_addr);

        // Gets all the approved requests of investor selling the shares of the company
        const result_inv_cycle_buyer = await db.getInvApprovedRequests(wallet_addr);

        // Gets all the approved requests of investor  buying the company shares from  other investor
        const result_inv_cycle_seller = await db.getInvApprovedRequests_Seller(wallet_addr)

        res.json({
            comp_cycle: result_comp_cycle,
            inv_cycle_buyer:result_inv_cycle_buyer,
            inv_cycle_seller:result_inv_cycle_seller
        });
    }catch(err){
        res.json({err});
    }
}

module.exports = {getApprovedRequests}