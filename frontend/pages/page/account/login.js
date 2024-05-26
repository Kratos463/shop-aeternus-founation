import React, { useState } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { useAuth } from "../../../helpers/auth/AuthContext";
import Link from "next/link";


const Login = () => {

  const {loading, login} = useAuth()
  const [user, setUser] = useState({
    identifier: "", password: "" 
  })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  }


  const loginAuth = async (e) => {
    
    e.preventDefault()
    try {
     
      await login(user.identifier, user.password);
    } catch (error) {
      setError('Invalid credentials');
    }
  }

  return (
    <CommonLayout parent="home" title="login">
      <section className="login-page section-b-space">
        <Container>
          <Row>
            <Col lg="6">
              <h3>Login</h3>
              <div className="theme-card">
                <Form className="theme-form" onSubmit={loginAuth}>
                  <div className="form-group">
                    <Label className="form-label" for="email">
                      Email
                    </Label>
                    <Input type="text" className="form-control" id="identifier" placeholder="Email or username"
                      value={user.identifier} onChange={handleChange} name="identifier"
                      required />
                  </div>
                  <div className="form-group">
                    <Label className="form-label" for="review">
                      Password
                    </Label>
                    <Input type="password" className="form-control" id="review" placeholder="Enter your password" name="password"
                      value={user.password} onChange={handleChange}
                      required />
                  </div>
                  <button type="submit" className="btn btn-solid">{loading ? "Processing..." : "Login"}</button>
                </Form>
              </div>
            </Col>
            <Col lg="6" className="right-login">
              <h3>New Customer</h3>
              <div className="theme-card authentication-right">
                <h6 className="title-font">Create A Account</h6>
                <p>Sign up for a free account at our store. Registration is quick and easy. It allows you to be able to order from our shop. To start shopping click register.</p>
                <Link href="/page/account/register" className="btn btn-solid">
                  Create an Account
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Login;
