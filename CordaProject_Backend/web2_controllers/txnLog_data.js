// Controllers interacting with transaction_log table

// Get Db_Service class obj to access database query functions
const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();

// Get the number of entries made in the transaction_log table
const getLogIdCount = async (req,res) =>{
   const LogIdCount = await db.getLogIdCount();
    return (LogIdCount[0].count+1)
}

// Get transaction details from the company_id
const getIndvRequest = async (req,res) =>{
   const {c_id} = req.query
   const result = await db.getIndvRequest(c_id);
   res.status(200).json({result});
}

module.exports = {
   getLogIdCount,
   getIndvRequest
}