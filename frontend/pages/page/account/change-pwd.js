import React, { useState } from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import { Container, Row, Form, Input, Col, Button, Label } from 'reactstrap';
import { useAuth } from '../../../helpers/auth/AuthContext';
import Dashboard_LeftPart from './common/dashboard_leftpart';

const ChangePwd = () => {

    const { updateUserPassword } = useAuth()
    const [password, setPassword] = useState({
        oldPassword: "", newPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPassword(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await updateUserPassword(password);
            setPassword({
                oldPassword: "", newPassword: ""
            })
        } catch (error) {
            console.log("Error while update the password", error)
        }
    }


    return (
        <CommonLayout parent="home" title="Change Password">
            <section className="contact-page register-page section-b-space">
                <Container>
                    <Row>
                        <Col lg='3'>
                            <Dashboard_LeftPart />
                        </Col>
                        <Col lg='9'>
                            <div className='dashboard-right'>
                                <div className='dashboard'>
                                    <Col sm="12" >
                                        <h3>Change Your Password</h3>
                                        <Form className="theme-form" onSubmit={handleSubmit}>
                                            <Row>
                                                <Row>
                                                    <Col md="6">
                                                        <Label className="form-label" for="old-pwd">Current Password</Label>
                                                        <Input type="password" className="form-control" id="old-pwd" name="oldPassword" placeholder="Enter Current Password"
                                                            onChange={handleChange}
                                                            required />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6">
                                                        <Label className="form-label" for="new-pwd">New Password</Label>
                                                        <Input type="password" className="form-control" id="new-pwd" name="newPassword" placeholder="Enter New Password"
                                                            onChange={handleChange}
                                                            required />
                                                    </Col>
                                                </Row>
                                                <div className="col-md-12">
                                                    <button className="btn btn-sm btn-solid" type="submit">Save</button>
                                                </div>
                                            </Row>
                                        </Form>
                                    </Col>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    )
}

export default ChangePwd;