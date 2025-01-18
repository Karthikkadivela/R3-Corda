// Controllers interacting with investor_listing table

// Get Db_Service class obj to access database query functions
const { Db_Service } = require("../config/db_service");
const db=Db_Service.getDbServiceInstance();

// To get the necessary contents of transaction table with investor_listing table
const getListingDetails=async (req,res)=>{
    const {company_id,wallet_addr}=req.query;
    const response=await db.getListing(company_id,wallet_addr);

    res.status(200).json({data:response});
}

module.exports={getListingDetails};