import React, { useState, useEffect, useRef, useContext } from "react";
import ProductTab from "../common/product-tab";
import Slider from "react-slick";
import DetailsWithPrice from "../common/detail-price";
import { Container, Row, Col, Media } from "reactstrap";
import axios from "axios";
import ImageZoom from "../common/image-zoom";
import { ProductsContext } from "../../../helpers/product/ProductContext";

const NoSidebarPage = ({ pathId }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);


  const [loading, setLoading] = useState(false)
  const [productDetails, setProductDetails] = useState([])
  const [image, setImage] = useState("")
  const [state, setState] = useState({ nav1: null, nav2: null });
  const [productColors, setProductColors] = useState([])
  const [productSizes, setProductSizes] = useState([])
  const [productImages, setProductImages] = useState([])
  const { productReviews, fetchProductReviews } = useContext(ProductsContext);

  // for fetching the product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/getProductDetails?productId=${pathId}`);
          if (response.data.Records) {
            if (Array.isArray(response.data.Records)) {
              setProductDetails(response.data.Records);
            } else {
              setProductDetails([response.data.Records]);
            }
          } else {
            setProductDetails([]);
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      };

      fetchData();
    };

    fetchProductDetails();
    fetchProductReviews(pathId)
  }, [pathId]);


  // for fetching the product images
  useEffect(() => {
    const fetchProductImages = async () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/getProductImagesList?productId=${pathId}`);
          if (response.data.Records) {
            if (Array.isArray(response.data.Records)) {
              setProductImages(response.data.Records);
            } else {
              setProductImages([response.data.Records]);
            }
          } else {
            setProductImages([]);
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log("Error while fetchng product images", error)
        }
      };

      fetchData();
    };

    fetchProductImages();
  }, [pathId]);



  const productDetail = productDetails.length > 0 ? productDetails[0] : null;

  // for fetching the product image
  useEffect(() => {
    if (productDetail) {
      const imageUrl = `https://thebrandtadka.com/images_inventory_products/front_images/${productDetail.Medium_file}`;
      setImage(imageUrl);
    }
  }, [productDetail]);


  // for fetching the product colors
  useEffect(() => {
    const fetchProductColors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`../api/getproductColors?skuId=${productDetail.Sku_id}`);
        if (response.data.Records) {
          if (Array.isArray(response.data.Records)) {
            setProductColors(response.data.Records);
          } else {
            setProductColors([response.data.Records]);
          }
        } else {
          setProductColors([]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProductColors();

  }, [productDetail])

  // for fetching the product sizes
  useEffect(() => {
    const fetchProductSizes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`../api/getProductSizes?skuId=${productDetail.Sku_id}`);
        if (response.data.Records) {
          if (Array.isArray(response.data.Records)) {
            setProductSizes(response.data.Records);
          } else {
            setProductSizes([response.data.Records]);
          }
        } else {
          setProductSizes([]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProductSizes();

  }, [productDetail])

  const sliderNav = {
    slidesToShow: productImages?.length,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    adaptiveHeight: true,
    focusOnSelect: true,
  };

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  }, [slider1, slider2]);

  const changeColorVar = (img_id) => {
    slider2.current?.slickGoTo(img_id);
  };


  return (
    <section className="">
      <div className="collection-wrapper">
        <Container>
          <Row>
            <Col sm="12" xs="12">
              <div className="container-fluid">
                {!productDetail ? (
                  "loading"
                ) : (
                  <Row>
                    <Col lg="6" className="product-thumbnail">

                      <Slider asNavFor={nav2} ref={(slider) => setSlider1(slider)} className="product-slick">
                        {productImages.map((vari, index) => (
                          <div key={index}>
                            <ImageZoom image={vari} />
                          </div>
                        ))}
                      </Slider>

                      {
                        productImages.length > 1 ? (
                          <Slider className="slider-nav" {...sliderNav} asNavFor={nav1} ref={(slider) => setSlider2(slider)}>
                            {productImages.map((item, i) => (
                              <div key={i}>
                                <Media src={`https://thebrandtadka.com/images_inventory_products/multiple_images/${item.Img_file}`} alt={item.alt} className="img-fluid" />
                              </div>
                            ))}
                          </Slider>
                        ) : (
                          <Slider {...sliderNav} asNavFor={nav1} ref={(slider) => setSlider2(slider)}>
                            {productImages.map((item, i) => (
                              <div key={i}>
                                <Media src={`https://thebrandtadka.com/images_inventory_products/multiple_images/${item.Img_file}`} alt={item.alt} height="100px" />
                              </div>
                            ))}
                          </Slider>
                        )
                      }

                    </Col>
                    <Col lg="6" className="rtl-text product-ps">
                      <DetailsWithPrice item={productDetail} colors={productColors} sizes={productSizes} changeColorVar={changeColorVar} />
                    </Col>
                  </Row>
                )}
              </div>
              <ProductTab product={productDetail} productReviews={productReviews} />

              <div className="product-desclaimer" style={{marginTop: "80px"}}>
                <h6 style={{fontWeight :700, color: "black"}}>The final product delivered might vary in color and print from the one displayed here, While we make every effort to deliver the same product, there might be variations because these products are procured in mixed batches.</h6>
                <p style={{wordSpacing: 2, marginTop: "10px"}}>Some products which are currently selling on the portal may belong to the stock lot or stock excess, It may belong to the prior manufacturing year (2023, 2022, 2021 or older) some listed products may be out of warranty and packing box and packaging might be damaged.
                  It is advisable to read all terms and conditions or refund policies while buying any product for more clarity.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default NoSidebarPage;
