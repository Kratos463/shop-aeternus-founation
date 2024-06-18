import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import {



    Container,
    Row,
    Col,

} from "reactstrap";


const ExchangePage = () => {
    return (
        <>
            <CommonLayout parent="home" title="Shipping & Exchange">
                <section className="privacy-page section-b-space">
                    <Container>
                        <Row>
                            <Col>
                                <h3>Shipping & Exchange</h3>
                                <div className="privacy-box">
                                    <p className="desc">
                                        At Aeternus Foundation Corporation, we are committed to providing a seamless and satisfactory experience for our customers. Our shipping and exchange policies are designed to ensure that you receive your products promptly and can easily address any issues that may arise.
                                    </p>

                                    <div className="ques-box">
                                        <p className="ques">How does the delivery process work?</p>
                                        <p className="desc">1. Once our system processes your order, your products are inspected thoroughly to ensure they are in a perfect condition.
                                        </p>

                                        <p className="desc">
                                            2. After they pass through the final round of quality check, they are packed and handed over to our trusted delivery partner i.e Blue Dart.
                                        </p>
                                        <p className="desc">
                                            3. Our delivery partners then bring the package to you at the earliest possibility. In case, they are unable to reach your provided address or at a suitable time, they will contact you to resolve the issue.
                                        </p>
                                        <p className="desc">
                                            4. Guarantee for delivery made by the Company is subject to the terms and conditions of the courier company. Any inconsistency/errors in name or address will result in non-delivery of the product.
                                        </p>
                            

                                    </div>

                                </div>
                                <h3>Aeternus Foundation Corporation's Shipping</h3>
                                <div className="secured-box">
                                    <p className="desc">
                                        We strive to deliver your orders as quickly as possible. Once your order is confirmed, we process and ship it within 7-10 days. You will receive a tracking number to monitor your shipment's progress until it reaches your doorstep. Delivery charges and time may vary based on your location and selected shipping method.
                                    </p>
                                </div>

                                <h3>Aeternus Foundation Corporation's Easy Exchange Policy</h3>
            
                                <div className="cookies-box">
                                    <p className="desc"> Aeternus Foundation Corporation offers its customers an 'Easy Exchange Policy', wherein you can raise a exchange request for a product within 1-3 business days of its delivery.</p>
                                    <div className="ques-box">
                                        <p className="ques">Exchange Policy:</p>
                                        <p className="desc"><strong>Eligible Products:</strong> We will only process exchanges for products that are damaged, incorrectly sized, or incorrect in color upon delivery.</p>
                                        <p className="desc"><strong>Exchange Conditions:</strong> To initiate an exchange for a damaged or incorrectly sized product, you must provide a valid reason and submit a complete video of the unboxing process. The video should clearly show the damage or discrepancy.</p>
                                        <p className="desc"><strong>Approval Process:</strong> After reviewing the video and inspecting the product, we will approve or cancel your exchange request based on our findings.</p>


                                        <p className="ques">Important Checklist for Returning Products:</p>
                                        <p className="desc">1. Ensure that products are returned with tags intact and in their original packaging.</p>
                                        <p className="desc">2. Products must be unwashed, undamaged, and unused.</p>
                                        <p className="desc">3. Refunds or replacements will be issued after a thorough inspection of the returned product(s).</p>
                                        <p className="desc">4. The entire process will be completed within 72 working hours once the product is received at our office.</p>
                                        <p className="ques">Non-Returnable Items:</p>
                                        <p className="desc">We do not entertain exchange requests for products that you simply do not like or wish to change without a valid reason such as damage or sizing issues.</p>
                                        <p className="ques">Jurisdiction:</p>
                                        <p className="desc">All arising disputes will be subject to jurisdiction only.</p>
                                        
                                    </div>
                                </div>

                                <p className="bold-text">By adhering to these guidelines, we aim to provide a smooth and fair exchange process for all our valued customers.</p>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </CommonLayout>
        </>
    );
};

export default ExchangePage; 
