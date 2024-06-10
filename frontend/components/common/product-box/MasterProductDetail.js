import React, { useContext, useState, useEffect } from "react";
import { calculateBusinessVolume, convertPrice, getConfig, truncateTitle } from "../../../helpers/utils";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import { useAuth } from "../../../helpers/auth/AuthContext";
import axios from "axios";

const MasterProductDetail = ({
  product,
  productDetail,
  detailClass,
  title,
}) => {
  let RatingStars = [];
  let rating = 5;
  for (var i = 0; i < rating; i++) {
    RatingStars.push(<i className="fa fa-star" key={i}></i>);
  }

  const { user } = useAuth();
  const { state: selectedCurr } = useContext(CurrencyContext);
  const [discount, setDiscount] = useState(null);
  const offerPrice = discount ? Math.floor((product.Price - (product.Price * discount / 100)) / 100) * 100 : product.Price;
  const productPrice = convertPrice(offerPrice, selectedCurr);

  useEffect(() => {
    async function fetchDiscount() {
      try {
        const response = await axios.get(`${process.env.API_URL}/api/v1/discount/get-discount/${Math.floor(product.Price)}`, getConfig());
        setDiscount(response.data.discount.discountPercentage);
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    }
    fetchDiscount();
  }, [product.Price]);


  return (
    <div className={`product-detail ${productDetail} ${detailClass}`}>
      <div>
        {title !== "Product style 4" ? (
          <div className="rating">{RatingStars}</div>
        ) : (
          ""
        )}
        <h6>{truncateTitle(product?.Title, 22)}</h6>
        <h4>
          <del>{selectedCurr.symbol}
            {convertPrice(parseInt(product.Price), selectedCurr)}.00
          </del>
          <span>{discount}% off</span>
        </h4>
        <h3 className="f-price">
          Offer Price: {selectedCurr.symbol} {convertPrice(offerPrice, selectedCurr)}.00
        </h3>
        {user?.mfvUser && (
          <h3 className="bv">
            BV: <span>{selectedCurr.symbol}{calculateBusinessVolume(productPrice).toFixed(2)}</span>
          </h3>
        )}
      </div>
    </div>
  );
};

export default MasterProductDetail;
