import React, { useContext, Fragment, useEffect, useState } from "react";
import Link from "next/link";
import CartHeader from "../headers/common/cart-header";
import CartContext from "../../helpers/cart";
import { Media } from "reactstrap";
import { CurrencyContext } from "../../helpers/Currency/CurrencyContext";
import { convertPrice } from "../../helpers/utils";
import { useAuth } from "../../helpers/auth/AuthContext";

const CartContainer = ({ icon }) => {
  const context = useContext(CartContext);
  const { state: selectedCurr } = useContext(CurrencyContext);
  const cart = context.cart;
  const user = useAuth();

  const [cartList, setCartList] = useState([]);

  useEffect(() => {
   
    if (user.user) {
      
      // Fetch cart contents only if user exists
      setCartList(context.state);
    } else {
      // If user does not exist, set cart contents to an empty array
      setCartList([]);
    }
  }, [user, context.state]);


  return (
    <Fragment>
      {user.user ? (
        <li className="onhover-div mobile-cart">
          <div className="cart-qty-cls">{cart?.itemsQuantity ? cart?.itemsQuantity : 0}</div>
          <Link href={`/page/account/cart`}>
            <div href={null}>
              <Media src={icon} className="img-fluid" alt="" />
              <i className="fa fa-shopping-cart"></i>
            </div>
          </Link>
          <ul className="show-div shopping-cart">
            {cart?.items?.map((item, index) => (
              <CartHeader key={index} item={item} total={cart.total} symbol={selectedCurr} />
            ))}
            {cart?.items?.length > 0 ? (
              <div>
                <li>
                  <div className="total">
                    <h5>
                      subtotal :{" "}
                      <span>
                        {selectedCurr.symbol} {convertPrice(cart.total, selectedCurr)}{" "}
                      </span>
                    </h5>
                  </div>
                </li>
                <li>
                  <div className="buttons view-cart">
                    <Link href={`/page/account/cart`}>view cart</Link>
                    <Link href={`/page/account/checkout`} className="checkout">checkout</Link>
                  </div>
                </li>
              </div>
            ) : (
              <li>
                <h5>Your cart is currently empty.</h5>
              </li>
            )}
          </ul>
        </li>
      ) : <li className="onhover-div mobile-cart">
      <div className="cart-qty-cls">{0}</div>
      <Link href={`/page/account/cart`}>
        <div href={null}>
          <Media src={icon} className="img-fluid" alt="" />
          <i className="fa fa-shopping-cart"></i>
        </div>
      </Link>
      <ul className="show-div shopping-cart">
        {cart?.items?.map((item, index) => (
          <CartHeader key={index} item={item} total={cart.total} symbol={selectedCurr} />
        ))}
        {cart?.items?.length > 0 ? (
          <div>
            <li>
              <div className="total">
                <h5>
                  subtotal :{" "}
                  <span>
                    {selectedCurr.symbol} {convertPrice(cart.total, selectedCurr)}{" "}
                  </span>
                </h5>
              </div>
            </li>
            <li>
              <div className="buttons view-cart">
                <Link href={`/page/account/cart`}>view cart</Link>
                <Link href={`/page/account/checkout`} className="checkout">checkout</Link>
              </div>
            </li>
          </div>
        ) : (
          <li>
            <h5>Your cart is currently empty.</h5>
          </li>
        )}
      </ul>
    </li>}
    </Fragment>
  );
};

export default CartContainer;
