import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import CommonLayout from '../../../components/shop/common-layout';
import Dashboard_LeftPart from './common/dashboard_leftpart';
import axios from 'axios';
import { formatCustomTimestamp, getConfig } from '../../../helpers/utils';
import { useAuth } from '../../../helpers/auth/AuthContext';
import Link from 'next/link';

const OrderItem = ({ item }) => (

    <Link href={`/product-details/` + item.productId}>
        <ListGroupItem className="d-flex align-items-center">
            <img
                src={"https://thebrandtadka.com/images_inventory_products/front_images/" + item.mediumFile}
                alt={item.title} className="img-thumbnail" style={{ width: '60px', height: '60px', marginRight: '15px' }} />
            <div>
                <h6>{item.title}</h6>
                <p>${item.offerPrice} - Qty: {item.quantity}</p>
            </div>
        </ListGroupItem>
    </Link>
);

const OrderCard = ({ order }) => {

    const formatShippingAddress = () => {
        const { firstName, lastName, email, phone, houseNo, street, landmark, city, state, postalcode, country } = order.shippingAddressDetails;
        return (
            <>
                <p>{firstName} {lastName}
                    <br />
                    {email}
                    <br />
                    {phone}
                </p>
                <p >{houseNo}, {street}, {landmark && landmark + ','} {city}, {state}, {country} - {postalcode}</p>
            </>
        );
    };

    return (
        <Card className="mb-4">
            <CardBody>
                <h5 className="card-title">Order ID: {order.orderId}</h5>
                <p className="card-text">Status: {order.status}</p>
                <p className="card-text">Total: ${order.totalPayAmount}</p>

                {/* Order Items */}
                <ListGroup flush className="mt-3">
                    {order.items.map(item => (
                        <OrderItem key={item._id} item={item} />
                    ))}
                </ListGroup>

                <Row>
                    <Col sm="12" md="6" className="payment-details mt-3">
                        <h6>Payment Details</h6>
                        <p><strong>Transaction ID:</strong> {order?.paymentDetails?.transactionId}</p>
                        <p><strong>Status:</strong> {order.paymentDetails?.status}</p>
                        <p><strong>Total Amount:</strong> ${order.paymentDetails?.amount}</p>
                        <p><strong>Transaction Date:</strong> {formatCustomTimestamp(order.paymentDetails?.createdAt)}</p>
                    </Col>
                    <Col sm="12" md="6" className="shipping-details mt-3">
                        <h6>Shipping Address</h6>
                        {formatShippingAddress()}
                    </Col>
                </Row>

                {/* Download Invoice Button (Bottom Left Corner) */}
                <div className="text-left mt-3">
                    <button className="btn btn-primary">Download Invoice</button>
                </div>
            </CardBody>
        </Card>
    );
};


const NoOrdersMessage = () => (
    <div className="text-center mt-5">
        <h3>No orders found</h3>
        <p>Start shopping to see your orders here!</p>
    </div>
);

const OrderPage = () => {

    const { user } = useAuth()
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.API_URL}/api/v1/order/get-orders`, getConfig());
                console.log("Orders response", response)
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchOrders();
        }
    }, [user]);

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
                                        <h3>My Orders</h3>
                                        {loading ? (
                                            <div className="text-center mt-5">
                                                <i className="fa fa-spinner fa-spin fa-3x"></i>
                                            </div>
                                        ) : (
                                            <>
                                                {orders?.length > 0 ? (
                                                    orders.map(order => (
                                                        <OrderCard key={order._id} order={order} />
                                                    ))
                                                ) : (
                                                    <NoOrdersMessage />
                                                )}
                                            </>
                                        )}
                                    </Col>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    );
};

export default OrderPage;
