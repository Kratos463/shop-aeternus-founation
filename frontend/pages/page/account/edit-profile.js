import React, { useEffect, useState } from 'react';
import { Container, Row, Form, Input, Label, Col } from 'reactstrap';
import CommonLayout from '../../../components/shop/common-layout';
import { useAuth } from '../../../helpers/auth/AuthContext';
import Dashboard_LeftPart from './common/dashboard_leftpart';

const EditProfilePage = () => {

    const { user, updateUserDetails } = useAuth()
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        newsletter: true
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                email: user.email || '',
                newsletter: user.newsletter || false
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserDetails(formData);
        } catch (error) {
            console.log('Invalid credentials', error);
        }
    };

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
                                        <h3>Edit Profile Details</h3>
                                        <Form className="theme-form" onSubmit={handleSubmit}>
                                            <Row>
                                                <Col md="6">
                                                    <Label className="form-label" for="username">Username</Label>
                                                    <Input type="text" className="form-control" id="username"
                                                        value={formData.username} onChange={handleChange} name='username'
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <Label className="form-label" for="email">Email</Label>
                                                    <Input type="email" className="form-control" id="email"
                                                        value={formData.email} onChange={handleChange} name="email" readOnly
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <Label className="form-label" for="first-name">First Name</Label>
                                                    <Input type="text" className="form-control" id="first-name"
                                                        value={formData.firstName} onChange={handleChange} name='firstName'
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <Label className="form-label" for="last-name">Last Name</Label>
                                                    <Input type="text" className="form-control" id="last-name"
                                                        value={formData.lastName} onChange={handleChange} name="lastName"
                                                    />
                                                </Col>
                                                <Col md="6">
                                                    <Label className="form-label" for="review">Phone number</Label>
                                                    <Input type="text" className="form-control" id="review"
                                                        value={formData.phone} onChange={handleChange} name="phone"
                                                    />
                                                </Col>

                                                <Col md="6">
                                                    <Label className="form-label">Newsletter Subscription</Label>
                                                    <div className="form-check">
                                                        <Input type="checkbox" className="form-control" id="newsletter" name="newsletter"
                                                            checked={formData.newsletter || false}
                                                            onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                                                        />
                                                        <Label className="form-label" for="newsletter">Subscribe</Label>
                                                    </div>
                                                </Col>


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

export default EditProfilePage;