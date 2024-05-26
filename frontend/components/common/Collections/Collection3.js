import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import ProductItems from "../product-box/ProductBox1";
import { Row, Col, Container } from "reactstrap";
import CartContext from "../../../helpers/cart";
import PostLoader from "../PostLoader";
import axios from "axios";
import WishlistContext from "../../../helpers/wishlist";

const TopCollection = ({ type, title, subtitle, designClass, noSlider, cartClass, productSlider, titleClass, noTitle, innerClass, inner, backImage }) => {
  const context = useContext(CartContext);
  const contextWishlist = useContext(WishlistContext);
  const quantity = context.quantity;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/getFrontProductsList');
        if (response.data.Records) {
          if (Array.isArray(response.data.Records)) {
            setProducts(response.data.Records);
          } else {
            setProducts([response.data.Records]);
          }
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className={designClass}>
      {noSlider ? (
        <Container>
          <Row>
            <Col>
              {noTitle === "null" ? (
                ""
              ) : (
                <div className={innerClass}>
                  {subtitle ? <h4>{subtitle}</h4> : ""}
                  <h2 className={inner}>{title}</h2>
                  {titleClass ? (
                    <hr role="tournament6" />
                  ) : (
                    <div className="line">
                      <span></span>
                    </div>
                  )}
                </div>
              )}

              {loading ? (
                <div className="row mx-0 margin-default">
                  <div className="col-xl-3 col-lg-4 col-6">
                    <PostLoader />
                  </div>
                  <div className="col-xl-3 col-lg-4 col-6">
                    <PostLoader />
                  </div>
                  <div className="col-xl-3 col-lg-4 col-6">
                    <PostLoader />
                  </div>
                  <div className="col-xl-3 col-lg-4 col-6">
                    <PostLoader />
                  </div>
                </div>
              ) : (
                <Slider {...productSlider} className="product-m no-arrow">
                  {products?.map((product, i) => (
                    <div key={i}>
                      <ProductItems product={product} title={title} addWishlist={() => contextWishlist.addToWish(product)} addCart={() => context.addToCart(product, quantity)} cartClass={cartClass} backImage={backImage} />
                    </div>
                  ))}
                </Slider>
              )}
            </Col>
          </Row>
        </Container>
      ) : (
        <>
          {title ? (
            <div className="title1 title-gradient  section-t-space">
              <h4>{subtitle}</h4>
              <h2 className="title-inner1">{title}</h2>
              <hr role="tournament6" />
            </div>
          ) : (
            ""
          )}
          <Container>
            <Row className="margin-default">
              {!products || products.length === 0 || loading ? (
                <div className="row margin-default">
                  <div className="col-xl-3 col-lg-4 col-6">
                    <PostLoader />
                  </div>
                  <div className="col-xl-3 col-lg-4 col-6">
                    <PostLoader />
                  </div>
                  <div className="col-xl-3 col-lg-4 col-6">
                    <PostLoader />
                  </div>
                  <div className="col-xl-3 col-lg-4 col-6">
                    <PostLoader />
                  </div>
                </div>
              ) : (
                products.slice(0, 12).map((product, index) => (
                  <Col xl="3" sm="6" key={index}>
                    <div>
                      <ProductItems product={product} backImage={backImage} addWishlist={() => contextWishlist.addToWish(product)} title={title} cartClass={cartClass} addCart={() => context.addToCart(product, quantity)} key={index} />
                    </div>
                  </Col>
                ))
              )}
            </Row>
          </Container>
        </>
      )}
    </section>
  );
};

export default TopCollection;
