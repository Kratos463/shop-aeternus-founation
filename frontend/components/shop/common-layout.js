import React from "react";
import HeaderOne from "../headers/header-one";
import Breadcrubs from "../common/widgets/breadcrubs";
import Helmet from "react-helmet";
import favicon from "../../public/assets/images/favicon/1.png";
import MasterFooter from "../footers/common/MasterFooter";

const CommonLayout = ({ children, title, parent, subTitle }) => {
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
      <HeaderOne topClass="top-header" logoName="logo.jpg" />
      <Breadcrubs title={title} parent={parent} subTitle={subTitle} />
      <>{children}</>
      <MasterFooter
        footerClass={`footer-light `}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
      />   
    </>
  );
};

export default CommonLayout;
