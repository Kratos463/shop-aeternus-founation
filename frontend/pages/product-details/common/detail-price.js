import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Input } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import MasterSocial from "./master_social";
import { calculateBusinessVolume, convertPrice, getConfig } from "../../../helpers/utils";
import { useAuth } from "../../../helpers/auth/AuthContext";
import WishlistContext from "../../../helpers/wishlist";
import axios from "axios";

const DetailsWithPrice = ({ colors, item, stickyClass, sizes }) => {
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { state: selectedCurr } = useContext(CurrencyContext);
  const product = item;
  const productPrice = parseFloat(product.Price);
  const offerPrice = discount ? parseFloat((productPrice - (productPrice * discount / 100)).toFixed(2)) : productPrice.toFixed(2);
  const convertedOfferPrice = parseFloat(convertPrice(offerPrice, selectedCurr).toFixed(2));
  const businessVolume = calculateBusinessVolume(convertedOfferPrice).toFixed(2);

  useEffect(() => {
    async function fetchDiscount() {
      try {
        const response = await axios.get(`${process.env.API_URL}/api/v1/discount/get-discount/${Math.floor(productPrice)}`, getConfig());
        setDiscount(response.data.discount.discountPercentage);
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    }
    fetchDiscount();
  }, [productPrice]);

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

  const handleAddToCart = () => {
    if (user) {
      const businessVolumeNumber = parseFloat(businessVolume);
      addToCart(product, quantity, businessVolumeNumber, colors[0], sizes[0], convertedOfferPrice, discount);
    } else {
      router.push("/page/account/login");
    }
  };

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
            {convertPrice(productPrice, selectedCurr).toFixed(2)}
          </del>
          <span>{discount}% off</span>
        </h4>
        <h3 className="f-price">
          Offer Price: {selectedCurr.symbol} {convertedOfferPrice}
        </h3>
        {user?.mfvUser && (
          <h3 className="bv">
            BV: <span>{selectedCurr.symbol}{businessVolume}</span>
          </h3>
        )}

        {product.Extra_amount !== "0.00" && (
          <h4 className="extra-charge">
            Handling Charge: {selectedCurr.symbol}{convertPrice(parseFloat(product.Extra_amount), selectedCurr).toFixed(2)}
          </h4>
        )}


        <div className="product-description border-product">

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
          <span className="instock-cls">{stock}</span>
          <h6 className="product-title">quantity</h6>
          {
            parseInt(product?.Stock_qty) > 0 && (
              <>
                <div className="qty-box mb-3">
                  <div className="input-group">
                    <span className="input-group-prepend">
                      <button type="button" className="btn quantity-left-minus" onClick={minusQty} data-type="minus" data-field="">
                        <i className="fa fa-angle-left"></i>
                      </button>
                    </span>
                    <Input type="number" name="quantity" value={quantity} onChange={changeQty} className="form-control input-number" readOnly />
                    <span className="input-group-prepend">
                      <button type="button" className="btn quantity-right-plus" onClick={() => plusQty(product)} data-type="plus" data-field="">
                        <i className="fa fa-angle-right"></i>
                      </button>
                    </span>
                  </div>
                </div>
                <div className="product-buttons">
                  <button onClick={handleAddToWishlist} className="btn btn-solid">
                    Add to Wishlist
                  </button>
                  <button onClick={handleAddToCart} className="btn btn-solid">
                    Add to Cart
                  </button>
                </div>
              </>
            )
          }

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
