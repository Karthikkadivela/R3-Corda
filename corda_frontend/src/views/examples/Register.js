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
import axios from "api/axios";
import { useRef, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
const LOGIN_URL = process.env.SERVER_ADDRESS +'/web2/register/postUserData';

const Register = () => {

  const navigate = useHistory();
  const [name,setName] = useState("");
  const userRef = useRef();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("");
  const [errMsg, setErrMsg] = useState('');
  useEffect(() => {
    userRef.current.focus();
}, [])

useEffect(() => {
 setErrMsg('');
}, [email, password])
 
let PostLogin = async (e) => {
         e.preventDefault();
 
         try {
           console.log("Registering....")
           const response = await axios.post(LOGIN_URL,
             JSON.stringify({ name, email, password , role}),
             {
                 headers: { 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': '*' }
             }
            );
           console.log(JSON.stringify(response?.data));
           const userID = response?.data?.result?.inserId
           const message = response?.data?.msg
           console.log(userID)
         //   const accessToken = response?.data?.accessToken;
         //   setAuth({ email, password, accessToken });
           setEmail("");
           setPassword("");
           setName("");
           setRole("");
           window.alert(message)
         //   document.cookie = `userID=${userID}`;
         // localStorage.setItem(role,userID)
           navigate('/');
         } 
         catch (err) {
           if (!err?.response) {
             setErrMsg('No Server Response');
         } else if (err.response?.status === 400) {
             setErrMsg('Missing Username or Password');
         } else if (err.response?.status === 401) {
             setErrMsg('Unauthorized');
         } else {
             setErrMsg('Login Failed');
         }
         console.log(err)
         }
       };


  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Sign up with</small>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon mr-4"
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
              <small>Or sign up with credentials</small>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input type="text" className="form-control" 
                     autoComplete='off'
                     ref={userRef}
                     required
                     placeholder="Name" value={name} onChange={(e)=> setName(e.target.value)} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="email" className="form-control" 
                    autoComplete='new-email'
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
                    type="password" required 
                    placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      {/* <i className="ni ni-lock-circle-open" /> */}
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text" required 
                    placeholder="Role-Investor Company Trustee" value={role} onChange={(e)=> setRole(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-muted font-italic">
                <small>
                  password strength:{" "}
                  <span className="text-success font-weight-700">strong</span>
                </small>
              </div>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="button" onClick={PostLogin}>
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
