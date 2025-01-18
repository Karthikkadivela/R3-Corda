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

import { useRef, useState, useEffect } from "react";
import axios from "api/axios";


const MirrorTable = (props) => {
  const errRef = useRef();
    const [mirrorInfo, setMirrorInfo] = useState([]);
    const [total_shares, setTotal_Shares]=useState(0);
    
    const [mint, setMint] = useState(false);
    const handleMintShow = () => setMint(true);
    const handleMintClose = () => setMint(false);
    const [name,setCompanyName] = useState("");
    const [sym,setSym] = useState("");
    const [sharecount,setShareCount] = useState(0);
    const [currency,setCurrency] = useState("");
    const [price,setPrice] = useState(0);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('');

    const REGISTER_URL=process.env.SERVER_ADDRESS +"/web2/company/mint_shares?comp_id="+localStorage.getItem("Company");

    let PostRegister = async (e) => {
      e.preventDefault();

      try {

        const response = await axios.post(REGISTER_URL,
          JSON.stringify({name:name,symbol:sym,currency:currency,issueVal:sharecount,price:price}),
          {
              headers: { 'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' },
          }
      );
      console.log(response)
      const res=JSON.stringify(response?.data.msg);
      // const res = response;
      console.log(res);
      res.data ? setSuccess("success"): setSuccess('');
      setCompanyName('');
      setSym('');
      setShareCount(0);
      setCurrency('');
      setPrice(0);
      } catch (err) {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 409) {
            setErrMsg('Failed');
        } else {
            setErrMsg('Failed')
        }
        errRef.current.focus()
        }
    };

    const getTimeStamps = async() =>{
        try{
              const response =await axios.get(process.env.SERVER_ADDRESS +"/web2/getMirrorTable?comp_id="+localStorage.getItem("Company"),
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                })
              console.log(response.data.data)
              const tuple_row = response.data.data
              var total_shares=0;
              for(var i=0;i<tuple_row.length;i++)
                {
                    console.log(tuple_row[i][1])
                    total_shares+=tuple_row[i][1]
                }
                console.log(total_shares)
              setTotal_Shares(total_shares);
              setMirrorInfo(tuple_row);
          }catch(err){
              console.log(err)
          }
        
    }

    useEffect(async() =>{
      setErrMsg('');
        getTimeStamps();
    }, []);

  return (
    <>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">MIRROR TABLE</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={handleMintShow}
                      size="sm"
                    >
                      Mint
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                    <tr>
                        <th scope ="col">#</th>
                        <th scope ="col">ShareHolder Name</th>
                        <th scope ="col">No of Shares</th>
                        <th scope ="col">% Of Holding</th>
                    </tr>
                </thead>
                <tbody>
                {
                mirrorInfo.map((items, index) => {
                    return (
                    <tr>
                        <td>{index+1}</td>
                        {items.map((subItems, sIndex) => {
                        return <td> {subItems} </td>;
                        })}
                    </tr>
                    );
                                
                    })}
                    <tr> 
                        <td colSpan={2}> <b>Total :</b></td>
                        <td>{total_shares}</td>
                        <td>100 %</td>
                    </tr>
                  {/* <tr>
                    <th scope="row">Mukesh</th>
                    <td>56%</td>
                  </tr>
                  <tr>
                    <th scope="row">Advani</th>
                    <td>34%</td>
                  </tr>
                  <tr>
                    <th scope="row">Sanghwan</th>
                    <td>8%</td>
                  </tr>
                  <tr>
                    <th scope="row">Ratan Lal</th>
                    <td>2%</td>
                  </tr> */}
                </tbody>
              </Table>
            </Card>
            <Modal
              className="modal-dialog-centered"
              size="sm"
              isOpen={mint}
               toggle={handleMintClose}
            >
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
              <p ref={errRef} className={success ? "success" : "offscreen"} aria-live="assertive">{success}</p>
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                      Mint Shares
                  </div>
                    <Form role="form">
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fas fa-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" placeholder="Enter Company Name" value={name} onChange={(e)=> setCompanyName(e.target.value)} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend" className="mr-1">
                            <InputGroupText>
                              <i className="fa fa-code" />
                            </InputGroupText>
                          </InputGroupAddon>
                        <Input type="text" className="form-control" placeholder="Enter symbol" value={sym} onChange={(e)=> setSym(e.target.value)} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="far fa-money-bill-alt" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" placeholder="Enter number of shares" value={sharecount} onChange={(e)=> setShareCount(e.target.value)}/>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fas fa-dollar-sign" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" placeholder="Enter Currency type" className="form-control" value={currency} onChange={(e)=> setCurrency(e.target.value)}/>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fas fa-money" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="number" className="form-control" value={price} onChange={(e)=> setPrice(e.target.value)}/>
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="button"
                          onClick={PostRegister}
                        >
                          Mint
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>
            {/* <form className='company' onSubmit={PostRegister}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <p ref={errRef} className={success ? "success" : "offscreen"} aria-live="assertive">{success}</p>

                <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" className="form-control" placeholder="Enter Company Name" value={name} onChange={(e)=> setCompanyName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Company Symbol</label>
                    <input type="text" className="form-control" placeholder="Enter symbol" 
                    value={sym} onChange={(e)=> setSym(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Total number of shares</label>
                    <input type="number" className="form-control" placeholder="Enter number of shares" 
                    value={sharecount} onChange={(e)=> setShareCount(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Currency</label>
                    <input type="text" className="form-control" value={currency} onChange={(e)=> setCurrency(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input type="number" className="form-control" value={price} onChange={(e)=> setPrice(e.target.value)}/>
                </div>

                <div className="form-group">
                    <input type="submit" className="form-control" style={{color:"blue"}} value="Submit"/>
                </div>
            </form> */}
    </>
  );
};

export default MirrorTable;
