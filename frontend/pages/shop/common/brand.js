import React, { useState, useContext, useMemo } from "react";
import { Collapse, Input } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import { ProductsContext } from "../../../helpers/product/ProductContext";

const Brand = () => {
  const context = useContext(FilterContext);
  const isChecked = context.isChecked;
  const [isOpen, setIsOpen] = useState(false);
  const toggleBrand = () => setIsOpen(!isOpen);

  const { categoryProduct } = useContext(ProductsContext);
  const selectedCategory = context.state;

  // Filter products based on the selected category
  const selectedCategoryProduct = useMemo(() => 
    categoryProduct.filter((product) => product.Category === selectedCategory),
    [categoryProduct, selectedCategory]
  );

  // Create a set of unique brand names from the filtered products
  const uniqueBrandNames = useMemo(() => 
    new Set(selectedCategoryProduct.map((product) => product.Brand_name)),
    [selectedCategoryProduct]
  );

  return (
    <div className="collection-collapse-block open">
      <h3 className="collapse-block-title" onClick={toggleBrand}>
        Brand
      </h3>
      <Collapse isOpen={isOpen}>
        <div className="collection-collapse-block-content">
          <div className="collection-brand-filter">
            {Array.from(uniqueBrandNames).map((brandName, index) => (
              <div
                className="form-check custom-checkbox collection-filter-checkbox"
                key={index}
              >
                <Input
                  checked={context.selectedBrands.includes(brandName)}
                  onChange={() => {
                    context.handleBrands(brandName, isChecked);
                  }}
                  type="checkbox"
                  className="custom-control-input"
                  id={brandName}
                />
                <label className="custom-control-label" htmlFor={brandName}>
                  {brandName}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Brand;
