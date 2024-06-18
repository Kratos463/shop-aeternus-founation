import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col, Media } from "reactstrap";
import aboutus from "../../public/assets/images/about/about_us.jpeg";
import mission from "../../public/assets/images/about/mission.jpeg";
import vision from "../../public/assets/images/about/vision.jpeg";
import ServiceLayout from "../../components/common/Service/service1.js";


const AboutUs = () => {
  return (
    <>
      <CommonLayout parent="home" title="About-us">
        {/* // <!-- about section start --> */}
        <section className="about-page section-b-space">
          <Container>
            <Row>
              <Col lg="12">
                <div className="banner-section">
                  <Media src={aboutus.src} className="img-fluid blur-up lazyload" alt="" />
                </div>
              </Col>
              <Col sm="12">
                <h4>Aeternus Foundation Corporation: Pioneering a Brighter Future for All</h4>
                <p>
                  At Aeternus Foundation Corporation, our paramount mission is to enhance the
                  life experience for every individual. Our foundation is supported by a team of
                  seasoned professionals who bring over two decades of expertise in business and
                  development. With a clear vision for the future, we aspire to positively impact
                  billions of lives, guiding them towards happiness and success through our
                  innovative initiatives.
                </p>
                < br />
                <p>
                  In the past, we have been fortunate to deliver exceptional results to our clients and business partners. Our success is driven by our innovative tactics, groundbreaking concepts, and seamless execution. We are unwavering in our commitment to continuous improvement, both in ourselves and our technologies, ensuring that everyone we connect with benefits from our advancements.
                </p>
                < br />
                <p>
                  The Aeternus Foundation Corporation Group is excited to embark on this new project, confident in our ability to foster a brighter, more prosperous future for all.
                </p>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <div className="banner-section">
                  <Media src={mission.src} className="img-fluid blur-up lazyload" alt="" />
                </div>
              </Col>
              <Col sm="12">
                <h4>Our Mission: Enhancing Lives in the Present</h4>
                <p>
                  At Aeternus Foundation Corporation, our mission is to create a positive and lasting impact on the lives of every individual today. We believe in the power of the present moment and are dedicated to implementing strategies and solutions that improve quality of life right now.
                </p>
                < br />
                <ul>
                  <li>
                    <strong>
                      Innovative Solutions:
                    </strong> Continuously developing and integrating cutting-edge technologies that address current challenges and enhance daily living.
                  </li>
                  <li>
                    <strong>
                      Personalized Support:
                    </strong> Providing tailored services and support to meet the unique needs of each person we serve, ensuring that everyone experiences tangible improvements in their life.
                  </li>
                  <li>
                    <strong>
                      Community Engagement:
                    </strong> Actively engaging with communities to understand their specific needs and collaborating with local partners to deliver impactful solutions.
                  </li>
                  <li>
                    <strong>
                      Holistic Development:
                    </strong> Focusing on the overall well-being of individuals by addressing physical, emotional, social, and economic aspects of life.
                  </li>
                </ul>
                < br />
                <p>We are passionate about making a difference today, creating a foundation for a happier, healthier, and more successful future for all. By striving towards our goal of improving lives in the present, we lay the groundwork for enduring positive change.</p>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <div className="banner-section">
                  <Media src={vision.src} className="img-fluid blur-up lazyload" alt="" />
                </div>
              </Col>
              <Col sm="12">
                <h4>Vision: Empowering Billions for a Brighter Future</h4>
                <p>
                  At Aeternus Foundation Corporation, our vision is rooted in empowering billions of individuals worldwide, leading them towards a future filled with promise and prosperity. We aspire to make a significant and lasting impact on the lives of people from all walks of life, enhancing their opportunities and quality of life through innovative initiatives and sustainable practices.
                </p>
                < br />
                <p>
                  Through our unwavering commitment to progress and development, we aim to foster a global community where every individual has the resources and support they need to thrive. By leveraging advanced technologies and forging meaningful partnerships, we seek to create solutions that address pressing societal challenges while promoting inclusivity and sustainability.
                </p>

              </Col>
            </Row>
            <h3>"Empowering billions today for a brighter tomorrow through innovation and inclusive growth at Aeternus Foundation Corporation."</h3>
          </Container>
        </section>


        <div className="section-b-space">
          <ServiceLayout sectionClass={"service border-section small-section"} />
        </div>
      </CommonLayout>
    </>
  );
};

export default AboutUs;
