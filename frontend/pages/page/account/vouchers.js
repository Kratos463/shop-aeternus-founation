import React from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import CommonLayout from '../../../components/shop/common-layout';
import Dashboard_LeftPart from './common/dashboard_leftpart';

const VouchersPage = () => {

    const vouchers = [
        { id: 1, value: "$6", description: "Save $6 on your next purchase", expiryDate: "Expires on 30/06/2024" },
        { id: 2, value: "$10", description: "Get $10 off for orders above $50", expiryDate: "Expires on 31/07/2024" },
        // Add more vouchers as needed
    ];

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
                                    <Col sm="12">
                                        <h3>Vouchers</h3>
                                        <Row>
                                            {vouchers.map(voucher => (
                                                <Col lg="4" md="6" key={voucher.id} className="mb-4">
                                                    <Card className="voucher-card">
                                                        <CardBody>
                                                            <div className="voucher-value-circle">
                                                                {voucher.value}
                                                            </div>
                                                            <p className="voucher-description">
                                                                {voucher.description}
                                                            </p>
                                                            <div className="voucher-footer">
                                                                <span className="voucher-expiry">
                                                                    {voucher.expiryDate}
                                                                </span>
                                                                <Button color="primary" className="claim-button btn-sm">
                                                                    Claim Now
                                                                </Button>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>
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
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                .voucher-value-circle {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ff6f61;
                    color: #fff;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                }

                .voucher-description {
                    margin-top: 40px;
                    font-size: 16px;
                    color: #333;
                }

                .voucher-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                }

                .voucher-expiry {
                    font-size: 14px;
                    color: #888;
                }

                .claim-button {
                    font-size: 14px;
                    padding: 5px;
                }
            `}</style>
        </CommonLayout>
    );
}

export default VouchersPage;
