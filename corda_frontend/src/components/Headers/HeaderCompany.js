import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import axios from "api/axios";
import { useState, useEffect } from "react";


const HeaderCompany = () => {

  const [Cbal,setCBal]  = useState([])

  const getCBalances =async () =>{
    const respoonse = await axios.get("http://localhost:5000/web2/company/getIndvCompanyData?comp_id="+localStorage.getItem("Company"),
    {
        headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' },
    }
    )

    // setHistory_det(respoonse.data.data) 
    // console.log("Balance")
    console.log(respoonse.data.data)
    setCBal([respoonse.data.data[0].no_of_shares,respoonse.data.data[0].price])
    
}

const [CompFiatBal,setCompFiatBal]  = useState([])

  const getFiatBalances =async () =>{
    const respoonse = await axios.get("http://localhost:5000/web2/company/getBalance?comp_id="+localStorage.getItem("Company"),
    {
        headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' },
    }
    )

    // setHistory_det(respoonse.data.data) 
    console.log("Balance")
    console.log(respoonse.data.data)
    setCompFiatBal(respoonse.data.data[1])
    
}

useEffect(() =>{
  getCBalances();
  getFiatBalances();
},[])


  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Investors
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          3
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Shares
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{Cbal[0]}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last week</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Balance
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{CompFiatBal}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        {/* <i className="fas fa-arrow-down" /> 1.10% */}
                      </span>{" "}
                      <span className="text-nowrap">Updated few seconds back</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Per Share Value
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{Cbal[1]}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="ni ni-money-coins" />
                          
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default HeaderCompany;
