import React, { Fragment, useContext } from "react";
import Link from "next/link";
import CartContext from "../../../helpers/cart";
import { Media } from "reactstrap";
import { convertPrice } from "../../../helpers/utils";

const CartHeader = ({ item, symbol}) => {
  
  const {removeFromCart} = useContext(CartContext);


  return (
    <Fragment>
      <li>
        <div className="media">
          <Link href={"/product-details/" + item.id}>
              <Media
                src={
                  "https://thebrandtadka.com/images_inventory_products/front_images/" + item.image
                }
                alt=""
              />
          </Link>
          <div className="media-body">
            <Link href={"/product-details/" + item.id}>
              <h6>{item.title}</h6>
            </Link>

            <h4>
              <span>
                {item.quantity} x {symbol.symbol}
                {convertPrice(item.price, symbol)}
              </span>
            </h4>

          </div>
        </div>
        <div className="close-circle">
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={() => removeFromCart(item)}></i>
        </div>
      </li>
    </Fragment>
  );
};

export default CartHeader;
