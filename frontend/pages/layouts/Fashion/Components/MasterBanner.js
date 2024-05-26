import Link from "next/link";
import { Col, Container, Media, Row } from "reactstrap";

const MasterBanner = ({ img, title, desc, link, classes, btn, btnClass }) => {
  return (
      <div className={`home ${classes ? classes : "text-center"}`}>
        <Media src={img}/>
        <Container>
          <Row>
            <Col>
              <div className="slider-contain">
                <div>
                  <h4>{title}</h4>
                  <h1>{desc}</h1>
                  <Link
                    href={link}
                    className={`btn ${btnClass ? btnClass : "btn-solid"}`}>
                    {/* <a > */}
                    {btn ? btn : "Shop Now"} {/* </a> */}
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
  );
};

export default MasterBanner;
