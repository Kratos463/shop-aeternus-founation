import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MENUITEMS } from "../../constant/menu";
import { Container, Row } from "reactstrap";
import { useRouter } from "next/router";

const NavBar = () => {
  const [navClose, setNavClose] = useState({ right: "0px" });
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth < 750) {
      setNavClose({ right: "-410px" });
    } else if (window.innerWidth < 1199) {
      setNavClose({ right: "-300px" });
    }

    const handleOutsideClick = (event) => {
      const nav = document.querySelector(".main-navbar");
      if (nav && !nav.contains(event.target)) {
        closeNav();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const openNav = () => {
    setNavClose({ right: "0px" });
    if (router.asPath === "/layouts/Gym")
      document.querySelector("#topHeader").classList.add("zindex-class");
  };

  const closeNav = () => {
    setNavClose({ right: "-410px" });
    if (router.asPath === "/layouts/Gym")
      document.querySelector("#topHeader").classList.remove("zindex-class");
  };

  const handleMegaSubmenu = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;

    const submenu = event.target.parentNode.nextElementSibling;
    if (submenu.classList.contains("opensubmegamenu")) {
      submenu.classList.remove("opensubmegamenu");
    } else {
      document.querySelectorAll(".menu-content").forEach((value) => {
        value.classList.remove("opensubmegamenu");
      });
      submenu.classList.add("opensubmegamenu");
    }
  };

  const [mainmenu, setMainMenu] = useState(MENUITEMS);

  useEffect(() => {
    const currentUrl = location.pathname;
    MENUITEMS.forEach((item) => {
      if (item.path === currentUrl) setNavActive(item);
      item.children?.forEach((subItem) => {
        if (subItem.path === currentUrl) setNavActive(subItem);
        subItem.children?.forEach((subSubItem) => {
          if (subSubItem.path === currentUrl) setNavActive(subSubItem);
        });
      });
    });
  }, []);

  const setNavActive = (item) => {
    MENUITEMS.forEach((menuItem) => {
      menuItem.active = menuItem === item;
      menuItem.children?.forEach((submenuItem) => {
        submenuItem.active = submenuItem === item;
        submenuItem.children?.forEach((subsubmenuItem) => {
          subsubmenuItem.active = subsubmenuItem === item;
        });
      });
    });
    setMainMenu([...MENUITEMS]);
  };

  const toggletNavActive = (item) => {
    item.active = !item.active;
    setMainMenu([...MENUITEMS]);
  };

  const openMblNav = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;

    const submenu = event.target.nextElementSibling;
    if (submenu.classList.contains("opensubmenu")) {
      submenu.classList.remove("opensubmenu");
    } else {
      document.querySelectorAll(".nav-submenu").forEach((value) => {
        value.classList.remove("opensubmenu");
      });
      submenu.classList.add("opensubmenu");
    }
  };

  return (
    <div>
      <div className="main-navbar">
        <div id="mainnav">
          <div className="toggle-nav" onClick={openNav}>
            <i className="fa fa-bars sidebar-bar"></i>
          </div>
          <ul className="nav-menu" style={navClose}>
            <li className="back-btn" onClick={closeNav}>
              <div className="mobile-back text-end">
                <span>Back navbar</span>
                <i className="fa fa-angle-right ps-2" aria-hidden="true"></i>
              </div>
            </li>
            {mainmenu.map((menuItem, i) => (
              <li key={i} className={`${menuItem.megaMenu ? "mega-menu" : ""}`}>
                {menuItem.type === "link" ? (
                  <Link href={menuItem.path} className="nav-link" onClick={closeNav}>
                    {menuItem.title}
                  </Link>
                ) : (
                  <a className="nav-link" onClick={openMblNav}>
                    {menuItem.title}
                    <span className="sub-arrow"></span>
                    
                  </a>
                )}
                {menuItem.children && !menuItem.megaMenu && (
                  <ul className="nav-submenu">
                    {menuItem.children.map((childrenItem, index) => (
                      <li key={index} className={`${childrenItem.children ? "sub-menu " : ""}`}>
                        {childrenItem.type === "sub" ? (
                          <a href="#" onClick={() => toggletNavActive(childrenItem)}>
                            {childrenItem.title}
                            {childrenItem.tag === "new" && <span className="new-tag">new</span>}
                            <i className="fa fa-angle-right ps-2"></i>
                          </a>
                        ) : (
                          <Link href={childrenItem.path} className="sub-menu-title" onClick={closeNav}>
                            {childrenItem.title}
                            {childrenItem.tag === "new" && <span className="new-tag">new</span>}
                          </Link>
                        )}
                        {childrenItem.children && (
                          <ul className={`nav-sub-childmenu ${childrenItem.active ? "menu-open" : ""}`}>
                            {childrenItem.children.map((childrenSubItem, key) => (
                              <li key={key}>
                                <Link href={childrenSubItem.path} className="sub-menu-title" onClick={closeNav}>
                                  {childrenSubItem.title}
                                  {childrenSubItem.tag === "new" && <span className="new-tag">new</span>}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {menuItem.megaMenu && (
                  <div className={`mega-menu-container${menuItem.megaMenu ? "" : " opensubmenu"}`}>
                    <Container>
                      <Row>
                        {menuItem.children.map((megaMenuItem, i) => (
                          <div
                            className={`${
                              menuItem.megaMenuType === "small"
                                ? "col mega-box"
                                : menuItem.megaMenuType === "medium"
                                ? "col-lg-3"
                                : menuItem.megaMenuType === "large"
                                ? "col"
                                : ""
                            } `}
                            key={i}
                          >
                            <div className="link-section">
                              <div className="menu-title">
                                <h5 onClick={handleMegaSubmenu}>{megaMenuItem.title}</h5>
                              </div>
                              <div className="menu-content">
                                <ul>
                                  {megaMenuItem.children.map((subMegaMenuItem, i) => (
                                    <li key={i}>
                                      <Link href={subMegaMenuItem.path}>
                                        <i className={`icon-${subMegaMenuItem.icon}`}></i>
                                        {subMegaMenuItem.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Row>
                    </Container>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;