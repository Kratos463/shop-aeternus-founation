import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import sizeChart from "../../../public/assets/images/size-chart.jpg";
import { Modal, ModalBody, ModalHeader, Media, Input } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import CountdownComponent from "../../../components/common/widgets/countdownComponent";
import MasterSocial from "./master_social";
import { calculateBusinessVolume, convertPrice } from "../../../helpers/utils";
import { useAuth } from "../../../helpers/auth/AuthContext";
import WishlistContext from "../../../helpers/wishlist";

const DetailsWithPrice = ({ colors, item, stickyClass, sizes, changeColorVar }) => {
  const [modal, setModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext)
  const { state: selectedCurr } = useContext(CurrencyContext);
  const toggle = () => setModal(!modal);
  const product = item;
  const uniqueSize = [];
  const productPrice = convertPrice(product.Price, selectedCurr);
  const businessVolume = calculateBusinessVolume(product.Price);


  const changeQty = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const minusQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const plusQty = (item) => {
    if (parseInt(item?.Stock_qty) >= quantity) {
      setQuantity(quantity + 1);
    }
  };

  const stock = parseInt(product?.Stock_qty) > 0 ? "In Stock" : "Out of Stock";

  // handle function for add product into cart
  const handleAddToCart = () => {
    if (user) {
      addToCart(product, quantity, businessVolume, colors[0], sizes[0]);
    } else {
      router.push("/page/account/login");
    }
  };

  // handle function for add product to wishlist
  const handleAddToWishlist = () => {
    if (user) {
      addToWishlist(product, colors[0], sizes[0]);
    } else {
      router.push("/page/account/login");
    }
  };

  return (
    <>
      <div className={`product-right ${stickyClass}`}>
        <h2> {product.Title} </h2>
        <h4>
          <del>MRP {selectedCurr.symbol}
            {convertPrice(parseInt(product.Price), selectedCurr)}.00
          </del>
          <span>{product.discount}% off</span>
        </h4>
        <h3>
          Offer Price: {selectedCurr.symbol} {convertPrice(parseInt(product.Price), selectedCurr)}.00
        </h3>
        {user?.mfvUser && (
          <h3 className="bv">
            Business Volume: <span>{selectedCurr.symbol}{calculateBusinessVolume(productPrice).toFixed(2)}</span>
          </h3>
        )}

        <div className="product-description border-product">

          {/* Color Dropdown */}
          <div className="product-colors-sizes">
            {colors && colors.length > 0 && (
              <div className="colors">
                <h6 className="product-title">Colors</h6>
                <select className="product-size-input form-control">
                  {colors.map((color, index) => (
                    <option key={index} value={color}>
                      {color.Color_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Size Dropdown */}
            {sizes && sizes.length > 0 && (
              <div className="sizes">
                <h6 className="product-title">Sizes</h6>
                <select className="product-size-input form-control">
                  {sizes.map((size, index) => (
                    <option key={index} value={size}>
                      {size.Size_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {product.variants ? (
            <div>
              {uniqueSize.some((size) => size) ? (
                <>
                  <h6 className="product-title size-text">
                    select size
                    <span>
                      <a href={null} data-toggle="modal" data-target="#sizemodal" onClick={toggle}>
                        size chart
                      </a>
                    </span>
                  </h6>
                  <Modal isOpen={modal} toggle={toggle} centered>
                    <ModalHeader toggle={toggle}>Sheer Straight Kurta</ModalHeader>
                    <ModalBody>
                      <Media src={sizeChart.src} alt="size" className="img-fluid" />
                    </ModalBody>
                  </Modal>
                  <div className="size-box">
                    <ul>
                      {uniqueSize.map((data, i) => {
                        return (
                          <li key={i}>
                            <a href={null}>{data}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          <span className="instock-cls">{stock}</span>
          <h6 className="product-title">quantity</h6>
          <div className="qty-box">
            <div className="input-group">
              <span className="input-group-prepend">
                <button type="button" className="btn quantity-left-minus" onClick={minusQty} data-type="minus" data-field="">
                  <i className="fa fa-angle-left"></i>
                </button>
              </span>
              <Input type="number" name="quantity" value={quantity} onChange={changeQty} className="form-control input-number" readOnly/>
              <span className="input-group-prepend">
                <button type="button" className="btn quantity-right-plus" onClick={() => plusQty(product)} data-type="plus" data-field="">
                  <i className="fa fa-angle-right"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="product-buttons">

          {/* Buy now Button */}
          <button onClick={handleAddToWishlist} className="btn btn-solid">
            Add to Wishlist
          </button>

          {/* Add to cart Button */}
          <button onClick={handleAddToCart} className="btn btn-solid">
            Add to Cart
          </button>

        </div>
        <div className="border-product">
          <h6 className="product-title">share it</h6>
          <div className="product-icon">
            <MasterSocial />
          </div>
        </div>

      </div>
    </>
  );
};

export default DetailsWithPrice;
