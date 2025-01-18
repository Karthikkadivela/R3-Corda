// Controllers interacting with investor table

// Get Db_Service class obj to access database query functions
const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();

// To get the contents of investor table
const getAllInvestorsData = async (req,res) =>{
    const data = await db.getAllInvestorsData();
     res.json({data});
}

module.exports = {
    getAllInvestorsData,
    }