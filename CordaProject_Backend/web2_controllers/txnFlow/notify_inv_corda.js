// Controllers interacting with company table
const axios = require('axios');
const dotenv=require('dotenv');
dotenv.config();
// Get Db_Service class obj to access database query functions
const {Db_Service} = require('../../config/db_service')
const db = Db_Service.getDbServiceInstance();

// Function call to post the company details to database and deploy the company contract and the swap contract associated with it
const notify_inv = async (req,res) =>{
    var {comp_name,inv_name} = req.body; //get details from frontend    

    console.log(req.body)
    try{
        const share_det = await db.getIndvCompanyDataByName(comp_name)

        console.log(share_det[0]['company_name'])

        const resp = await axios.post(process.env.TRUSTEE_NODE+"/notifyInvestors?inv_id="+req.query['inv_id'],
        JSON.stringify({name:share_det[0]['company_name'],symbol:share_det[0]['company_sym'],currency:share_det[0]['currency'],price:share_det[0]['price']}),
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
        )
        console.log(resp.data)

        const flag = await db.updateInvFlag(inv_name,share_det[0]['company_id'])
                console.log(flag);
        res.json({
            result:resp.data,
            msg:"txn id",
        })
    }catch(error){
        console.log(error)
        res.json({
            msg:"error",
            err:error
        })
    }

}

module.exports = {
    notify_inv
}