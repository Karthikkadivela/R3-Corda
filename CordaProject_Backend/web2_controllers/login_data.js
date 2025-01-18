// Controllers interacting with login table

// Get Db_Service class obj to access database query functions
const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();

// To post the login details into the database
const postLoginData = async (req,res) =>{
    // var {name,email,wallet_addr,role} = req.body; // get details
    //    try{
    // //    Post to login table
    //     const result = await db.login(name,email,wallet_addr,role);
    //     var res_another;

    //     // Post investor table or trustee table about their details
    //     if(role == "Investor" || role == "Lead Investor")
    //         res_another = await db.postInvestor(name,wallet_addr)
    //     else if(role == "Trustee")
    //         res_another = await db.postTrustee(name,wallet_addr)

    //     // Company details are posted when their shares are minted hence no if condition for them here
        
    //     res.json({
    //         result:result.id,
    //         result_another:res_another,
    //         msg:result.message,
    //     })
    // }catch(error){
    //     res.json({
    //         msg:"error",
    //         err:error
    //     })
    // }

    var { email, password , role} = req.body; // get details
    console.log(req.body)
       try{
    // //    Post to login table
        var result;
        if(role === "Company"){
            result = await db.getCompanyFromEmail(email,password);
        }else if(role === "Investor"){
            result = await db.getInvestorFromEmail(email,password);
        }else{
            result = await db.getTrusteeFromEmail(email,password);
        }
        console.log(result)
        var message;
        if(result.id.length === 0){
            message = role+" doesn't exitst"
        }else{
            message = role+" exists"
        }
    //     var res_another;

    //     // Post investor table or trustee table about their details
    //     if(role == "Investor" || role == "Lead Investor")
    //         res_another = await db.postInvestor(name,wallet_addr)
    //     else if(role == "Trustee")
    //         res_another = await db.postTrustee(name,wallet_addr)

        // Company details are posted when their shares are minted hence no if condition for them here
        
        res.json({
            result:result.id[0],
            msg:message,
        })
    }catch(error){
        res.json({
            msg:"error",
            err:error
        })
    }

}

module.exports = {
    postLoginData
}