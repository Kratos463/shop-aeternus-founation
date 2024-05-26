import React, {useState } from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import { Container, Row, Col, Button } from 'reactstrap';
import { useAuth } from '../../../helpers/auth/AuthContext';
import Dashboard_leftpart from '../account/common/dashboard_leftpart';

const Dashboard = () => {

    const { user, userAddress } = useAuth()
    const [accountInfo, setAccountInfo] = useState(false)
    const [showOptions, setShowOptions] = useState(null);

    const handleOptionsClick = (index) => {
        setShowOptions(index === showOptions ? null : index);
    };

    return (
        <CommonLayout parent="home" title="dashboard">
            <section className="section-b-space">
                <Container>
                    <Row>
                        <Col lg="3">
                            <Dashboard_leftpart />
                        </Col>
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
                                                        <p>{user?.newsletter ? "Newsletter subscribed" : "You are currently not subscribed to any newsletter."}</p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div className="box-account box-info">
                                                <div className="box-head">
                                                    <h2>Shipping Address</h2>
                                                </div>
                                                <Row>
                                                    <Col sm="6">
                                                        <div className='box'>
                                                            <div className='box-title'>
                                                                <h3>Default Address</h3>
                                                            </div>

                                                            <div className="box-content">
                                                                {userAddress && userAddress.length > 0 ? (
                                                                    <div>
                                                                        {userAddress.map((addressItem, index) => (
                                                                            index === 0 && (
                                                                                <div key={addressItem._id}>
                                                                                    <div style={{ position: 'relative' }}>
                                                                                        <div onClick={() => handleOptionsClick(index)} style={{ position: 'absolute', top: '0', right: '0', cursor: 'pointer' }}>
                                                                                            &#10247;
                                                                                        </div>
                                                                                        {showOptions === index && (
                                                                                            <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: '20px', right: '0', background: '#fff', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)', zIndex: '100', padding: '5px', borderRadius: '5px' }}>
                                                                                                <Button className='btn btn-sm'>Edit</Button>
                                                                                                <Button className='btn btn-sm' onClick={() => removeAddress(addressItem._id)}>Remove</Button>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <h5>{`${addressItem.firstName} ${addressItem.lastName}`}</h5>
                                                                                    <p>Email: {addressItem.email}</p>
                                                                                    <p>Phone: {addressItem.phone}</p>
                                                                                    <p>Address: {`${addressItem.houseNo}, ${addressItem.street}, ${addressItem.city}, ${addressItem.state}, ${addressItem.country} - ${addressItem.postalcode}`}</p>
                                                                                    <p>Landmark: {addressItem.landmark}</p>
                                                                                </div>
                                                                            )
                                                                        ))}

                                                                    </div>
                                                                ) : (
                                                                    <p>No address found.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    );
};

export default Dashboard;
