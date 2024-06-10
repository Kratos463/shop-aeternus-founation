import React from 'react';
import { Container, Row, Col, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import CommonLayout from '../../../components/shop/common-layout';
import Dashboard_LeftPart from './common/dashboard_leftpart';

const OrderItem = ({ item }) => (
    <ListGroupItem className="d-flex align-items-center">
        <img src={item.image} alt={item.name} className="img-thumbnail" style={{ width: '60px', height: '60px', marginRight: '15px' }} />
        <div>
            <h6>{item.name}</h6>
            <p>${item.price} - Qty: {item.quantity}</p>
        </div>
    </ListGroupItem>
);

const OrderCard = ({ order }) => {
    return (
        <Card className="mb-4">
            <CardBody>
                <h5 className="card-title">Order #{order.id}</h5>
                <p className="card-text">Status: {order.status}</p>
                <p className="card-text">Total: ${order.total}</p>
                <ListGroup flush>
                    {order.items.map(item => (
                        <OrderItem key={item.id} item={item} />
                    ))}
                </ListGroup>
                <div className="mt-3">
                    <p className="mb-1"><strong>Order ID:</strong> {order.id}</p>
                    <p className="mb-1"><strong>Status:</strong> {order.status}</p>
                    <p className="mb-1"><strong>Total Amount:</strong> ${order.total}</p>
                    <p className="mb-1"><strong>Order Date:</strong> {order.date}</p>
                    <p className="mb-1"><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                </div>
            </CardBody>
        </Card>
    );
};

const OrderPage = () => {
    // Dummy order data for demonstration
    const orders = [
        {
            id: 1,
            status: 'Processing',
            total: 50,
            date: '2024-05-01',
            shippingAddress: '123 Main St, Springfield',
            items: [
                { id: 1, name: 'Product 1', price: 10, quantity: 2, image: 'https://via.placeholder.com/60' },
                { id: 2, name: 'Product 2', price: 15, quantity: 1, image: 'https://via.placeholder.com/60' }
            ]
        },
        {
            id: 2,
            status: 'Shipped',
            total: 70,
            date: '2024-05-02',
            shippingAddress: '456 Elm St, Springfield',
            items: [
                { id: 3, name: 'Product 3', price: 20, quantity: 1, image: 'https://via.placeholder.com/60' }
            ]
        },
        {
            id: 3,
            status: 'Delivered',
            total: 90,
            date: '2024-05-03',
            shippingAddress: '789 Oak St, Springfield',
            items: [
                { id: 4, name: 'Product 4', price: 30, quantity: 2, image: 'https://via.placeholder.com/60' }
            ]
        },
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
                                        <h3>My Orders</h3>
                                        {orders.map(order => (
                                            <OrderCard key={order.id} order={order} />
                                        ))}
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
