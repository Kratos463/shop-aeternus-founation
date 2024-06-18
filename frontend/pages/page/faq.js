import React, { useState } from "react";
import CommonLayout from "../../components/shop/common-layout";
import {
  Collapse,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";

const faqData = [
  {
    qus: "What is Shop Atrno?",
    ans:
      "Shop Atrno is an online e-commerce platform where you can discover a wide range of products ranging from fashion and accessories to electronics and home essentials.",
  },
  {
    qus: "How can I place an order on Shop Atrno?",
    ans:
      "To place an order on Shop Atrno, simply browse our website, select the items you wish to purchase, add them to your cart, and proceed to checkout. Follow the prompts to enter your shipping details and payment information to complete your order.",
  },
  {
    qus: "Is it safe to shop on Shop Atrno?",
    ans:
      "Yes, shopping on Shop Atrno is safe and secure. We use industry-standard encryption technology to protect your personal information and ensure a secure checkout process",
  },
  {
    qus: "How can I track my order on Shop Atrno?",
    ans:
      "Once your order has been shipped, you will receive a confirmation email with a tracking number. You can use this tracking number to monitor the status of your delivery through our website or the courier's tracking service.",
  },
  {
    qus: "What is Shop Atrno's exchange policy?",
    ans:
      "We have a hassle-free exchange policy. If you are not satisfied with your purchase, you can exchange the item(s) within 5 days of receipt for another item of equal or lesser value. Please ensure the item is in its original condition with tags attached. For more details, please refer to our Returns & Exchanges page.",
  },
  {
    qus: "Does Shop Atrno ship internationally?",
    ans:
      "Yes, we offer international shipping to many countries worldwide. Shipping rates and delivery times may vary depending on your location. You can check if we ship to your country during the checkout process.",
  },
  {
    qus: "How can I contact customer support at Shop Atrno?",
    ans:
      "For any inquiries or assistance, you can reach our customer support team via email at support@shopatrno.com, or through our Contact Us page on the website. We are here to help you with any questions or concerns you may have.",
  },
  {
    qus: "Are there any discounts or promotions available on Shop Atrno?",
    ans:
      "We regularly offer discounts, promotions, and seasonal sales on Shop Atrno. Be sure to subscribe to our newsletter and follow us on social media to stay updated on the latest offers and deals.",
  },
  {
    qus: "How can I stay updated with new arrivals and trends on Shop Atrno?",
    ans:
      "To stay informed about new arrivals, trends, and exclusive offers, you can subscribe to our newsletter. You can also follow us on social media platforms like Instagram and Facebook for daily updates and style inspiration.",
  },
  {
    qus: "How does Shop Atrno handle customer privacy and data security?",
    ans:
      "Protecting your privacy and securing your personal information is our top priority. We adhere to strict data protection regulations and use advanced encryption technology to safeguard your data. For more details, please refer to our Privacy Policy.",
  },
];

const FaqList = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <Card>
      <CardHeader id="headingOne">
        <h5 className="mb-0">
          <button
            className="btn btn-link"
            type="button"
            onClick={toggle}
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            {faq.qus}
          </button>
        </h5>
      </CardHeader>
      <Collapse
        isOpen={isOpen}
        id="collapseOne"
        className="collapse"
        aria-labelledby="headingOne"
        data-parent="#accordionExample"
      >
        <div className="card-body">
          <p>{faq.ans}</p>
        </div>
      </Collapse>
    </Card>
  );
};

const FaqPage = () => {
  return (
    <>
      <CommonLayout parent="home" title="FAQ">
        <section className="faq-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div
                  className="accordion theme-accordion"
                  id="accordionExample"
                >
                  {faqData.map((faq, i) => (
                    <FaqList faq={faq} key={i} />
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </CommonLayout>
    </>
  );
};

export default FaqPage; 
