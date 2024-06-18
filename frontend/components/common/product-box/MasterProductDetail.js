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
  const productPrice = parseFloat(product.Price);
  const offerPrice = discount ? parseFloat((productPrice - (productPrice * discount / 100)).toFixed(2)) : productPrice.toFixed(2);
  const convertedOfferPrice = parseFloat(convertPrice(offerPrice, selectedCurr).toFixed(2));
  const businessVolume = calculateBusinessVolume(convertedOfferPrice).toFixed(2);

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
          <del>MRP {selectedCurr.symbol}
            {convertPrice(productPrice, selectedCurr).toFixed(2)}
          </del> <span>{discount}% off</span>
        </h4>
        <h3 className="f-price">
          Offer Price: {selectedCurr.symbol}{convertedOfferPrice}
        </h3>
        {user?.mfvUser && (
          <h3 className="bv">
            BV: <span>{selectedCurr.symbol}{businessVolume}</span>
          </h3>
        )}
      </div>
    </div>
  );
};

export default MasterProductDetail;
