import React, { useEffect, useState } from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import { Container, Row, Col } from 'reactstrap';
import { useAuth } from '../../../helpers/auth/AuthContext';

const Profile = () => {

    const {user}= useAuth()

    return (
        <CommonLayout parent="home" title="dashboard">
            <section className="section-b-space">
                <Container>
                    <Row>
                        <Col lg="9">
                            <div className="dashboard-right">
                                <div className="dashboard">
                                    <div className="page-title">
                                        <h2>My Dashboard</h2>
                                    </div>
                                    <div className="welcome-msg">
                                        <p>Hello, {user && user?.firstName + " " + user?.lastName} </p>
                                        <p>From your My Account Dashboard you have the ability to view a snapshot of your recent
                                            account activity and update your account information. Select a link below to view or
                                            edit information.</p>
                                    </div>
                                    <div className="box-account box-info">
                                        <div className="box-head">
                                            <h2>Account Information</h2>
                                        </div>
                                        <Row>
                                            <Col sm="6">
                                                <div className="box">
                                                    <div className="box-title">
                                                        <h3>Contact Information</h3>
                                                    </div>
                                                    <div className="box-content">
                                                        <h6>{user?.firstName + " " + user?.lastName}</h6>
                                                        <h6>{user?.email}</h6>
                                                        <h6>{user?.phone}</h6>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm="6">
                                                <div className="box">
                                                    <div className="box-title">
                                                        <h3>Newsletters</h3>
                                                    </div>
                                                    <div className="box-content">
                                                        <p>You are currently not subscribed to any newsletter.</p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div>
                                            <div className="box">
                                                <div className="box-title">
                                                    <h3>Address Book</h3>
                                                </div>
                                                <Row>
                                                    <Col sm="6">
                                                        <h6>Default Billing Address</h6>
                                                        <address>You have not set a default billing address.<br /><a href="#">Edit
                                                        Address</a></address>
                                                    </Col>
                                                    <Col sm="6">
                                                        <h6>Default Shipping Address</h6>
                                                        <address>You have not set a default shipping address.<br /><a
                                                            href="#">Edit Address</a></address>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    )
}

export default Profile