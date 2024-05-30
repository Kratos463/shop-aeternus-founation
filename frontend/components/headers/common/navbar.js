<<<<<<< HEAD
import React, { useState, useEffect, useContext } from "react";
=======
import React, { useState, useEffect, useContext, useMemo } from "react";
>>>>>>> 94a925ea93f7ff4019c9172b0df9b08ab15e6f38
import Link from "next/link";
import { Container, Row } from "reactstrap";
import { useRouter } from "next/router";
<<<<<<< HEAD
import FilterContext from "../../../helpers/filter/FilterContext";
=======
import CategoryContext from '../../../helpers/category/CategoryContext';
import FilterContext from '../../../helpers/filter/FilterContext';

const getMenuItems = (categories, subcategoriesMap, router, setSelectedCategory, setSelectedCategoryId) => [
  {
    title: "Home",
    type: "link",
    path: '/'
  },
  {
    title: "Products",
    megaMenu: true,
    megaMenuType: "small",
    type: "sub",
    children: Object.values(categories).flat().map(category => {
      const subcategories = subcategoriesMap[category.Category_id]?.map(subcategory => {
        return {
          title: subcategory.Category,
          type: "link",
          icon: "icon-placeholder",
          onClick: () => {
            const path = `/shop/left_sidebar?category=${subcategory.Category}&brand=&color=&size=&minPrice=500&maxPrice=10000`;
            setSelectedCategory(subcategory.Category);
            setSelectedCategoryId(subcategory.Category_id);
            router.push(path);
          }
        };
      }) || [];
      
      return {
        title: category.Category,
        type: "sub",
        children: subcategories
      };
    }),
  },
  {
    title: "Blogs",
    type: "link",
    path: "/blogs/blog_right_sidebar",
  },
  {
    title: "Contact",
    type: "link",
    path: "/page/account/contact",
  },
];
>>>>>>> 94a925ea93f7ff4019c9172b0df9b08ab15e6f38

const NavBar = () => {
  const [navClose, setNavClose] = useState({ right: "0px" });
  const router = useRouter();
<<<<<<< HEAD
  const { setSelectedCategory, setSelectedCategoryId } = useContext(FilterContext)
=======
  const { categories, subcategoriesMap } = useContext(CategoryContext);
  const { setSelectedCategory, setSelectedCategoryId } = useContext(FilterContext);

  const mainmenu = useMemo(() => {
    return getMenuItems(categories, subcategoriesMap, router, setSelectedCategory, setSelectedCategoryId);
  }, [categories, subcategoriesMap, router, setSelectedCategory, setSelectedCategoryId]);
>>>>>>> 94a925ea93f7ff4019c9172b0df9b08ab15e6f38

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

  const setNavActive = (item) => {
    mainmenu.forEach((menuItem) => {
      menuItem.active = menuItem === item;
      menuItem.children?.forEach((submenuItem) => {
        submenuItem.active = submenuItem === item;
        submenuItem.children?.forEach((subsubmenuItem) => {
          subsubmenuItem.active = subsubmenuItem === item;
        });
      });
    });
  };

  const toggletNavActive = (item) => {
    item.active = !item.active;
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

  const clickCategory = (subcategory) => {
    router.push(`/shop/left_sidebar?`);
    setSelectedCategory(subcategory.Category);
    setSelectedCategoryId(subcategory.Category_id)
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
                  <Link href={menuItem.path} className="nav-link" onClick={menuItem.onClick || closeNav}>
                    {menuItem.title}
                  </Link>
                ) : (
                  <a className="nav-link" onClick={openMblNav}>
                    {menuItem.title}
                    <span className="sub-arrow"></span>
<<<<<<< HEAD

                  </a>
                )}
=======
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
                          <a className="sub-menu-title" onClick={childrenItem.onClick || closeNav}>
                            {childrenItem.title}
                            {childrenItem.tag === "new" && <span className="new-tag">new</span>}
                          </a>
                        )}
                        {childrenItem.children && (
                          <ul className={`nav-sub-childmenu ${childrenItem.active ? "menu-open" : ""}`}>
                            {childrenItem.children.map((childrenSubItem, key) => (
                              <li key={key}>
                                <a className="sub-menu-title" onClick={childrenSubItem.onClick || closeNav}>
                                  {childrenSubItem.title}
                                  {childrenSubItem.tag === "new" && <span className="new-tag">new</span>}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
>>>>>>> 94a925ea93f7ff4019c9172b0df9b08ab15e6f38
                {menuItem.megaMenu && (
                  <div className={`mega-menu-container${menuItem.megaMenu ? "" : " opensubmenu"}`}>
                    <Container>
                      <Row>
                        {menuItem.children.map((megaMenuItem, i) => (
                          <div
                            className={`${menuItem.megaMenuType === "small"
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
<<<<<<< HEAD
                                      <Link href="#" onClick={() => clickCategory(subMegaMenuItem)}>
                                        <i className={`icon-${subMegaMenuItem.icon}`}></i>
                                        {subMegaMenuItem.Category}
                                      </Link>
=======
                                      <a onClick={subMegaMenuItem.onClick}>
                                        <i className={`icon-${subMegaMenuItem.icon}`}></i>
                                        {subMegaMenuItem.title}
                                      </a>
>>>>>>> 94a925ea93f7ff4019c9172b0df9b08ab15e6f38
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
