import React, { Fragment } from "react";
import Link from "next/link";

const LogoImage = ({ logo }) => {
  return (
    <Fragment>
      <Link href={"/"}>
        <img
          src={`/assets/images/icon/${logo ? logo : "logo.jpg"}`}
          alt=""
          className="img-fluid"
          style={{ maxWidth: "100%", height: "auto" }} 
          width="180px" 
        />
      </Link>
    </Fragment>
  );
};

export default LogoImage;
