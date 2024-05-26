import React, { useContext, useEffect, useState } from "react";
import FilterContext from "./FilterContext";
import { useRouter } from "next/router";
import { ProductsContext } from "../product/ProductContext";

const FilterProvider = (props) => {
  const router = useRouter();
  const brand = router.query.brand;
  const color = router.query.color;
  const size = router.query.size;
  const category = router.query.category;
  const min = router.query.min;
  const max = router.query.max;
  const sizeParam = size ? size.split(",") : null;
  const param = brand ? brand.split(",") : [];
  
  const { categoryProduct } = useContext(ProductsContext);

  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [selectedBrands, setSelectedBrands] = useState(param || []);
  const [selectedColor, setSelectedColor] = useState(color || "");
  const [selectedSize, setSelectedSize] = useState(sizeParam || []);
  const [selectedPrice, setSelectedPrice] = useState({
    min: min || 500,
    max: max || 10000,
  });
  const [isChecked, setIsChecked] = useState(true);
  const [filterChecked, setFilterChecked] = useState([{}]);
  const [selectedFilteredProducts, setSelectedFilteredProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("AscOrder");

  useEffect(() => {
    applyFiltersAndSort();
  }, [categoryProduct, selectedCategory, selectedBrands, selectedPrice, sortBy, selectedColor, selectedSize]);

  const applyFiltersAndSort = () => {
    if (categoryProduct) {
      let filteredProducts = categoryProduct.filter(product => {
        const isInSelectedCategory = selectedCategory ? product.Category === selectedCategory : true;
        const isInSelectedBrands = selectedBrands.length === 0 || selectedBrands.includes(product.Brand_name);
        const isInSelectedPriceRange = product.Price >= selectedPrice.min && product.Price <= selectedPrice.max;
        const isInSelectedColor = selectedColor ? product.Color === selectedColor : true;
        const isInSelectedSize = selectedSize.length === 0 || selectedSize.includes(product.Size);
        return isInSelectedCategory && isInSelectedBrands && isInSelectedPriceRange && isInSelectedColor && isInSelectedSize;
      });

      switch (sortBy) {
        case "HighToLow":
          filteredProducts.sort((a, b) => b.Price - a.Price);
          break;
        case "LowToHigh":
          filteredProducts.sort((a, b) => a.Price - b.Price);
          break;
        case "Newest":
          filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "A to Z":
          filteredProducts.sort((a, b) => a.Title.localeCompare(b.Title));
          break;
        case "Z to A":
          filteredProducts.sort((a, b) => b.Title.localeCompare(a.Title));
          break;
        default:
          break;
      }

      setSelectedFilteredProducts(filteredProducts);
    }
  };

  const handleBrands = (brand, checked) => {
    setSelectedBrands(prevBrands => {
      const index = prevBrands.indexOf(brand);
      const updatedBrands = [...prevBrands];
      if (index > -1) {
        updatedBrands.splice(index, 1);
      } else {
        updatedBrands.push(brand);
      }
      return updatedBrands;
    });
  };

  const handleSizes = (size, checked) => {
    setSelectedSize(prevSizes => {
      const index = prevSizes.indexOf(size);
      const updatedSizes = [...prevSizes];
      if (index > -1) {
        updatedSizes.splice(index, 1);
      } else {
        updatedSizes.push(size);
      }
      return updatedSizes;
    });
  };

  const handlePriceRange = (minPrice, maxPrice) => {
    setSelectedPrice({ min: minPrice, max: maxPrice });
  };

  return (
    <FilterContext.Provider
      value={{
        ...props,
        state: selectedCategory,
        setSelectedColor,
        setSelectedCategory,
        setSelectedBrands,
        selectedBrands,
        selectedColor,
        selectedPrice,
        isChecked,
        filterChecked,
        selectedSize,
        setSelectedSize,
        setSelectedPrice,
        handleBrands,
        handleSizes,
        handlePriceRange,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedFilteredProducts,
        sortBy,
        setSortBy,
      }}
    >
      {props.children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;
