import { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import axios from "api/axios";
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

import HeaderTrustee from "components/Headers/HeaderTrustee.js";
import MirrorTable from "./MirrorTable";

const Trustee = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [inv_name,setInv_name] = useState("")

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };


  const [companies, setCompanies] = useState([]);
  const [investorinfo, setInvestor] = useState([]);
  const [request, setRequest] = useState(false);
  const handleHoldingShow = () => setHolding(true);
  const [holdings, setHolding] = useState(false);
  const [company_name, setCompany_name] = useState("");
  const [notify_modal, setNotify_modal] = useState(false)

  const handleShowRequest = (c_id) => {
    async function fetchData(){
        console.log(c_id)
        let response = await axios.get(process.env.SERVER_ADDRESS +"/web2/trustee/getIndvRequest?c_id="+c_id,
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
        )
        setInvestor(response.data.result);


    }
    fetchData();
    setRequest(true);
}


const handleCloseRequest = () => setRequest(false);
const handleModalClose = async () => {
  setRequest(false);
  setHolding(false);
  setNotify_modal(false);
  }

  async function handleSwap(transaction_id,flag){
    // 0 - normal cycle , 1- investor cycle
    let response = await axios.get(process.env.SERVER_ADDRESS +"/web3/trustee/swap?transaction_id="+transaction_id+"&flag="+flag,
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
        )
    console.log(response);
}

async function forwardReq(txn_id,flag)
    {
        // flag =0 new investor from company
        // flag =1 existing investor selling
        handleCloseRequest();
        let response = await axios.get(process.env.SERVER_ADDRESS +"/web2/trustee/sendConfirmation?transaction_id="+txn_id+"&flag="+flag,
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
            )
            console.log(response);
           
    }

    const Notify_Investor = async (e) => {
      e.preventDefault();

      try{
          const result = await axios.get(process.env.SERVER_ADDRESS +"/web2/investor/getIndvInvestor?inv_name="+inv_name,
          {
              headers: { 'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' },
          }
          )

          // console.log(result.data.data.investor_id)


          const res = await axios.post(process.env.SERVER_ADDRESS +"/web2/trustee/notify?inv_id="+result.data.data.investor_id,
          JSON.stringify({comp_name:company_name,inv_name:inv_name}),
              {
                  headers: { 'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*' }
              }
          )

          console.log(res)
      }catch(err){
          console.log(err);
      }
  }
 

useEffect(() =>{
        
  async function fetchData(){
      let response = await axios.get(process.env.SERVER_ADDRESS +"/web2/company/getAllCompaniesData",
          {
              headers: { 'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' },
          }
      )
      console.log(response.data.data)
      setCompanies(response.data.data);
  }
  fetchData();
}, []);

  return (
    <>
      <HeaderTrustee />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
          </Col>
          <Col xl="4">
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Transaction Log</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                  <th scope="col">#</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Per Share Value</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* <tr>
                    <th scope="row">EKI Energy Systems</th>
                    <td>EKI</td>
                    <td>340</td>
                    <td>189</td>
                    <td>
                      <Button className="bg-yellow text-white" href="#pablo" onClick={(e) => e.preventDefault()} size="sm">Manage</Button>
                      <Button color="info" href="#pablo" onClick={(e) => e.preventDefault()} size="sm">Holdings</Button>
                      <Button color="success" href="#pablo" onClick={(e) => e.preventDefault()} size="sm">Notify</Button>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Infotech Solutions</th>
                    <td>ITS</td>
                    <td>190</td>
                    <td>96</td>
                    <td>
                      <Button className="bg-yellow text-white" href="#pablo" onClick={(e) => e.preventDefault()} size="sm">Manage</Button>
                      <Button color="info" href="#pablo" onClick={(e) => e.preventDefault()} size="sm">Holdings</Button>
                      <Button color="success" href="#pablo" onClick={(e) => e.preventDefault()} size="sm">Notify</Button>
                    </td>
                  </tr> */}
                  {
                        companies.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.company_name}</td>
                            <td>{value.company_sym}</td>
                            <td>{value.no_of_shares}</td>
                            <td>{value.price}</td>
                            <td><Button className="bg-yellow text-white" size="sm" onClick={()=>handleShowRequest(value.company_id)}>Manage</Button>
                            <Button className="bg-info text-white" size="sm" onClick={()=>{handleHoldingShow();setCompany_name(value.company_name)}}>Holdings</Button>
                            <Button className="bg-primary text-white" size="sm" onClick={()=>{setNotify_modal(true);setCompany_name(value.company_name)}}>Notify</Button></td>
                            </tr>
                        )
                        })
                  }
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal
              className="modal-dialog-centered"
              size="xl"
              isOpen={request}
               toggle={handleModalClose}
            >
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                      Request Log
                  </div>
                  <Table className="align-items-center table-flush" color="primary" responsive>
                  <thead className="thead-light">
                    <tr>
                    <th>#</th>
                    <th>Investor Name</th>
                    <th>No of shares</th>
                    <th>Status</th>
                    <th>Status Modified Date</th>
                    <th>Action</th>
                    </tr>
                  </thead>
            <tbody>
                    {
                        investorinfo.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.investor_name}</td>
                            <td>{value.no_of_shares}</td>
                            <td>{value.status}</td>
                            <td>{value.updated_at}</td>
                            {(value.status === "Initiated")?
                            <td><Button color="primary" onClick={()=>forwardReq(value.transaction_id,0)}>Forward</Button></td>: 
                            (value.status === "Approved")?
                            <td><Button color="primary" onClick={()=>{
                                // Transaction_ID(value.transaction_id);
                                // handleForwardUSDT(value.transaction_id);
                                handleSwap(value.transaction_id,0)
                            }}>Swap</Button></td>:
                            (value.status === "Rejected")?
                            <td><Button color="danger">Rejected</Button></td>:
                            (value.status === "Swapping")?
                            <td><Button color="primary" onClick={()=>{
                                handleSwap(value.transaction_id,0);
                            }}>Swap</Button></td>:
                            (value.status === "Investor_Swapping")?
                            <td><Button color="success" onClick={()=>{
                                handleSwap(value.transaction_id,1);
                            }}>Swap</Button></td>:
                            (value.status === "Swap Successful")?
                            <td><Button color="success">Completed</Button></td>:
                            (value.status === "Investor_Initiated")?
                            <td><Button variant="primary" onClick={()=>forwardReq(value.transaction_id,1)}>Forward</Button></td>:
                            (value.status==="Buyer_Initiated")?<td><Button variant="primary" onClick={()=>forwardReq(value.transaction_id,2)}>Forward</Button></td>
                            :<td><Button variant="warning">Processing</Button></td>}
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


            {/* MirrorTable View */}
            <Modal isOpen={holdings} toggle={handleModalClose} className="modal-dialog-centered"
              size="lg">
                <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                   <div className="text-center text-muted mb-4">
                   {company_name}
                  </div>
                  <MirrorTable/>
                  </CardBody>
                </Card>
              </div>
                {/* <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                        {company_name}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body><MirrorTable/></Modal.Body>
                <Modal.Footer>
                </Modal.Footer> */}
            </Modal>

            {/* Notify */}
            <Modal isOpen={notify_modal} toggle={handleModalClose} className="modal-dialog-centered"
              size="sm">
                <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                   <div className="text-center text-muted mb-4">
                   {company_name}
                  </div>
                  <Form role="form" className='company' onSubmit={Notify_Investor}>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fas fa-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <input type="text" className="form-control" placeholder="Enter Investor Name" value={inv_name} onChange={(e)=> setInv_name(e.target.value)} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend" className="mr-1">
                            <InputGroupText>
                              <i className="fas fa-users" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <input type="text" className="form-control" defaultValue={company_name} value={"    "+company_name} disabled={true} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend" className="mr-1">
                            {/* <InputGroupText>
                              <i className="fas fa-dollar-sign" />
                            </InputGroupText> */}
                          </InputGroupAddon>
                          <input type="submit" className="form-control" style={{color:"blue"}} value="Submit"/>
                        </InputGroup>
                      </FormGroup>
                      </Form>
                  </CardBody>
                </Card>
              </div>
                
                {/* <Modal.Body>
                <form className='company' onSubmit={Notify_Investor}>

                <div className="form-group">
                    <label>Investor Name</label>
                    <input type="text" className="form-control" placeholder="Enter Investor Name" value={inv_name} onChange={(e)=> setInv_name(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" className="form-control" defaultValue={company_name} value={company_name} disabled={true} />
                </div>

                <div className="form-group">
                    <input type="submit" className="form-control" style={{color:"blue"}} value="Submit"/>
                </div>
            </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer> */}
            </Modal>
    </>
  );
};

export default Trustee;
