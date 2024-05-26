import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";

const RateAndReviewForm = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");

    const handleStarClick = (rate) => {
        setRating(rate);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your form submission logic here
        
    };

    return (
        <section className="register-page" style={{ padding: "20px 0px" }}>
            <Container>
                <Row>
                    <Col md="6">
                        <div className="dashboard-right">
                            <Col sm="12">
                                <h4>Rate and Review Product</h4>
                                <Form className="theme-form" onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md="12">
                                            <Label className="form-label" for="rating">Rating</Label>
                                            <div>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i
                                                        key={star}
                                                        className={`fa fa-star${star <= (hoverRating || rating) ? "" : "-o"}`}
                                                        onClick={() => handleStarClick(star)}
                                                        style={{ cursor: "pointer", fontSize: "2rem", color: star <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9" }}
                                                    ></i>
                                                ))}
                                            </div>
                                        </Col>

                                        <Col md="12">
                                            <Label className="form-label" for="review">Review</Label>
                                            <Input
                                                className="form-control"
                                                type="textarea"
                                                name="review"
                                                id="review"
                                                value={review}
                                                onChange={handleReviewChange}
                                                rows="5"

                                            />
                                        </Col>

                                    </Row>

                                    <div className="col-md-12">
                                        <button className="btn btn-sm btn-solid" type="submit">Submit</button>
                                    </div>
                                </Form>
                            </Col>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default RateAndReviewForm;
