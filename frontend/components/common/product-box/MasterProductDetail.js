import React, { useContext } from "react";
import { convertPrice } from "../../../helpers/utils";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";

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

  const { state: selectedCurr } = useContext(CurrencyContext);


  return (
    <div className={`product-detail ${productDetail} ${detailClass}`}>
      <div>
        {title !== "Product style 4" ? (
          <div className="rating">{RatingStars}</div>
        ) : (
          ""
        )}
        <h6>{product?.Title}</h6>
        {des ? <p>{product?.description}</p> : ""}
        <h4>
          {selectedCurr.symbol}
          {convertPrice(product.Price, selectedCurr)}.00

          {/* for discount price */}
          {/* {(
            (product.price - (product.price * product.discount) / 100) *
            currency.value
          ).toFixed(2)} */}

          {/* For discount price */}
          {/* <del>
            <span className="money">
              {currency.symbol}
              {(product.price * currency.value).toFixed(2)}
            </span>
          </del> */}
        </h4>
      </div>
    </div>
  );
};

export default MasterProductDetail;
