import React, { Fragment, useEffect, useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import MasterBanner from "./MasterBanner";
import axios from "axios";
import { Media } from "reactstrap";

const Banner = () => {
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    const fetchHomeBanners = async () => {
      try {
        const response = await axios.get(`/api/getHomeBanners`);
        if (response.data.Records && Array.isArray(response.data.Records)) {
          const banners = response.data.Records.flatMap(record =>
            record.Category_html.split(',').map(url => url.trim().replace(/^"|"$/g, ''))
          );
          setBannerImages(banners);
        } else {
          setBannerImages([]);
        }
      } catch (error) {
        console.log("Error while fetching front Banners:", error);
      }
    };

    fetchHomeBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Fragment>
      <section className="p-0">
        <Slider {...settings} className="slide-1 home-slider">
          {bannerImages?.map((image, i) => (
            <Media src={image} key={i}/>
          ))}
        </Slider>
      </section>
    </Fragment>
  );
};

export default Banner;
