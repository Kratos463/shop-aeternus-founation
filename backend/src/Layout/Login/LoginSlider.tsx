import Image from "next/image";
import Slider from "react-slick";
import { Card, Col } from "reactstrap";
import stats from "../../../public/assets/images/logo/shop-atrno.png";

const LoginSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
  };
  return (
    <Col md="5" className="p-0 card-left">
      <Card className="bg-primary">
        <div className="svg-icon">
          <Image height={78} width={78} alt="" src={stats} className="Img-fluid" />
        </div>
        <Slider className="single-item" {...settings}>
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div>
                <h3>Welcome to Shop Atrno</h3>
                <p>
                  Elevate your shopping experience with our carefully curated selection of premium products,
                  designed to enhance every aspect of your life!
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </Card>
    </Col>
  );
};

export default LoginSlider;
