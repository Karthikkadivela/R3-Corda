// Controllers interacting with company table

// Get Db_Service class obj to access database query functions
const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();

// import web3 controllers
const {insert_and_deploy} = require('../web3_controllers/company_deploy')
const {insert_and_swap} = require('../web3_controllers/swap_contract_deploy')


// Function call to post the company details to database and deploy the company contract and the swap contract associated with it
const postIndvCompanyData = async (req,res) =>{
    var {comp_wallet_addr,comp_name,comp_symb,comp_shares} = req.body; //get details from frontend 

    comp_shares = parseInt(comp_shares) // comp_shares is string in req.body , so convert to int    

    try{
        // Deploy company contract and its associated swap contract
        const comp_contract_addr = await insert_and_deploy(comp_name,comp_symb,comp_shares,comp_wallet_addr);
        const swap_contract= await insert_and_swap(comp_contract_addr,comp_wallet_addr);
        console.log("Company address retrieved");

        // Insert the company and its share details to company table
        const result = await db.mint(comp_wallet_addr,comp_name,comp_symb,comp_shares,comp_contract_addr,swap_contract);

        res.json({
            result:result.id,
            msg:result.message,
        })
    }catch(error){
        res.json({
            msg:"error",
            err:error
        })
    }

}

// Get pending requests for transaction of shares that need to be either approved or rejected by the compnay
const getPendingRequests =async(req,res) =>{
    const {comp_id}=req.query;

    // Get all requests of investors those who want to sell their company shares
    // const data_seller=await db.getPendingRequests(wallet_addr);

    // Get all requests of investors those who want to buy their company shares
    const data_buyer_processing =await db.getPendingRequests_Buyer_Processing(comp_id);
    console.log(data_buyer_processing)

    res.json({buyer:data_buyer_processing});
}

// Get all contents from company table
const getAllCompaniesData = async (req,res) =>{
    const data = await db.getAllCompanyData();
     res.json({data});
}

// Get company contract address and its swap contract address
const getContractAddrs = async (req,res) =>{
    const {wallet_addr} = req.query;
    const data = await db.getContractAddrs(wallet_addr);
    res.json({data});
}


// Get Indivisual company data based on its wallet address
const getIndvCompanyData = async (req,res) =>{
    const {comp_id} = req.query;
    const data = await db.getIndvCompanyData(comp_id);
    res.json({data});
}

module.exports = {
    postIndvCompanyData,
    getAllCompaniesData,
    getPendingRequests,
    getContractAddrs,
    getIndvCompanyData
}