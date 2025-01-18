require('dotenv').config();
const express=require("express");
const app=express();
const cors=require('cors');
const bd = require('body-parser')
const corsOptions = require('./config/corsOptions');
const axios = require('axios');

// Controllers(Applicaton Logic) imports
// Web2 Controllers
const {postIndvCompanyData, getAllCompaniesData,getPendingRequests,getContractAddrs,getIndvCompanyData} = require('./web2_controllers/company_data')
const {requestShares} = require('./web2_controllers/txnFlow/requestShares')
const {sendConfirmation} = require('./web2_controllers/txnFlow/sendConfirmation')
const {getAcceptance} = require('./web2_controllers/txnFlow/getAcceptance')
const {getApprovedRequests} = require('./web2_controllers/txnFlow/getApprovedRequests')
const {getIndvRequest} = require('./web2_controllers/txnLog_data')
const {requestAllowance} = require('./web2_controllers/txnFlow/requestAllowance')
const {sendAllowance} = require('./web2_controllers/txnFlow/sendAllowance')
const {getAllInvestorsData} = require('./web2_controllers/investor_data.js')
const {sellSharesRequest} =require("./web2_controllers/investorTxnFlow/sellSharesRequest");
const {updateTxnStatus} =require("./web2_controllers/investorTxnFlow/updateTxnStatus");
const { getListingDetails } = require('./web2_controllers/investor_listing_data');
const { initiateBuyTxn } = require('./web2_controllers/investorTxnFlow/initateBuyTxn');
const {postLoginData} = require('./web2_controllers/login_data.js')

// Web3 Controllers
const {swapController} = require('./web3_controllers/swapController')

//corda
const {mint_shares} = require('./web2_controllers/txnFlow/mint_shares')
const {notify_inv} = require('./web2_controllers/txnFlow/notify_inv_corda');
const {acceptance_corda} = require('./web2_controllers/txnFlow/acceptance_corda')
const {swapCorda} = require('./web2_controllers/txnFlow/swapCorda')
const {getMirrorTableCorda} = require('./web2_controllers/getMirrorTableCorda')
const {postUserData} = require('./web2_controllers/postUserData.js')
const { Db_Service } = require('./config/db_service');


// Necessary middlewares
app.use(cors({origin: '*'}));
app.use(bd.urlencoded({extended:false}))
app.use(bd.json())

// Main route
app.get('/',(req,res)=>{res.json({msg:"Sever is running successfully"})})

// Login route
app.post('/web2/login/postLoginData',postLoginData)

// Register route
app.post('/web2/register/postUserData',postUserData)

// Company routes
app.post('/web2/company/mint_shares',mint_shares)
app.post('/web2/company/acceptance_corda',acceptance_corda)


app.get('/web2/company/getAllCompaniesData',getAllCompaniesData)
app.get('/web2/company/getPendingRequests', getPendingRequests)
app.get('/web2/company/getAcceptance', getAcceptance)
app.post('/web2/company/postIndvCompanyData',postIndvCompanyData)
app.get('/web2/company/getContractAddrs',getContractAddrs)
app.get('/web2/company/updateTxnStatus',updateTxnStatus);
app.get('/web2/company/getIndvCompanyData', getIndvCompanyData)


app.get('/web2/company/getHistory', async(req,res) => {
    const comp_id = req.query.comp_id
    history = []
    try{
        const db = Db_Service.getDbServiceInstance();
        const resp = await db.getHistory(comp_id)
        // console.log(resp.id)
        for(let i=0;i<resp.id.length;i++){
            history.push([resp.id[i].investor_name,resp.id[i].no_of_shares,resp.id[i].price,resp.id[i].updated_at,resp.id[i].swap_txn_hash])
        }
        // console.log(history)
        res.json({data: history})
    }catch(err){
        console.log(err)
    }
})

app.get('/web2/company/getBalance', async(req,res) => {
    const comp_id = req.query.comp_id
    history = []
    try{
        var comp_node
        if(comp_id == "1")
            comp_node = process.env.COMPANY_NODE1
        else
            comp_node = process.env.COMPANY_NODE2
        // console.log(resp.id)
        const company_string= await axios.get(comp_node+"/getStockBalance",
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
    
        company_share = Number(company_string.data.split(" ")[3])

        const company_string2 = await axios.get(comp_node+"/getFiatCurrencyBalance",
        {
          headers: { 'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' },
        }
        )

        company_bal = Number(company_string2.data.split(" ")[3])

        // console.log("Checking balance...")
        // console.log(company_share,company_bal)
        res.json({data: [company_share,company_bal]})
    }catch(err){
        console.log(err)
    }
})

app.get('/web2/investor/getBalance', async(req,res) => {
    const inv_id = req.query.inv_id
    console.log(inv_id)
    history = []
    try{
        var inv_node
        if(inv_id == "2")
            inv_node = process.env.INVESTOR_NODE1
        else if (inv_id == "3")
            inv_node = process.env.INVESTOR_NODE2
        else if( inv_id == "4")
            inv_node = process.env.INVESTOR_NODE3
        // console.log(resp.id)
        const company_string= await axios.get(inv_node+"/getStockBalance",
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
    
        company_share = Number(company_string.data.split(" ")[3])


        const company_string3= await axios.get(inv_node+"/getStockBalance?Symbol=AMZ",
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
    
        company_share3 = Number(company_string3.data.split(" ")[3])


        const company_string2 = await axios.get(inv_node+"/getFiatCurrencyBalance",
        {
          headers: { 'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' },
        }
        )

        company_bal = Number(company_string2.data.split(" ")[3])

        // console.log("Checking balance...")
        // console.log(company_share,company_bal)
        res.json({data: [company_share, company_bal, company_share3]})
    }catch(err){
        console.log(err)
    }
})

// Investor routes
app.get('/web2/investor/indvInvestor',async (req,res)=>{
    var {inv_id} = req.query
    inv_id = parseInt(inv_id)

    try{
        const db = Db_Service.getDbServiceInstance();
        const resp = await db.getIndvInvestor(inv_id)
        console.log(resp)
        res.json({data: resp[0]})
    }catch(err){
        console.log(err)
    }
})

app.get('/web2/investor/getIndvInvestor',async (req,res)=>{
    var {inv_name} = req.query

    try{
        const db = Db_Service.getDbServiceInstance();
        const resp = await db.getIndvInvestorByName(inv_name)
        console.log(resp)
        res.json({data: resp[0]})
    }catch(err){
        console.log(err)
    }
})

app.post('/web3/investor/requestShares', requestShares)
app.get('/web2/investor/getApprovedRequests', getApprovedRequests)
app.get('/web3/investor/sendAllowance',sendAllowance);
app.get('/web2/investor/getAllInvestorsData',getAllInvestorsData)
app.post("/web2/investor/sellShares",sellSharesRequest);
app.get("/web2/investor/getListingDetails",getListingDetails);
app.post("/web2/investor/buyInitiate",initiateBuyTxn);

// Trustee routes
app.post('/web2/trustee/notify',notify_inv)


app.get('/web2/trustee/getIndvRequest', getIndvRequest)
app.get('/web2/trustee/sendConfirmation',sendConfirmation)
app.get('/web2/trustee/requestAllowance', requestAllowance)
// app.get('/web3/trustee/swap', swapController)
app.get('/web3/trustee/swap', swapCorda)


app.get('/web2/getMirrorTable',getMirrorTableCorda)

app.listen(5000,()=>{
    console.log("Server is listening to port 5000");
});