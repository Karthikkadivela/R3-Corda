import { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import axios from "api/axios";
import MirrorTable from "./MirrorTable";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

import {
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "variables/charts.js";

import HeaderCompany from "components/Headers/HeaderCompany.js";

const Company = (props) => {


  const [history_det,setHistory_det] = useState([]);

  const getTimeStamps =async () =>{
    const respoonse = await axios.get(process.env.SERVER_ADDRESS +"/web2/company/getHistory?comp_id="+localStorage.getItem("Company"),
    {
        headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' },
    }
    )

    setHistory_det(respoonse.data.data); 
    
    }


    const [bal,setBal]  = useState([])
    const getBalances =async () =>{
        const respoonse = await axios.get(process.env.SERVER_ADDRESS +"/web2/company/getBalance?comp_id="+localStorage.getItem("Company"),
        {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )

        // setHistory_det(respoonse.data.data) 
        setBal(respoonse.data.data)
        
    }

    async function updateTxnStatus(status,txnid){
      let response = await axios.get(process.env.SERVER_ADDRESS +"/web2/company/updateTxnStatus?transaction_id="+txnid+"&comp_status="+status,
              {
                  headers: { 'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*' },
              }
          )
  }
  const [pendingRequests,setPendingRequests]=useState([]);
  const [transact, setTransaction_ID] = useState(0);
    const [no_of_shares, setNo_of_shares] = useState(0);
    const [status , setStatus] = useState("");

  const handleAcceptRequestOpen = async (transaction_id,no_of_shares,price,status) => {
        
    setNo_of_shares(no_of_shares);
        setTransaction_ID(transaction_id);
        console.log(status);
        console.log(price)
        // if(status === "Rejected")
        //     ModalUSDT(false);
        // else
        //     ModalUSDT(true);
        setStatus(status);
        const respoonse = await axios.post(process.env.SERVER_ADDRESS +"/web2/company/acceptance_corda?comp_id="+localStorage.getItem("Company"),
        {transaction_id,shares:no_of_shares,price,cur_status:status}
        ,{
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )
        console.log(respoonse)
}

    useEffect(async() =>{
      getTimeStamps();
      fetchData("");
      getBalances();
      }, []); 

  
      async function fetchData(acc){
        console.log(acc);
        let response = await axios.get(process.env.SERVER_ADDRESS +"/web2/company/getPendingRequests?comp_id="+localStorage.getItem("Company"),
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
        )
        console.log(response.data);
        let combined=response.data.buyer
        console.log(combined);
        setPendingRequests(combined);
            
        
    }
  
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const [request, setRequest] = useState(false);

    const handleRequestClose = () => setRequest(false);
    const handleRequestShow = () => setRequest(true);

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  return (
    <>
      <HeaderCompany />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
          </Col>
          <Col xl="4">
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">TRANSACTION HISTORY</h3>
                  </div>
                  <div className="col text-right">
                    {/* <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button> */}
                    <Button color="primary" size="sm" onClick={handleRequestShow}>View Requests</Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Investor Name</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Timestamp</th>
                    <th>Txn Hash</th>
                  </tr>
                </thead>
                <tbody>
                {
                
                history_det.map((items, index) => {
                                return (
                                <tr>
                                    <td>{index+1}</td>
                                    {items.map((subItems, sIndex) => {
                                    return <td> {subItems} </td>;
                                    })}
                                </tr>
                                );
                    })}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <MirrorTable/>
          </Col>
        </Row>
      </Container>

      
      <Modal
              className="modal-dialog-centered"
              size="xl"
              isOpen={request}
               toggle={handleRequestClose}
            >
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                      Requests
                  </div>
                  <Table className="align-items-center table-flush" responsive>
                  <thead>
                    <tr>
                    <th>#</th>
                    <th>Investor Name</th>
                    <th>No of shares</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pendingRequests.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.investor_name}</td>
                            <td>{value.no_of_shares}</td>
                            <td>{value.price}</td>
                            <td>{value.status=='Processing'?"Buyer":value.status=="Investor_Processing"?"Seller":"Buyer"}</td>
                            <td><Button color="success" onClick={()=>{
                                if(value.status=='Processing')handleAcceptRequestOpen(value.transaction_id,value.no_of_shares,value.price,"Approved");
                                else if(value.status=='Investor_Processing'){
                                    updateTxnStatus("Investor_Approved",value.transaction_id);
                                }else if(value.status=='Buyer_Processing'){
                                    updateTxnStatus("Buyer_Approved",value.transaction_id);
                                }
                                }}>Approve</Button>
                                <Button color="danger"  onClick={()=>updateTxnStatus("Rejected",value.transaction_id)}>Reject</Button></td>
                            </tr>
                        )
                        })
                    }
                </tbody>
            </Table>
                  </CardBody>
                </Card>
              </div>
            </Modal>
    </>
  );
};

export default Company;
