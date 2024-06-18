import React from "react";
import { Container, Row, Col } from "reactstrap";
import Link from "next/link";
import { useAuth } from "../../../helpers/auth/AuthContext";


const TopBarDark = ({ topClass, fluid }) => {

  const { user, logout, wallet } = useAuth()



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
            <ul className="header-dropdown">
              {
                user && user.mfvUser && (
                  <li className="mobile-wishlist">
  
                     E-Wallet Balance: ${(wallet && wallet.amount !== undefined && wallet.amount !== 0) ? wallet.amount.toFixed(2) : "0.00"}
                  </li>
                )
              }
              <li className="mobile-wishlist">
                <Link href="/page/account/wishlist">
                  <i className="fa fa-heart" aria-hidden="true"></i> wishlist
                </Link>
              </li>
              <li className="onhover-dropdown mobile-account">

                <i style={{}} className="fa fa-user" aria-hidden="true"></i>
                {
                  user ? user?.firstName : "My Account"

                }

                <ul className="onhover-show-div">
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
