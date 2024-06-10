import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import CommonLayout from '../../../components/shop/common-layout';
import Dashboard_LeftPart from './common/dashboard_leftpart';
import { useVoucher } from '../../../helpers/voucher/VoucherContext';
import { extractDateFromISO } from '../../../helpers/utils';

const isVoucherExpiredOrUsed = (voucher) => {
    const currentDate = new Date();
    const expiryDate = new Date(voucher.expiresAt);
    return voucher.isUsed || expiryDate < currentDate;
};

const getVoucherStatus = (voucher) => {
    const currentDate = new Date();
    const expiryDate = new Date(voucher.expiresAt);
    if (voucher.isUsed) {
        return 'Used';
    } else if (expiryDate < currentDate) {
        return 'Expired';
    }
    return null;
};

const VouchersPage = () => {
    const { vouchers } = useVoucher();
    const [activeTab, setActiveTab] = useState('all');

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const renderVouchers = (voucherList) => {
        return (
            <Row>
                {voucherList.map(voucher => {
                    const expiredOrUsed = isVoucherExpiredOrUsed(voucher);
                    const voucherStatus = getVoucherStatus(voucher);
                    return (
                        <Col lg="4" md="6" key={voucher._id} className="mb-4">
                            <Card className={`voucher-card ${expiredOrUsed ? 'expired-or-used' : ''}`}>
                                <CardBody>
                                    <div className="voucher-value-circle">
                                        ${voucher.cost}
                                    </div>
                                    <p className="voucher-description">
                                        <span className="voucher-code">{voucher.code}</span>
                                        <br />
                                        Get ${voucher.cost} off on your next purchase
                                    </p>
                                    <div className="voucher-footer">
                                        <span className="voucher-expiry">
                                            {extractDateFromISO(voucher.expiresAt)}
                                        </span>
                                        {!expiredOrUsed ? (
                                            <Button color="primary" className="claim-button btn-sm">
                                                Claim Now
                                            </Button>
                                        ) : (
                                            <span className="voucher-status">
                                                {voucherStatus}
                                            </span>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    const allVouchers = renderVouchers(vouchers);
    const expiredVouchers = renderVouchers(vouchers.filter(voucher => isVoucherExpiredOrUsed(voucher) && !voucher.isUsed));
    const usedVouchers = renderVouchers(vouchers.filter(voucher => voucher.isUsed));

    return (
        <CommonLayout parent="home" title="profile">
            <section className="contact-page register-page section-b-space">
                <Container>
                    <Row>
                        <Col lg="3">
                            <Dashboard_LeftPart />
                        </Col>
                        <Col lg='9'>
                            <div className='dashboard-right'>
                                <div className='dashboard'>
                                    <h3>Vouchers</h3>
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === 'all' })}
                                                onClick={() => { toggleTab('all'); }}
                                            >
                                                All Vouchers
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === 'expired' })}
                                                onClick={() => { toggleTab('expired'); }}
                                            >
                                                Expired
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === 'used' })}
                                                onClick={() => { toggleTab('used'); }}
                                            >
                                                Used
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={activeTab} style={{marginTop: "20px"}}>
                                        <TabPane tabId="all">
                                            {vouchers.length > 0 ? allVouchers : <p>No vouchers found.</p>}
                                        </TabPane>
                                        <TabPane tabId="expired">
                                            {expiredVouchers}
                                        </TabPane>
                                        <TabPane tabId="used">
                                            {usedVouchers}
                                        </TabPane>
                                    </TabContent>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <style jsx>{`
                .voucher-card {
                    position: relative;
                    text-align: center;
                    border-radius: 10px;
                    padding: 20px;
                    background-color: #f9f9f9;
                    box-shadow: 0 4px                     px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease-in-out;
                    margin-bottom: 20px;
                }

                .voucher-card.expired-or-used {
                    background-color: #f0f0f0;
                }

                .voucher-value-circle {
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ff6f61;
                    color: #fff;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.3s ease-in-out;
                }

                .voucher-card.expired-or-used .voucher-value-circle {
                    background: #ccc;
                    color: #333;
                }

                .voucher-description {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #333;
                    text-align: center;
                }

                .voucher-description .voucher-code {
                    font-weight: bold;
                    color: #007bff;
                }

                .voucher-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                }

                .voucher-expiry {
                    font-size: 12px;
                    color: #888;
                }

                .claim-button {
                    font-size: 12px;
                    padding: 5px 15px;
                    text-transform: uppercase;
                    border-radius: 20px;
                }

                .voucher-status {
                    font-size: 12px;
                    font-weight: bold;
                    color: #d9534f;
                }

                .tab-pane p {
                    margin-top: 20px;
                    text-align: center;
                }

                .nav-tabs .nav-link {
                    cursor: pointer;
                }
            `}</style>
        </CommonLayout>
    );
};

export default VouchersPage;
