import React, { Fragment } from 'react';
import { Container ,Row ,Col ,Media} from 'reactstrap';

const CopyRight = ({layout, fluid}) => {
    return (
        <Fragment>
            <div className={`sub-footer ${layout}`}>
                <Container fluid={fluid}>
                    <Row>
                        <Col xl="12" md="12" sm="12">
                            <div className="footer-end">
                                <p><i className="fa fa-copyright" aria-hidden="true"></i>2024-25 Shop Atrno. All Rights Reserved.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Fragment>
    )
}

export default CopyRight;