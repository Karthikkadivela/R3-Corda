// Investor - Company cycle -> Step 1: Investor requests shares from the company

// Necessary imports
const {txn_store} = require('../../web3_controllers/txn_store');
const { txn_retrieve } = require('../../web3_controllers/txn_retrieve');
const { getLogIdCount } = require('../txnLog_data')
const {Db_Service} = require('../../config/db_service')
const dotenv=require('dotenv');
dotenv.config();
const axios = require('axios');

const requestShares = async (req,res)=>{
    // Current date
    const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()

    const comp_dets = await db.getIndvCompanyDataByName(req.body.cname)
    const comp_id = comp_dets[0].company_id


    // Get investor details from their wallet address
    // const investor_id_data = await db.getInvestorByWallet(req.query.wallet_addr)

    // investor id 
    const inv_id = req.query.inv_id
    console.log(inv_id)

    //Get Current txn log id from the transaction log table
    const LogId = await getLogIdCount();
    var inv_node;
    if(inv_id === "2"){
        inv_node = process.env.INVESTOR_NODE1
    }else if(inv_id === "3"){
        inv_node = process.env.INVESTOR_NODE2
    }
    else if(inv_id === "4"){
        inv_node = process.env.INVESTOR_NODE3
    }

    console.log(inv_node,comp_id)
    // Txn object is pushed onto the blockchain
    const hash= await axios.post(inv_node+"/proposal?comp_id="+comp_id,
        JSON.stringify({
            "company_name": req.body.cname,
            "symbol": req.body.csym,
            "total_price": parseInt(req.body.comp_price),
            "no_of_shares": req.body.reqShares
          }),
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
        let lent = hash.data.split(" ").length
        const hash_id = hash.data.split(" ")[lent-1]
        console.log(hash_id)

    // const response = await txn_retrieve(30);
    // This txn object (containing txn details) is logged onto the blockchain 
    const txn = {
        company_id:comp_id, // to be made dynamic since only one company is assumed in our case
        no_of_shares:req.body.reqShares,
        price:req.body.comp_price,
        investor_id:inv_id,
        trustee_id:1,
        status:"Initiated",
        linear_id: hash_id,
        created_at:createdDate,
        updated_at:createdDate
    }

    // After logging the txn into the blockchain
    try{

        // Insert the txn into the database - transaction table to let all the actors to know that the buying shares txn has been initiated
        const result = await db.IntiateTxn(txn);
        var txn_id=result["id"]["insertId"];

        // Log the txn into the database - transaction_log table
        try{
            const result_log = await db.LogTxn(hash_id,txn_id);
            res.json({message:result_log.message});
        }catch(err){
            res.json({err})
        }

    }catch(err){
        res.json({err})
    }

}

module.exports = {requestShares}