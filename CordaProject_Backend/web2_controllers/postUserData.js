// Controllers interacting with login table

// Get Db_Service class obj to access database query functions
const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();

// To post the login details into the database
const postUserData = async (req,res) =>{
    var { name, email, password , role} = req.body; // get details
    console.log(req.body)
       try{
    // //    Post to login table
        var result;
        if(role === "Company"){
            result = await db.postCompany(name,email,password);
        }else if(role === "Investor"){
            result = await db.postInvestor(name,email,password);
        }else{
            result = await db.postTrustee(name,email,password);
        }
        console.log(result)
    //     var res_another;

    //     // Post investor table or trustee table about their details
    //     if(role == "Investor" || role == "Lead Investor")
    //         res_another = await db.postInvestor(name,wallet_addr)
    //     else if(role == "Trustee")
    //         res_another = await db.postTrustee(name,wallet_addr)

        // Company details are posted when their shares are minted hence no if condition for them here
        
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

module.exports = {
    postUserData
}