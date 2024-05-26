import React, { Fragment, useContext } from "react";
import { useRouter } from "next/router";
import { Row, Col } from "reactstrap";
import CategoryContext from "../../../helpers/category/CategoryContext";
import FilterContext from "../../../helpers/filter/FilterContext";

const SideBar = () => {

  const router = useRouter();
  const { setSelectedCategory } = useContext(FilterContext)
  const { categories, subcategoriesMap } = useContext(CategoryContext)

  const closeNav = () => {
    var closemyslide = document.getElementById("mySidenav");
    if (closemyslide) closemyslide.classList.remove("open-side");
  };

  const handleSubmenu = (event) => {
    if (event.target.classList.contains("sub-arrow")) {
      return;
    }

    if (event.target.nextElementSibling.classList.contains("opensub1"))
      event.target.nextElementSibling.classList.remove("opensub1");
    else {
      document.querySelectorAll(".opensub1").forEach(function (value) {
        value.classList.remove("opensub1");
      });
      event.target.nextElementSibling.classList.add("opensub1");
    }
  };


  const handleMegaSubmenu = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;

    if (event.target.nextElementSibling.classList.contains("opensidesubmenu"))
      event.target.nextElementSibling.classList.remove("opensidesubmenu");
    else {
      event.target.nextElementSibling.classList.add("opensidesubmenu");
    }
  };

  const clickCategory = (subcategory) => {
    router.push(`/shop/left_sidebar?`);
    setSelectedCategory(subcategory.Category);
  };

  return (
    <Fragment>
      <div id="mySidenav" className="sidenav">
        <a href={null} className="sidebar-overlay" onClick={closeNav}></a>
        <nav>
          <a href={null} onClick={closeNav}>
            <div className="sidebar-back text-start">
              <i className="fa fa-angle-left pe-2" aria-hidden="true"></i> Back
            </div>
          </a>
          <ul id="sub-menu" className="sidebar-menu">
            {categories?.map((category) => (
              <li key={category.Category_id}>
                <a href="#" onClick={(e) => handleMegaSubmenu(e)}>
                  {category.Category}
                  <span className="sub-arrow"></span>
                </a>
                <ul className="mega-menu clothing-menu">
                  <h5>{category.Category}</h5>
                  {subcategoriesMap[category.Category_id]?.map((subcategory) => (
                    <li key={subcategory.Category_id}>
                      <Row m="0">
                        <Col xl="4">
                          <div className="link-section">
                            <ul>
                              <li onClick={() => clickCategory(subcategory)}>
                                <a href="#">{subcategory.Category}</a>
                              </li>
                            </ul>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default SideBar;
