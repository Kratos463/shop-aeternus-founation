import React, { useState, useEffect, useRef } from "react";
import NavBar from "./common/navbar";
import SideBar from "./common/sidebar";
import Cart from "../containers/Cart";
import CartContainer from "../containers/CartContainer";
import TopBarDark from "./common/topbar-dark";
import { Media, Container, Row, Col, Popover, PopoverHeader, PopoverBody, CloseButton, PopoverFocus } from "reactstrap";
import LogoImage from "./common/logo";
import search from "../../public/assets/images/icon/search.png";
import cart from "../../public/assets/images/icon/cart.png";
import { useRouter } from "next/router";
import SearchOverlay from "./common/search-overlay";

const HeaderOne = ({
  logoName,
  headerClass,
  topClass,
  noTopBar,
  direction,
}) => {

  const router = useRouter();
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef(null);


  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    

    if (keyword) {

       router.push(`/shop/left_sidebar/?keyword=${keyword}`)
      // router.push(`/?keyword=${keyword}`) 
    }
    else {
      router.push("/")
    }

  }


  const toggleSearchPopup = () => {
    setShowSearchPopup(!showSearchPopup);


    if (inputRef.current) {
      inputRef.current.focus();
    }



  };


  /*=====================
     Pre loader
     ==========================*/
  useEffect(() => {
    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 2000);

    if (router.asPath !== "/layouts/Christmas")
      window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number >= 300) {
      if (window.innerWidth < 581)
        document.getElementById("sticky")?.classList.remove("fixed");
      else document.getElementById("sticky")?.classList.add("fixed");
    }
    else document.getElementById("sticky")?.classList.remove("fixed");
  };


  const openSearch = () => {
    document.getElementById("search-overlay").style.display = "block";
  };



  return (
    <div >
      <header id="sticky" className={`sticky ${headerClass}`}  >
        <div className="mobile-fix-option"></div>
        {/*Top Header Component*/}
        {noTopBar ? "" : <TopBarDark topClass={topClass} />}

        <Container>
          <Row>
            <Col>
              <div className="main-menu">
                <div className="menu-left">
                  <div className="brand-logo">
                    <LogoImage logo={logoName} />
                  </div>
                </div>
                <div className="menu-right pull-right">
                  {/*Top Navigation Bar Component*/}
                  <NavBar />

                  <div className="icon-nav">
                    <ul>
                      {/* <li className="onhover-div mobile-search">
                        <div id="search-icon" onClick={toggleSearchPopup}>
                          <img src={search} alt="Search" />
                        </div>
                      </li> */}


                      <li className="onhover-div mobile-search" >
                        <div id="PopoverFocus"
                        >
                          <Media

                            src={search.src}
                            onClick={toggleSearchPopup}
                            className="img-fluid"
                            alt=""
                          />
                          <i

                            className="fa fa-search"
                            onClick={toggleSearchPopup}
                          ></i>
                        </div>
                      </li>



                      {/*Header Cart Component */}
                      {direction === undefined ? (
                        // <></>
                        <CartContainer layout={direction} icon={cart.src} />
                      ) : (

                        <Cart layout={direction} icon={cart.src} />
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      <Popover
        placement="bottom"
        isOpen={showSearchPopup}
        target="PopoverFocus"
        toggle={toggleSearchPopup}
        trigger="focus"

      >
        {/* <PopoverHeader style={{}}>Search </PopoverHeader>  */}
        {/* <CloseButton style={{paddingLeft:'0px'}}/> */}
        <PopoverBody style={{ paddingRight: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search here....."
              value={keyword}
              onChange={handleKeywordChange}
              style={{ paddingRight: '5px', borderRadius: '5px', paddingLeft: '10px', borderColor: 'none' }}
            />

            <div style={{ marginRight: '5px' }}></div>
            <button style={{ backgroundColor: '#ff4c3b', border: 'none', borderRadius: '5px', color: 'white' }} onClick={(e) => handleSearch(e)}>Search</button>
            {/* <button onClick={toggleSearchPopup}>Close</button> */}

          </div>
        </PopoverBody>

      </Popover>
    </div>
  );
};

export default HeaderOne;