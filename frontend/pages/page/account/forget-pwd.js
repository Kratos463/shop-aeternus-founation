import React, { useState } from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import { Container, Row, Form, Input,Col } from 'reactstrap';


const ForgetPwd = () => {

    return (
        <CommonLayout parent="home" title="Forget Password">
            <section className="pwd-page section-b-space">
                <Container>
                    <Row>
                        <Col lg="6" className="m-auto">
                            <h2>Forget Your Password</h2>
                            <Form className="theme-form">
                                <Row>
                                    <Col md="12">
                                        <Input type="email" className="form-control" id="email" placeholder="Enter Your Email"
                                            required="" />
                                    </Col>
                                    <a href="#" className="btn btn-solid w-auto">Submit</a>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    )
}

export default ForgetPwd;