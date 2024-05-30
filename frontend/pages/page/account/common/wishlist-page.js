import React, { useContext } from "react";
import { Container, Row, Col, Table, Media } from "reactstrap";
import CartContext from "../../../../helpers/cart/index";
import { useRouter } from "next/router";
import Link from "next/link";
import WishlistContext from "../../../../helpers/wishlist";
import { convertPrice } from "../../../../helpers/utils";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";

const WishlistPage = () => {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  
  const { state: selectedCurr } = useContext(CurrencyContext);

  const checkOut = () => {
    router.push("/page/account/checkout");
  };

  return (
    <>
      {wishlistItems?.length >= 0 ? (
        <section className="wishlist-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <Table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">image</th>
                      <th scope="col">product name</th>
                      <th scope="col">price</th>
                      <th scope="col">availability</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  {wishlistItems?.map((item, i) => (
                    <tbody key={i}>
                      <tr>
                        <td>
                          <Link href={`/product-details/` + item.productId}>
                            <Media
                              src={
                                "https://thebrandtadka.com/images_inventory_products/front_images/" + item.image
                              }
                              alt=""
                            />
                          </Link>
                        </td>
                        <td>
                          <a href="#">{item.title}</a>
                          <Row className="mobile-cart-content">
                            <div className="col-xs-3">
                              <p>out of stock</p>
                            </div>
                            <div className="col-xs-3">
                              <h2 className="td-color">$63.00</h2>
                            </div>
                            <div className="col-xs-3">
                              <h2 className="td-color">
                                <a href="#" className="icon me-1">
                                  <i className="fa fa-close"></i>
                                </a>
                                <a href="#" className="cart">
                                  <i className="fa fa-shopping-cart"></i>
                                </a>
                              </h2>
                            </div>
                          </Row>
                        </td>
                        <td>
                          <h2>       {selectedCurr.symbol}
                            {convertPrice(item.price, selectedCurr)}</h2>
                        </td>
                        <td>
                          {/* <p>{item.stock > 0 ? "In Stock" : "out of Stock"}</p> */}
                        </td>
                        <td>
                          <a
                            href={null}
                            className="icon me-3"
                            onClick={() => removeFromWishlist(item)}
                          >
                            <i className="fa fa-times"></i>
                          </a>
                          <a
                            href={null}
                            className="cart"
                            onClick={() => addToCart(item)}
                          >
                            <i className="fa fa-shopping-cart"></i>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </Table>
              </Col>
            </Row>
            <Row className="wishlist-buttons">
              <Col sm="12">
                <Link href={"/"} className="btn btn-solid">
                  continue shopping
                </Link>
                <a href={null} className="btn btn-solid" onClick={checkOut}>
                  check out
                </a>
              </Col>
            </Row>
          </Container>
        </section>
      ) : <section className="cart-section section-b-space">
        <Container>
          <Row>
            <Col sm="12">
              <div>
                <div className="col-sm-12 empty-cart-cls text-center">
                  <Media
                    src={cart}
                    className="img-fluid mb-4 mx-auto"
                    alt=""
                  />
                  <h3>
                    <strong>Your Wishlist is Empty</strong>
                  </h3>
                  <h4>Explore more shortlist some items.</h4>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>}
    </>
  );
};

export default WishlistPage;
