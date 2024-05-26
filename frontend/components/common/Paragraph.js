import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Paragraph = ({heading, category, title, inner, line ,hrClass, desc}) => {
    return (
        <>
            <div className={title}>
                <h4>{heading ? heading : "special offer"}</h4>
                <h2 className={inner}>{category ? category : "top collection"}</h2>
                {
                    line ?
                        <div className="line"></div> : 
                    hrClass ?
                        <hr role="tournament6"></hr>
                    : ''
                }
            </div>
            <Container>
                <Row>
                    <Col lg="6" className="m-auto">
                        <div className="product-para">
                            <p className="text-center">{desc}</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Paragraph;