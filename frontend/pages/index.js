import React from "react";
import Banner from "./layouts/Fashion/Components/Banner";
import CollectionBanner from "./layouts/Fashion/Components/Collection-Banner";
import CollectionBanner2 from "./layouts/Fashion/Components/CollectionBanner";
import TopCollection from "../components/common/Collections/Collection3";
import Parallax from "./layouts/Fashion/Components/Parallax";
import SpecialProducts from "../components/common/Collections/TabCollection1";
import ServiceLayout from "../components/common/Service/service1";
import Blog from "../components/common/Blog/blog1";
import HeaderOne from "../components/headers/header-one";
import { Product4 } from "../services/script";
import Paragraph from "../components/common/Paragraph";
import Helmet from "react-helmet";
import MasterFooter from "../components/footers/common/MasterFooter";
import CategoryMenu from "../components/common/CategoryMenu/CategoryMenu"
import CategoriesProducts from "../components/common/Collections/CategoriesProducts";

const Fashion = () => {

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={"/assets/images/favicon/favicon-32x32.png"} />
        <link rel="apple-touch-icon" sizes="180x180" href={"/assets/images/favicon/apple-touch-icon.png"} />
        <link rel="icon" type="image/png" sizes="32x32" href={"/assets/images/favicon/favicon-32x32.png"} />
        <link rel="icon" type="image/png" sizes="16x16" href={"/assets/images/favicon/favicon-16x16.png"} />
        <link rel="manifest" href={"/site.webmanifest"} />
      </Helmet>
      {/* <ModalComponent /> */}
      <HeaderOne logoName={"logo.jpg"} topClass="top-header" />
      <CategoryMenu />
      <Banner />
      <CollectionBanner />
      <Paragraph title="title1 section-t-space" inner="title-inner1" hrClass={false} desc={"Discover our handpicked selection of top-selling items from various categories, guaranteed to elevate your style and enhance your lifestyle!"} />
      <TopCollection noTitle="null" backImage={true} type="fashion" title="top collection" subtitle="special offer" productSlider={Product4} designClass="section-b-space p-t-0 ratio_asos px-2" noSlider="false" cartClass="cart-info cart-wrap" />
      <Parallax />
      <SpecialProducts type="fashion" backImage={true} productSlider={Product4} line={true} title="title1 section-t-space" inner="title-inner1" designClass="section-b-space p-t-0 ratio_asos" noSlider="true" cartClass="cart-info cart-wrap" />
      <CategoriesProducts />

      <CollectionBanner2 />
      <ServiceLayout sectionClass="border-section small-section" />

      <MasterFooter footerClass={`footer-light`} footerLayOut={"light-layout upper-footer"} footerSection={"small-section border-section border-top-0"} belowSection={"section-b-space light-layout"} newLatter={true} logoName={"logo.jpg"} />
    </>
  );
};

export default Fashion;
