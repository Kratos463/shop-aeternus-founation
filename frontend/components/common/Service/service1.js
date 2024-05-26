import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  svgFreeShipping,
  svgservice,
  svgoffer,
  svgpayment,
} from "../../../services/script";
import MasterServiceContent from "./MasterServiceConternt";

const Data = [
  {
    link: svgFreeShipping,
    title: "free shipping",
    service: " on order above $100",
  },
  {
    link: svgservice,
    title: "24 X 7 service",
    service: "online service for 24 x 7",
  },
  {
    link: svgoffer,
    title: "festival offer",
    service: "new online special offer",
  },
  {
    link: svgpayment,
    title: "payment",
    service: "Secure Payment",
  },
];

const ServiceLayout = ({ sectionClass }) => {
  return (
    <Container>
      <section className={sectionClass}>
        <Row>
          {Data.map((data, index) => {
            return (
              <Col md="3" className="service-block" key={index}>
                <MasterServiceContent
                  link={data.link}
                  title={data.title}
                  service={data.service}
                />
              </Col>
            );
          })}
        </Row>
      </section>
    </Container>
  );
};

export default ServiceLayout;
