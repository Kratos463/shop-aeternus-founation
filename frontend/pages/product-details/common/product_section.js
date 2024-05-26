import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Media } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import { useRouter } from "next/router";
import axios from "axios";
import { ProductsContext } from "../../../helpers/product/ProductContext";
import { convertPrice, truncateTitle } from "../../../helpers/utils";
import WishlistContext from "../../../helpers/wishlist";
import PostLoader from "../../../components/common/PostLoader";


const ProductSection = ({ pathId }) => {
  const router = useRouter();
  const wishlistContext = useContext(WishlistContext);
  const { state: selectedCurr } = useContext(CurrencyContext);
  const cartCtx = useContext(CartContext);
  const addToCart = cartCtx.addToCart;
  const quantity = cartCtx.quantity;

  const { products, loading, productReviews, fetchProductReviews } = useContext(ProductsContext);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  // Extract product ID from URL
  const id = router.query.id;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/getProductDetails?productId=${id}`);
        if (response.data.Records) {
          if (Array.isArray(response.data.Records)) {
            setProductDetails(response.data.Records[0]);
          } else {
            setProductDetails([response.data.Records[0]]);
          }
        } else {
          setProductDetails([]);
        }
      } catch (error) {
        console.log("Error while fetching product details:", error);
      }
    };
    fetchProductDetails();
    
  }, [id]);        


  useEffect(() => {
    // Filter related products based on the category ID of the fetched product
    if (productDetails && productDetails.Category_id && products) {
      const filteredProducts = products.filter(product => product.Category_id === productDetails.Category_id);
      setRelatedProducts(filteredProducts);
    }
  }, [productDetails, products]);

  const clickProductDetail = (product) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`/product-details/${product.Product_id}`, undefined, { shallow: true });
  };

  return (
    <section className="section-b-space ratio_asos">
      <Container>
        <Row>
          <Col className="product-related">
            <h2>Related Products</h2>
          </Col>
        </Row>
        <Row className="search-product">
          {!relatedProducts ||
            relatedProducts.length === 0 ||
            loading ? (
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
            <>
              {relatedProducts.map((product, index) => (
                <Col xl="2" md="4" sm="6" key={index}>
                  <div className="product-box"
                    onClick={() => clickProductDetail(product)}
                  >
                    <div className="img-wrapper">
                      <div className="front">
                        <div>
                          <Media
                            onClick={() => clickProductDetail(product)}
                            src={`https://thebrandtadka.com/images_inventory_products/front_images/${product.Product_image}`}
                            className="img-fluid blur-up lazyload bg-img"
                            alt={product.title}
                          />
                        </div>
                      </div>
                      <div className="cart-info cart-wrap">
                        {/* for adding to cart */}
                        <button
                          data-toggle="modal"
                          data-target="#addtocart"
                          title="Add to cart"
                          onClick={() => addToCart(product, quantity)}
                        >
                          <i className="fa fa-shopping-cart"></i>
                        </button>
                        {/* for adding in wishlist */}
                        <a
                          href="#"
                          onClick={() => wishlistContext.addToWish(product)}
                          title="Add to Wishlist"
                        >
                          <i className="fa fa-heart" aria-hidden="true"></i>
                        </a>
                      </div>
                    </div>
                    <div className="product-detail">
                      <div className="rating">
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>
                      </div>
                      <a onClick={() => clickProductDetail(product)}>
                        <h6>{truncateTitle(product.Title, 20)}</h6>
                      </a>
                      <h4>
                        {selectedCurr.symbol}
                        {convertPrice(parseInt(product.Price), selectedCurr)}.00
                      </h4>
                    </div>
                  </div>
                </Col>
              ))}
            </>
          )}
        </Row>
      </Container>
    </section >
  );
};

export default ProductSection;
