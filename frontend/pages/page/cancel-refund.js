import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import {



    Container,
    Row,
    Col,

} from "reactstrap";


const RefundPage = () => {
    return (
        <>
            <CommonLayout parent="home" title="Shipping & Exchange">
                <section className="privacy-page section-b-space">
                    <Container>
                        <Row>
                            <Col>
                                <h3>Cancellation & Refunds</h3>
                                <div className="privacy-box">
                                    <p className="desc">
                                        There may be certain orders that we might be unable to process due to certain reasons. Aeternus Foundation Corporation solely reserves the right to refuse or cancel any order. Certain criteria for cancellation of order includes that may result in your order being cancelled include limitations on quantities available for purchase, inaccuracy or errors in product or pricing information, or problems identified by our credit and fraud avoidance department. In such case if customer has placed the order and payment is made and if we are unable to Provide the product/products or customer cancel thier order before order status update in proccessing (order processing time may take 24-48 working hours), full paid amount will be refunded to customer within 10-15 working days in same payment mode as you paid.
                                    </p>
                                    <p className="desc">
                                        Also if the order is cancelled by the customer after being processed, the amount of that order won't be refunded.
                                    </p>
                                    <p className="desc">
                                        The recipient, upon signing the delivery receipt, acknowledges the receipt of the product in terms of the order placed with the Company. The Company is not liable to the Customer / recipient for any refund / replacement, under any circumstances, for any subsequent complaints with respect to such deliveries If the recipient is not available at the time of delivery, the Company / courier agent shall try and deliver the item thrice before returning the same to  . All costs for re-shipment and handling in the case of non-delivery to the Member shall be chargeable to the Member. In such case the order will be cancelled and the voucher amount of such product will not be refundable.
                                    </p>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </section>
            </CommonLayout>
        </>
    );
};

export default RefundPage; 
