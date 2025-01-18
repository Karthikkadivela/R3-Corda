// Swap Controller handling the request received from the client that handles investor <-> investor swap & investor <-> company swap

// Required imports
require('dotenv').config();
const { Db_Service } = require('../../config/db_service');
const db = Db_Service.getDbServiceInstance();
const axios = require('axios');

const swapCorda = async (req,res)=>{
    const {transaction_id , flag} = req.query;

    const data1 = await db.getTransactionDetails(transaction_id)
    const data2 = await db.getIndvCompanyDataById(data1[0].company_id)

    company_id = data2[0].company_id
    investor_id = data1[0].investor_id

    symbol = data2[0].company_sym
    qty = data1[0].no_of_shares
    price = data1[0].price

    var comp_node;
    if(company_id == 1){
      comp_node = process.env.COMPANY_NODE1
    }else if(company_id == 2){
      comp_node = process.env.COMPANY_NODE2
    }

    console.log("Swapping.....")
    const hash= await axios.post(comp_node+"/swap?inv_id="+investor_id,
        JSON.stringify({
            "symbol": symbol, 
            "quantity": qty, 
            "total_price": price
        }),
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
        let lent = hash.data.split(" ").length
        const hash_id = hash.data.split(" ")[lent-1]
    console.log(hash_id)


    const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const afterSwapRes=await db.swapSuccessUpdate(createdDate,transaction_id,hash_id);

    // const comp_data = await db.getAllCompanyData();
    const company_string= await axios.get(comp_node+"/getStockBalance?Symbol="+symbol,
    {
      headers: { 'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' },
    }
    )

    company_share = Number(company_string.data.split(" ")[3])
    const updateSharesRes = await db.updateCompanyShares(company_share,0,company_id)

    res.json({response:afterSwapRes})
}

module.exports = {swapCorda}
