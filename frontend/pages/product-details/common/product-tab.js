import React, { useState } from "react";
import { Container, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import RateAndReviewForm from "./review-form";
import Review from "../../page/review";

const ProductTab = ({ product, productReviews }) => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <section className="tab-product m-0">
      <Container>
        <Row>
          <Col sm="12" lg="12">
            <Row className="product-page-main m-0">
              <Nav tabs className="nav-material">
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                  <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => setActiveTab("1")}>
                    Description
                  </NavLink>
                </NavItem>
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                </NavItem>
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                  <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => setActiveTab("2")}>
                    Ratings & Reviews
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab} className="nav-material">
                <TabPane tabId="1">
                  <p className="mb-0 pb-0" dangerouslySetInnerHTML={{ __html: (product?.Description) }}></p>
                </TabPane>
                <TabPane tabId="2">
                  {/* <RateAndReviewForm /> */}
                  <Review productReviews={productReviews} />
                </TabPane>
              </TabContent>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductTab;
