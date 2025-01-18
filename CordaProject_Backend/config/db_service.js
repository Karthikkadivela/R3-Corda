// Database queries here

// Necessary imports
const mysql=require('mysql');
const dotenv=require('dotenv');
const fs=require("fs")

//Singleton class instance
let instance=null;
dotenv.config();

// DB Connection credentials
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB_NAME,
    port:3306,
    ssl  : {
        ca : fs.readFileSync(__dirname + '/DigiCertGlobalRootCA.crt.pem')
      }
});

// Singleton class
class Db_Service{
    static getDbServiceInstance(){
        return instance ? instance :new Db_Service();
    }


//  Company Queries

// Get all requests of investors those who want to sell their company shares
        async postCompany(name,email,password){
            try{
                const response=await new Promise((resolve,reject)=>{
                     
                     const query="INSERT into company (company_name,email,password) values (?,?,?)";
                     pool.getConnection((err, connection) => { 
                     connection.query(query,[name,email,password],(error,result)=>{    
                         connection.release();
                         if(error){
                             reject(new Error(error.message));
                             console.log(error.message);
                         }
                         resolve(result);
                     })
                 });
                 });
         
                 return {
                     id:response,
                     message: " company data recorded"
                 };
             }
             catch(error){
                 return error;
             }
        
        }

        async getPendingRequests(wallet_addr){
            try{
                console.log(wallet_addr);
                const response=await new Promise((resolve,reject)=>{
                    const query="SELECT t.transaction_id,t.no_of_shares,t.company_id,i.investor_name,i.investor_id,t.status FROM `company` c,transaction t,investor i WHERE c.wallet_addr=? AND c.company_id=t.company_id AND (t.status=? OR t.status=?)AND t.investor_id=i.investor_id";
                    pool.getConnection((err, connection) => { 
                    connection.query(query,[wallet_addr,"Processing","Investor_Processing"],(error,results)=>{    
                        connection.release();
                        if(error){
                            reject(new Error(error.message));
                        }
                        resolve(results);
                    })
                });
                });
                return(response);
                
            }
            catch(error){
                return error;
            }
        }

        // Get all requests of investors those who want to buy their company shares
        async getPendingRequests_Buyer_Processing(comp_id){
            try{

                const response=await new Promise((resolve,reject)=>{
                    // const query="SELECT t.transaction_id,t.no_of_shares,t.company_id,i.investor_name,i.investor_id,t.status FROM `company` c,transaction t,investor i,investor_listing il WHERE c.company=? AND c.company_id=t.company_id AND t.status=? AND t.transaction_id=il.transaction_id AND il.buyer_wallet_addr=i.wallet_addr";
                    const query="SELECT t.transaction_id,t.no_of_shares,t.price,t.company_id,i.investor_name,i.investor_id,t.status FROM transaction t,investor i WHERE t.company_id=? AND i.investor_id=t.investor_id AND t.status=?";
                    pool.getConnection((err, connection) => { 
                    connection.query(query,[comp_id,"Processing"],(error,results)=>{    
                        connection.release();
                        if(error){
                            reject(new Error(error.message));
                        }
                        resolve(results);
                    })
                });
                });
                return(response);
                
            }
            catch(error){
                return error;
            }
        }

 // Change the status in the transaction table after company accepts or rejects the request
        async getAcceptance(update_time,transaction_id,comp_status,req_usdt){
            try{
                transaction_id = parseInt(transaction_id)
                const response=await new Promise((resolve,reject)=>{
                     const query="UPDATE transaction SET status=?,updated_at=?,price=? WHERE transaction_id=?";
                     pool.getConnection((err, connection) => { 
                     connection.query(query,[comp_status,update_time,req_usdt,transaction_id],(error,result)=>{    
                         connection.release();
                         if(error){
                             reject(new Error(error.message));
                             console.log(error.message);
                         }
                         resolve(result);
                     })
                 });
                 });
                 return {
                    id:response,
                    message: "Confirmation sent to Company"
                };
            }
            catch(error){
                return error;
            }
       }
         
// To get all company details
    async getAllCompanyData(){
        try{
            const response=await new Promise((resolve,reject)=>{
                const query="select * from company";
                pool.getConnection((err, connection) => { 
                connection.query(query,(error,results)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(results);
                })
            });
            });
            return(response);
            
        }
        catch(error){
            return error;
        }
    }

    // get Company smart contract adresses
    async getContractAddrs(wallet_addr){
        try{
            const response=await new Promise((resolve,reject)=>{
                const query="select contract_addr,swap_contract_addr,company_name from company where wallet_addr=?";
                pool.getConnection((err, connection) => { 
                connection.query(query,[wallet_addr],(error,results)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(results);
                })
            });
            });
            return(response);
            
        }
        catch(error){
            return error;
        }
    }

    // Get Indivisual company data based on its wallet address
    async getIndvCompanyData(comp_id){
        try{
            const response=await new Promise((resolve,reject)=>{
                const query="select * from company where company_id=?";
                pool.getConnection((err, connection) => { 
                connection.query(query,[comp_id],(error,results)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(results);
                })
            });
            });
            return(response);
            
        }
        catch(error){
            return error;
        }
    }

    async getIndvCompanyDataByName(comp_name){
        try{
            const response=await new Promise((resolve,reject)=>{
                const query="select * from company where company_name=?";
                pool.getConnection((err, connection) => { 
                connection.query(query,[comp_name],(error,results)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(results);
                })
            });
            });
            return(response);
            
        }
        catch(error){
            return error;
        }
    }

    async getIndvCompanyDataById(comp_id){
        try{
            const response=await new Promise((resolve,reject)=>{
                const query="select * from company where company_id=?";
                pool.getConnection((err, connection) => { 
                connection.query(query,[comp_id],(error,results)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(results);
                })
            });
            });
            return(response);
            
        }
        catch(error){
            return error;
        }
    }

    // Insert into company table
    async mint(name,symbol,currency,issueVal,price,txn_id,comp_id){
        try{
           const response=await new Promise((resolve,reject)=>{
                
                // const query="INSERT into company (company_name,company_sym,currency,no_of_shares,price,mint_txn_id) values (?,?,?,?,?,?)";
                const query="UPDATE company SET company_name=?,company_sym=?,currency=?,no_of_shares=?,price=?,mint_txn_id=? WHERE company_id=?";
                pool.getConnection((err, connection) => { 
                connection.query(query,[name,symbol,currency,issueVal,price,txn_id,comp_id],(error,result)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                        console.log(error.message);
                    }
                    resolve(result);
                })
            });
            });

            return {
                id:response,
                message: name+" shares minted successfully"
            };
        }
        catch(error){
            return error;
        }
    }

    async addCompanyShares(name,new_shares,txn_id,comp_id){
        try{
            const response=await new Promise((resolve,reject)=>{
                 const query="UPDATE company SET no_of_shares=?,mint_txn_id=? WHERE company_id=?";
                 pool.getConnection((err, connection) => { 
                 connection.query(query,[new_shares,txn_id,comp_id],(error,result)=>{    
                     connection.release();
                     if(error){
                         reject(new Error(error.message));
                         console.log(error.message);
                     }
                     resolve(result);
                 })
             });
             });
             return {
                id:response,
                message: name+" shares minted successfully"
            };
        }
        catch(error){
            return error;
        }
    }
 
    // Update the Company shares
    async updateCompanyShares(comp_no_of_shares,req_no_of_shares,company_id){
        try{
            const remaining_shares = comp_no_of_shares - req_no_of_shares;
            const response=await new Promise((resolve,reject)=>{
                 const query="UPDATE company SET no_of_shares=? where company_id=?";
                 pool.getConnection((err, connection) => { 
                 connection.query(query,[remaining_shares,company_id],(error,result)=>{    
                     connection.release();
                     if(error){
                         reject(new Error(error.message));
                         console.log(error.message);
                     }
                     resolve(result);
                 })
             });
             });
             return {
                id:response,
                message: "Confirmation sent to Company"
            };
        }
        catch(error){
            return error;
        }
    }


// Investor queries

async getIndvInvestor(inv_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="SELECT * FROM investor WHERE investor_id = ?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[inv_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        // console.log(response);
        return(response);
        
    }
    catch(error){
        return error;
    }
}

async getIndvInvestorByName(inv_name){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="SELECT * FROM investor WHERE investor_name = ?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[inv_name],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        // console.log(response);
        return(response);
        
    }
    catch(error){
        return error;
    }
}

async updateInvFlag(inv_name,comp_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            var query;
            if(comp_id == 1)
                query="UPDATE investor SET notified=? WHERE investor_name=?";
            else 
                query="UPDATE investor SET notified2=? WHERE investor_name=?";
            console.log(query+" "+inv_name+" "+comp_id);
            pool.getConnection((err, connection) => { 
            connection.query(query,[1,inv_name],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }
    catch(error){
        return error;
    }
}


// Get details of investor table
async getAllInvestorsData(){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select investor_name from investor";
            pool.getConnection((err, connection) => { 
            connection.query(query,(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        // console.log(response);
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// get individual investor by wallet address
async getInvestorData(wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select investor_id from investor where wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// get investor(seller) details
async getInvestorDataByID(investor_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select * from investor where investor_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[investor_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

//  Transaction Queries


// Insert the txn details into the database - transaction table to let all the actors to know that the buying shares txn has been initiated
async IntiateTxn(txn){
    try{
       const response=await new Promise((resolve,reject)=>{
            const query="INSERT into transaction (company_id , no_of_shares , price, investor_id , trustee_id , status , swap_txn_hash, created_at , updated_at) values (?,?,?,?,?,?,?,?,?) ";
            pool.getConnection((err, connection) => { 
            connection.query(query,[txn.company_id,txn.no_of_shares,txn.price,txn.investor_id,txn.trustee_id,txn.status,txn.linear_id,txn.created_at,txn.updated_at],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: "Request recieved at Trustee"
        };
    }
    catch(error){
        return error;
    }
}

// get txn details for blockchain push
async getTransactionDetails(transaction_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select * from transaction where transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }
    catch(error){
        return error;
    }
}

//For status change of the transaction in the transaction table
async updateTxnTable(status,transaction_id,timestamp){
    try{
        console.log(status,transaction_id,timestamp);
        const response=await new Promise((resolve,reject)=>{
            const query="UPDATE transaction SET status=?,updated_at=? WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[status,timestamp,transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }
    catch(error){
        return error;
    }
}

// Investor flow 

// Insert the txn into the database - transaction table to let all the actors to know that the selling of shares txn has been initiated
async IntiateSellTxn_Investor(txn){
    try{
       const response=await new Promise((resolve,reject)=>{
            const query="INSERT into transaction (company_id , no_of_shares , investor_id , trustee_id , status , created_at , updated_at,request_usdt) values (?,?,?,?,?,?,?,?) ";
            pool.getConnection((err, connection) => { 
            connection.query(query,[txn.company_id,txn.no_of_shares,txn.investor_id,txn.trustee_id,txn.status,txn.created_at,txn.updated_at,txn.request_usdt],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: "Request recieved at Trustee"
        };
    }
    catch(error){
        return error;
    }
}





// Change the status(USDT allowance) in the transaction table after trustee requests allowance from the Investor
async requestAllowance(updatedDate,transaction_id){
    try{
       const response=await new Promise((resolve,reject)=>{
            const query="UPDATE transaction SET status='USDTAllowance',updated_at=? WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[updatedDate,transaction_id],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: "Request recieved at Investor to give allowance for USDT"
        };
    }
    catch(error){
        return error;
    }
}

// Get the necessary details required for swapping from the database
async retrieveForSwap(transaction_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.no_of_shares,t.request_usdt,i.wallet_addr,c.swap_contract_addr from transaction t,company c,investor i WHERE t.company_id=c.company_id and t.investor_id=i.investor_id and transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }catch(err){
        return err;
    }
}

// Get the necessary details required for swapping from the database for Investor to Investor cycle
async retrieveForSwapInvestor(transaction_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.no_of_shares,t.request_usdt,c.swap_contract_addr,il.buyer_wallet_addr,il.seller_wallet_addr from transaction t,company c,investor_listing il WHERE t.company_id=c.company_id and t.transaction_id=il.transaction_id and t.transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        // console.log(response);
        return(response);
    }catch(err){
        return err;
    }
}

// Update status to successfull after transaction is complete
async swapSuccessUpdate(createdDate,transaction_id,swap_txn_hash){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="UPDATE transaction SET status='Swap Successful',updated_at=?,swap_txn_hash=? WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[createdDate,swap_txn_hash,transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }catch(err){
        return err;
    }
}

// Gets all the approved requests of investor directly buying the shares from the company
async getApprovedRequests(wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.transaction_id,c.company_name,t.request_usdt,t.no_of_shares from transaction t,company c,investor i where t.company_id=c.company_id and t.investor_id=i.investor_id and t.status='USDTAllowance'  and i.wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr],(error,results)=>{  
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// Gets all the approved requests of investor selling the shares of the company
async getInvApprovedRequests(wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.transaction_id,c.company_name,t.request_usdt,t.no_of_shares,il.seller_wallet_addr,il.buyer_wallet_addr from transaction t,company c,investor_listing il where t.company_id=c.company_id and t.transaction_id=il.transaction_id and t.status='Buyer_Approved'  and il.buyer_wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr,wallet_addr],(error,results)=>{  
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// Gets all the approved requests of investor  buying the company shares from  other investor
async getInvApprovedRequests_Seller(wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.transaction_id,c.company_name,c.contract_addr,c.swap_contract_addr,t.request_usdt,t.no_of_shares,il.seller_wallet_addr,il.buyer_wallet_addr from transaction t,company c,investor_listing il where t.company_id=c.company_id and t.transaction_id=il.transaction_id and t.status='Buyer_USDT_Allowance' and il.seller_wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr,wallet_addr],(error,results)=>{  
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// Change the status in the transaction table accordingly after Investor gives his allowance for swapping of shares and USDT (Both cycle)
async sendAllowance(txn_id,updatedDate,status){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="UPDATE transaction SET status=?,updated_at=? WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[status,updatedDate,txn_id],(error,results)=>{  
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// Get transaction details from the company_id
async getIndvRequest(company_id){
    try{
        company_id=parseInt(company_id);
        const response=await new Promise((resolve,reject)=>{
            const query="select investor_name,no_of_shares,status,updated_at,transaction_id from transaction as txn,investor as inv where txn.investor_id=inv.investor_id and company_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[company_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// Get transaction details using txn id
async getIndvTxn(transaction_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select * from transaction WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }catch(err){
        return err;
    }
        
}

// Change the status in the transaction table after trustee forwards the requests
async sendConfirmation(status,update_time,transaction_id){
    try{// Processing
        transaction_id = parseInt(transaction_id)
        const response=await new Promise((resolve,reject)=>{
             const query="UPDATE transaction SET status=?,updated_at=? WHERE transaction_id=?";
             pool.getConnection((err, connection) => { 
             connection.query(query,[status,update_time,transaction_id],(error,result)=>{    
                 connection.release();
                 if(error){
                     reject(new Error(error.message));
                     console.log(error.message);
                 }
                 resolve(result);
             })
         });
         });
 
         return {
             id:response,
             message: "Confirmation sent to Company"
         };
     }
     catch(error){
         return error;
     }
}


// Transaction Log Queries

// Get the number of entries made in the transaction_log table
async getLogIdCount(){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select count(*) as count from transaction_log";
            pool.getConnection((err, connection) => { 
            connection.query(query,(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// Insert into transaction hash details into transaction_log table
async LogTxn(hash,id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="insert into transaction_log (txn_hash,transaction_id) values (?,?) ";
            pool.getConnection((err, connection) => { 
            connection.query(query,[hash,id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return {
            id:response,
            message: "Request recieved at Trustee"
        };
        
    }
    catch(error){
        return error;
    }
}
    
// investor_listing table Queries

 // Add Listing details to investor_listing table
async insertInvestor_Listing(txn_id,seller_wallet){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="insert into investor_listing (transaction_id,seller_wallet_addr) values (?,?) ";
            pool.getConnection((err, connection) => { 
            connection.query(query,[txn_id,seller_wallet],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return (response);
    }
    catch(error){
        return error;
    }
}

// To get the necessary contents of transaction table with investor_listing table whose wallet address is not equal to seller wallet address
async getListing(company_id,wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="SELECT t.transaction_id,t.no_of_shares,t.request_usdt from transaction t,investor_listing il where il.transaction_id=t.transaction_id and il.seller_wallet_addr <> ? and t.company_id=? and t.status=?;";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr,company_id,"Investor_Approved"],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return (response);
    }
    catch(error){
        return error;
    }
}

// Insert into investor_listing table the buyer wallet address
async insertWalletAddress(txn_id,wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="update investor_listing set buyer_wallet_addr=? where transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr,txn_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return (response);
    }
    catch(error){
        return error;
    }
}

// Login Table 

// Post login details to table
async login(name,email,wallet_addr,role){
    try{
       const response=await new Promise((resolve,reject)=>{
            
            const query="INSERT into login (name,email,wallet_addr,role) values (?,?,?,?)";
            pool.getConnection((err, connection) => { 
            connection.query(query,[name,email,wallet_addr,role],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: " user data recorded"
        };
    }
    catch(error){
        return error;
    }
}

// Investor Table Queries

 // Post investor table  about their details
async postInvestor(name,email,password){
    try{
       const response=await new Promise((resolve,reject)=>{
            
            const query="INSERT into investor (investor_name,email,password) values (?,?,?)";
            pool.getConnection((err, connection) => { 
            connection.query(query,[name,email,password],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: " investor data recorded"
        };
    }
    catch(error){
        return error;
    }
}

// Get investor id by his wallet address
async getInvestorByWallet(wallet_addr){
    try{
       const response=await new Promise((resolve,reject)=>{
            
            const query="SELECT investor_id FROM investor WHERE wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: " investor data retrieved"
        };
    }
    catch(error){
        return error;
    }
}

// Trustee table Queries

// Post trustee table about their details
async postTrustee(name,email,password){
    try{
        console.log(name,email,password)
       const response=await new Promise((resolve,reject)=>{
            
            const query="INSERT into trustee (trustee_name,email,password) values (?,?,?)";
            pool.getConnection((err, connection) => { 
            connection.query(query,[name,email,password],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: " Trustee data recorded"
        };
    }
    catch(error){
        return error;
    }
}


async getCompanyFromEmail(email,password){
    try{
        // console.log(email,password)
       const response=await new Promise((resolve,reject)=>{
            
            const query="SELECT * FROM company WHERE email=? AND password=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[email,password],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response
        };
    }
    catch(error){
        return {msg:"Invalid email or password",error};
    }
}

async getInvestorFromEmail(email,password){
    try{
        // console.log(email,password)
       const response=await new Promise((resolve,reject)=>{
            
            const query="SELECT * FROM investor WHERE email=? AND password=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[email,password],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response
        };
    }
    catch(error){
        return {msg:"Invalid email or password",error};
    }
}

async getTrusteeFromEmail(email,password){
    try{
        // console.log(email,password)
       const response=await new Promise((resolve,reject)=>{
            
            const query="SELECT * FROM trustee WHERE email=? AND password=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[email,password],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response
        };
    }
    catch(error){
        return {msg:"Invalid email or password",error};
    }
}

async getHistory(comp_id){
    try{
        // console.log(email,password)
       const response=await new Promise((resolve,reject)=>{
            
            const query="SELECT i.investor_name,t.no_of_shares,t.price,t.updated_at,t.swap_txn_hash FROM transaction as t,investor as i WHERE t.investor_id=i.investor_id AND t.company_id=? AND STATUS=? ORDER BY updated_at DESC LIMIT 5";
            pool.getConnection((err, connection) => { 
            connection.query(query,[comp_id,'Swap Successful'],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response
        };
    }
    catch(error){
        return {msg:"Invalid email or password",error};
    }
}
    
} //End Singleton class

module.exports={Db_Service};