import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Collapse } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import CategoryContext from "../../../helpers/category/CategoryContext";

const CategoryMenu = () => {
  const context = useContext(FilterContext);
  const { categories, subcategoriesMap } = useContext(CategoryContext)
  const [openCategory, setOpenCategory] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const setSelectedCategory = context.setSelectedCategory;
  const setSelectedCategoryId = context.setSelectedCategoryId

  const toggleSubcategories = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const updateCategory = (subcategory) => {
    setSelectedCategory(subcategory.Category);
    setSelectedCategoryId(subcategory.Category_id)
  };

  return (
    <div className="collection-collapse-block open">
      <h3 className="collapse-block-title" onClick={toggleCategory}>
        Category
      </h3>
      <Collapse isOpen={isCategoryOpen}>

        <div className="collection-collapse-block-content">
          <div className="collection-brand-filter">
            <ul>
              {categories?.map((category, index) => (
                <li key={index} style={{ marginBottom: "10px", display: "block" }}>
                  <p
                    onClick={() => toggleSubcategories(category?.Category_id)}
                    style={{ cursor: "pointer", marginBottom: "5px", display:"block"}}
                  >
                    {category?.Category}
                  </p>
                  {openCategory === category.Category_id && (
                    <ul className="subcategory-list" style={{ marginLeft: "20px", listStyleType: "none" , display:"block" }}>
                      {subcategoriesMap[category?.Category_id] &&
                        subcategoriesMap[category?.Category_id].map((subcategory, subIndex) => (
                          <li
                            style={{ cursor: "pointer", marginBottom: "5px",display:"block"}}
                          >
                            <a href={null} key={subIndex} onClick={() => updateCategory(subcategory)}>{subcategory?.Category}</a>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default CategoryMenu;
