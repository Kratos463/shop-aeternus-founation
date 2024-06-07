import React, { useContext } from "react";
import { calculateBusinessVolume, convertPrice, truncateTitle } from "../../../helpers/utils";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import { useAuth } from "../../../helpers/auth/AuthContext";

const MasterProductDetail = ({
  product,
  productDetail,
  detailClass,
  title,
  des,
}) => {
  let RatingStars = [];
  let rating = 5;
  for (var i = 0; i < rating; i++) {
    RatingStars.push(<i className="fa fa-star" key={i}></i>);
  }

  const { user } = useAuth()
  const { state: selectedCurr } = useContext(CurrencyContext);
  const productPrice = convertPrice(product.Price, selectedCurr);
  const businessVolume = calculateBusinessVolume(productPrice);


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
          <span>{product.discount} 50% off</span>
        </h4>
        <h3 className="f-price">
          Offer Price: {selectedCurr.symbol} {convertPrice(parseInt(product.Price), selectedCurr)}.00
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
