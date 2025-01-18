

// Necessary imports
const dotenv=require('dotenv');
dotenv.config();
const axios = require('axios');
const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();

const getMirrorTableCorda = async (req,res)=>{

    const comp_id = req.query.comp_id
    console.log(comp_id);

    var comp_node
    var comp_sym
    if(comp_id == "1")
        {
            comp_node = process.env.COMPANY_NODE1
            comp_sym = "MST"
        }
    else
       {
            comp_node = process.env.COMPANY_NODE2
            comp_sym = "AMZ"
       }

    mirrorTable = []
    // Txn object is pushed onto the blockchain
    const investor_string1= await axios.get(process.env.INVESTOR_NODE1+"/getStockBalance?Symbol="+comp_sym,
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
    
    investor_share1 = Number(investor_string1.data.split(" ")[3])

    const investor_string2= await axios.get(process.env.INVESTOR_NODE2+"/getStockBalance?Symbol="+comp_sym,
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
    
    investor_share2 = Number(investor_string2.data.split(" ")[3])

    const investor_string3= await axios.get(process.env.INVESTOR_NODE3+"/getStockBalance?Symbol="+comp_sym,
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
    
    investor_share3 = Number(investor_string3.data.split(" ")[3])

    const company_string= await axios.get(comp_node+"/getStockBalance?Symbol="+comp_sym,
          {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
    
    company_share = Number(company_string.data.split(" ")[3])

    total_shares = investor_share1 + investor_share2 + investor_share3 + company_share

    comp_perc = ((company_share/total_shares)*100).toFixed(2) + "%"
    inv_perc1 = ((investor_share1/total_shares)*100).toFixed(2) + "%"
    inv_perc2 = ((investor_share2/total_shares)*100).toFixed(2) + "%"
    inv_perc3 = ((investor_share3/total_shares)*100).toFixed(2) + "%"

    const comp_data = await db.getIndvCompanyData(comp_id);
    const inv_data = await db.getAllInvestorsData();

    console.log(comp_data[0].company_name)
    console.log(comp_data[0].company_name)

    const inv_shares = {1:[investor_share1,inv_perc1],2:[investor_share2,inv_perc2],3:[investor_share3,inv_perc3]}

    mirrorTable.push([comp_data[0].company_name,company_share,comp_perc])
    for(let i=1;i<inv_data.length;i++){
        mirrorTable.push([inv_data[i]['investor_name'],inv_shares[i][0],inv_shares[i][1]])
    }
    // mirrorTable.push(["Vijay Kedia",investor_share1,inv_perc1])
    // mirrorTable.push(["Vijay Kedia",investor_share2,inv_perc2])
    // mirrorTable.push(["Vijay Kedia",investor_share3,inv_perc3])

    console.log(mirrorTable)

    res.json({"data":mirrorTable})

}

module.exports = {getMirrorTableCorda}