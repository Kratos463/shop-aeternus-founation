import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Media} from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import MasterProductDetail from "./MasterProductDetail";

const ProductItem = ({ product, addCart, des, addWishlist, cartClass, productDetail, title }) => {
  // eslint-disable-next-line
  const router = useRouter();
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;

  const [image, setImage] = useState("");
  const [frontImage, setFrontImage] = useState("")
  const [loading, setLoading] = useState(false)
  const uniqueTags = [];


  useEffect(() => {
    const imageUrl = `https://thebrandtadka.com/images_inventory_products/front_images/${product.Product_image ? product.Product_image : product.Small_file}`;

    setFrontImage(imageUrl);
    setLoading(false);
  }, [product]);


  const clickProductDetail = () => {
    router.push(`/product-details/${product.Product_id}`);
  };

  const variantChangeByColor = (imgId, product_images) => {
    product_images?.map((data) => {
      if (data?.image_id == imgId) {
        setImage(data.src);
      }
    });
  };


  return (
    <div className="product-box product-wrap">
      <div className="img-wrapper">
        <div className="lable-block">
          {product.new === true ? <span className="lable3">new</span> : ""}
          {product.sale === true ? <span className="lable4">on sale</span> : ""}
        </div>
        <div className="front" onClick={clickProductDetail}>
          <Media src={frontImage} className="img-fluid" alt="" />
        </div>
        {product.images ? (
          <ul className="product-thumb-list">
            {product.images.map((img, i) => (
              <li className={`grid_thumb_img ${img.src === image ? "active" : ""}`} key={i}>
                <a href={null} title="Add to Wishlist">
                  {/* <Media src={`${img.src}`} alt="wishlist" onClick={() => onClickHandle(img.src)} /> */}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>
      <MasterProductDetail product={product} productDetail={productDetail} currency={currency} uniqueTags={uniqueTags} title={title} des={des} variantChangeByColor={variantChangeByColor} />
    </div>
  );
};

export default ProductItem;