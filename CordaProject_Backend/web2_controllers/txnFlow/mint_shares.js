// Controllers interacting with company table
const axios = require('axios');
const dotenv=require('dotenv');
dotenv.config();
// Get Db_Service class obj to access database query functions
const {Db_Service} = require('../../config/db_service')
const db = Db_Service.getDbServiceInstance();

// Function call to post the company details to database and deploy the company contract and the swap contract associated with it
const mint_shares = async (req,resp) =>{
    var {name,symbol,currency,issueVal,price} = req.body; //get details from frontend 

    comp_shares = parseInt(issueVal) // comp_shares is string in req.body , so convert to int    

    comp_id = req.query['comp_id']
    console.log(req.body,comp_id)
    try{
        var comp_node;
        if(comp_id == "1")
                comp_node = process.env.COMPANY_NODE1
        else
                comp_node = process.env.COMPANY_NODE2

        const bal_string = await axios.get(comp_node+"/getStockBalance?Symbol="+symbol,
                {
                    headers: {'Access-Control-Allow-Origin': '*' },
                }
        )
        // console.log(bal_string.data)
        var shares = parseInt(bal_string.data.split(" ")[3])
        console.log(shares)
        var route = comp_node + "/createCompanyShares"
        // if(comp_id == "1")
        //         route = process.env.COMPANY_NODE1+"/createCompanyShares?comp_id="+comp_id
        // else
        //         route = process.env.COMPANY_NODE2+"/createCompanyShares?comp_id="+comp_id

        const res = await axios.post(route,
        JSON.stringify({name:name,symbol:symbol,currency:currency,issueVal:issueVal,price:price}),
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
        )
        console.log(res.data)
        var res_list = res.data.split(" ")
        txn_id = res_list[res_list.length-1]
        console.log("mint txn id: ", txn_id)

        // Insert the company and its share details to company table
        var result;
        if(shares==0){
           result = await db.mint(name,symbol,currency,issueVal,price,txn_id,comp_id);
        }else{
            result = await db.addCompanyShares(name,shares+parseInt(issueVal),txn_id,comp_id);
        }
         
        // console.log(result)
        console.log("Minting done......")
        resp.json({
            result:result.id,
            msg:result.message,
        })
    }catch(error){
        resp.json({
            msg:"error",
            err:error
        })
    }

}

module.exports = {
    mint_shares
}