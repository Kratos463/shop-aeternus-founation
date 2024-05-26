import React, { useState, useEffect } from 'react';
import CommonLayout from '../../../../components/shop/common-layout';
import { Container, Row, Form, Label, Input, Col } from 'reactstrap';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

    const router = useRouter();
    const [user, setUser] = useState({
        email: "", password: ""
    })
    const [loading, setLoading] = useState(false)

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }


    const loginAuth = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await axios.post("./../../api/user/login/route", user)
            console.log("User login response", response.data)
            toast.success("Login successfully")
            router.push("/")
        } catch (error) {
            setLoading(false)
            console.log("login failed", error.message)
            toast.error(error.message)
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
                                        <Label className="form-label" for="email">Email</Label>
                                        <Input type="email"  className="form-control" placeholder="Email" 
                                         value={user.email} onChange={handleChange} name="email"
                                        required />
                                    </div>
                                    <div className="form-group">
                                        <Label className="form-label" for="review">Password</Label>
                                        <Input type="password" className="form-control" id="review"
                                            placeholder="Enter your password" name="password"
                                            value={user.password} onChange={handleChange}
                                            required />
                                    </div>
                                    <button type="submit" className="btn btn-solid">{loading ? "Processing..." : "Login"}</button>
                                    <div className="footer-social">
                                        <ul>
                                            <li>
                                                <a href="https://www.facebook.com" target="_blank">
                                                    <i className="fa fa-facebook" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://plus.google.com" target="_blank">
                                                    <i className="fa fa-google-plus" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                        <Col lg="6" className="right-login">
                            <h3>New Customer</h3>
                            <div className="theme-card authentication-right">
                                <h6 className="title-font">Create A Account</h6>
                                <p>Sign up for a free account at our store. Registration is quick and easy. It allows you to be
                                    able to order from our shop. To start shopping click register.</p><a href="#"
                                        className="btn btn-solid">Create an Account</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    )
}

export default Login;