import { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import {
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
} from "reactstrap";
// reactstrap components
import axios from "api/axios";
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

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "variables/charts.js";

import HeaderInvestor from "components/Headers/HeaderInvestor.js";

const Investor = (props) => {
  const [comp_price, setComp_price] = useState(0);
  const [activeNav, setActiveNav] = useState(1);
  const [reqShares, setReqShares]= useState(1);
  
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  const handleModalClose = async () => {
    setRequest(false);
    }


  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const handleRequestClose = async () => {
    try{
        const response =await axios.post(process.env.SERVER_ADDRESS +"/web3/investor/requestShares?inv_id="+localStorage.getItem("Investor"),
    {cname,csym,reqShares,comp_price}
    ,{
        headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' },
    })
    setRequest(false);
    console.log(response.data)
}catch(err){
    console.log(err)
}
}

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const [companies, setCompanies] = useState([]);

  const [bal,setBal]  = useState([])
    const getBalances =async () =>{
        const respoonse = await axios.get(process.env.SERVER_ADDRESS +"/web2/investor/getBalance?inv_id="+localStorage.getItem("Investor"),
        {
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        }
        )

        // setHistory_det(respoonse.data.data) 
        console.log(respoonse.data.data)
        setBal(respoonse.data.data)
        
    }


  useEffect(() =>{
    async function fetchData(){
        let resp = await axios.get(process.env.SERVER_ADDRESS +"/web2/investor/indvInvestor?inv_id="+localStorage.getItem("Investor"))

        const inv_det = resp.data.data
        
        if(inv_det.notified === 1 && inv_det.notified2 === 1){
            let response = await axios.get(process.env.SERVER_ADDRESS +"/web2/company/getAllCompaniesData",
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
            )
            setCompanies(response.data.data);
            console.log(response.data.data[0]);
        }else if(inv_det.notified === 1){
            let response = await axios.get(process.env.SERVER_ADDRESS +"/web2/company/getIndvCompanyData?comp_id="+1,
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
            )
            setCompanies(response.data.data);
            console.log(response.data.data[0]);
        }else if(inv_det.notified2 === 1){
            let response = await axios.get(process.env.SERVER_ADDRESS +"/web2/company/getIndvCompanyData?comp_id="+2,
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
            )
            setCompanies(response.data.data);
            console.log(response.data.data[0]);
        }
    }
 
    fetchData();
    
    getBalances();
        
  }, []);





  
  const [cname, setName] = useState("");
  const [csym, setSym] = useState("");
  const [showShares, setRequest] = useState(false);
  const handleRequestOpen = (name,sym,price) =>{ 
    setRequest(true);
    setName(name);
    setSym(sym);
    setComp_price(price)
    }

  return (
    <>
      <HeaderInvestor />
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
                    <h3 className="mb-0">INVESTMENT OPTIONS</h3>
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
                    <th scope="col">Per Share Price</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {
                        companies.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.company_name}</td>
                            <td>{value.company_sym}</td>
                            <td>{value.no_of_shares}</td>
                            <td>{value.price}</td>
                            <td><Button color="success" size="sm" onClick={e=>{
                                handleRequestOpen(value.company_name,value.company_sym,value.price)
                            }}>Request</Button>
                            </td>
                            </tr>
                        )
                        })
                    }
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">INVESTMENTS</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      // onClick={(e) => e.preventDefault()}
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
                    <th scope="col">Company Name</th>
                    <th scope="col">No. of Shares</th>
                    {/* <th scope="col" /> */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Microsoft</th>
                    <td>{bal[0]}</td>
                  </tr>
                  <tr>
                    <th scope="row">Amazon</th>
                    <td>{bal[2]}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Request modal */}

      <Modal
              className="modal-dialog-centered"
              size="sm"
              isOpen={showShares}
               toggle={handleModalClose}
            >
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                      Request Shares
                  </div>
                    <Form role="form">
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fas fa-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="seller" placeholder="Company Name" value={"    "+cname} disabled={true} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend" className="mr-1">
                            <InputGroupText>
                              <i className="fas fa-dollar-sign" />
                            </InputGroupText>
                          </InputGroupAddon>
                        <Input type="text" name="assetid" placeholder="Token Name" value={"   "+csym} disabled={true} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fab fa-ethereum" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="number" name="assetid" value={reqShares} onChange={(e)=>{setReqShares(e.target.value);}} onBlur={(e)=>{setComp_price(parseInt(e.target.value)*comp_price)}} placeholder="Enter the amount of shares"/>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="far fa-money-bill-alt" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="assetid" placeholder="Shares price"  value={"   "+comp_price} disabled={true}/>
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="button"
                          onClick={handleRequestClose}
                        >
                          Request
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>





      {/* <Modal show={showShares} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Request shares</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                    <Form.Group className="mb-3" controlId="seller">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" name="seller" placeholder="Company Name" value={cname} disabled={true}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assetid">
                            <Form.Label>Token Name</Form.Label>
                            <Form.Control type="text" name="assetid" placeholder="Token Name"  value={csym} disabled={true}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assetid">
                            <Form.Label>Quantity of shares</Form.Label>
                            <Form.Control type="text" name="assetid" value={reqShares} onChange={(e)=>{setReqShares(e.target.value);}} onBlur={(e)=>{setComp_price(parseInt(e.target.value)*comp_price)}} placeholder="Enter the amount of shares" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assetid">
                            <Form.Label>Shares total price</Form.Label>
                            <Form.Control type="text" name="assetid" placeholder="Shares price"  value={comp_price} disabled={true}/>
                        </Form.Group>

                        <div className="text-center" >
                    <Button variant="primary" onClick={handleRequestClose}>
                        Request
                        </Button>  
                        </div>
                        
                    </Form>
                </Modal.Body>
            </Modal> */}
    </>
  );
};

export default Investor;
