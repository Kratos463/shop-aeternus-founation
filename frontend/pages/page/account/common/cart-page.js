import React, { useState, useContext } from "react";
import Link from "next/link";
import CartContext from "../../../../helpers/cart";
import { Container, Row, Col, Media, Button } from "reactstrap";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import { convertPrice } from "../../../../helpers/utils";


const CartPage = () => {

  const { cart, removeFromCart, updateQty } = useContext(CartContext)
  const { state: selectedCurr } = useContext(CurrencyContext);
  const [quantityError, setQuantityError] = useState(false);

  const handleQtyUpdate = (item, quantity) => {
    if (quantity >= 1) {
      setQuantityError(false);
      updateQty(item, quantity);
    } else {
      setQuantityError(true);
    }
  };

  return (
    <div>
      {cart && cart?.items?.length > 0 ? (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">image</th>
                      <th scope="col">product name</th>
                      <th scope="col">price</th>
                      <th scope="col">quantity</th>
                      <th scope="col">total</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  {cart.items.reverse().map((item, index) => {
                    return (
                      <tbody key={item.productId}>
                        <tr>
                          <td>
                            <Link href={`/product-details/` + item.productId}>
                              <Media
                                src={
                                  "https://thebrandtadka.com/images_inventory_products/front_images/" + item.image
                                }
                                alt=""
                                style={{ width: '80px', height: '80px' }}
                              />
                            </Link>
                          </td>
                          <td>
                            <Link href={`/product-details/` + item.productId}>
                              {item.title}
                            </Link>
                            <div className="mobile-cart-content row">
                              <div className="col-xs-3">
                                <div className="qty-box">
                                  <div className="input-group">
                                    <input
                                      type="number"
                                      name="quantity"
                                      onChange={(e) =>
                                        handleQtyUpdate(item, e.target.value)
                                      }
                                      className="form-control input-number"
                                      defaultValue={item.quantity}
                                      style={{
                                        borderColor: quantityError && "red",
                                      }}
                                    />
                                  </div>
                                </div>
                                {/* {item.quantity >= item.stock ? "out of Stock" : ""} */}
                              </div>
                              <div className="col-xs-3">
                                <h2 className="td-color">
                                  {selectedCurr.symbol}
                                  {convertPrice(item.price, selectedCurr)}
                                </h2>
                              </div>
                              <div className="col-xs-3">
                                <h2 style={{color:'black'}}>

                                <i
                                    className="fa fa-times"
                                    onClick={() => removeFromCart(item)}></i>
                                </h2>
                              </div>
                            </div>
                          </td>
                          <td>
                            <h2>
                              {selectedCurr.symbol}
                              {convertPrice(item.price, selectedCurr)}
                            </h2>
                          </td>
                          <td>
                            <div className="qty-box">
                              <div className="input-group">
                                <input
                                  type="number"
                                  name="quantity"
                                  onChange={(e) =>
                                    handleQtyUpdate(item, e.target.value)
                                  }
                                  className="form-control input-number"
                                  defaultValue={item.quantity}
                                  style={{
                                    borderColor: quantityError && "red",
                                  }}
                                />
                              </div>
                            </div>
                            {/* {item.qty >= item.stock ? "out of Stock" : ""} */}
                          </td>

                          <td>
                            <h2 className="td-color">
                              {selectedCurr.symbol}
                              {convertPrice((item.quantity * item.price), selectedCurr)}

                            </h2>
                          </td>
                          <td>

                            <Button onClick={() => removeFromCart(item)} color="danger" outline>
                              Remove
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
                <table className="table cart-table table-responsive-md">
                  <tfoot>
                    <tr>
                      <td>total price :</td>
                      <td>
                        <h2>
                          {selectedCurr.symbol} {convertPrice(cart.total, selectedCurr)}{" "}
                        </h2>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Col>
            </Row>
            <Row className="cart-buttons">
              <Col xs="6">
                <Link href={`/`} className="btn btn-solid">
                  continue shopping
                </Link>
              </Col>
              <Col xs="6">
                <Link href={`/page/account/checkout`} className="btn btn-solid">
                  check out
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="cart-section section-b-space">
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
                      <strong>Your Cart is Empty</strong>
                    </h3>
                    <h4>Explore more shortlist some items.</h4>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default CartPage;
