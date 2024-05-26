import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Form,
  Input,
  Button,
  Collapse,
} from "reactstrap";
import LogoImage from "../../headers/common/logo";
import CopyRight from "./copyright";
import CategoryContext from "../../../helpers/category/CategoryContext";
import FilterContext from "../../../helpers/filter/FilterContext";
import { useRouter } from "next/router";
import { ProductsContext } from "../../../helpers/product/ProductContext";

const MasterFooter = ({
  containerFluid,
  logoName,
  layoutClass,
  footerClass,
  footerLayOut,
  footerSection,
  belowSection,
  belowContainerFluid,
  CopyRightFluid,
  newLatter,
}) => {

  const router = useRouter()
  const { setSelectedCategory, setSelectedCategoryId, selectedFilteredProducts } = useContext(FilterContext)
  const { categoryProduct } = useContext(ProductsContext)
  const { categories } = useContext(CategoryContext)
  const [isOpen, setIsOpen] = useState();
  const [collapse, setCollapse] = useState(0);
  const width = window.innerWidth <= 767;
  useEffect(() => {
    const changeCollapse = () => {
      if (window.innerWidth <= 767) {
        setCollapse(0);
        setIsOpen(false);
      } else setIsOpen(true);
    };

    window.addEventListener("resize", changeCollapse);

    return () => {
      window.removeEventListener("resize", changeCollapse);
    };
  }, []);

  const clickCategory = (category) => {
    router.push(`/shop/left_sidebar?`);
    setSelectedCategory(category.Category);
    setSelectedCategoryId(category.Category_id)
  };

  return (
    <div>
      <footer className={footerClass}>
        {newLatter ? (
          <div className={footerLayOut}>
            <Container fluid={containerFluid ? containerFluid : ""}>
              <section className={footerSection}>
                <Row>
                  <Col lg="6">
                    <div className="subscribe">
                      <div>
                        <h4>KNOW IT ALL FIRST!</h4>
                        <p>
                          Never Miss Anything From Shop Atrno By Signing Up To
                          Our Newsletter.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg="6">
                    <Form className="form-inline subscribe-form">
                      <div className="mx-sm-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button type="submit" className="btn btn-solid">
                        subscribe
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </section>
            </Container>
          </div>
        ) : (
          ""
        )}

        <section className={belowSection}>
          <Container fluid={belowContainerFluid ? belowContainerFluid : ""}>
            <Row className="footer-theme partition-f">
              <Col lg="4" md="6">
                <div
                  className={`footer-title ${isOpen && collapse == 1 ? "active" : ""
                    } footer-mobile-title`}>
                  <h4
                    onClick={() => {
                      setCollapse(1);
                      setIsOpen(!isOpen);
                    }}>
                    about
                    <span className="according-menu"></span>
                  </h4>
                </div>
                <Collapse
                  isOpen={width ? (collapse === 1 ? isOpen : false) : true}>
                  <div className="footer-contant">
                    <div className="footer-logo">
                      <LogoImage logo={logoName} />
                    </div>
                    <p>
                      Elevate your shopping experience with our carefully
                      curated selection of premium products, designed to
                      enhance every aspect of your life. From fashion to home
                      essentials, find everything you need to indulge in luxury
                      and style. Explore now and redefine your shopping journey with us!
                    </p>
                    <div className="footer-social">
                      <ul>
                        <li>
                          <a href="https://www.facebook.com/profile.php?id=61556123022506&mibextid=ZbWKwL" target="_blank">
                            <i
                              className="fa fa-facebook"
                              aria-hidden="true"></i>
                          </a>
                        </li>
                        <li>
                          <a href="support@shopatrno.com" target="_blank">
                            <i
                              className="fa fa-envelope"
                              aria-hidden="true"></i>
                          </a>
                        </li>
                        <li>
                          <a href="https://www.instagram.com/shopatrno?igsh=MTgwcmVkbTJlOWp3ZA==" target="_blank">
                            <i
                              className="fa fa-instagram"
                              aria-hidden="true"></i>
                          </a>
                        </li>

                      </ul>
                    </div>
                  </div>
                </Collapse>
              </Col>
              <Col className="offset-xl-1">
                <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 2 ? "active" : ""
                      } `}>
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(2);
                        } else setIsOpen(true);
                      }}>
                      online shopping
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 2 ? isOpen : false) : true}>
                    <div className="footer-contant">
                      <ul>
                        {categories?.map((categorie) => {
                          return <li key={categorie.Category_id}>
                            <Link href={`/shop/left_sidebar`} onClick={() => clickCategory(categorie)}>
                              {categorie.Category}
                            </Link>
                          </li>
                        })}
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
              <Col>
                <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 3 ? "active" : ""
                      } `}>
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(3);
                        } else setIsOpen(true);
                      }}>
                      Customer Policies
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 3 ? isOpen : false) : true}>
                    <div className="footer-contant">
                      <ul>
                        <li>
                          <a href="#">About Us</a>
                        </li>
                        <li>
                          <a href="#">Contact Us</a>
                        </li>
                        <li>
                          <a href="#">FAQ</a>
                        </li>
                        <li>
                          <a href="#">Privacy Policy</a>
                        </li>
                        <li>
                          <a href="#">Term & Condition</a>
                        </li>
                        <li>
                          <a href="#">shipping & return</a>
                        </li>
                        <li>
                          <a href="#">Cancel & Refund</a>
                        </li>

                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
              <Col>
                <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 4 ? "active" : ""
                      } `}>
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(4);
                        } else setIsOpen(true);
                      }}>
                      store information
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 4 ? isOpen : false) : true}>
                    <div className="footer-contant">
                      <ul className="contact-list">
                        <li>
                          <i className="fa fa-map-marker"></i>Address: 108 W. 13th Street,
                          Suite 100, Wilmington, DE 19801
                        </li>
                        <li>
                          <i className="fa fa-phone"></i>Support: 882-436-9749
                        </li>
                        <li>
                          <i className="fa fa-envelope-o"></i>Email Us: <span style={{ textTransform: "lowercase" }}>support@shopatrno.com</span>
                        </li>
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <CopyRight
          layout={layoutClass}
          fluid={CopyRightFluid ? CopyRightFluid : ""}
        />
      </footer>
    </div>
  );
};
export default MasterFooter;
