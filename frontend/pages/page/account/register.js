import React, { useState } from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import { Input, Container, Row, Form, Label, Col } from 'reactstrap';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from "axios"

const Register = () => {
    const router = useRouter()

    const [user, setUser] = useState({
        username: "", firstName: "", lastName: "", email: "", phone: "", password: ""
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    const onSignup = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(
                `${process.env.API_URL}/api/v1/user/register`,
                user,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.API_KEY
                    }
                }
            );
            if (response.data.success) {
                router.push('/page/account/login');
            } else {
                toast.error("Failed to Register user");
            }

        } catch (error) {
            setLoading(false);
            toast.error("Signup failed", error.message);
            console.log("Error while register a user", error)
        }
    }


    return (
        <CommonLayout parent="home" title="register">
            <section className="register-page section-b-space">
                <Container>
                    <Row>
                        <Col lg="12">
                            <h3>create account</h3>
                            <div className="theme-card">
                                <Form className="theme-form" onSubmit={onSignup}>
                                    <Row>
                                        <Col md="6">
                                            <Label className="form-label" for="fname"> Username</Label>
                                            <Input type="text" className="form-control" id="usname" name="username" placeholder="username"
                                                value={user.username} onChange={handleChange} required />
                                        </Col>
                                        <Col md="6">
                                            <Label className="form-label" for="email">Email</Label>
                                            <Input type="email" className="form-control" id="email" name="email" placeholder="Email"
                                                value={user.email} onChange={handleChange} required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <Label className="form-label" for="fname">First Name</Label>
                                            <Input type="text" className="form-control" id="fname" name="firstName" placeholder="First Name"
                                                value={user.firstName} onChange={handleChange} required />
                                        </Col>
                                        <Col md="6">
                                            <Label className="form-label" for="lname">Last Name</Label>
                                            <Input type="text" className="form-control" id="lname" name="lastName" placeholder="Last Name"
                                                value={user.lastName} onChange={handleChange} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <Label className="form-label" for="phone">Phone</Label>
                                            <Input type="text" className="form-control" id="phone" name="phone" placeholder="Phone Number"
                                                value={user.phone} onChange={handleChange} required />
                                        </Col>
                                        <Col md="6">
                                            <Label className="form-label" for="password">Password</Label>
                                            <Input type="password" className="form-control" id="password" name="password"
                                                value={user.password} onChange={handleChange} placeholder="Enter your password" required />
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col md="12">
                                            <button type="submit" className="btn btn-solid w-auto">{loading ? "Processing..." : "Create Account"}</button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    )
}

export default Register
