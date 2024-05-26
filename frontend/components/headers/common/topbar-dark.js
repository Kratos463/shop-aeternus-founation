import React from "react";
import { Container, Row, Col } from "reactstrap";
import Link from "next/link";
import { useAuth } from "../../../helpers/auth/AuthContext";


const TopBarDark = ({ topClass, fluid }) => {

  const { user, logout,token } = useAuth()
  // console.log("token details:", JSON.stringify(token, null, 2));

  

  return (
    <div className={topClass}>
      <Container fluid={fluid}>
        <Row>
          <Col lg="6">
            <div className="header-contact">
              <ul>
                <li>Welcome to Shop Atrno</li>
                <li>
                  <i className="fa fa-phone text-white" aria-hidden="true"></i>
                  Support: 882-436-9749
                </li>
              </ul>
            </div>
          </Col>
          <Col lg="6" className="text-end">
            <ul   className="header-dropdown">
              <li className="mobile-wishlist">
                <Link href="/page/account/wishlist">
                  <i className="fa fa-heart" aria-hidden="true"></i> wishlist
                </Link>
              </li>
              <li   className="onhover-dropdown mobile-account">
             
                <i style={{}} className="fa fa-user" aria-hidden="true"></i> 
                {
                  user ? user ?.firstName  : "My Account"
                  
                } 
                   {/* <span className="dropdown-arrow"></span> */}


                      <span className="dropdown-arrow">&#x25BC;</span>

                <ul  className="onhover-show-div">
                  {user ? (
                    <>
                    <li>
                      <Link href={`/page/account/dashboard`}>
                        Profile
                      </Link>
                    </li>
                    <li onClick={logout}>
                      <Link href="#">
                        Logout
                      </Link>
                    </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href={`/page/account/login`}>
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link href={`/page/account/register`}>
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBarDark;
