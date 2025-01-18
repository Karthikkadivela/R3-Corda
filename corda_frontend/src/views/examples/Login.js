// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";
// import useAuth from '../hooks/useAuth';
import axios from "api/axios";
import { useHistory } from "react-router-dom";

import { useAuth, useRef, useState, useEffect } from 'react';


const LOGIN_URL = process.env.SERVER_ADDRESS +'/web2/login/postLoginData';


const Login = () => {

  const navigate = useHistory();
  // const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
         userRef.current.focus();
   }, [])

    useEffect(() => {
      setErrMsg('');
    }, [email, password])
        

    let PostLogin = async (e) => {
              e.preventDefault();
      
              try {
                console.log("Logging in....")
                const response = await axios.post(LOGIN_URL,
                  JSON.stringify({ email, password ,role}),
                  {
                      headers: { 'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*' }
                  }
                 );
                console.log(JSON.stringify(response?.data?.result));
                const msg = response?.data?.msg
                console.log(msg)

                if(msg === role+" doesn't exitst"){
                  alert(role+" not found")
                }else{
                  if(role === "Company"){
                    localStorage.setItem(role,response?.data?.result?.company_id)
                    navigate.push('/admin/company')
                  }else if(role === "Investor"){
                    localStorage.setItem(role,response?.data?.result?.investor_id)
                    navigate.push('/admin/investor')
                  }else{
                    localStorage.setItem(role,response?.data?.result?.trustee_id)
                    navigate.push('/admin/trustee')
                  }
                }
                
              }catch(err){
                console.log(err)
              }
    };


  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/github.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
            <Form role="form">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="email"
                    autoComplete='new-email'
                    ref={userRef}
                    required
                    placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="password" className="form-control"
                    required 
                    placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text" required 
                    placeholder="Role-Investor Company Trustee" value={role} onChange={(e)=> setRole(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" onClick={PostLogin}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
